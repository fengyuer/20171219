<template>
  <div class="components-container">
    <span><h2>通知</h2></span>
    <hr width="100%" color=#987cb9 SIZE=1>
    <br>
    <el-form :inline="true" v-model="list" class="demo-form-inline" v-loading="listLoading"
      element-loading-text="给我一点时间">
      <label>任务审核或过期后发短信通知申请人:</label>
      <el-radio-group v-model="temp.approveEnable" size="medium" @change="updateSettings">
        <el-radio label="on" border>打开</el-radio>
        <el-radio label="off" border>关闭</el-radio>
      </el-radio-group>
      <br>
      <label>任务申请后发短信通知审核人员:</label>
      <el-radio-group v-model="temp.proposerEnble" size="medium" @change="updateSettings">
        <el-radio label="on" border>打开</el-radio>
        <el-radio label="off" border>关闭</el-radio>
      </el-radio-group>
      <br>
    </el-form>
  </div>
</template>
<script>
  import {systemGetList, systemUpdate} from '../../../api/smsApi'
  import {parseTime, parseRsp} from '../../../utils'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          start: 1,
          pageSize: 1,
          approveEnable: undefined,
          proposerEnble: undefined
        },
        temp: {
          approveEnable: 'off',
          proposerEnble: 'on'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        systemGetList(this.listQuery).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            this.list = data.items
            this.total = data.total
            console.log('---dat->' + this.rspData)
            this.temp = this.list[0]
            this.listLoading = false
          }
        })
      },
      updateSettings(val) {
        const param = JSON.stringify(this.temp)
        console.log('--systemUpdateProposer----->' + val)
        systemUpdate(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('更新成功！！！')
          }
        })
      },
    }
  }
</script>
