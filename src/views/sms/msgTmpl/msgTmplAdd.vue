<template>
    <div class="msgtmpladd_wrap">
        <div class="msgtmpl_form">
            <el-form :model="msgTmpl" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="模板名称：" prop="name">
                    <el-input v-model="msgTmpl.name" placeholder="请输入模板名称"></el-input>
                </el-form-item>
                <el-form-item label="模板说明：" prop="intro">
                    <el-input v-model="msgTmpl.intro" placeholder="请输入模板说明" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item v-for="(text, index) in msgTmpl.texts"
                    :label="'文本|参数 ' + index"
                    :key="text.key"
                    :prop="'texts.' + index + '.value'"
                    :rules="{
                        required: true, message: '文本或参数不能为空', trigger: 'blur'
                    }"
                >
                    <el-input :maxlength="text.length || 10000" v-model="text.value" @input="joinTmpl">
                        <template slot="prepend">{{ text.type|typeText }}</template>
                    </el-input>
                    <el-button @click.prevent="removeText(text)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-cascader
                        placeholder="请选择"
                        :options="msgTmpl.options"
                        @change="handleItemChange"
                        filterable
                    ></el-cascader>
                    <el-button @click="addText" type="primary" :disabled="isAddBtnDis">插入</el-button>
                </el-form-item>
                <el-form-item label="模板预览：" prop="content">
                    <el-input v-model="msgTmpl.content" disabled placeholder="模板内容预览"  type="textarea" :rows="5"></el-input>
                    <div class="msgTip">当前输入<span class="red">{{msgLength}}</span>字，将作为<span class="red">{{Math.ceil(msgLength/70)}}</span>条短信发送（带有参数时，仅供参考）</div>
                </el-form-item>
            </el-form>
        </div>
        <div class="tmpl_params">
            <div class="tmpl_params_title">
                <span>自定义参数</span>
                <el-button @click="dialogFormVisible = true" type="primary" icon="sms-icon-addition" size="mini">新增参数</el-button>
                <span class="red">*参数编辑后请重新插入模板</span>
                <el-dialog title="新增参数" :visible.sync="dialogFormVisible">
                    <el-form :model="paramForm">
                        <el-form-item label="参数名：" :label-width="formLabelWidth" :rules="{
                        required: true, message: '参数名不能为空', trigger: 'blur'
                    }">
                            <el-input v-model="paramForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="长度限制：" :label-width="formLabelWidth">
                            <el-input v-model="paramForm.length" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <!--内层dialog-->
                    <el-dialog width="30%" title="参数名不能为空！" :visible.sync="dialogInnerVisible" append-to-body></el-dialog>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addParam(paramForm)">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div class="tmpl_params_table">
                <el-dialog title="编辑参数" :visible.sync="dialogEditParam">
                    <el-form :model="paramForm">
                        <el-form-item label="参数名：" :label-width="formLabelWidth" :rules="{
                        required: true, message: '参数名不能为空', trigger: 'blur'
                    }">
                            <el-input v-model="paramForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="长度限制：" :label-width="formLabelWidth">
                            <el-input v-model="paramForm.length" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <!--内层dialog-->
                    <el-dialog width="30%" title="参数名不能为空！" :visible.sync="dialogInnerEditParam" append-to-body></el-dialog>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogEditParam = false">取 消</el-button>
                        <el-button type="primary" @click="saveParam(paramForm)">确 定</el-button>
                    </div>
                </el-dialog>
                <el-table border :data="msgTmpl.options[1].children">
                    <el-table-column label="编号" type="index" width="160"></el-table-column>
                    <el-table-column property="value[name]" label="参数名" width="160"></el-table-column>
                    <el-table-column property="value[length]" label="长度限制" width="160"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleParamEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleParamDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="tmpl_save">
            <el-button @click="submitForm()" type="primary">保存</el-button>
        </div>
    </div>
</template>
<script>
import { fetchSmsTmplList, fetchUpdateSmeTmpl, fetchAddSmeTmpl } from "@/api/smsApi";

export default {
  data() {
    return {
      msgTmpl: {
        name: "",
        intro: "",
        isActive: '',
        content: "",
        texts: [],
        options: [
          {
            value: "text",
            label: "文本"
          },
          {
            value: "param",
            label: "参数",
            children: []
          }
        ]
      },
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        intro: [{ required: true, message: "请输入模板说明", trigger: "blur" }]
      },
      isAddBtnDis: true,
      labelType: "text",
      paramLength: 0,
      paramValue:'',
      dialogFormVisible: false,
      dialogInnerVisible: false,
      paramForm: {
        name: '',
        length: '',
        value: ''
      },
      formLabelWidth: "120px",
      combineString: "",
      msgLength: 0,
      isEdit: false,
      smsId: "",
      dialogEditParam: false,
      dialogInnerEditParam: false,
      editParamIndex: 0,                     // 编辑的参数索引值
      isUpdate: false                        // 是否是更新短信模板
    };
  },
  created() {
    this.smsId = this.$route.query.id || "";
    if (this.smsId) {
      this.isUpdate = true
      let queryObj = {
        id: this.smsId
      };
      fetchSmsTmplList(queryObj).then(response => {
        let [code, data] = [response.data.code, response.data.data]
        if(code == '000000'){
            this.initSmsTmpl(data[0])
        }
      });
    }
  },
  methods: {
    // url带有id时初始化模板
    initSmsTmpl(smsData){
      //console.log(smsData)
      this.msgTmpl.name = smsData.name
      this.msgTmpl.intro = smsData.description
      this.msgTmpl.isActive = smsData.isActive
      this.msgTmpl.texts = smsData.content
      this.msgTmpl.content = this.setContentData(smsData.content)
      this.setParamData(smsData.params)
    },
    // 编辑-赋值参数列表
    setParamData: function(params){
      // {
      //   label: "name",
      //   value: {
      //     name: "key",
      //     length: 10,
      //     value: '${key}'
      //   }
      // }
      let tempArr = []
      for(let i = 0; i< params.length; i++){
        let paramObj = {
          label: params[i].key,
          value: {
            name: params[i].key,
            length: params[i].length,
            value: params[i].value
          }
        }
        tempArr.push(paramObj)
      }
      this.msgTmpl.options[1].children = tempArr
    },
    setContentData: function(contentList) {
      console.log(contentList)
      let contentString = ''
      for(let i=0;i<contentList.length;i++){
        contentString += contentList[i].value
      }
      return contentString
    },
    // 增加文本或者参数按钮，添加文本框
    addText: function() {
      this.msgTmpl.texts.push({
        type: this.labelType,
        value: this.paramValue,       
        length: this.paramLength
      });
      // 添加后，拼接一次短信模板
      this.joinTmpl()
    },
    removeText: function(item) {
      let index = this.msgTmpl.texts.indexOf(item);
      if (index !== -1) {
        this.msgTmpl.texts.splice(index, 1);
      }
      this.joinTmpl();
    },
    joinTmpl: function() {
      let tmplString = "";
      // 拼接的短信模板
      this.combineString = "";
      for (let i = 0; i < this.msgTmpl.texts.length; i++) {
        tmplString += this.msgTmpl.texts[i].value;
        this.combineString += this.msgTmpl.texts[i].type;
      }
      this.msgTmpl.content = tmplString;
      this.msgLength = tmplString.length;
    },
    // 增加自定义参数
    addParam: function(obj) {
      // 如果参数名为空，内嵌dialog提示
      if (!obj.name) {
        this.dialogInnerVisible = true;
        return;
      }
      let newParam = {
        label: obj.name,
        value: {
          name: obj.name,
          length: parseInt(obj.length),
          value: '${'+obj.name+'}'
        }
      };
      // 插入对象
      this.msgTmpl.options[1].children.push(newParam);
      this.dialogFormVisible = false;
    },
    // 编辑参数
    handleParamEdit: function(index, row) {
      this.paramForm.name = row.value.name
      this.paramForm.length = row.value.length
      this.paramForm.value = row.value.value
      this.dialogEditParam = true
      this.editParamIndex = index
    },
    // 保存编辑后的参数
    saveParam: function(obj) {
      let index = this.editParamIndex;
      // {
      //   label: "name",
      //   value: {
      //     name: "key",
      //     length: 10,
      //     value: '${key}'
      //   }
      // }
      this.msgTmpl.options[1].children[index].label = obj.name
      this.msgTmpl.options[1].children[index].value = {
        name: obj.name,
        length: obj.length,
        value: '${'+obj.name+'}'
      }
      this.dialogEditParam = false
      //console.log('children', this.msgTmpl.options[1].children[index])
    },
    // 删除参数
    handleParamDelete: function(index, value) {
      console.log("删除参数");
      let pIndex = this.combineString.indexOf(value.label);
      if (pIndex == -1) {
        this.msgTmpl.options[1].children.splice(index, 1);
      } else {
        alert("参数正被使用中，无法删除！");
      }
    },
    // 级联选择器
    handleItemChange: function(value) {
      console.log('value',value);
      if (value[0]) {
        this.isAddBtnDis = false;
      }
      if (value[0] == "param") {
        this.labelType = 'param';
        this.paramLength = value[1].length;
        this.paramValue = value[1].value;
      } else {
        this.labelType = "text";
        this.paramLength = false;
        this.paramValue = '';
      }
    },
    // 更新或者新建模板
    submitForm: function() {
      let sortedDate = this.sortData();
      // 更新
      if(this.isUpdate){
        let requestData = {
          id: this.smsId,
          name: this.msgTmpl.name,
          content: sortedDate.content,
          isActive: this.msgTmpl.isActive,
          params: sortedDate.params,
          descripton: this.msgTmpl.intro
        }
        console.log('requestData', requestData)
        fetchUpdateSmeTmpl(requestData).then(response => {
          let [code, data] = [response.data.code, response.data.data];
          console.log(response)
          if(code == '000000'){
            // 更新成功
            this.$message({
              type: "success",
              message: "短信模板更新成功!"
            });
          }
        }).catch()
      }else{
        let isEmpty = (this.msgTmpl.name == '') || (sortedDate.content.length == 0)
        if(isEmpty){
          this.$message({
            type: "warning",
            message: "短信模板名称或者内容不能为空!"
          });
          return
        }
        // 新建短信模板
        let requestData = {
          name: this.msgTmpl.name,
          content: sortedDate.content,
          isActive: 1,
          params: sortedDate.params,
          descripton: this.msgTmpl.intro
        }
        console.log('新建短信模板requestData', requestData)
        fetchAddSmeTmpl(requestData).then(response => {
          let [code, data] = [response.data.code, response.data.data];
          console.log(response)
          if(code == '000000'){
            // 更新成功
            this.$message({
              type: "success",
              message: "短信模板新建成功!"
            });
          }
        }).catch()
      }
    },
    sortData: function(){
      let contentArr = this.msgTmpl.texts
      let paramArr = this.msgTmpl.options[1].children
      for(let i=0;i<contentArr.length;i++){
        // value去除${}
        let tempValue = contentArr[i].value.replace(/^\$\{|\}$/g,'')
        let tempObj = {
          type: contentArr[i].type,
          value: tempValue
        }
        contentArr[i] = tempObj
      }
      for(let j=0;j<paramArr.length;j++){
        let paramObj = {
          key: paramArr[j].value.name,
          length: paramArr[j].value.length,
          value: paramArr[j].value.value
        }
        paramArr[j] = paramObj
      }
      return {
        content: contentArr,
        params: paramArr
      }
    }
  },
  filters: {
    typeText: function(value) {
      if(value == 'text'){
        return '文本'
      }else{
        return '参数'
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin dist {
  margin: 20px 0 0 30px;
}
.red {
  color: #f56c6c;
}
.msgtmpladd_wrap {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;

  .msgtmpl_form {
    @include dist;

    .el-form-item {
      // 输入框宽度
      .el-input {
        max-width: 580px;
      }
      .el-textarea {
        max-width: 580px;
      }
      & .el-input .el-select {
        width: 100px;
      }
    }
  }

  .tmpl_params {
    @include dist;

    .tmpl_params_title {
      padding: 10px;
      width: 760px;
      border-bottom: 1px solid #ccc;
    }

    .tmpl_params_table {
      margin-top: 20px;

      .el-table {
        width: 760px;
      }
    }
  }

  .tmpl_save {
    @include dist;
    margin-bottom: 50px;
  }
}
</style>
