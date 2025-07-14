import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入Pinia状态管理
import App from './App.vue'
import router from './router' // 导入路由配置

// 创建Vue应用实例
const app = createApp(App)

// 安装Pinia状态管理
app.use(createPinia())

// 安装路由
app.use(router)

// 挂载应用到DOM
app.mount('#app')
