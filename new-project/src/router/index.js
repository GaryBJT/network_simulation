import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/Result.vue'
import Main from '../views/Main.vue'
import Test from '@/views/test.vue'
import PageOne from '../views/Connecting.vue'
import Model from '../views/Model.vue'

Vue.use(VueRouter)
// 1. 创建路由组件
// 2. 将路由与组件进行映射
// 3. 创建router实例

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    // 主路由
    {
        path: '/',
        name: 'main',
        component: Main,
        redirect: '/home', // 重定向
        children: [
        //     子路由
            { path: 'connecting', name: 'connecting', component: PageOne }, // 页面1
            { path: 'model', name: 'model', component: Model }, // 页面2
            { path: '/result',name: 'result',component: User} //页面3
        ]
    },
    {
        path: '/test',
        name: 'test',
        component: Test
    },
]

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

export default router

