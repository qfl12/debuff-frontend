import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// 导入页面组件
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Inventory from '../views/Inventory.vue';
import Selling from '../views/Selling.vue';
import Buying from '../views/Buying.vue';

// 定义路由规则
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/inventory', name: 'Inventory', component: Inventory, meta: { requiresAuth: true }},
  { path: '/selling', name: 'Selling', component: Selling, meta: { requiresAuth: true }},
  { path: '/buying', name: 'Buying', component: Buying, meta: { requiresAuth: true }}
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // 检查路由是否需要登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 未登录则重定向到登录页
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;