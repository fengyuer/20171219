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
            
        </el-table>

        <!-- 任务列表 -->
        <el-dialog title="提示" :visible.sync="showTaskList" class="task_pop">
            <p>当前有任务ID处于待执行状态，若此时删除该短信签名，该任务将会被弃用，是否继续删除？</p>

            <el-table :data="taskList">
                <el-table-column property="taskId" label="ID"></el-table-column>
                <el-table-column property="templateName" label="短信模板"></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                
                <el-button @click="confirmDel">删除</el-button>
                <el-button type="primary" @click="cancelDel">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { 
    fetchSignatures, 
    fetchDelSignatures,
    fetchUsedTasks,
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
                selectDelObj:{},            // 选择删除的数据
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

            // 新增签名
            add(){
                this.$router.push({path:'addSignature'})
            },

            // 删除一条
            delRow(index,rows){
                
                this.selectDelObj.index = index
                // 调用任务列表
                this.getTask(rows[index].id, ()=>{
                    console.log(this.taskList)
                    if(this.taskList.length > 0){
                        this.showTaskList =  true
                    }else{
                        // 无使用任务
                        this.confirmDel()
                    }
                })
            },

            // 取消删除
            cancelDel(){
                this.showTaskList = false
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            },

            // 确认删除
            confirmDel(){
                
                let index = this.selectDelObj.index
                let lists = this.tableData
                let id = lists[index].id
                
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
                });
                setTimeout(() => {
                    this.showTaskList = false
                },200)
            },

            // 获取使用签名的任务列表
            getTask(id,callback){
                
                this.taskList = []
                let params = {
                    ids: id
                }

                fetchUsedTasks(params).then(res => {
                    console.log(res)
                    if(!res) return

                    let [code, data] = [res.data.code, res.data.data]
                    if(code === '000000'){
                        this.taskList = data
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
                        this.showTaskList = false
                        this.$message({
                            type: 'success',
                            message: '签名删除成功!'
                        });
                        lists.splice(index,1);
                    }else{
                        this.showTaskList = false
                        this.$message({
                            type: 'info',
                            message: '签名删除失败'
                        }); 
                    }
                }).catch(err => {
                    this.$message({
                        type: 'info',
                        message: '系统异常'
                    }); 
                })

            },


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
