import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {Avatar, Button, ConfigProvider, Dropdown, Form, Input, Layout, Menu} from "ant-design-vue";


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


app.mount('#app')
