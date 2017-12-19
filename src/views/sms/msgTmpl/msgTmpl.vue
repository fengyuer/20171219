<!--短信模板列表-->
<template>
    <div class="msgtmpl_wrap">
        <div class="msgtmpl_head">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button type="primary" @click="routeToAdd"><span>新增模板</span></el-button>
                    <el-button type="primary" @click="delSelected" :disabled="isDelBtnDisabled"><span>删除选中项</span></el-button>
                </el-col>
                <el-col :span="6">
                    <el-input
                        placeholder="请输入模板ID/模板名称查询"
                        prefix-icon="sms-icon-search"
                        v-model="searchKeyword"
                        @input="handleInput">
                        <template slot="suffix">
                            <i class="sms-icon-delete" v-if="searchKeyword" @click="clearInput"></i>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span='6'>
                    <el-button type="primary" @click="handleQuery" :disabled="isQueryBtnDisabled"><span>查询</span></el-button>
                </el-col>
            </el-row>
        </div>
        <div class="msgtmpl_body">
            <el-table
                :data="tmplList"
                :row-key="tmplList.id"
                show-overflow-tooltip="true"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="creatTime"
                    label="创建时间"
                    width="160">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="模板ID"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="模板名称"
                    width="260" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="说明"
                    width="260" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="320">
                    <template slot-scope="scope">
                    <!--操作按钮-->
                        <el-button
                            type="primary" size="mini"
                            @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            @click="delSingle(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="启用状态"
                >
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.isActive"
                            active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitchStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
        title="模板详情"
        :visible.sync="showTmplDetail"
        width="30%"
        center>
            <div><span class="dialogfield">模板名称：</span>{{tmplDetail.name}}</div>
            <div><span class="dialogfield">模板描述：</span>{{tmplDetail.description}}</div>
            <div><span class="dialogfield">模板内容：</span>{{tmplDetail.content}}</div>
            <div><span class="dialogfield">模板状态：</span>{{tmplDetail.isActive|statusText}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showTmplDetail = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { fetchSmsTmplList, fetchDelSmsTmpl, fetchUpdateSmeTmpl } from "@/api/smsApi";

export default {
  data() {
    return {
      searchKeyword: "",
      allChecked: false,
      tmplList: [],
      showTmplDetail: false,
      tmplDetail: {},
      isQueryBtnDisabled: false,
      isDelBtnDisabled: true,
      selected: []
    };
  },
  beforeRouteEnter: (to, from, next) => {
    // 调取获取短信模板列表接口
    fetchSmsTmplList().then(response => {
      let [code, data] = [response.data.code, response.data.data];
      //console.log(response.data)
      if (code == "000000") {
        next(vm => {
          let tempArr = data;
          vm.tmplList = vm.handleData(tempArr);
        });
      }
    });
  },
  methods: {
    handleData(dataArray) {
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].isActive == "1") {
          dataArray[i].isActive = true;
        } else {
          dataArray[i].isActive = false;
        }
      }
      return dataArray;
    },
    clearInput: function() {
      this.searchKeyword = "";
    },
    // 处理选择状态
    handleSelectionChange: function(selection) {
      let length = selection.length;
      this.isDelBtnDisabled = length > 0 ? false : true;
      this.selected = selection;
    },
    // 删除选中项
    delSelected: function() {
      let delIdArr = [];
      for (let i = 0; i < this.selected.length; i++) {
        delIdArr.push(this.selected[i].id);
      }
      let delIdString = delIdArr.join(",");
      let delObj = {
        id: delIdString
      };
      this.handleDelete(delObj);
    },
    // 查看按钮
    handleCheck: function(index, row) {
      this.showTmplDetail = true;
      let tmplObj = row
      let contentArr = row.content
      let contentString = ''
      for(let item of contentArr){
        if(item.type == 'text'){
          contentString += item.value
        }else{
          contentString += item.value //.replace(/^\$\{|\}$/g,'')
        }
      }
      tmplObj.content = contentString
      this.tmplDetail = tmplObj;
    },
    // 编辑按钮
    handleEdit: function(index, row) {
      // 将接口查询需要的参数id传递给新增模板组件
      this.$router.push({ name: "新增/修改模板", query: { id: row.id } });
    },
    // 删除按钮
    delSingle: function(index, row) {
      let delObj = {
        id: row.id
      };
      this.handleDelete(delObj);
    },
    handleDelete: function(delObj) {
      this.$confirm("此操作将删除该短信模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchDelSmsTmpl(delObj).then(response => {
            let [code, data] = [response.data.code, response.data.data];
            if (code == "000000") {
              this.tmplList = this.handleData(data);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            // 发生错误，提示错误
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 状态切换按钮
    handleSwitchStatus: function(row) {
      console.log('row', row)
      // 是否启用（整数1表示启用，2表示不启用，默认为1）
      let activeStatus = 1
      // 停用时，如有待执行的任务，则弹出提示，询问是否弃用待执行的任务；
      if (!row.isActive) {
        const h = this.$createElement;
        this.$msgbox({
          title: "消息",
          message: h("p", null, [
            h("span", null, "是否"),
            h("i", { style: "color: red; font-style: normal" }, "停用 已启用 "),
            h("span", null, "的短信模板？")
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              let requestObj = {
                id: row.id,
                isActive: activeStatus
              }
              fetchUpdateSmeTmpl(requestObj).then(response => {
                let [code, data] = [response.data.code, response.data.data]
                if(code == '000000'){
                  instance.confirmButtonLoading = false;
                  done()
                }
              }).catch(
                //error
              )
            } else {
              done()
              row.isActive = true;
            }
          }
        }).then(action => {
          this.$message({
            type: "info",
            message: "短信模板停用成功！"
          });
        });
      }else{
        //启用
        activeStatus = 2
        const h = this.$createElement;
        this.$msgbox({
          title: "消息",
          message: h("p", null, [
            h("span", null, "是否"),
            h("i", { style: "color: red; font-style: normal" }, "启用 已停用 "),
            h("span", null, "的短信模板？")
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              let requestObj = {
                id: row.id,
                isActive: activeStatus
              }
              fetchUpdateSmeTmpl(requestObj).then(response => {
                let [code, data] = [response.data.code, response.data.data]
                if(code == '000000'){
                  instance.confirmButtonLoading = false;
                  done()
                }
              }).catch()
            } else {
              done()
              row.isActive = false;
            }
          }
        }).then(action => {
          this.$message({
            type: "info",
            message: "短信模板启用成功！"
          });
        });
      }
    },
    // 输入框查询
    handleInput: function(value) {
      //this.isQueryBtnDisabled = value ? false : true;
    },
    // 查询按钮
    handleQuery: function() {
      console.log("查询操作");
      this.searchKeyword = this.searchKeyword.replace(/^\s+|\s+$/g, "");
      let queryObj = {
        key: this.searchKeyword
      };
      fetchSmsTmplList(queryObj).then(response => {
        let [code, data] = [response.data.code, response.data.data];
        if (code == "000000") {
          this.tmplList = this.handleData(data);
        }
      });
    },
    // 跳转到新增模板页面
    routeToAdd: function() {
      this.$router.push({ name: "新增/修改模板" });
    }
  },
  filters: {
    statusText: function(value) {
      return value ? "已启用" : "未启用";
    }
  }
};
</script>
<style lang="scss">
.msgtmpl_wrap {
  width: 100%;

  .msgtmpl_head {
    margin: 20px 0 0 20px;
  }
  .msgtmpl_body {
    margin-top: 20px;

    .el-table thead > tr {
      background-color: rgb(242, 242, 242);
    }
    .el-table th > .cell {
      //text-align: center;
    }
    .el-table th:nth-of-type(1) {
      & > .cell {
        text-align: left;
      }
    }
  }
  .sms-icon-delete {
    display: inline-block;
    line-height: 40px;
    font-size: 20px;
    cursor: pointer;
  }

  .el-dialog {
    .dialogfield {
      color: #409eff;
    }
  }
}
</style>