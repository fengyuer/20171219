<template>
    <div class="components-container">
        <el-form 
            :model="formDatas"
            :rules="rules"
            ref="modifyForm"
            class="form_wrap"
            label-width="100px">

            <el-form-item label="通道ID:" prop="id">
                <span>{{formDatas.id}}</span>
            </el-form-item>
            
            <el-form-item label="通道名称:" prop="name">
                <span>{{formDatas.name}}</span>
            </el-form-item>
            
            <el-form-item label="通道单价:" prop="price">
                <!-- <el-row :gutter="10"> -->
                    <el-col :span="18">
                        <el-input v-model="formDatas.price" placeholder="请输入通道价格"></el-input>
                    </el-col>
                    <el-col :offset="1" :span="5">元/条</el-col>
                <!-- </el-row> -->
            </el-form-item>
            
            <el-form-item label="通道说明:" prop="explain">
                <el-input type="textarea" v-model="formDatas.description" placeholder="请描述您的业务使用场景"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="" @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit('modifyForm')">保存</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import { fetchChannels, fetchUpdateChannel } from "@/api/smsApi";
    export default {
        data(){
            return {
                formDatas:{},
                rules: {
                    id:{
                        required: true
                    },
                    price:{
                        required: true,
                        trigger:'blur',
                        message: '请输入单价'
                    }
                }
            }
        },
        created(){
            this.getData()
        },
        methods:{
            // 查询信息
            getData(){
                let params = {
                    key: this.$route.query.id
                }
                fetchChannels(params).then(res => {
                    let resData = res.data
                    if(!res || !resData) return 
                    console.log(res)

                    let [code, data]= [resData.code, resData.data]
                    if(code === '000000' && data.length > 0 ){

                        this.formDatas = data[0]
                        this.formDatas.price = String(data[0].price)
                    }
                })
            },
            onCancel(){
                this.$router.go(-1)
            },
            onSubmit(FormName){
                this.$refs[FormName].validate(valid => {
                    if(!valid){
                        return false
                    }

                    let query = {
                        id: this.formDatas.id, 
                        price: Number(this.formDatas.price), 
                        description: this.formDatas.description
                    }

                    // console.log(query)
                    
                    fetchUpdateChannel(query).then(res => {
                        console.log(res)
                        if(!res) return

                        let code = res.data.code
                        if(code === '000000'){
                            this.$message({
                                message: '添加成功',
                                type: 'success'

                            })
                            this.$router.go(-1)
                        }

                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>