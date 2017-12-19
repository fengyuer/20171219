<template>
    <div class="data_Statistics">
        <div class="row">
            <span class="sub_title">时间:</span>
            <div class="col">
                <el-radio-group v-model="timeType">
                    <el-radio :label="1">实时统计(今日)</el-radio>
                    <el-radio :label="2">历史统计
                        <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-radio>
                </el-radio-group>
            </div>
            <div class="col">
                <span>颗粒度:</span>
                <el-select v-model="granularity" placeholder="请选择">
                    <el-option v-for="item in granularityOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <span class="sub_title">部门/发送人:</span>
            <div class="col">
                <span>部门:</span>
                <el-input v-model="department" placeholder="请输入部门"></el-input>
            </div>
            <div class="col">
                <span> 创建人:</span>
                <el-input v-model="creater" placeholder="请输入创建人"></el-input> 
            </div>
        </div>
        <div class="row">
            <span class="sub_title">维度:</span>
            <div class="col">
                <span>短信模板</span>
                <el-select v-model="templateName" placeholder="请选择短信模板">
                    <el-option v-for="item in tempOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>短信签名</span>
                <el-select v-model="signName" placeholder="请选择短信签名">
                    <el-option v-for="item in signOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>短信通道</span>
                <el-select v-model="channelName" placeholder="请选择短信签名">
                    <el-option v-for="item in channelOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <el-button class='search' type="primary" @click="handleQuery">查询</el-button>
        </div>
        <div class="row">
            <el-tabs type="border-card" @tab-click="handleClick">
                <el-tab-pane label="短信发送量概览">
                    <div id="send_volume"></div>
                </el-tab-pane>
                <el-tab-pane label="费用统计概览">
                    <div id="total_price"></div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="row">
            <el-table :data="statisData" style="width: 100%" :header-row-style="{backgroundColor:'#eee'}">
                <el-table-column prop="date" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="sendNum" label="发送总量（条）">
                </el-table-column>
                <el-table-column prop="sendSuccessNum" label="发送成功量（条）">
                </el-table-column>
                <el-table-column prop="sendFailureNum" label="发送失败量（条）">
                </el-table-column>
                <el-table-column prop="successRatio" label="发送成功率">
                </el-table-column>
                <el-table-column prop="price" label="费用统计（元）">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary">失败详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="row last_row">
            <div class="left">
                总计：发送短信量
                <span>{{sendTotal}}</span>条, 发送成功
                <span>{{successTotal}}</span>条, 发送失败
                <span>{{failureTotal}}</span>条，产生总费用
                <span>{{priceTotal}}</span>元
            </div>
            <div class="right">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next" :total="recordsTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
var Mock = require("mockjs");
import {
  fetchSignatures,
  fetchChannels,
  fetchSmsTmplList,
  fetchStatistics
} from "@/api/smsApi";
import echarts from "echarts";
//处理日期数据
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate()
  );
};
export default {
  data() {
    return {
      statisData: [], //统计数据列表
      chart: null,
      chart1: null,
      timeType: 2, //2-历史统计 1-今日统计
      date: "", //日期
      granularity: 2,
      granularityOpt: [
        { label: "小时", value: 1 },
        { label: "天", value: 2 },
        { label: "周", value: 3 },
        { label: "月", value: 4 }
      ],
      department: "",
      creater: "", //创建人
      templateName: "",
      tempOpt: [{ label: "全部", value: "" }],
      signName: "",
      signOpt: [{ label: "全部", value: "" }],
      channelName: "",
      channelOpt: [{ label: "全部", value: "" }],
      dateList: [],
      sendNumList: [],
      sendSuccessNumList: [],
      sendFailureNumList: [],
      priceList: [],
      sendTotal: 0,
      successTotal: 0,
      failureTotal: 0,
      priceTotal: 0,
      recordsTotal: 0,
      pageNum: 1,
      pageSize: 5
    };
  },
  created() {
    //获取所有的签名
    fetchSignatures().then(res => {
      if (!res) {
        return;
      }
      const resData = res.data;
      const { code, data, message } = resData;
      if (code === "000000") {
        data.forEach(item => {
          this.signOpt.push({ label: item.name, value: item.name });
        });
      }
    });
    //获取所有的通道
    fetchChannels().then(res => {
      if (!res) {
        return;
      }
      const resData = res.data;
      const { code, data, message } = resData;
      if (code === "000000") {
        data.forEach(item => {
          this.channelOpt.push({ label: item.name, value: item.name });
        });
      }
    });
    //获取所有的短信模板
    fetchSmsTmplList().then(res => {
      if (!res) {
        return;
      }
      const resData = res.data;
      const { code, data, message } = resData;
      if (code === "000000") {
        data.forEach(item => {
          this.tempOpt.push({ label: item.name, value: item.name });
        });
      }
    });
    this.getTableData(); //异步操作
    this.getChartData(); //异步操作
  },
  beforeDestroy() {
    if (!this.chart & this.chart1) {
      return;
    }
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.chart1) {
      this.chart1.dispose();
      this.chart1 = null;
    }
  },
  methods: {
    //获取表格数据
    getTableData() {
      fetchStatistics(
        Object.assign({}, this.queryObj, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          pagination: 0
        })
      ).then(res => {
        if (!res) {
          return;
        }
        this.checkTableLists(res.data);
      });
    },
    //获取图像数据
    getChartData() {
      fetchStatistics(
        Object.assign({}, this.queryObj, { pagination: 1 })
      ).then(res => {
        debugger;
        if (!res) {
          return;
        }
        this.checkChartLists(res.data);
      });
    },
    //处理表格数据
    checkTableLists(resData) {
      const { code, message, data } = resData;
      if (code === "000000") {
        const tableData = data.data;
        this.recordsTotal = data.recordsTotal;
        tableData.forEach((item, index) => {
          let date = new Date(item.date);
          item.date = date.toLocaleString();
          item.price /= 1000;
          item.successRatio += "%";
        });
        this.statisData = tableData;
      }
    },
    //处理图形数据
    checkChartLists(resData) {
      const { code, message, data } = resData;
      if (code === "000000") {
          this.dateList =[];
          this.sendNumList =[];
          this.sendSuccessNumList=[];
          this.sendFailureNumList=[];
          this.priceList=[];
          this.sendTotal=0;
          this.successTotal=0;
          this.failureTotal=0;
          this.priceTotal=0;
        const chartData = data.data;
        chartData.forEach((item, index) => {
          let date = new Date(item.date);
          item.date = date.toLocaleString();
          item.price /= 1000;
          this.dateList.push(item.date);
          this.sendNumList.push(item.sendNum);
          this.sendSuccessNumList.push(item.sendSuccessNum);
          this.sendFailureNumList.push(item.sendFailureNum);
          this.priceList.push(item.price);
          this.sendTotal += item.sendNum;
          this.successTotal += item.sendSuccessNum;
          this.failureTotal += item.sendFailureNum;
          this.priceTotal += item.price;
        });
        this.initChart();
      }
    },

    initChart() {
      this.chart = echarts.init(document.getElementById("send_volume"));
      this.chart1 = echarts.init(document.getElementById("total_price"));
      this.chart.setOption({
        title: {
          x: "center",
          text: "短信发送量统计",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["发送总量", "发送成功量", "发送失败量"],
          x: "left"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dateList,
          name: "日期"
        },
        yAxis: {
          type: "value",
          name: "总量"
        },
        series: [
          {
            name: "发送总量",
            type: "line",
            stack: "总量",
            data: this.sendNumList
          },
          {
            name: "发送成功量",
            type: "line",
            stack: "总量",
            data: this.sendSuccessNumList
          },
          {
            name: "发送失败量",
            type: "line",
            stack: "总量",
            data: this.sendFailureNumList
          }
        ]
      });
      this.chart1.setOption({
        title: {
          left: "center",
          text: "费用统计",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.dateList,
            name: "日期"
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位:(元)"
          }
        ],
        series: [
          {
            name: "最高气温",
            type: "line",
            data: this.priceList,
            markPoint: {
              data: [{ type: "max", name: "最大值" }, { type: "min", name: "最小值" }]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      });
    },
    handleQuery() {
      console.log(this.queryObj);
      this.getTableData();
      this.getChartData();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    sum(array) {
      let sum = 0;
      array.forEach(function(element) {
        sum += element;
      });
      return sum;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getTableData();
    }
  },
  computed: {
    queryObj() {
      const queryObj = {};
      if (this.department.trim()) {
        queryObj.department = this.department.trim();
      }
      if (this.creater.trim()) {
        queryObj.creater = this.creater.trim();
      }
      if (this.date) {
        queryObj.startTime = this.date[0].getTime();
      }
      if (this.date) {
        queryObj.endTime = this.date[1].getTime() + 3600000 * 24;
      }
      if (this.templateName) {
        queryObj.templateName = this.templateName;
      }
      if (this.signName) {
        queryObj.signName = this.signName;
      }
      if (this.channelName) {
        queryObj.channelName = this.channelName;
      }
      return queryObj;
    }
  },

  watch: {
    timeType: function(val) {
      if (val === 2) {
        this.granularityOpt = [
          { label: "小时", value: 1 },
          { label: "天", value: 2 },
          { label: "周", value: 3 },
          { label: "月", value: 4 }
        ];
        this.granularity = 2;
      }
      if (val === 1) {
        this.granularityOpt = [{ label: "小时", value: 1 }];
        this.granularity = 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#send_volume,
#total_price {
  width: 1000px;
  height: 500px;
}

.row {
  margin: 20px 100px;
  .sub_title {
    display: inline-block;
    width: 120px;
    text-align: left;
    font-weight: bold;
  }
  .col {
    margin-right: 40px;
    display: inline-block;
  }
  .left {
    float: left;
    line-height: 30px;
  }
  .right {
    float: right;
  }
  .last_row {
    margin-bottom: 100px;
  }
  &.last_row:after {
    content: ".";
    visibility: hidden;
    display: block;
    clear: both;
  }
}
</style>
<style lang="scss">
.data_Statistics {
  .el-table td:first-child .cell,
  .el-table th:first-child .cell {
    padding-left: 10px;
  }
  .el-input {
    width: auto;
  }
}
</style>
