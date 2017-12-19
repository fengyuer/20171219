<template>
  <div class="tasklist_reviewed">
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column fixed label="编号" type="index" width="60"></el-table-column>
      <el-table-column label="任务ID" prop="taskId" width="120"></el-table-column>
      <el-table-column label="申请人" prop="proposer" width="100"></el-table-column>
      <el-table-column label="申请部门" prop="dept" width="140"></el-table-column>
      <el-table-column label="短信模板" prop="msgTmpl" width="140"></el-table-column>
      <el-table-column label="短信签名" prop="msgSign" width="140"></el-table-column>
      <el-table-column label="用户分群" prop="userGroup" width="160"></el-table-column>
      <el-table-column label="推送时间" prop="sendDate" width="160"></el-table-column>
      <el-table-column label="申请时间" prop="applyDate" width="160"></el-table-column>
      <el-table-column label="审核人" prop="approver" width="100"></el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">{{ scope.row.status|statusText }}</template>
      </el-table-column>
      <el-table-column label="审核意见" prop="opinion" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleCheck(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="任务审核"
      :visible.sync="reviewedDialogVisible"
      width="790px"
      center>
      <div class="reviewdialog">
        <task-info :rowData="rowData"></task-info>
        <div class="audit_wrap">
          <el-form ref="form" :model="rowData.auditForm" label-width="100px">
            <el-form-item label="审批结果：">{{ rowData.auditForm.status|statusText }}</el-form-item>
          <el-form-item label="审批意见：">
            <span>{{rowData.auditForm.opinion}}</span>
          </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewedDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import taskInfo from './taskInfo'

export default {
  props: ['list'],
  data() {
    return {
      reviewedDialogVisible: false,
      rowData: {
        taskId: '',
        dept: '',
        proposer: '',
        msgTmplName: '',
        msgTmpl:'',
        msgSign:'',
        msgChannel:'',
        userGroup:'',
        lob:'',
        tag:'',
        userNumber:'',
        sendDate:'',
        msgIntro:'',
        cost: '',
        auditForm: {
          status: false,   // 审核状态
          opinion: ''        // 审核意见
        }
      }
    }
  },
  mounted() {
    console.log(this.list)
  },
  methods: {
    handleCheck: function(index, row) {
      this.reviewedDialogVisible = true
      console.log('row:', row)
      this.rowData = row
    }
  },
  filters: {
    statusText: function(value){
        if(value){
            return '已同意'
        }else{
            return '已拒绝'
        }
    }
  },
  components: {
    taskInfo
  }
}
</script>
<style lang="scss">
.tasklist_reviewed{
    padding: 10px;

    .el-table thead>tr{
        background-color: rgb(242,242,242);
    }
}
</style>
