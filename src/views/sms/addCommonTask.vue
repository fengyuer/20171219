<template>
    <div class="add_market_task">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
            <el-form-item label="选择模板:" prop="temp">
                <el-select v-model="ruleForm.temp" placeholder="请选择短信模板">
                    <el-option v-for="item in tempOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="templeVisible = true">查看模板内容</el-button>
            </el-form-item>

            <el-form-item label="选择签名:" prop="sign">
                <el-select v-model="ruleForm.sign" placeholder="请选择短信签名">
                    <el-option v-for="item in signOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发送人群:" prop="group">
                <el-button type="primary" @click="groupVisible = true" v-if="notChoose">选择人群</el-button>
                <div v-if="!notChoose">
                    <span>{{this.group.resource}}--{{this.group.business}}--{{this.group.groupIndex}}--{{this.group.rule}}--{{this.group.num}}人</span>
                    <el-button type="primary" @click="groupVisible = true">重新选择</el-button>
                </div>
            </el-form-item>

            <el-form-item label="推送时间:" required>
                <el-col :span="12">
                    <el-form-item prop="date1">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="date2">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="发送说明:" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" placeholder="请描述您的业务使用场景" :autosize="{ minRows: 4,maxRows:8}"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="hasPush">
                    该短信模板
                    <span class="period">
                        <el-select v-model="period" size="mini">
                            <el-option v-for="item in periodOpt" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    已经推送过的用户不再重复推送
                </el-checkbox>
            </el-form-item>
            <p class="tip">根据当前选项，预计将发送20000条短信，并产生费用300元</p>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交申请</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 弹出Form -->
        <el-dialog :visible.sync="groupVisible" :show-close="false">
            <div slot="title" class="title">选择人群</div>
            <el-radio-group v-model="groupType">
                <el-radio :label="1">新建人群</el-radio>
                <el-radio :label="2">已有人群</el-radio>
            </el-radio-group>
            <div class="row" v-if="groupType ===1">
                数据来源:
                <el-select v-model="group.resource" placeholder="">
                    <el-option v-for="item in resourceOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
               &nbsp&nbsp&nbsp
                业务线:
                <el-select v-model="group.business" placeholder="">
                    <el-option v-for="item in businessOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="row" v-if="groupType ===1">
                <el-table  max-height="300"  :data="newGroupData" highlight-current-row  :header-row-style="{backgroundColor:'#eee'}"   @current-change="handleCurrentChange">
                    <el-table-column width="50">
                        <template slot-scope="scope">
                            <el-radio v-model="currentRow"  :label="scope.row.index">{{null}}
                            </el-radio> 
                        </template>
                    </el-table-column>
                    <el-table-column property="groupIndex" label="群组" ></el-table-column>
                    <el-table-column property="rule" label="规则"></el-table-column>
                    <el-table-column property="num" label="人数"></el-table-column>
                </el-table>      
            </div>
            <div class="row" v-if="groupType ===2">
              <el-table  max-height="300"  :data="oldGroupData" highlight-current-row  :header-row-style="{backgroundColor:'#eee'}"   @current-change="handleCurrentChange">
                    <el-table-column  width="50">
                        <template slot-scope="scope">
                            <el-radio v-model="currentRow2"  :label="scope.row.index">{{null}}
                            </el-radio> 
                        </template>
                    </el-table-column>
                    <el-table-column property="dataSources" label="数据来源 "></el-table-column>
                    <el-table-column property="serviceLine" label="业务线"></el-table-column>
                    <el-table-column property="groupIndex" label="群组"></el-table-column>
                    <el-table-column property="rule" label="规则"></el-table-column>
                    <el-table-column property="num" label="人数"></el-table-column>
                </el-table>   
            </div>
            <p>其中有手机号人数
                    <span>{{hasPhone}}</span>人，无手机号人数
                    <span>{{noPhone}}</span>人
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="groupVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="templeVisible" :show-close="false">
            <div slot="title" class="title">模板内容</div>
            <div class='detail'>
                <div class='item'>
                    <span>模板ID：</span>
                    <span>{{ }}</span>
                </div>
                <div class='item'>
                    <span>创建时间：</span>
                    <span>{{ }}</span>
                </div>
                <div class='item'>
                    <span>模板名称：</span>
                    <span>{{ }}</span>
                </div>
                <div class='item'>
                    <span>说明：</span>
                    <span>{{ }}</span>
                </div>
                <div class='item'>
                    <span>模板内容：</span>
                    <span>{{ }}</span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="templeVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
var Mock = require("mockjs");
export default {
  data() {
    return {
      tempOpt: [
        { label: "模板1", value: "选项1" },
        { label: "模板2", value: "选项2" },
        { label: "模板3", value: "选项3" }
      ],
      signOpt: [
        { label: "签名1", value: "选项1" },
        { label: "签名2", value: "选项2" },
        { label: "签名3", value: "选项3" }
      ],
      resourceOpt: [
        { label: "TD", value: "TD" },
        { label: "COC", value: "COC" },
        { label: "EXCEL上传", value: "EXCEL上传" }
      ],
      businessOpt: [
        { label: "全部", value: "全部" },
        { label: "业务线1", value: "业务线1" },
        { label: "业务线2", value: "业务线2" },
        { label: "业务线3", value: "业务线3" }
      ],
      periodOpt: [
        { label: "近3日内", value: "选项1" },
        { label: "近7日内", value: "选项2" },
        { label: "近30日内", value: "选项3" }
      ],
      ruleForm: {
        temp: "",
        sign: "",
        group: "",
        date1: "",
        date2: "",
        desc: ""
      },
      rules: {
        temp: [{ required: true, message: "请选择短信模板", trigger: "change" }],
        sign: [{ required: true, message: "请选择短信签名", trigger: "change" }],
        group: [{ required: true, message: "请选择人群" }],
        date1: [
          { type: "date", required: true, message: "请选择日期", trigger: "change" }
        ],
        date2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ]
      },
      period: "近3日内", //最近一段时间
      //dialog部分数据
      groupVisible: false,
      templeVisible: false,
      groupType: 1,
      group: {
        resource: "TD",
        business: "全部",
        groupIndex: "",
        num: "",
        rule: ""
      },
      newGroupData: [],
      hasPhone: "",
      noPhone: "",
      notChoose: true, //是否选择人群
      hasPush: false,
      currentRow: null, //新建人群选中当前行
      currentRow2: null //已有人群选中当前行
    };
  },
  created() {
    let data = Mock.mock({
      "newGroupData|1-100": [
        {
          "index|+1": 1,
          rule: "男&运动&购物",
          "num|0-10": 100
        }
      ],
      "oldGroupData|1-100": [
        {
          "index|+1": 1,
          "dataSources|1": ["TD", "COC", "EXCEL上传"],
          "serviceLine|1": ["业务线1", "业务线2", "业务线3"],
          rule: "男&运动&购物",
          "num|0-10": 100
        }
      ],
      "hasPhone|0-100": 100,
      "noPhone|0-100": 100
    });
    data.newGroupData.forEach(function(item) {
      item.groupIndex = "group" + item.index;
    });
    data.oldGroupData.forEach(function(item) {
      item.groupIndex = "group" + item.index;
    });
    this.newGroupData = data.newGroupData;
    this.oldGroupData = data.oldGroupData;
    this.hasPhone = data.hasPhone;
    this.noPhone = data.noPhone;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      debugger;
      this.notChoose = true;
    },
    //提交所选人群
    confirm() {
      this.groupVisible = false;
      this.notChoose = false;
    },
    handleCurrentChange(val) {
      debugger;
      this.group = Object.assign({}, this.group, val);
      console.log(this.group);
    }
  }
};
</script>
<style lang="scss" scoped>
.ruleForm {
  margin-top: 80px;
  margin-left: 20%;
  width: 50%;
}

.row {
  margin-top: 20px;
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
.period {
  display: inline-block;
  width: 120px;
}

.tip {
  padding-left: 100px;
  color: #666;
}
// .el-dialog .el-table{
//   max-height:400px;
//   overflow: auto;
// }
</style>
<style lang="scss">
.add_market_task {
  .el-dialog__header {
    padding: 0;
  }

  .el-table td:first-child .cell,
  .el-table th:first-child .cell {
    padding-left: 10px;
  }

  .el-table th:first-child .cell {
    display: none;
  }
}
</style>

