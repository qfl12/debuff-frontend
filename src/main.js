import { createApp } from 'vue';
import './assets/global.css';
import MainNav from './MainNav.vue'
import router from './router' // 导入路由配置
import pinia from './store';

// 创建Vue应用实例
const app = createApp(MainNav)
app.config.globalProperties.$apiBaseUrl = 'http://localhost:8080'
app.config.globalProperties.$imageBaseUrl = 'http://localhost:8080'
//app.config.globalProperties.$apiBaseUrl = 'http://192.168.110.7:8080'
//app.config.globalProperties.$imageBaseUrl = 'http://192.168.110.7:8080'

// 安装Pinia状态管理
app.use(pinia)

// 安装路由
app.use(router)

// 挂载应用到DOM
app.mount('#app')
