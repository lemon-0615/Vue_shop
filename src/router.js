import Vue from 'vue'
import Router from 'vue-router'
//import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ './components/Login.vue')
//import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ './components/Home.vue')
//import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ './components/Welcome.vue')
//import Users from './components/user/User.vue'
//import Rights from './components/power/Rights.vue'
//import Roles from './components/power/Roles.vue'
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ './components/user/User.vue')
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ './components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ './components/power/Roles.vue')
//import Cate from './components/goods/Cate.vue'
//import Params from './components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "Cate-Params" */ './components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate-Params" */ './components/goods/Params.vue')
//import GoodsList from './components/goods/GoodsList.vue'
//import Add from './components/goods/Add.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList-Add" */ './components/goods/GoodsList.vue')
const Add = () => import(/* webpackChunkName: "GoodsList-Add" */ './components/goods/Add.vue')
//import Order from './components/order/Order.vue'
//import Report from './components/report/Report.vue'
const Order = () => import(/* webpackChunkName: "Order-Report" */ './components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order-Report" */ './components/report/Report.vue')
Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', 
      component: Home, 
      redirect: '/welcome',
      children:[
        { path: '/welcome', component: Welcome},
        {path:'/users',component: Users},
        {path:'/rights',component: Rights},
        {path:'/roles',component: Roles},
        {path:'/categories',component: Cate},
        {path:'/params',component: Params},
        {path: '/goods', component: GoodsList},
        {path: '/goods/add', component: Add },
        {path: '/orders', component: Order },
        {path: '/reports', component: Report }
        ] 
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
