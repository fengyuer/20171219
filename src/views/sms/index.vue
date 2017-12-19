<template>
<div class="z-countinfo">
    <div class="z-ctbox ">
        <div id="user-info">
            <div class="u-pic">
                <img alt="用户头像" :src="indexData.avatar">
                <div class="mask"></div>
                <div class="face-link-box"></div>
            </div>
            <div class="info-m">
                <div>
                    <b>{{indexData.name}} | {{indexData.depart}}</b>
                </div>
                <div class="pad"></div>
                <div>绑定角色：{{indexData.role}}
                </div>

            </div>
        </div>
    </div>
    <div class="z-ctbox no-border z-p25">
        <span>请求失败数</span>
        <p>{{indexData.reqFail}}条</p>
    </div>
    <div class="sm easebuy-m " id="addresssDiv-138244275">
        <div class="smt">
            <h3>
                发送短信总量：{{indexData.totalMsgCount}}条
                <!-- 旧地址不可编辑别名 -->
                <a onclick="modifyAliasTipsByoverseas(138244275,event,0);" id="alias-edit-138244275" class="alias-edit" href="javascript:;"></a>
            </h3>
        </div>
        <div class="smc">
            <div class="items new-items">
                <div class="item-lcol">
                    <div class="item">
                        <span class="label">最近一次发送数量：</span>
                        <div class="item-line">
                            {{indexData.lastCount}}条
                        </div>
                    </div>
                    <div class="item">
                        <span class="label">最近一次发送时间：</span>
                        <div class="item-line">
                            {{indexData.lastTimeStamp}}
                        </div>
                    </div>
                </div>
                <div class="clr"></div>
            </div>
        </div>
    </div>
    <div class="sm easebuy-m " id="addresssDiv-138244275">
        <div class="smt">
            <h3>
                总到达率
                <!-- 旧地址不可编辑别名 -->
                <a onclick="modifyAliasTipsByoverseas(138244275,event,0);" id="alias-edit-138244275" class="alias-edit" href="javascript:;"></a>
            </h3>
        </div>
        <div class="smc">
            <div class="items new-items">
                <div class="item-lcol">
                    <div class="item">
                        <span class="label">成功：</span>
                        <div class="item-line">
                            {{indexData.totalArrivalSucc}}%
                        </div>
                    </div>
                    <div class="item">
                        <span class="label">失败：</span>
                        <div class="item-line">
                            {{indexData.totalArrivalFail}}%
                        </div>
                    </div>
                </div>
                <div class="clr"></div>
            </div>
        </div>
    </div>
    <a href="" class="z-ctbtn"></a>
</div>
</template>
<script>
import { fetchSmsIndex } from "@/api/smsApi";
export default {
  data() {
    return {
      indexData: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      fetchSmsIndex().then(response => {
        this.indexData = response.data;
      });
    }
  }
};
</script>
<style lang="scss"  scoped>
.easebuy-m {
  border: 2px solid #e6e6e6;
  margin: 0 0 20px;
  width: 720px;
  margin-left: 20px;
  padding-top: 10px;
  .smt {
    padding-left: 10px;
    line-height: 35px;
    height: 35px;
    position: relative;
    display: inline-block;
    display: block;
    overflow: visible;
    .smt h3 {
      float: left;
      color: #666;
      font-family: "microsoft yahei";
    }
  }
  .smc {
    padding: 10px;
    line-height: 22px;
    width: 788px;
    .new-items {
      position: relative;
      width: 788px;
    }
    .item-lcol {
      width: 450px;
      float: left;
      .item-line {
        width: 180px;
        display: inline-block;
      }
    }
    .item {
      margin-bottom: 10px;
      span {
        margin-left: 8px;
        color: #999;
        text-align: right;
      }
    }
  }
}
#user-info {
  font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB,
    "\u5b8b\u4f53", sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #666;
  background: #fff;
  overflow: hidden;
  width: 302px;
  float: left;
  padding: 10px;
  margin-bottom: 10px;
  height: 124px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  color: #666;
  line-height: 20px;
  margin-left: 20px;
  .u-pic {
    position: relative;
    z-index: 0;
    float: left;
    width: 104px;
    height: 104px;
    overflow: hidden;
    text-align: center;
    margin-right: 6px;
    .mask {
      background: url(//misc.360buyimg.com/user/myjd-2015/css/i/myjd-bg2.png) 0
        0;
      width: 104px;
      height: 104px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }
  .info-m {
    margin-top: 20px;
    float: left;
    width: 170px;
  }
}
.z-countinfo {
  padding-bottom: 30px;
  font-family: 微软雅黑;
  border-top: 1px dashed rgb(229, 229, 229);
  .z-grey {
    background: #efefef;
  }
  .z-p25 {
    padding: 25px 0;
  }
}
.z-ctbox {
  width: 720px;
  overflow: hidden;
  padding: 30px 0;
  border-bottom: 1px dashed #e5e5e5;
  img {
    display: block;
    float: left;
    border: 0;
  }
  span {
    display: block;
    float: left;
    width: 118px;
    height: 24px;
    font-size: 14px;
    line-height: 24px;
    font-weight: normal;
    text-indent: 20px;
  }
  p {
    float: left;
    width: 460px;
    line-height: 24px;
    font-size: 14px;
  }
  &.no-border {
    border: none;
  }
}

.fl {
  float: left;
}
.clear,
.clr {
  display: block;
  overflow: hidden;
  clear: both;
  height: 0;
  line-height: 0;
  font-size: 0;
}
.pad {
  height: 20px;
}
* {
  margin: 0;
  padding: 0;
}
</style>
