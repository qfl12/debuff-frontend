import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// 导入页面组件
import Home from '../views/Home/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Inventory from '../views/Home/Inventory.vue';
import Selling from '../views/Home/Selling.vue';
import Buying from '../views/Home/Buying.vue';
import AccountSettingsIndex from '../views/accountsettings.vue';
import UserProfile from '../views/account-settings/UserProfile.vue';
import ReadMail from '@/views/account-settings/mail/ReadMail.vue';
import UnreadMail from '@/views/account-settings/mail/UnreadMail.vue';
import AllMail from '@/views/account-settings/mail/AllMail.vue';
import UserFunds from '../views/account-settings/RechargeModule/UserFunds.vue';
import UserTransactions from '../views/account-settings/TransactionModule/UserTransactions.vue';
import UserFeedback from '../views/account-settings/UserFeedback.vue';
import BasicSettings from '../views/account-settings/BasicSettings.vue';
import Recharge from '../views/account-settings/RechargeModule/Recharge.vue';
import Transactions from '../views/account-settings/TransactionModule/transactions.vue';

// 定义路由规则
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/inventory', name: 'Inventory', component: Inventory, meta: { requiresAuth: true }},
  { path: '/selling', name: 'Selling', component: Selling, meta: { requiresAuth: true }},
  { path: '/buying', name: 'Buying', component: Buying, meta: { requiresAuth: true }},
  { path: '/account-settings', name: 'AccountSettings', component: AccountSettingsIndex, meta: { requiresAuth: true },
    children: [
      { path: 'profile', name: 'AccountProfile', component: UserProfile },
      { path: 'basic', name: 'BasicSettings', component: BasicSettings },
      { path: 'funds', name: 'AccountFunds', component: UserFunds, children: [
        { path: 'all', name: 'AllTransactions', component: UserTransactions },
        { path: 'active', name: 'ActiveTransactions', component: UserTransactions },
        { path: 'completed', name: 'CompletedTransactions', component: UserTransactions }
      ] },
      { path: 'recharge', children: [
        { path: 'new', component: Recharge },
        { path: 'history', component: Transactions }
      ] },
      { path: 'transactions', name: 'AccountTransactions', component: UserTransactions },
      { path: 'feedback', name: 'AccountFeedback', component: UserFeedback },
      { 
          path: 'mail', 
          children: [
            { path: 'all', name: 'AllMail', component: AllMail },
          { path: 'read', name: 'ReadMail', component: ReadMail },
          { path: 'unread', name: 'UnreadMail', component: UnreadMail },
          { path: '', redirect: 'unread' }
          ]
      },
      { path: '', redirect: 'profile' }
    ]
  }
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