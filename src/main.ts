import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {
  Avatar,
  Breadcrumb,
  Button, Checkbox, Col, Collapse,
  ConfigProvider, DatePicker, Descriptions,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu, Row,
  Select,
  Spin, Table, Tag, TreeSelect
} from "ant-design-vue";


const app = createApp(App);
app.use(router)

app.use(ConfigProvider)
app.use(Layout)
app.use(Button)
app.use(Input)
app.use(Form)
app.use(Menu)
app.use(Avatar)
app.use(Dropdown)
app.use(Spin)
app.use(Select)
app.use(Breadcrumb)
app.use(TreeSelect)
app.use(Descriptions)
app.use(DatePicker)
app.use(Checkbox)
app.use(Table)
app.use(Tag)
app.use(Collapse)
app.use(Row)
app.use(Col)

app.mount('#app')
