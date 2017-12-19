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
            v-loading="loading"
            @selection-change="selectChange">

            <el-table-column 
                type="selection"
                width="50"></el-table-column>
            
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
                    <el-switch :plain="true" v-model="scope.row.isActive" @change="onLive" :disabled="!isAdmin"></el-switch>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
import { fetchSignatures, fetchDelSignatures } from "@/api/smsApi";

    export default {
        data(){
            return{
                loading: false,
                pageSizes: [2, 4, 6, 8],    // 每页设置
                total: null,                // 总页数
                isAdmin: true,              // 是否是管理员
                searchCon: '',               // 搜索关键字
                tableData:[],               // 表格数据
                selectData:[],              // 选中的内容
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
            // 删除数据
            del(ids){
                fetchDelSignatures(ids).then((res) => {
                    console.log(res)
                    if(!res) return
                    if(res.code==='000000'){
                        this.$confirm('当前有任务处于待执行状态, 是否弃用?', '提示', {
                            confirmButtonText: '启用',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });          
                        });
                    }
                })
            },
            // 查询
            onSearch(){
                this.getList()
                console.log(this.searchCon)
            },
            // 删除一条
            delRow(index,rows, row){
                const query = {
                    ids: rows[index].id
                }
                fetchDelSignatures(query).then((res) => {
                    console.log(res)
                    if(!res) return

                    const code =  res.data.code
                    if(code==='000000'){
                        this.$confirm('当前有任务处于待执行状态, 是否弃用?', '提示', {
                            confirmButtonText: '启用',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            rows.splice(index,1);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });          
                        });
                    }
                })
            },
            selectChange(val){
                console.log(val);
                this.selectData = val
            },
            // 启用状态
            onLive(val){
                if(!this.isAdmin){
                    this.$message({
                        message: '只有管理员有权限！',
                        type: 'warning'
                    });
                }
                console.log(val)
            },
            // 新增签名
            add(){
                this.$router.push({path:'addSignature'})
            },
        }
        
    }
</script>