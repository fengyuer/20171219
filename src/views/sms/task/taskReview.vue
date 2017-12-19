<template>
    <div class="taskreview_wrap">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待审核任务" name="unreviewed">
                <!--待审核任务-->
                <task-query @reviewQuery="handleQuery"></task-query>
                <div class="list">
                    <task-un-reviewed :list="listUnReviewed"></task-un-reviewed>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已审核任务" name="reviewed">
                <!--已审核任务-->
                <task-query @reviewQuery="handleQuery" @statusFilter="handleStatusFilter" :activeName="activeName"></task-query>
                <div class="list">
                    <task-reviewed :list="listReviewed"></task-reviewed>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import taskQuery from "./taskQuery";
import taskUnReviewed from "./taskUnReviewed";
import taskReviewed from "./taskReviewed";
import Mock from 'mockjs'

export default {
  data() {
    return {
      activeName: "unreviewed",
      listUnReviewed: [],
      listReviewed: []
    };
  },
  beforeRouteEnter: (to, from, next) => {
    // 调取接口

    next(vm => {
      // vm.tmpList =
    });
  },
  created() {
    this.listUnReviewed = this.getListUnReviewed();
    this.listReviewed = this.getListUnReviewed();
  },
  methods: {
    handleClick() {
      console.log(this.activeName);
    },
    handleQuery(json) {
      // 通过activeName来判断处于哪个tab
      console.log(json);
      if (this.activeName == "unreviewed") {
        // 筛选返回待审核任务
      } else {
        // 筛选返回已审核任务
      }
    },
    // 筛选已审核任务
    handleStatusFilter(value){
        
    },
    // 通过接口获取待审核列表数据
    getListUnReviewed() {
        let list = this.mockUnReviewedData()
        return list
    },
    // Mock数据
    mockUnReviewedData(){
        const count = 10;
        let tempList = [];
        for(var i = 0; i < count; i++){
            let data = Mock.mock({
                'taskId': 'T'+ Mock.Random.natural( 10000000, 99999999 ),
                'proposer': Mock.Random.csentence( 2, 3 ),
                'dept': Mock.Random.csentence( 3, 10 ),
                'msgName': Mock.Random.cword(3),
                'msgTmpl': Mock.Random.csentence( 3, 8 ),
                'msgSign': Mock.Random.csentence( 3, 8 ),
                'msgChannel': Mock.Random.cword(4),
                'userGroup': Mock.Random.csentence( 3, 8 ),
                'lob': Mock.Random.cword(4),
                'tag': Mock.Random.cword(4),
                'userNumber': Mock.Random.natural(),
                'sendDate': Mock.Random.datetime(),
                'msgIntro': Mock.Random.csentence( 3, 8 ),
                'applyDate': Mock.Random.datetime(),
                'cost': Mock.Random.natural(),
                'auditForm': {
                    'status': Mock.Random.boolean(),
                    'opinion': Mock.Random.csentence( 3, 8 )
                }
            })
            tempList.push(data);
        }
        return tempList;
    },
  },
  components: {
    taskQuery,
    taskUnReviewed,
    taskReviewed
  }
};
</script>
<style lang="scss">
.taskreview_wrap {
  margin-top: 20px;

    .el-tabs--top .el-tabs__item:nth-child(2) {
        margin-left: 20px;
    }
    .el-tabs__active-bar {
        left: 20px;
    }

    .list{
        margin-top: 30px;
    }
}
</style>
