<template>
    <div class="msg_push">
        <div class="row">
            <div class="col">
                <span>任务ID:</span>
                <el-input v-model="id" placeholder="请输入内容"></el-input>
            </div>
            <div class="col">
                <span>短信模板名称:</span>
                <el-input v-model="templateName" placeholder="请输入内容"></el-input>
            </div>
            <div class="col">
                <span>任务状态:</span>
                <el-select v-model="status" placeholder="请选择">
                    <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span>推送时间:</span>
                <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="col">
                <span>所属部门:</span>
                <el-select v-model="project" placeholder="请选择">
                    <el-option v-for="item in projectOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>创建人:</span>
                <el-select v-model="creater" placeholder="请选择">
                    <el-option v-for="item in createrOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button class='search' type="primary" @click="search">查询</el-button>
        </div>
        <div class="row page_change">
            <div class="col page_size">
                <span>每页显示:</span>
                <el-select v-model="pageSizeOne" placeholder="请选择">
                    <el-option v-for="item in sizeOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="pageSizeVal" placeholder="" v-if="this.pageSizeOne=='自定义'" @keyup.enter.native="pageSizeChange"></el-input>
            </div>
            <el-button class="right-button" type="info" plain @click="multipleDel">弃用</el-button>
            <el-button class='right-button' type="info" plain @click="toMarketTask">新增普通任务</el-button>
            <el-button class="right-button"  type="info" plain @click="toAPITask">新增API任务</el-button>        
        </div>
        <div class="row">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading.body="dataLoading" @selection-change="handleSelectionChange" :header-row-style="{backgroundColor:'#eee'}">
                <el-table-column type="selection" width="55" class-name='first_col'>
                </el-table-column>
                <el-table-column prop="index" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="taskType" label="任务类型" width="120">
                </el-table-column>
                <el-table-column prop="executeTime" label="推送时间" width="180">
                </el-table-column>
                <el-table-column prop="id" label="任务ID" width="120">
                </el-table-column>
                <el-table-column prop="templateName" label="短信模板" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sendUserNum" label="发送人数">
                </el-table-column>
                <el-table-column prop="sendNum" label="发送条数">
                </el-table-column>
                <el-table-column prop="creater" label="创建人">
                </el-table-column>
                <el-table-column prop="project" label="所属部门">
                </el-table-column>
                <el-table-column prop="status" label="任务状态">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleToDetail(scope.$index, scope.row)">查看</el-button>
                        <el-button size="mini" @click="singleDelete(scope.$index, scope.row)">弃用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-pagination class='pagination'  :current-page.sync="currentPage" :page-size="pageSize" layout="total,prev, pager, next, jumper" :total="recordsTotal">
        </el-pagination>

        <el-dialog :visible.sync="detailVisible" :show-close="false">
            <div slot="title" class="title">任务详情</div>
            <div class='detail'>
                <div class='item'>
                    <span>任务ID：</span>
                    <span>{{detailData.id}}</span>
                </div>
                <div class='item'>
                    <span>任务状态：</span>
                    <span>{{detailData.status}}</span>
                </div>
                <div class='item'>
                    <span>创建人：</span>
                    <span>{{detailData.creater}}</span>
                </div>
                <div class='item'>
                    <span>所属部门：</span>
                    <span>{{detailData.project}}</span>
                </div>
                <div class='item'>
                    <span>短信模板：</span>
                    <span>{{detailData.templateName}}</span>
                </div>
                <div class='item'>
                    <span>短信签名：</span>
                    <span>{{detailData.signName}}</span>
                </div>
                <div class='item'>
                    <span>推送人群：</span>
                    <span>{{detailData.group}}</span>
                </div>
                <div class='item'>
                    <span>推送人数：</span>
                    <span>{{detailData.sendUserNum}}</span>
                </div>
                <div class='item'>
                    <span>推送条数：</span>
                    <span>{{detailData.sendNum}}</span>
                </div>
                <div class='item'>
                    <span>推送时间：</span>
                    <span>{{detailData.executeTime}}</span>
                </div>
                <div class='item'>
                    <span>推送说明：</span>
                    <span>{{}}</span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { fetchMsgPushList, fetchDelMsgPush } from "@/api/smsApi";
export default {
  data() {
    return {
      id: "",
      templateName: "",
      status: "",
      date: "",
      project: "",
      creater: "", //创建人
      pageSizeOne: "自定义", //选择
      pageSizeVal: 10, //自定义
      pageSizeTwo: "",
      currentPage: 1,
      firstCol: "first_col",
      statusOpt: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "未审核"
        },
        {
          value: 3,
          label: "已审核（同意）"
        },
        {
          value: 2,
          label: "已审核（拒绝）"
        },
        {
          value: 5,
          label: "正常执行"
        },
        {
          value: 4,
          label: "已完成"
        }
      ],
      projectOpt: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "研究院",
          label: "研究院"
        },
        {
          value: "云群",
          label: "云群"
        },
        {
          value: "百视通",
          label: "百视通"
        }
      ],
      createrOpt: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "创建人1",
          label: "创建人1"
        },
        {
          value: "创建人2",
          label: "创建人2"
        }
      ],
      sizeOpt: [
        {
          value: "自定义",
          label: "自定义"
        },
        {
          value: 10,
          label: "10"
        },
        {
          value: 20,
          label: "20"
        },
        {
          value: 50,
          label: "50"
        },
        {
          value: 100,
          label: "100"
        }
      ],
      tableData: [],
      multipleSelection: [],
      detailVisible: false,
      detailData: {}, //详情数据
      dataLoading: false, //
      recordsTotal: 0, //查询数据总条数
      ids:''//需要批量删除的id,用逗号分隔
    };
  },
  created() {
    this.pageSizeTwo = this.pageSizeVal;
    console.log(this.searchQuery);
    this.getData();
  },
  computed: {
    pageSize() {
      if (this.pageSizeOne == "自定义") {
        return this.pageSizeTwo;
      }
      return this.pageSizeOne;
    },
    // //开始搜索的位置
    // start() {
    //   return (this.currentPage - 1) * this.pageSize;
    // },
    searchQuery() {
      let searchQueryObj = {
        start: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.id.trim()) {
        searchQueryObj.id = this.id.trim();
      }
      if (this.project) {
        searchQueryObj.project = this.project;
      }
      if (this.creater) {
        searchQueryObj.creater = this.creater;
      }
      if (this.date) {
        searchQueryObj.startTime = this.date[0].getTime();
      }
      if (this.date) {
        searchQueryObj.endTime = this.date[1].getTime() + 3600000 * 24;
      }
      if (this.templateName.trim()) {
        searchQueryObj.templateName = this.templateName.trim();
      }
      if (this.status) {
        searchQueryObj.status = this.status;
      }
      return searchQueryObj;
    }
  },
  methods: {
    getData() {
      this.dataLoading = true;
      fetchMsgPushList(this.searchQuery).then(response => {
        this.dataLoading = false;
        if (!response) {
          return;
        }
        this.checkLists(response.data);
      });
    },
    //处理数据列表
    checkLists(resData) {
      const {code, message, data} = resData;
      if (code === "000000") {
        let tableData = data.data;
        this.recordsTotal = data.recordsTotal;
        Date.prototype.toLocaleString = function() {
          return (
            this.getFullYear() +
            "-" +
            (this.getMonth() + 1) +
            "-" +
            this.getDate() +
            " " +
            this.getHours() +
            ":" +
            this.getMinutes() +
            ":" +
            this.getSeconds()
          );
        };
        tableData.forEach(function(item, index) {
          switch (item.status) {
            case 1:
              item.status = "未审核";
              break;
            case 2:
              item.status = "已审核（拒绝）";
              break;
            case 3:
              item.status = "已审核（通过）";
              break;
            case 4:
              item.status = "已完成";
              break;
            case 5:
              item.status = "正常执行";
              break;
          }
          let executeTime = new Date(item.executeTime);
          item.executeTime = executeTime.toLocaleString();
          item.index = data.start + index + 1;
        });
        this.tableData = tableData;
      }
    },
    search() {
      console.log(this.searchQuery);
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const idArr = this.multipleSelection.map(item => {
        return item.id;
      });
      this.ids=idArr.join(',')
      
    },
    handleToDetail(index, row) {
      console.log(index, row);
      this.detailData = row;
      this.detailVisible = true;
    },
    singleDelete(index, row) {
      console.log(index, row);
      this.handleDelete({ ids: row.id });
    },
    multipleDel() {
       if(!this.ids) return
       this.handleDelete({ ids: this.ids });
    },
    handleDelete(idsObj) {
      this.dataLoading = true;
      fetchDelMsgPush(idsObj).then(response => {
        this.dataLoading = false;
        if (!response) {
          return;
        }
        const resData = response.data;
        const [code, message] = [resData.code, resData.message];
        if (code === "000000") {
          this.getData();
        }
      });
    },
    pageSizeChange() {
      this.pageSizeTwo = parseInt(this.pageSizeVal);
    },
    toMarketTask() {
      this.$router.push("addCommonTask");
    },
    toAPITask() {
      this.$router.push("addAPITask");
    }
  },
  watch: {
    pageSize: function() {
      console.log(this.searchQuery);
      this.getData();
    },
    currentPage: function() {
      console.log(this.searchQuery);
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.row {
  margin: 20px 40px;
  .col {
    margin-right: 40px;
    display: inline-block;
    .el-input {
      width: 300px;
      margin-right: 20px;
    }
    &.page_size {
      .el-input,
      .el-select {
        width: 100px;
      }
    }
  }
  &.page_change {
    border-top: 1px solid #eee;
    padding-top: 20px;
    .col {
      margin-right: 20px;
    }
  }
  .el-table {
    margin-top: 40px;
  }
}

.title {
  text-align: center;
  background: #409eff;
  color: #fff;
  line-height: 40px;
}

.detail {
  padding: 10px;
  overflow: hidden;
  .item {
    float: left;
    min-width: 50%;
    padding-top: 10px;
    padding-left: 10px;
  }
}
.pagination {
  float: right;
  margin-right: 35px;
  margin-bottom: 20px;
}
.right-button {
  float: right;
  margin-left: 10px;
}
</style>
<style lang="scss">
.msg_push {
  .el-table td:first-child .cell,
  .el-table th:first-child .cell {
    padding-left: 10px;
  }
  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
  }
}
</style>

