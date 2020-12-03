import Vue from 'vue'
import { Button, Input, Form, FormItem, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
// 将弹框组件注册为全局组件，将他挂载到vue的原型对象中
Vue.prototype.$message = Message
