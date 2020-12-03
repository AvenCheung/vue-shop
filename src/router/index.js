import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

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
    component: Home
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
