import Vue from 'vue'
import VueRouter from 'vue-router'
// 先前的模式
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/User/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
//改为懒加载的模式
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/User/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
      // 路由重定向，当用户访问根目录的时自动跳转到登录页面
    },
    {
      path: '/login',
      name: Login,
      component: Login
    },
    {
      path: '/home',
      name: Home,
      component: Home,
      // 重定向到welcome
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        name: Welcome,
        component: Welcome
      }, {
        path: '/users',
        name: Users,
        component: Users
      }, {
        path: '/rights',
        name: Rights,
        component: Rights
      }, {
        path: '/roles',
        name: Roles,
        component: Roles
      }, {
        path: '/categories',
        name: Cate,
        component: Cate
      }, {
        path: '/params',
        name: Params,
        component: Params
      }, {
        path: '/goods',
        name: List,
        component: List
      }, {
        path: '/goods/add',
        name: Add,
        component: Add
      }, {
        path: '/orders',
        name: Order,
        component: Order
      }, {
        path: '/reports',
        name: Report,
        component: Report
      }]
    }
  ]
})

// 挂载路由导航守卫 beforeEach((to, from, next) => {})
router.beforeEach((to, from, next) => {
  // to 表示要跳转的页面
  // from表示从那个路径跳转而来
  // next是一个函数 表示放行
  //   next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
