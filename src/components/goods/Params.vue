<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="catelist" :props="cateProps" @change="handleChange" clearable change-on-select="true"></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParanmsDialog">添加参数</el-button>
          <!-- 动态参数表格数据 -->
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
                <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParanmsDialog">添加属性</el-button>
          <!-- 静态属性表格数据 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
                <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClosed">
      <el-form ref="addParamsFormRef" :model="addParamsForm" label-width="100px" :rules="addParamsFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 这是级联选择框双向绑定的数组
      selectedKeys: [],
      // 静态标签页选中对象
      activeName: 'many',
      // 动态参数数据
      manyTabData: [],
      // 静态属性数据
      onlyTabData: [],
      // 表单数据对象
      addParamsForm: {
        attr_name: ''
      },
      // 表单数据验证规则对象
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      addParamsDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // 点击Tab标签页触发的事件
    handleTabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      console.log(this.selectedKeys)
      // 根据所选分类的ID，和当前所处的面板，获取对应的参数
      const { data: res} = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      console.log(res.data)
      // 对数据根据不同的展示面板进行判断
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 添加参数对话框
    addParanmsDialog () {
      this.addParamsDialogVisible = true
    },
    // 监听对话框关闭时表单数据重置的事件
    addParamsDialogClosed () {
      this.$refs.addParamsFormRef.resetFields()
    }
  },
  // 计算器
  computed: {
    // 如果selectedKeys选中的长度不等于3，则返回true禁用,如果是则返回false取消禁用
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    catId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat-opt{
  margin: 15px 0;
}
</style>
