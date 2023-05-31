<template>
  <!-- 头部373d41 左侧333744 内容eaedf1-->
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <div>
        <!-- <el-button type="info" @click="logout">退出</el-button> -->
        <el-dropdown @command="handleCommand">
          <el-avatar class="avatar">use</el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item disabled>设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出账户</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleFold">|||</div>
        <!-- 侧边菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
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
      <!-- 右侧内容主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-box',
        101: 'el-icon-s-goods',
        102: 'el-icon-document-copy',
        145: 'el-icon-s-marketing'
      },
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        default:
          break
      }
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log('获取左侧菜单', res)
    },
    // 点击按钮，折叠左侧菜单栏
    toggleFold() {
      this.isCollapse = !this.isCollapse
    },
    activeNavState(activePath) {
      window.sessionStorage.getItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  // 优化左侧菜单展开导致不对齐突出边框的问题
  .el-menu {
    border: none;
  }
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.avatar {
  cursor: pointer;
}

.el-main {
  background-color: #eaedf1;
}
</style>
