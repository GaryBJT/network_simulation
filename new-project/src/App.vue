<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
    <router-view></router-view>
  </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>
<style lang="less">
  html,body,h3, p {
    margin: 0;
    padding: 0
  }
</style>
