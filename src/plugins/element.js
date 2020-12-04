import Vue from 'vue'
import { Button, Input, Form, FormItem, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 将弹框组件注册为全局组件，将他挂载到vue的原型对象中
Vue.prototype.$message = Message
