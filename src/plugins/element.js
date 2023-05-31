import Vue from 'vue'
import {
  Button, Input, Form, FormItem, Message, Container,
  Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card,
  Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload, Avatar, Dropdown, DropdownMenu, DropdownItem
} from 'element-ui'
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

const componentsUI = [
  Button,
  Input,
  Form,
  FormItem,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem
]

componentsUI.map(componentItem => {
  Vue.use(componentItem)
})

// 将弹框组件注册为全局组件，将他挂载到vue的原型对象中
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
