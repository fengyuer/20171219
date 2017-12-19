<template>
    <div class="components-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="任务ID：">
                <el-input @keyup.enter.native="handleFilter" v-model="listQuery.id" placeholder="任务ID"></el-input>
            </el-form-item>
             <el-form-item label="所属部门：">
                <el-input @keyup.enter.native="handleFilter" v-model="listQuery.group" placeholder="所属部门"></el-input>
            </el-form-item>
             <el-form-item label="创建人：">
                <el-input @keyup.enter.native="handleFilter" v-model="listQuery.creater" placeholder="创建人"></el-input>
            </el-form-item>
             <el-form-item label="短信模板名称：">
                <el-input @keyup.enter.native="handleFilter" v-model="listQuery.templateName" placeholder="短信模板名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
            </el-form-item>
        </el-form>
         <div class="block">
        <span class="demonstration">发送时间：</span>
        <el-date-picker
          v-model="value6"
          type="daterange"
          range-separator="-">
        </el-date-picker>
      </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column width="50px" align="center" label="序号">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.number}}</span>
                </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="任务ID">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="任务类型">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.taskType}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="短信模板">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.templateName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="短信签名">
                <template slot-scope="scope">
                    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.sceneName"></el-input>
                    <span v-show="!scope.row.edit">{{scope.row.signName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="发送人群">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.group}}</span>
                </template>
            </el-table-column>
            <el-table-column width="60" align="center" label="发送人数">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.sendUserNum}}</span>
                </template>
            </el-table-column>
            <el-table-column width="60" align="center" label="发送条数">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.sendNum}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="发送时间">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.executeTime| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="创建人">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.creater}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="所属部门">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.project}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-show='!scope.row.edit' type="primary"  size="small" @click="viewDetail">查看详情</el-button>
                    <el-button size="small" type="primary" @click="handleDownload" :loading="downloadLoading">导出
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="任务ID" :visible.sync="dialogTableVisible">
         <el-form :inline="true" :model="listAnotherQuery" class="demo-form-inline">
            <el-form-item label="手机号：">
                <el-input @keyup.enter.native="handleAnotherFilter" v-model="listAnotherQuery.phoneNum" placeholder="手机号"></el-input>
            </el-form-item>
              <el-form-item label="发送状态：">
                <el-select @keyup.enter.native="handleAnotherFilter" v-model="listAnotherQuery.sendState" placeholder="发送状态">
                    <el-option v-for="item in  StateType" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleAnotherFilter">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :key='tableKey' :data="AnotherList"  style="width: 100% high:60%" >
         <el-table-column width="50px" align="center" label="序号">
                <template slot-scope="scope">
                    <span style='color:red;'>{{scope.row.number}}</span>
                </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="手机号">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.phoneNum}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="发送状态">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.sendState}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="短信模板">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.templateName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="短信通道">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.smsPass}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="短信条数">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.smsCount}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="发送时间">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.executeTime| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="接收时间">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.receiveTime| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="失败原因">
                <template slot-scope="scope">
                    <span style=''>{{scope.row.failReason}}</span>
                </template>
            </el-table-column>
        </el-table>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button size="large" type="primary" @click="handleDownloadSecond" :loading="downloadLoadingSecond">导出Excel</el-button>
            <el-button size="large" type="danger"  @click="dialogTableVisible = false">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { fetchPropelList } from 'api/smsApi'
import { fetchDetailList } from 'api/smsApi'
import { parseTime } from 'utils';
const StateType = [
    { key: '全部', display_name: '全部' },
    { key: '成功', display_name: '成功' },
    { key: '失败', display_name: '失败' }
];
export default {
    data() {
        return {
            list: null,
            AnotherList: null,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                taskID: undefined,
                section: undefined,
                creater: undefined,
                smsTemplet: undefined,
                phoneNum: undefined,
                sendState: undefined,
            },
            listAnotherQuery: {
                page: 1,
                limit: 20,
                taskID: undefined,
                section: undefined,
                creater: undefined,
                smsTemplet: undefined,
                phoneNum: undefined,
                sendState: undefined,
            },
            value6: '',
            dialogTableVisible: false,
            downloadLoading: false,
            downloadLoadingSecond: false,
            dialogStatus: '',
            qrCode: {
                title: '',
                value: '',
                type: '',
                vTime: ''

            },
            textMap: {
                update: '编辑',
                create: '创建'
            },
            total: null,
            StateType,
            tableKey: 0,
            dialogFormVisible: false,
            rules: {
                title: [{ required: true, message: '请输入场景值', trigger: 'blur' }],
                vTime: [{ required: true, message: '请输入有效时间', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getList()
        this.getTaskList()
    },
    watch: {
        dialogFormVisible(n, o) {
            if (!n) {
                this.rstDialogForm('qrCode')
            }
        }
    },
    methods: {
        getList() {
            this.listLoading = true;
            fetchPropelList(this.listQuery).then(response => {
                this.list = response.data.items;
                this.total = response.data.total;
                this.listLoading = false;
            })
        },
        viewDetail() {
            this.dialogTableVisible = true;
        },
        getTaskList() {
            //this.listLoading = true;
            fetchDetailList(this.listAnotherQuery).then(response => {
                this.AnotherList = response.data.items;
                this.total = response.data.total;
                //this.listLoading = false;
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            console.log(this.lastQuery)
            this.getList()
        },
        handleAnotherFilter() {
            this.listAnotherQuery.page = 1
            console.log(this.lastQuery)
            this.getTaskList()
        },
        handleDel() { },
        handleModifyStatus(row, status) {
            // row.status = status
            switch (status) {
                case 'update':
                    this.update(row)
                    break;
                case 'delete':
                    this.delete(row)
                    break;
                case 'look':
                    this.look(row)
                default:
                    break;
            }
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        handleCreate() {
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        create() {
            this.dialogFormVisible = false;
            this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
            });
        },
        update(row) {
            row.edit = false
            // this.dialogFormVisible = false;
            this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
            });
        },
        delete(row) {

        },
        handleDownload() {
          this.downloadLoading = true
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel')
            const tHeader = ['序号', '任务ID', '任务类型', '短信模板', '短信签名', '发送人群', '发送人数', '发送条数', '发送时间', '创建人', '所属部门']
            const filterVal = ['id', 'taskID', 'taskType', 'smsTemplet', 'smsSign', 'sendCrowd', 'sendNum', 'sendCount', 'sendTime', 'creater', 'section']
            const list = this.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '列表excel')
            this.downloadLoading = false
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
        handleDownloadSecond() {
          this.downloadLoadingSecond = true
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel')
            const tHeader = ['序号', '手机号', '发送状态', '短信模板', '短信通道', '短信条数', '发送时间', '接收时间', '失败原因']
            const filterVal = ['id', 'phoneNum', 'sendState', 'smsTemplet', 'smsPass', 'smsCount', 'sendTime', 'receiveTime', 'failReason']
            const list = this.list
            const data = this.formatJsonSecond(filterVal, list)
            export_json_to_excel(tHeader, data, '列表excel')
            this.downloadLoadingSecond = false
          })
        },
        formatJsonSecond(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },
        look(row) {
            const h = this.$createElement;
            this.$msgbox({
                title: '二维码',
                message: h('img', {
                    attrs: {
                        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507543023689&di=83fa0837a3340a2c3752563bca28832c&imgtype=0&src=http%3A%2F%2F4493bz.1985t.com%2Fuploads%2Fallimg%2F160414%2F3-160414162642.jpg'
                    },
                    style: {height:'300px',width:'300px'}
                })
            })
        },
        rstDialogForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
