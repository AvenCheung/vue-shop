# vue_shop：电商管理系统

# 1.项目概述

## 1.1 开发模式

>电商后台管理系统整体采用的前后端分离的开发模式，其中前端项目是基于Vue技术栈的SPA项目

用户 ------> 前端项目(SPA) ------> 后端项目 ------> 数据库

## 1.2 技术选型

**前端项目技术栈**

- Vue
- Vue-Router
- Element-UI
- Axios
- Echarts

**后端项目技术栈**

- Node.js
- Express
- Jwt
- MySql
- Sequelize

# 2.项目初始化

## 2.1前端项目初始化步骤

1. 安装Vue脚手架
2. 通过vue脚手架创建项目
3. 配置vue路由
4. 配置element-UI 组件库
5. 配置axios库
6. 初始化git远程仓库

【注】：脚手架版本Vue-cli4

## 2.2后台项目的环境安装配置

1. 安装MySQL数据库
2. 安装node.js环境
3. 配置项目相关信息
4. 启动项目
5. 使用postman测试后台项目接口是否正常

# 登录功能

## 3.1概述

1. 登录业务流程

    1. 在登录页面输入用户名和密码
    2. 调用后台接口进行验证
    3. 通过验证之后，根据后台的响应状态跳转到项目主页
    
    

2. 登录业务的相关技术点

    - http是无状态的
    - 通过cookie在客户端记录状态
    - 通过session在服务器端记录状态
    - 通过token方式维持状态

## 3.2登录-token原理分析

【注】：按步骤来

1. 登录页面输入用户名和密码进行登录
2. 服务器验证通过之后生成该用户的token并返回
3. 客户端存储该token
4. 后续所有的请求都携带该token发送请求
5. 服务器端验证token是否通过

## 3.3登录功能实现

代码实现：`Login.vue`

### 表单数据绑定

```html
//:model绑定数据
<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont iconi-pwd"></el-input>
        </el-form-item>
      </el-form>
//...
data(){
    return {
      //登陆表单的数据绑定对象
      loginForm:{
        username:'admin',
        password:'123456',
      },
    }
  },
```

### 表单数据验证

绑定rules

```html
<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
```

data中

```js
data(){
    return {
      //这是表单的验证规则对象
      loginFormRules:{
        //验证用户名是否合法
        username:[
          { required:true, message:"请输入登录用户名", trigger:"blur"},
          { min:3, max:10, message:"长度在3到10个字符中间", trigger:"blur"}
        ],
      }
    }
  },
```

### 重置表单

```html
<el-button type="info" @click="resetLoginForm">重置</el-button>
```

```js
methods:{
    //重置登录表单
    resetLoginForm(){
      //console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
}
```

### 登陆前表单数据预验证

```html
<el-button type="primary" @click="login">登录</el-button>
```

```js
methods:{
    //登录预验证 valid是验证结果 判断验证通过/失败
    login(){
      this.$refs.loginFormRef.validate(async valid =>{
        //console.log(valid);
        if(!valid) return;
        //发送请求
        const {data: res} = await this.$http.post('login',this.loginForm);//操作返回的是await，可以使用async和await简化操作
        if(res.meta.status!==200) return this.$message.error('登陆失败');
        this.$message.success('登陆成功')
        //1. 将登陆成功之后的token，保存到客户端的sessionStorage中
        //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //  1.2 token只应当在当前网站打开期间生效，所以将token保存在sessionStorage中
        console.log(res);
        window.sessionStorage.setItem('token',res.data.token);
        //2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      });
    }
```

### 配置`axios`发起登录请求

注意：这里的发送请求利用后端的`api`，使用`axios`

在`main.js`中

```js
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios;//可以直接使用this.$http来请求
```

### 配置Message全局弹框请求

在`element.js`中

```js
import Vue from 'vue'

//按需导入element-ui组件
import {
  Button,Message,
 } from 'element-ui'

Vue.use(Button)
//将弹框组件挂载到vue的原型上，使得每个组件都可以通过this.$message访问
Vue.prototype.$message = Message;
```

### 路由导航守卫

控制页面的访问权限，只有登陆了才可以继续进行之后的操作

`router.js`中

```js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes:[
    //访问根路径时，重定向到login
    { path:'/',redirect:'/login'},
    { path:'/login',component:Login},
    { path:'/home',component:Home}
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 函数 表示放行
  //   next() 放行 next('/login')强制跳转
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
```

## 3.4  退出

<img src="Vue实战项目：电商管理系统.assets/1594212497138.png" alt="1594212497138" style="zoom: 67%;" />

### 实现退出功能

```html
<el-button type="info" @click="logout">退出</el-button>
```

```js
export default {
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登陆页面
      this.$router.push('/login');
    }
  }
};
```

### 使用git提交代码到码云中

```
git add .
git status
git commit -m "完成了登录功能"
git push //提交msater
git push -u origin login //提交到新分支login
```

# 4. 主页布局

## 4.1 整体布局

实现 `Home.vue`

## 4.2 左侧菜单布局

```html
<!-- 侧边栏区域 -->
<el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleFold">|||</div>
    <!-- 侧边菜单区域 -->
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
             :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router
             :default-active="activePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" @click="activeNavState">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                    <i class="el-icon-s-unfold"></i>
                    <span>{{subItem.authName}}</span>
                </template>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</el-aside>
```

## 4.3 通过接口获取菜单数据

【注】：需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌，后端验证token是否正确和过期。

在`main.js`中

```js
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config);
  //为请求头对象，添加token认证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //最后必须return config
  return config;
})
Vue.prototype.$http = axios;
```

`Home.vue`中

**设置二级菜单：**

* 首先通过接口获取左侧菜单数据
* 然后使用双层for循环渲染菜单
* 侧边栏路由链接改造：`el-menu router>`设置router，根据二级菜单的index值直接设置路由链接。

**样式设置：**

* 添加分类的图标，利用数组`iconsObj`每个菜单都有一个id，对应设置其icon

* 设置每次只能打开一个菜单项`unique-opened`

* 侧边栏的折叠与展开 `<el-menu :collapse="isCollapse" router>`: 绑定属性isCollapse,点击切换按钮来改变其值实现折叠与展开


```html
<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/shop.png" alt style="width:40px;height:40px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主题区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区域-->
        <el-menu unique-opened background-color="#333744" 
        text-color="#fff" active-text-color="#409BFF"
        :collapse-transition="false" 
        :collapse="isCollapse" router>
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
```

```js

<script>
export default {
  data(){
    return {
      //左侧菜单数据
      menuList:[],
      iconsObj:{
        '125':'iconfont iconuser',
        '103':'iconfont icontijikongjian',
        '101':'iconfont iconshangpin',
        '102':'iconfont icondanju',
        '145':'iconfont iconbaobiao'
      },
      //是否折叠
      isCollapse:false,
    }
  },
  created(){
    this.getMenuList();
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登陆页面
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log('请求菜单返回的结果：',res);
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
```

### 通过路由的形式展现用户列表

定义组件 `User.vue`

再修改`router.js`（嵌套进home组件，home包含一个子路由用户列表）

```js
import Users from '../components/user/Users.vue'

const router = new Router({
  routes:[
    //访问根路径时，重定向到login
    { path:'/',redirect:'/login'},
    { path:'/login',component:Login},
    { path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        { path:'/welcome',component:Welcome},
         //获取用户列表的组件
        { path:'/users',component:Users},
    ]}
  ]
})
```

### 在`sessionStorage`中保存左侧菜单的激活状态(高亮状态)

Menu中设置属性`deafult-active`,将这个值绑定到`<el-menu  :default-active="activePath">` `activePath`中，每次点击链把对应的地址保存到`sessionStorage`当中，当刷新页面的时候再取出动态赋值给菜单。

在`Home.vue`中

二级菜单绑定单击事件

```html
<!--二级菜单-->
<el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
    <i class="el-icon-menu"></i>
    <span>{{subItem.authName}}</span>
</el-menu-item>
```

动态绑定到`sessionStoarge`中,整个home组件创建时执行created(),就将`activePath`保存

```js
<script>
export default {
  data(){
    return {
      //被激活的链接地址
      activePath:'',
    }
  },
  created(){
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: 
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  }
};
</script>
```

# 5. 用户管理

## 5.1 用户列表

### 用户列表组件布局

```html
<!-- 用户列表区域 -->
<el-table :data="userlist" border stripe>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态">
        <!-- 添加作用域插槽 -->
        <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
        <!-- 通过作用域插槽进行行内数据 -->
        <template slot-scope="scope">
            <!-- 用户编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>

            <!-- 用户删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>

            <!-- 用户分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoleDialog(scope.row)"></el-button>
            </el-tooltip>
        </template>
    </el-table-column>
</el-table>
```

使用el-row和el-col

### 获取用户列表数据

`User.vue`

data中

* `queryInfo`表示调用API的时候的传参
* `userList`和total接受数据

created中

* 初始化组件时获取用户列表（在methods中定义方法，获取数据返回给userList和total）

```html
<script>
export default {
  data(){
    return {
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0,
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data:res} = await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status!==200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      //console.log(res);  
    }
  }
};
</script>
```

### 使用el-table组件渲染用户列表

为el-table绑定data,为el-table-column指定`label`和`prop`

### 为表格添加索引列

在头部加一列 `<el-table-column type="index"></el-table-column>`

### 自定义状态列的显示效果

```html
<template slot-scope="scope">
    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
</template>
```

```html
<!--用户列表-->
<el-table :data="userList" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态">
        <template slot-scope="scope">
            <!--{{scope.row}}-->
            <el-switch v-model="scope.row.mg_state">
            </el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作"></el-table-column>
</el-table>
```

`scoper.row`获得这一列的结果，绑定其上的数据，改变状态的展示形式

### 通过作用域插槽渲染操作列

```html
<el-table-column label="操作" width="180px">
    <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>                     <el-button type="danger" icon="el-icon-delete"  @click="removeUserById(scope.row.id)" ></el-button>
        <el-tooltip effect="dark" content="分配角色" placement="top-start" enterable="false">
            <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
        </el-tooltip>
    </template>
</el-table-column>
```