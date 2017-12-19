<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <span>用户名：</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="请填写用户名"
                v-model="listQuery.account">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table ref="multipleTable" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间"
              border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="160px" align="center" label="已分配角色">
        <template slot-scope="scope">
          <span v-for="item in scope.row.assignedRole" style=''>{{item}} |</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleEditRole(scope.row,'edit')">编辑</el-button>
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
      <el-form class="small-space" :model="temp" label-position="left" label-width="90px"
               style='width: 500px; margin-left:50px'>
        <el-form-item label="用户名">
          <!--<el-input v-model="temp.account" :disabled="dialogStatus=='create'?false:true">{{temp.account}}</el-input>-->
          <label> {{temp.account}} </label>
        </el-form-item>

        <hr>
        <el-form-item label="已配置角色：" prop="value" label-width="120px">
          <label v-for="item in temp.assignedRole"> {{item}} |</label>
        </el-form-item>
        <hr>

        <el-checkbox-group v-model="temp.assignedRole" @change="handleCheckedRoleChange">
          <el-checkbox label="业务人员"></el-checkbox>
          <el-checkbox label="系统管理员"></el-checkbox>
          <el-checkbox label="短信推送员"></el-checkbox>
        </el-checkbox-group>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {userGetList, userUpdate} from '@/api/smsApi'
  import {parseRsp} from '../../../utils'
  import waves from '@/directive/waves/index.js' //  水波纹指令

  export default {
    name: 'table_demo',
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          start: 1,
          pageSize: 20,
          account: undefined
        },
        temp: {
          id: undefined,
          assignedRole: [],
          account: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },

    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        userGetList(this.listQuery).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            this.list = data.items
            this.total = data.total
            this.listLoading = false
          }
        })
      },
      handleFilter() {
        this.listQuery.start = 1
        console.log(this.lastQuery)
//       console.log(this.lastQuery.daterange)
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

      handleEditRole(row, edit) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },

      // 更新角色
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },

      // 更新角色权限
      updateRole(value) {
        // todo 需不需要更新时间戳
//        this.temp.timestamp = +this.temp.timestamp
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogFormVisible = false
        console.log('--todo需要更新到服务器---->' + this.temp.assignedRole)
        const param = JSON.stringify(this.temp)
        console.log(param)
        userUpdate(param).then(resp => parseRsp(resp.data, this)).then(data => {
          if (data !== null) {
            console.log('用户更新成功');
          }
        })
      },
      handleCheckedRoleChange(value) {
        //  获取到的数据
        console.log('---获取角色配置数据--->' + value)
      }
    }
  }
</script>
