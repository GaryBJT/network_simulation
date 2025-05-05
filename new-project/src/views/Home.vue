<template>
  <div class="container">
    <div class="content">
  <!-- <h1>我是home</h1> -->
   <div style="text-align: center;">
    <img class="picture" src="https://img.js.design/assets/img/67495502df1438b736b8b451.png" alt="西电校徽">
   </div>
   <div class="line">
   <img class="left" src="https://img.js.design/assets/img/67b0081807c4c2e467bcbcf9.png" alt="星光">
   <span class="font">西电数智网络仿真平台</span>
   <img class="right" src="https://img.js.design/assets/img/67b0081807c4c2e467bcbcf9.png" alt="星光">
  </div>
   <div class="module">
    <button class="design" @click="jump(model)">
      <img src="../assets/images/design.png" alt="设计">
      <span>模型设计</span>
    </button>
    <button class="connect" @click="jump(connect)">
      <img src="../assets/images/connect.png" alt="组装">
      <span>模型组装</span>
    </button>
    <button class="analyse" @click="jump(result)">
      <img src="../assets/images/analyse.png" alt="分析">
      <span>结果分析</span>
    </button>

   </div>
  <!-- <el-button type="primary" @click="jump(item)">跳转</el-button> -->
  </div>
</div>
</template>
<script>
import { EventBus } from '@/bus/eventbus';
import { connect } from 'echarts';
export default {
  data() {
      return {
        model:{ path: '/model'},
        connect:{path: '/connecting'},
        result:{path: '/result'},
      }
  },
  methods:{
    jump(item){
      // console.log(item);
      // 当页面的路由与跳转的路由不一致才允许跳转
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path);
      }
       }
  },

}
</script>

<style scoped>

.container{
	/* width : 100%; */
	height : 100vh;
  opacity: 0.94;
  background: linear-gradient(90deg, rgba(20, 52, 216, 1) 0%, rgba(20, 98, 216, 1) 100%);

  
}

.content{
  margin: 0 auto;
  width: 1190px;
}
.picture{
  /* padding: 0 870px; */
  padding-top: 80px;
  width: 180px;
  height: 180px;
  
}

.line{
  /* position: absolute; */
  width: 1190px;
  text-align: center;
  height: 316px;
  padding-top: 40px;
}
.font{
  display: inline-block;
  /* position: fixed;  */
  /* margin-left: 820px; */
  width: 280px;
  height: 39px;
  /* margin: 20px auto; */
  /** 文本1 */
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 40.54px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  vertical-align: top;

}
.left{
  position: relative; 
  left:0px;
  bottom: 135px;
  width: 316px; 
  
}
.right{
  position: relative; 
  left:0px;
  bottom: 135px;
  width: 316px;
  
}
.design{
  position: relative; 
  bottom: 135px;
  margin-left: 25px;
  width: 320px;
  height: 140px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 16px  rgba(10, 71, 178, 1);
  border: 0;
}
.design span{
  display: block;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 29px;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  padding-top: 8px;
}
.connect{
  position: relative; 
  bottom: 135px;
  margin-left: 90px;
  width: 320px;
  height: 140px;
  
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 16px  rgba(10, 71, 178, 1);
  border: 0;
}
.connect span{
  display: block;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 29px;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  padding-top: 8px;
}
.analyse{
  position: relative; 
  bottom: 135px;
  margin-left: 90px;
  width: 320px;
  height: 140px;
  
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 16px  rgba(10, 71, 178, 1);
  border: 0;
}
.analyse span{
  display: block;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 29px;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  padding-top: 8px;
}
</style>