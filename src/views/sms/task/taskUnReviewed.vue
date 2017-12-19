<template>
  <div class="tasklist_unreview">
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
      <el-table-column label="预计费用" prop="cost" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleReview(scope.$index, scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="任务审核"
      :visible.sync="unreviewedDialogVisible"
      width="790px"
      center>
      <div class="reviewdialog">
        <task-info :rowData="rowData"></task-info>
        <div class="audit_wrap">
          <el-form ref="form" :model="rowData.auditForm" label-width="100px">
            <el-form-item label="审批结果：">
            <el-radio-group v-model="rowData.auditForm.status">
              <el-radio label="同意"></el-radio>
              <el-radio label="拒绝"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见：">
            <el-input type="textarea" v-model="rowData.auditForm.opinion"></el-input>
          </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unreviewedDialogVisible = false">确 定</el-button>
        <el-button @click="unreviewedDialogVisible = false">取 消</el-button>
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
      unreviewedDialogVisible: false,
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
    handleReview(index, row) {
      this.unreviewedDialogVisible = true
      this.rowData = row
      console.log(this.rowData)
    }
  },
  components: {
    taskInfo
  }
}
</script>
<style lang="scss">
.tasklist_unreview{
    padding: 10px;

    .el-table thead>tr{
        background-color: rgb(242,242,242);
    }
    .reviewdialog{
      width:790px;

      .audit_wrap{
        padding-top:20px;
        width:736px;
        border-top: 1px solid #ccc;

        .el-form{
          .el-form-item{
            min-height:40px;
          }
        }
      }
    }
}
</style>
