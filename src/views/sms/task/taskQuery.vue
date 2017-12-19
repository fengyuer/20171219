<template>
    <div class="taskquery_wrap">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="任务ID">
                <el-input v-model="formInline.id" placeholder="请输入任务id"></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model="formInline.user" placeholder="请输入创建人"></el-input>
            </el-form-item>
            <el-form-item label="所属部门">
                <el-input v-model="formInline.dept" placeholder="请输入所属部门"></el-input>
            </el-form-item>
            <el-form-item v-if='activeName'>
                <el-select v-model="defaultValue" placeholder="请选择" @change="onSelect">
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props: ['activeName'],
    data() {
        return {
            formInline: {
                id: '',
                user: '',
                dept: ''
            },
            statusOptions: [
                {
                    value: 'approved',
                    label: '已审核(同意)'
                },
                {
                    value: 'refused',
                    label: '已审核(拒绝)'
                },
                {
                    value: 'finish',
                    label: '已完成'
                }
            ],
            defaultValue: 'approved'
        }
    },
    methods: {
        onSubmit() {
            // 发送查询请求
            this.$emit('reviewQuery', this.formInline)
        },
        onSelect(value) {
            // 发送筛选请求
            this.$emit('statusFilter', value)
        }
    }
}
</script>
<style lang="scss" scoped>
.taskquery_wrap{
    padding-left: 20px;
}
</style>
