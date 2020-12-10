<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

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
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDiglogClosed">
            <!-- 表单内容主题区域 -->
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 表单提交按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户的对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 验证邮箱的规则 参数分别是rule规则，value输入的数据，cb回调函数
    var checkEmail = (rule, value, cb) => {
        // 校验邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
            return cb()
        }
        cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
        // 校验手机的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
            return cb()
        }
        cb(new Error('请输入合法的手机号码'))
    }
    return {
        // 获取用户列表的参数对象
        queryInfo: {
            query: '',
            // 当前页码
            pagenum: 1,
            // 当前的每页显示多少条数据
            pagesize: 2
        },
        userlist: [],
        total: 0,

        // 添加用户对话框对象
        addDialogVisible: false,
        // 添加用户数据表单对象
        addForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
        },
        // 添加用户的表单数据验证规则
        addFormRule: {
            username: [
                {required: true, message: '请输入用户名称', trigger: 'blur'}
            ],
            password: [
                {required: true, message: '请输入用户密码', trigger: 'blur'},
                {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
            ],
            email: [
                {required: true, message: '请输入合法的邮箱', trigger: 'blur'},
                {validator: checkEmail, trigger: 'blur'}
            ],
            mobile: [
                {required: true, message: '请输入合法的手机号', trigger: 'blur'},
                {validator: checkMobile, trigger: 'blur'}
            ]
        },
        // 编辑用户对话框的对象
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 编辑用户校验对象
        editFormRule: {
            email: [
                {required: true, message: '请输入合法的邮箱', trigger: 'blur'},
                {validator: checkEmail, trigger: 'blur'}
            ],
            mobile: [
                {required: true, message: '请输入合法的手机号', trigger: 'blur'},
                {validator: checkMobile, trigger: 'blur'}
            ]
        }

    }
  },
  created () {
      this.getUserList()
  },
  methods: {
    async getUserList () {
        const { data: res} = await this.$http.get('users', {
            params: this.queryInfo
        })
        if (res.meta.status !== 200) {
            return this.$message.error('获取用户列表失败')
        }
        this.userlist = res.data.users
        this.total = res.data.total
        this.$message.success('获取用户列表成功！')
        console.log(res)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newNum) {
        this.queryInfo.pagenum = newNum
        this.getUserList()
    },
    // 监听 用户状态 改变的事件
    async userStateChange (userinfo) {
        const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        console.log(userinfo)
        if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框 关闭重置的事件
    addDiglogClosed () {
        this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮 添加新用户事件
    addUser () {
        this.$refs.addFormRef.validate(async valid => {
            if (!valid) return
            const {data: res} = await this.$http.post('users', this.addForm)
            if (res.meta.status !== 201) {
                return this.$message.error('添加用户失败!')
            }
            this.$message.success('添加用户成功!')
            // 关闭对话框
            this.addDialogVisible = false
            // 重新获取用户列表
            this.getUserList()
        })
    },
    // 打开编辑用户对话框事件
    async showEditDialog (id) {
        const { data: res} = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) {
            return this.$message.error('查询用户信息失败')
        }
        this.$message.success('查询用户信息成功')
        this.editForm = res.data
        this.editDialogVisible = true
    },
    // 监听编辑用户对话框 关闭重置的事件
    editDialogClosed () {
        this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮 修改用户信息事件
    editUserInfo () {
        this.$refs.editFormRef.validate(async valid => {
            // 这里先做表单预验证处理，valid表示表单验证的结果
            if (!valid) return
            const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                email: this.editForm.email,
                mobile: this.editForm.mobile
            })
            if (res.meta.status !== 200) {
                this.$message.error('更新用户信息失败!')
            }
            this.$message.success('更新用户信息成功!')
            // 关闭对话框
            this.editDialogVisible = false
            // 更新用户信息列表
            this.getUserList()
        })
    },
    // 删除用户信息 事件
    async removeUserById (id) {
         const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        /**
         * catch(err){
         * return err
         * }
         * 简化成
         * catch(err => err)
         */
        // console.log(confirmResult)
        // 如果确认删除则返回字符串类型 confirm
        // 如果取消删除则返回字符串类型 cancel
        if (confirmResult !== 'confirm') {
            return this.$message.info('已取消了删除！')
        }
        // console.log('确认了删除')
        const { data: res} = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
