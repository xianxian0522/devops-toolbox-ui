import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router';
import {store, key} from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.use(router)
app.use(store, key)
app.use(Antd)
app.mount('#app')
