import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'

Vue.use(VueRouter)

const routes = [
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
    }]
  }
]

const router = new VueRouter({
  routes
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
