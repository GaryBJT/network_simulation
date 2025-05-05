<template>
  <div class="header-container">
    <div class="l-content">
      <!-- <el-button
        style="margin-right: 20px"
        @click="handleMenu"
        icon="el-icon-menu"
        size="mini"></el-button> -->
      <!-- 面包屑 -->
      <!-- <span class="text">首页 </span> -->
       <img class="picture" src="https://img.js.design/assets/img/67495502df1438b736b8b451.png" alt="">
       <span class="xidian">西电数智网络仿真平台</span>
    </div>
    <div class="r-content">
      <img class='arrow' src="../assets/images/arrow.png" alt="箭头" />
      <el-button type="text" class="return">返回首页</el-button>
      <!-- <span class="return">返回首页</span> -->
      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" src="../assets/images/user.png" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item >退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    handleMenu() {
      this.$store.commit("collapseMenu");
    }, 
  },
};
</script>



<style lang="less" scoped>
.header-container {
  opacity: 1;
  padding: 0 20px;
  background: linear-gradient(90deg, rgba(20, 52, 216, 1) 0%, rgba(20, 98, 216, 1) 100%);
  height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }
  .r-content {
    .arrow{
      vertical-align: middle;
    }
    .return {
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 17.38px;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      vertical-align: center;
      display: inline-block;

    }
  }
  .l-content {
    // display: flex;
    // align-items: center;
    // /deep/.el-breadcrumb__item {
    //   .el-breadcrumb__inner {
    //     font-weight: normal;
    //     &.is-link {
    //       color: #666;
    //     }
    //   }
    //   &:last-child {
    //     .el-breadcrumb__inner {
    //       color: #fff;
    //     }
    //   }
    // }
    .xidian{
      left: 78px;
      top: 21px;
      width: 180px;
      height: 27px;
      opacity: 1;
      /** 文本1 */
      font-size: 18px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 26.06px;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      vertical-align: middle;
      padding-left: 8px;
    }
    .picture{
    left: 20px;
    top: 8px;
    width: 50px;
    height: 50px;
    opacity: 1;
    vertical-align: middle;
    
    }

    

  }
}
</style>