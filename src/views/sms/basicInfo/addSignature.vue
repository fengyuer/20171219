// 新增签名
<template>
    <div class="components-container">
        <el-form 
            :model="addDatas" 
            :rules="rules" 
            ref="addSignature" 
            label-width="100px" 
            class="form_wrap">
            
            <el-form-item label="签名名称:" prop="name">
                <el-input v-model="addDatas.name" placeholder="请输入签名名称"></el-input>
            </el-form-item>

            <el-form-item label="是否启用:" prop="isActive">
                <el-select v-model="addDatas.isActive">
                    <el-option label="是" value="yes"></el-option>
                    <el-option label="否" value="no"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="说明:">
                <el-input type="textarea" v-model="addDatas.description" placeholder="请描述您的业务使用场景"></el-input>
            </el-form-item>


            <!-- 所属通道 -->
            <el-form-item label="所属通道:">
                <el-table 
                    align="center"
                    :data="addedChannels" 
                    class="sms_table basic_add_channel"
                    :class="{disable_add: !canAdd}"
                    @header-click="showChannel">
                    
                    <el-table-column label="通道ID" prop="id"></el-table-column>
                    <el-table-column label="通道名称" prop="name"></el-table-column>
                    <el-table-column label="通道单价" prop="price"></el-table-column>

                    <el-table-column label="新增">
                        <template slot-scope="scope">
                            <el-button type="primary" 
                                size="small" 
                                @click.native.prevent="delRow(scope.$index,addedChannels)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit('addSignature')">保存</el-button>
            </el-form-item>
        </el-form>

        <!-- 通道列表 -->
        <el-dialog title="添加通道" :visible.sync="showChannelList">
            <el-table :data="channelList" 
                @selection-change="selectChange">
                <el-table-column 
                    type="selection"
                    width="50" 
                    :selectable='checkboxInit'></el-table-column>
                <el-table-column property="id" label="通道id" width="150"></el-table-column>
                <el-table-column property="name" label="通道名称"></el-table-column>
                <el-table-column property="price" label="通道单价"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showChannelList = false">取 消</el-button>
                <el-button type="primary" @click="selectConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchAddSignature, fetchChannels } from "@/api/smsApi";

    export default {
        data(){
            return{
                showChannelList: false,
                canAdd: true, 
                addDatas:{
                    edit: false,
                    name:'',
                    isActive: '',
                    description: '',
                },
                channelList:[],
                addedChannels: [],
                selectChannel:[],
                rules:{
                    name:[
                        {
                            required: true, message:'请输入签名名称', trigger:'blur'
                        }
                    ],
                    isActive:{
                        required: true
                    }

                },
            }
        },
        computed: {
            addedChannelIds() {
                return this.addedChannels.map(v => v.id)
            }
        },
        methods:{
            // 显示通道列表
            showChannel(){
                fetchChannels().then(res => {
                    console.log(res)                    
                    let resData = res.data
                    if(!res || !resData) return
                    let [code, data] = [resData.code, resData.data]
                    if(code === '000000'){
                        this.channelList = data
                        this.showChannelList = true
                    }
                })
            },
            selectChange(val){
                this.selectChannel = val
            },
            checkboxInit(row,index){
                if(!this.addedChannelIds.includes(row.id)){
                    return 1; //可勾选
                }
                return 0 //不可勾选
            },

            // 确认选择通道
            selectConfirm(){
                let selectLen = this.selectChannel.length
                for(let i=0; i< selectLen; i++){
                    this.addedChannels.push(this.selectChannel[i])
                }
                this.showChannelList = false
            },

            // 删除通道
            delRow(index,rows){
                rows.splice(index,1);
            },

            // 取消
            onCancel(){
                this.$router.go(-1)
            },
            // 保存
            onSubmit(FormName){
                this.$refs[FormName].validate(valid => {

                    if(!valid){
                        // console.log('err')
                        return false
                    }
                    let query = {
                        name: this.addDatas.name, 
                        isActive: this.addDatas.isActive ==='是'? 1 : 2, 
                        description: this.addDatas.description, 
                        channelName: this.addedChannels.map(v => v.name).join('、')
                    }
                    console.log(query)
                    fetchAddSignature(query).then(res => {
                        console.log(res)
                        const resData = res.data
                        if(!res && !resData) return false

                        const code = resData.code
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

<style lang="scss">
    .basic_add_channel{
        
        th:nth-last-child(2){
            .cell{
                display: inline;
                padding: 7px 17px;
                color: #409EFF;
                background: #fff;
                border-radius: 4px;
                cursor:pointer;

            }
        }
        &.disable_add{
            th:nth-last-child(2){
                .cell{
                    background: #e5e5e5;
                    color: #c1c1c1;
                }
            }
        }
    }
</style>