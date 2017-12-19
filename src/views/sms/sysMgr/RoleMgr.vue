<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <span>角色名：</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="请填写角色名"
                v-model="listQuery.roleName">
      </el-input>

      <span>创建时间(起)：</span>
      <el-date-picker
        v-model="daterange"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getDateRange"
        align="right">
      </el-date-picker>


      <span>角色编码：</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="请填写角色编码"
                v-model="listQuery.roleCode">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px" @click="handleOptionDelete" type="primary"
                 icon="delete">删除选中项
      </el-button>
      <el-checkbox class="filter-item" @change='tableKey=tableKey+1' v-model="showRoleCode">显示角色编码</el-checkbox>
    </div>

    <el-table ref="multipleTable" :key='tableKey' :data="list" @selection-change="handleSelectionChange"
              v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column
        type="selection"
        width="40">
      </el-table-column>


      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="280px" align="center" label="角色描述">
        <template slot-scope="scope">
          <span style='color:black'>{{scope.row.roleDescribe}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="创建者账号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="角色编码">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" v-if='showRoleCode' align="center" label="角色编码">
        <template slot-scope="scope">
          <span style='color:red'>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleEditRole(scope.row,'edit')">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除 </el-button>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="启用状态" width="90">
        <template slot-scope="scope">
          <el-tooltip :content="'切换值: ' + scope.row.status" placement="top">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="on"
              @change="switchAuthority(scope.row)"
              inactive-value="off">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>


    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.start"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-container>
        <el-aside width="400px">
          <el-form class="small-space" :model="temp" label-position="left" label-width="70px"
                   style='width: 400px; margin-left:50px'>
            <el-form-item label="角色编码">
              <!--<el-input v-model="temp.roleCode" :disabled="dialogStatus=='create'?false:true">{{temp.roleCode}}-->
              <el-input v-model="temp.roleCode" :disabled="true">{{temp.roleCode}}
              </el-input>
            </el-form-item>

            <el-form-item label="角色名">
              <el-input v-model="temp.roleName" :disabled="dialogStatus=='create'?false:true"></el-input>
            </el-form-item>

            <el-form-item label="角色描述">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                        v-model="temp.roleDescribe">
              </el-input>
            </el-form-item>
          </el-form>
        </el-aside>
        <el-main>
          <el-form class="small-space" label-width="120px" style='width: 400px; margin-left:10px'>
            <el-tooltip :content="authorityTips" placement="top">
              <el-button>权限：</el-button>
            </el-tooltip>
            <el-tree
              :data="roleAuthorityView"
              show-checkbox
              default-expand-all
              node-key="id"
              @check-change="checkChange"
              ref="tree"
              highlight-current
              :default-checked-keys="temp.roleAuthority"
              :props="defaultProps">
            </el-tree>
          </el-form>
        </el-main>
      </el-container>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createRole">确 定</el-button>
        <el-button v-else type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import {roleFetchList, roleUpdate, roleCreate, roleNewRoleCode, roleDelete} from '@/api/smsApi'
  import waves from '@/directive/waves/index.js' //  水波纹指令
  import {parseRsp} from '../../../utils'

  export default {
    name: 'table_demo',
    directives: {
      waves
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        daterange: undefined,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          start: 1,
          pageSize: 20,
          roleCode: undefined,
          roleName: undefined,
          dateRangeStart: undefined,
          dateRangeEnd: undefined
        },
        temp: {
          id: undefined,
          importance: 0,
          roleDescribe: '',
          timestamp: 0,
          account: '',
          roleCode: '',
          roleName: undefined,
          status: undefined,
          roleAuthority: []
        },
        statusOptions: ['on', 'off'],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        tableKey: 0,
        showRoleCode: false,
        multipleSelection: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        roleAuthorityView: [
          {
            id: 1,
            label: '首页',
            children: [
              {
                id: 11,
                label: '首页'
              }
            ]
          },
          {
            id: 2,
            label: '短信推送',
            checked: true,
            children: [
              {
                id: 21,
                label: '推送任务管理',
                children: [
                  {
                    id: 211,
                    label: '维护权限'
                  }]
              },
              {
                id: 22,
                label: '推送日志',
              }
            ]
          },
          {
            id: 3,
            label: '短信模板',
            children: [
              {
                id: 31,
                label: '短信模板',
                children: [
                  {
                    id: 311,
                    label: '维护权限'
                  }]
              }]
          },
          {
            id: 4,
            label: '数据统计',
            children: [
              {
                id: 41,
                label: '数据统计'
              }
            ]
          },
          {
            id: 5,
            label: '基础信息',
            children: [
              {
                id: 51,
                label: '基础签名',
                children: [
                  {
                    id: 511,
                    label: '维护权限'
                  }]
              },
              {
                id: 52,
                label: '短信通道',
                children: [
                  {
                    id: 521,
                    label: '维护权限'
                  }]
              }
            ]
          },
          {
            id: 6,
            label: '任务审核',
            children: [
              {
                id: 61,
                label: '任务审核'
              }
            ]
          },
          {
            id: 7,
            label: '系统管理',
            children: [
              {
                id: 71,
                label: '用户管理',
                children: [
                  {
                    id: 711,
                    label: '维护权限'
                  }]
              },
              {
                id: 72,
                label: '角色管理',
                children: [
                  {
                    id: 721,
                    label: '维护权限'
                  }]
              },
              {
                id: 73,
                label: '系统管理',
                children: [
                  {
                    id: 731,
                    label: '维护权限'
                  }]
              }
            ]
          }
        ],
        authorityTips: '维护权限说明:对应为页面中的新增，修改，删除（弃用），启用/停用按钮'
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        roleFetchList(this.listQuery).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            this.list = data.items
            console.log(JSON.stringify(this.list));
            this.total = data.total
            this.listLoading = false
          }
        })
      },
      handleFilter() {
        this.listQuery.start = 1
        console.log('list query 查询参数')
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.start = val
        this.getList()
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.dateRangeStart = undefined
          this.listQuery.dateRangeEnd = undefined
          return
        }
        this.listQuery.dateRangeStart = parseInt(+time[0] / 1000)
        this.listQuery.dateRangeEnd = parseInt((+time[1] + 3600 * 1000 * 24) / 1000)
      },

      handleEditRole(row, edit) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },

      // 创建新角色
      handleCreate() {
        console.log('申请New roleCode')
        console.log(this.temp)
        this.resetTemp()
        roleNewRoleCode().then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log(JSON.stringify(data));
            this.temp.roleCode = data.roleCode
            this.temp.account = data.account
            this.temp.id = data.id
          }
        })
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },

      // 更新角色
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },

      // 删除一行
      handleDelete(row) {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        console.log('通知服务器 删除了' + this.temp)
        console.log('删除1行' + row.roleCode)
        const roc = [row.roleCode]
        this.syncDelete(roc)
      },

      // 创建角色
      createRole() {
        // todo id是不是需要服务器分配－－待议
        this.temp.id = parseInt(Math.random() * 100) + 1024
        this.temp.timestamp = +new Date()
        console.log('需要获取当前登陆者账户')
//      account是不是需要服务器获取或者本地自己获取--待议
//      this.temp.account = '管理人员'
        console.log('todo 需要上传到服务器')
        console.log(this.$refs.tree.getCheckedKeys())
        this.list.unshift(this.temp)
        this.dialogFormVisible = false
        const authoryKeys = this.$refs.tree.getCheckedKeys()
        this.temp.roleAuthority = authoryKeys
        const param = JSON.stringify(this.temp)
        roleCreate(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('删除成功');
          }
        })
      },
      // 更新角色权限
      updateUser() {
        this.temp.timestamp = +this.temp.timestamp
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogFormVisible = false
        console.log(this.$refs.tree.getCheckedKeys())
        const authoryKeys = this.$refs.tree.getCheckedKeys()
        this.temp.roleAuthority = authoryKeys
        const param = JSON.stringify(this.temp)
        roleUpdate(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('删除成功');
          }
        })
      },

      resetTemp() {
        this.temp = {
          id: undefined,
          roleDescribe: '',
          timestamp: 0,
          account: '',
          roleCode: '', // 不能少的字段
          roleName: undefined,
          status: undefined,
          roleAuthority: []
        }
      },

      // 设置选择项
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
//        console.log(val)
        for (const del of this.multipleSelection) {
          console.log(del.id)
        }
      },
      handleOptionDelete() {
        let needDeleteList = []
        for (const del of this.multipleSelection) {
          for (const v of this.list) {
            console.log('v---' + v.id)
            if (v.id === del.id) {
              console.log(v.id)
              const index = this.list.indexOf(v)
//              needDeleteList.push(v.roleCode)
              needDeleteList.push(v.id)
              this.list.splice(index, 1)
              break
            }
          }
        }
        console.log('需要删除的roleCode:' + needDeleteList)
        console.log('需要通知服务器 todo')
        const roc = needDeleteList
        this.syncDelete(roc)
      },

      //  时间监听
      getDateRange(val) {
        console.log(val)
        if (val === undefined) {
          console.log('没有输入时间')
          return
        }
        console.log('获取时间是')
        console.log(Date.parse(val[0]))
        console.log(Date.parse(val[1]))
        this.listQuery.dateRangeStart = Date.parse(val[0])
        this.listQuery.dateRangeEnd = Date.parse(val[1])
      },
      // 启用或者关闭
      switchAuthority(row) {
        this.temp = Object.assign({}, row)
        console.log('开关状态' + this.temp.status)
        this.temp.status = row.status
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
            break
          }
        }
        const param = JSON.stringify(this.temp)
        console.log(param)
        roleUpdate(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('权限开关成功');
          }
        })

      },
      syncDelete(data) {
        const upParam = Object.assign({}, {id: data})
        const param = JSON.stringify(upParam)
        console.log(param)
        roleDelete(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('删除成功');
          }
        })
      },
      checkChange(val) {
        console.log('check list val')
//      选择值监听
      },
      respTips(response){
        const msg = response.data.msg
        const code = response.data.code
        console.log('----消息' + msg)
        console.log(code)
        if (code === '000000') {
          this.$notify({
            title: '成功',
            message: '任务成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '任务失败',
            type: 'error',
            duration: 2000
          })
        }
      },
    }
  }
</script>
