<template>
    <div class="components-container">
        <el-row :gutter="10" style="margin-bottom:10px">
            <el-col :span="8">
                <el-input prefix-icon="sms-icon-search" v-model="searchCon" placeholder="请输入签名ID/签名名称查询"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-col>
            <el-col :span="13" align="right" v-if="isAdmin">
                <el-button type="primary" @click="add">新增签名</el-button>
            </el-col>
        </el-row>

        <!-- table -->
        <el-table 
            class="sms_table"
            :data="tableData"
            stripe
            v-loading="loading">

            <el-table-column 
                label="创建时间" 
                prop="createTime"
                width="153"></el-table-column>

            <el-table-column 
                label="签名ID" 
                prop="id"></el-table-column>
            
            <el-table-column 
                label="签名名称" 
                prop="name"></el-table-column>
            
            <el-table-column 
                label="说明" 
                prop="description"></el-table-column>
            
            <el-table-column 
                label="所属通道" 
                prop="channelName"></el-table-column>
            
            <el-table-column 
                label="创建人" 
                prop="creater"></el-table-column>
            
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="delRow(scope.$index,tableData)" size="small">删除</el-button>
                </template>
            </el-table-column>
            
            <el-table-column label="启用状态">
                <template slot-scope="scope">
                    <el-switch :plain="true" v-model="scope.row.isActive" @change="onLive(scope.row,scope.$index)" :disabled="!isAdmin"></el-switch>
                </template>
            </el-table-column>
        </el-table>

        <!-- 任务列表 -->
        <el-dialog title="提示" :visible.sync="showTaskList" class="task_pop">
            <h3><i class="el-icon-warning"></i> 当前有任务ID处于待执行状态，是否弃用？</h3>
            <p>点击“弃用”则弃用选中任务，点击“正常执行”则任务正常执行,签名{{optName}}。点击'x'，则取消{{optName}}</p>
            <el-table :data="taskList" 
                @selection-change="selectChange">
                <el-table-column 
                    type="selection"
                    width="50"></el-table-column>
                <el-table-column property="id" label="ID"></el-table-column>
                <el-table-column property="templateName" label="短信模板"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="showTaskList = false">取 消</el-button> -->
                <el-button type="primary" @click="abandon">弃 用</el-button>
                <el-button type="primary" @click="keepUse">正常执行</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { 
    fetchSignatures, 
    fetchDelSignatures,
    queryPushTaskList, 
    delMsgPush,
    fetchToOpenSignature
    } from "@/api/smsApi";

    export default {
        data(){
            return{
                loading: false,
                isAdmin: true,              // 是否是管理员
                searchCon: '',              // 搜索关键字
                tableData:[],               // 表格数据
                taskList: [],               // 任务列表
                showTaskList: false,
                selectTask: [],             // 选择的任务列表
                selectDelObj:{},            // 选择删除的数据
                selectStopObj: {},
                optName: '删除'
            }
        },
        created() {
            this.getList()
        },
        methods:{
            // 获取数据列表
            getList(){
                this.loading =  true
                let query = {
                    key: this.searchCon,
                }
                fetchSignatures(query).then(res => {
                    this.loading = false
                    const resData = res.data
                    if(!res || !resData) return
                    const [code,data] = [resData.code,resData.data]
                    console.log(res)
                    if(code === '000000'){
                        this.tableData = data
                    }
                })
            },

            // 查询
            onSearch(){
                this.getList()
                console.log(this.searchCon)
            },

            // 删除一条
            delRow(index,rows){
                
                this.selectDelObj.index = index
                // 调用任务列表
                this.getTask(rows[index].name, ()=>{
                    console.log(this.taskList)
                    if(this.taskList.length > 0){
                        this.optName = '删除'
                        this.showTaskList =  true
                    }else{
                        // 无使用任务
                        this.confirmDel()
                    }
                })
            },

            // 启用状态
            onLive(row,index){
                let beforeState = !row.isActive
                row.isActive = beforeState

                this.selectStopObj.id = row.id
                this.selectStopObj.index = index
                this.selectStopObj.isActive = beforeState

                if(!this.isAdmin){
                    this.$message({
                        message: '只有管理员有权限！',
                        type: 'warning'
                    });
                    return
                }

                // 启用
                if(!beforeState){
                    this.$confirm('您确定要启用此短信签名吗？', '提示', {
                        confirmButtonText: '启用',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.isActiveChange(row.id, beforeState, () =>{
                            row.isActive = !beforeState
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消启用'
                        });
                    });
                    return
                }
                // 停用
                this.getTask(row.name, ()=>{
                    console.log(this.taskList)
                    if(this.taskList.length > 0){
                        this.optName = '停用'
                        this.showTaskList =  true
                    }else{
                        // 无使用任务
                        this.confirmStop()
                    }
                })
            },

            // 新增签名
            add(){
                this.$router.push({path:'addSignature'})
            },

            // 选择任务
            selectChange(val){
                this.selectTask = val
            },

            // 弃用任务
            abandon(){
                if(this.selectTask.length < 1){
                    this.$message({
                        type: 'info',
                        message: '请选择弃用的任务'
                    });
                    return
                }

                let tipText = ''
                if(this.optName === '停用'){
                    tipText = '您确定要弃用选中的任务并停用此条签名吗？'
                }else{
                    tipText = '您确定要弃用选中的任务并删除此条签名吗？'
                }
                
                this.$confirm(tipText, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.abandonTask(() => {
                        let index = this.selectDelObj.index
                        if(this.optName === '停用'){
                            let obj = this.selectStopObj
                            this.isActiveChange(obj.id, obj.isActive, ()=> {
                                this.tableData[obj.index].isActive = !obj.isActive
                            })
                        }else{
                            this.delSignature(this.tableData[index].id, this.tableData, index)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消弃用'
                    });
                    this.showTaskList = false
                });
            },

            // 正常执行
            keepUse(){
                if(this.optName === '停用'){
                    this.confirmStop()
                }else{
                    this.confirmDel()
                }
            },

            // 删除确定
            confirmDel(){
                let index = this.selectDelObj.index
                let lists = this.tableData
                let id = this.tableData[index].id
                
                this.$confirm('您确定要删除此条签名吗？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delSignature(id,lists,index)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });      
                    this.showTaskList = false    
                });

            },

            // 获取使用签名的任务列表
            getTask(signName,callback){
                
                this.taskList = []
                let query = {
                    signName: '',
                    status: '', // 1,3
                    // pagination: 1
                }

                queryPushTaskList(query).then(res => {
                    // console.log(res)
                    if(!res) return

                    let [code, data] = [res.data.code, res.data.data]
                    if(code === '000000'){
                        let allData = data.data
                        // console.log(allData)
                        allData.filter(arg => {
                            if(arg.signName === signName){
                                this.taskList.push(arg)
                            }
                        })
                        callback()
                    }
                })
            },

            // 删除签名-调用删除签名接口
            delSignature(id,lists,index){
                let params = {
                    ids: id
                }
                fetchDelSignatures(params).then((res) => {
                    const code = res.data.code 
                    if(code === '000000'){
                        this.$message({
                            type: 'success',
                            message: '签名删除成功!'
                        });
                        this.showTaskList = false
                        lists.splice(index,1);
                    }else{
                        this.$message({
                            type: 'info',
                            message: '签名删除失败'
                        }); 
                        this.showTaskList = false
                    }
                }).catch(err => {
                    this.$message({
                        type: 'info',
                        message: '系统异常'
                    }); 
                })

            },

            // 弃用任务
            abandonTask(callback){
                const params = {
                    ids: this.selectTask.map(obj=>obj.id).join(',')
                }
                delMsgPush(params).then(res => {
                    const code = res.data.code
                    if(code === '000000'){
                        this.showTaskList = false
                        callback()
                    }else{
                        this.$message({
                            type: 'info',
                            message: '弃用任务失败'
                        });
                        return
                    }
                })
            },

            // 调用启用/停用
            isActiveChange(id, isActive, callback){
                let params = {
                    ids: id,
                    isActive: isActive ? 1 : 2
                }
                fetchToOpenSignature(params).then(res => {
                    console.log(res)
                    if(!res) return
                    let code = res.data.code

                    if(code === '000000'){
                        this.$message({
                            type: 'success',
                            message: isActive ? '停用成功!' : '启用成功'
                        });
                        callback()
                    }else{
                        this.$message({
                            type: 'info',
                            message: '启用失败'
                        }); 
                    }
                })
            },

            // 确定停用
            confirmStop(){
                this.$confirm('您确定要停用此条签名吗？', '提示', {
                    confirmButtonText: '停用',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let obj = this.selectStopObj
                    this.isActiveChange(obj.id, obj.isActive, ()=> {
                        this.tableData[obj.index].isActive = !obj.isActive
                    })
                    this.showTaskList = false
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消停用'
                    });      
                    this.showTaskList = false
                });
            }
        }
    }
</script>
<style lang="scss">
.task_pop {
    .el-dialog__body{
        padding: 0 20px 30px
    }
    .el-icon-warning{
        color: #E6A23C

    }
}
</style>
