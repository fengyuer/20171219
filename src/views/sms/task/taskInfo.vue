<template>
  <div class="taskinfo_wrap">
    <el-row>
        <el-col :span="24">
            <div>任务ID：{{rowData.taskId}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <div>申请部门：{{rowData.dept}}</div>
        </el-col>
        <el-col :span="12">
            <div>申请人：{{rowData.proposer}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <div>短信模板：{{rowData.msgTmplName}}</div>
        </el-col>
        <el-col :span="12">
            <div>模板内容：{{rowData.msgTmpl}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <div>短信签名：{{rowData.msgSign}}</div>
        </el-col>
        <el-col :span="12">
            <div>短信通道：{{rowData.msgChannel}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div>推送人群：{{rowData.userGroup}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <div>业务线：{{rowData.lob}}</div>
        </el-col>
        <el-col :span="12">
            <div>标签规则：{{rowData.tag}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div>人数：{{rowData.userNumber}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <div>推送时间：{{rowData.sendDate}}</div>
        </el-col>
        <el-col :span="12">
            <div>推送说明：{{rowData.msgIntro}}</div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div>预计费用：{{rowData.cost}}</div>
        </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
    props: ['rowData']
};
</script>
<style lang="scss" scoped>
.taskinfo_wrap {
  width: 790px;
  height: 460px;

  .el-row{
      min-height: 40px;
  }
}
</style>
