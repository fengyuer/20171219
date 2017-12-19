<template>
    <div class="add_market_task">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
            <el-form-item label="选择模板:" prop="temp">
                <el-select v-model="ruleForm.temp" placeholder="请选择短信模板">
                    <el-option v-for="item in tempOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="groupVisible = true" >查看模板内容</el-button>
            </el-form-item>

            <el-form-item label="选择签名:" prop="sign">
                <el-select v-model="ruleForm.sign" placeholder="请选择短信签名">
                    <el-option v-for="item in signOpt" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="发送说明:" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" placeholder="请描述您的业务使用场景" :autosize="{ minRows: 4,maxRows:8}"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交申请</el-button>
            </el-form-item>

        </el-form>

        <!-- 弹出Form -->
        <el-dialog :visible.sync="groupVisible" :show-close="false">
            <div slot="title" class="title">模板详情</div>
             <el-form class="small-space"  label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="模板ID ：" prop="templetID">
                    <el-input v-model="templet.templetID" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="创建时间 ：" prop="createTime">
                    <el-input v-model="templet.createTime" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="模板名称 ：" prop="templetName">
                    <el-input v-model="templet.templetName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="说明 : " prop="explain">
                    <el-input v-model="templet.explain" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="模板内容 : " prop="templetContent">
                    <el-input v-model="templet.templetContent" :disabled="true"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
var Mock = require('mockjs')
export default {
    data() {
        return {
            tempOpt: [
                { label: "模板1", value: "选项1" },
                { label: "模板2", value: "选项2" },
                { label: "模板3", value: "选项3" }
            ],
            signOpt: [
                { label: "签名1", value: "选项1" },
                { label: "签名2", value: "选项2" },
                { label: "签名3", value: "选项3" }
            ],
            resourceOpt: [
                { label: "TD", value: "TD" },
                { label: "COC", value: "COC" },
                { label: "EXCEL上传", value: "EXCEL上传" }
            ],
            businessOpt: [
                { label: "全部", value: "全部" },
                { label: "业务线1", value: "业务线1" },
                { label: "业务线2", value: "业务线2" },
                { label: "业务线3", value: "业务线3" }
            ],
            periodOpt: [
                { label: "近3日内", value: "选项1" },
                { label: "近7日内", value: "选项2" },
                { label: "近30日内", value: "选项3" },
            ],
            ruleForm: {
                temp: '',
                sign: '',
                group: '',
                date1: '',
                date2: '',
                desc: ''
            },
            rules: {
                temp: [
                    { required: true, message: '请选择短信模板', trigger: 'change' }
                ],
                sign: [
                    { required: true, message: '请选择短信签名', trigger: 'change' }
                ],
                group: [
                    { required: true, message: '请选择人群' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],

            },
            period: '近3日内',//最近一段时间
            //dialog部分数据
            groupVisible: false,
            groupType: 1,
            group: {
                resource: 'TD',
                business: '全部',
                groupIndex: '',
                num: '',
                rule: '',
            },
            templet: {
                templetID: '1',
                createTime: '2017-11-16',
                templetName: '模板名称1',
                explain: '模板说明1',
                templetContent: '模板内容1'
            },
            newGroupData: [],
            hasPhone: '',
            noPhone: '',
            notChoose: true, //是否选择人群
            hasPush: false,
        };
    },
    created() {
        let data = Mock.mock({
            'newGroupData|1-10': [{
                'groupIndex|+1': 0,
                'rule': "男&运动&购物",
                'num|0-100': 100,
            }],
            'hasPhone|0-100': 100,
            'noPhone|0-100': 100,
        })
        data.newGroupData.forEach(function(item) {
            item.groupIndex = 'group' + item.groupIndex
        })
        this.newGroupData = data.newGroupData
        this.hasPhone = data.hasPhone
        this.noPhone = data.noPhone
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            debugger
            this.notChoose = true;
        },
        //提交所选人群
        confirm() {
            this.groupVisible = false;
            this.notChoose = false;

        },
        handleSelectionChange(val) {
            this.group = Object.assign({}, this.group, val[0])
            console.log(this.group)
        }
    }
}
</script>
<style lang="scss" scoped>
.ruleForm {
    margin-top: 80px;
    margin-left: 20%;
    width: 50%;
}

.row {
    margin-top: 20px;
}

.title {
    text-align: center;
    background: #409EFF;
    color: #fff;
    line-height: 40px;
}

.period {
    display: inline-block;
    width: 120px;
}

.tip {
    padding-left: 100px;
    color: #666;
}
</style>
<style lang="scss">
.add_market_task {
    .el-dialog__header {
        padding: 0;
    }

    .el-table td:first-child .cell,
    .el-table th:first-child .cell {
        padding-left: 10px;
    }

    .el-table th:first-child .cell {
        display: none;
    }
}
</style>

