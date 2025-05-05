<template>
  <div >
      <el-container>
             <!-- 头部 -->
              <el-header>
                  <common-header />
              </el-header>
              <router-view></router-view>
              <!-- <el-container> 
                    侧边栏
              <el-main width="auto" >
                  <common-aside />
              </el-main>
            </el-container> -->
      </el-container>
  </div>
</template>
<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'

export default {
  data() {
      return {}
  },
  components: {
      CommonAside,
      CommonHeader,
      
      
  },
  
}
</script>
<style scoped>

.el-header {
  padding: 0;
  margin-bottom:6px;
}
 /* .el-aside{
 height: calc(100vh - 66px); 
  border: 20px solid rgba(242, 247, 251, 1);
  background-color:rgba(255, 255, 255, 1); 
}*/
.el-main{
  padding:0;
  /* height: calc(100vh - 66px);  */
  /* height: 100vh;  */
  
}
</style>