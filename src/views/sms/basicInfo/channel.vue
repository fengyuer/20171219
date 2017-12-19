<template>
    <div class="components-container">
        <el-row :gutter="10" style="margin-bottom:10px">
            <el-col :span="8">
                <el-input prefix-icon="sms-icon-search" v-model="searchCon" placeholder="请输入通道ID/通道名称查询"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-col>
        </el-row>

        <el-table class="sms_table" :data="tableData" v-loading="loading" stripe>
            <el-table-column
                label="创建时间" 
                prop="createTime"
                width="153"></el-table-column>

            <el-table-column 
                label="通道ID" 
                prop="id"></el-table-column>

            <el-table-column 
                label="通道名称" 
                prop="name"></el-table-column>
            
            <el-table-column 
                label="通道单价" 
                prop="price">

                <template slot-scope="scope">
                    <span>{{scope.row.price}}元/条</span>
                </template>
            </el-table-column>

            <el-table-column 
                label="通道说明" 
                prop="description"></el-table-column>

            <el-table-column 
                label="版本" 
                prop="version"></el-table-column>

            <el-table-column label="操作" width="200" v-if="isAdmin">
                <template slot-scope="scope">
                    <el-button size="small" @click="modify(scope.row)">修改</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import { fetchChannels } from "@/api/smsApi";
    export default {
        data(){
            return{
                isAdmin: true,
                loading: false,
                searchCon: '',
                tableData:[]
            }
        },
        beforeRouteEnter: (to, from, next) => {
            next(Vm => {
                Vm.getList()
            })
        },
        methods:{
            onSearch(){
                this.getList()
            },
            getList(){
                this.loading =  true
                let params = {
                    key: this.searchCon
                }
                fetchChannels(params).then(res => {
                    this.loading =  false
                    if(!res) return 
                    console.log(res)
                    let resData = res.data
                    if(!resData) return

                    let [code, data]= [resData.code, resData.data]
                    if(code === '000000'){
                        this.tableData = data
                    }
                })
            },
            modify(row){
                this.$router.push({
                    path:'modifyChannel',
                    query:{
                        id: row.id
                    }
                })
                // console.log(row)
            }
        }
    }
</script>