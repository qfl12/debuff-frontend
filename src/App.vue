<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <img src="@/assets/logo.jpg" alt="DEBUFF Logo" class="logo-img">
      </div>

      <!-- 主导航菜单 -->
      <nav class="main-nav">
        <router-link to="/" class="nav-text-link">首页</router-link>
        <router-link to="/market" class="nav-text-link">饰品市场</router-link>

      </nav>

      <!-- 用户控件（邮件和头像） -->
      <div class="user-controls">
        <div v-if="authStore.isLoggedIn" class="logged-in-controls">
          <!-- 用户导航链接 -->
          <div class="user-nav-links">
            <router-link to="/inventory" class="nav-text-link">我的库存</router-link>
            <router-link to="/selling" class="nav-text-link">我的出售</router-link>
            <router-link to="/buying" class="nav-text-link">我的求购</router-link>
          </div>
          <!-- 邮件图标 -->
          <div class="mail-icon">
            <img src="@/assets/mail-icon.svg" alt="邮件" class="icon">
          </div>

          <!-- 用户头像及信息 -->
          <div class="user-profile" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <img :src="`${$imageBaseUrl}${authStore.user.avatarUrl || 'default-avatar.svg'}`" alt="用户头像" class="info-avatar" @click="goToAccountSettings('/profile')">
            <span class="level-badge">Lv{{ authStore.user.level || 1 }}</span>

            <!-- 用户信息卡片（下拉菜单） -->
            <div class="user-info-card" v-if="showUserInfo">
              <div class="user-info-header">
                <img :src="`${$imageBaseUrl}${authStore.user.avatarUrl || 'default-avatar-2.svg'}`" alt="用户头像" class="info-avatar">
                <div class="user-info-main" @click="goToAccountSettings('/profile')">
                  <div class="username">{{ authStore.user.username || '未知用户' }}</div>
                  <div class="user-id">U{{ authStore.user.id || '0000000000' }}</div>
                  <div class="user-level">Lv{{ authStore.user.level || 1 }}</div>
                </div>
              </div>
          
              <div class="user-balance" @click="goToAccountSettings('/funds')">
                <span class="balance-label">资金</span>
                <span class="balance-amount">¥{{ authStore.user.balance || '0' }}</span>
                <button class="recharge-btn" @click.stop="goToAccountSettings('/funds')">充值</button>
                
              </div>
              <div class="user-actions">
                <a href="#" class="action-link" @click.prevent="goToAccountSettings('/transactions')">我的交易</a>
                <a href="#" class="action-link" @click.prevent="goToAccountSettings('/feedback')">我要反馈</a>
                <a href="#" class="logout-link" @click.prevent="authStore.logout">退出登录</a>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="login-section">
          <router-link to="/login" class="login-btn">登录/注册</router-link>
        </div>
      </div>
    </header>

    <!-- 路由视图容器 -->
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from './store/auth';
import { onMounted, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    // 获取认证状态管理Store
    const authStore = useAuthStore();
    const router = useRouter();
    const showUserInfo = ref(false);
    const instance = getCurrentInstance();
    const $imageBaseUrl = instance.appContext.config.globalProperties.$imageBaseUrl;

    const goToAccountSettings = (path = '') => {
      router.push(`/account-settings${path}`);
    };

let infoTimeout;

const handleMouseEnter = () => {
  clearTimeout(infoTimeout);
  showUserInfo.value = true;
};

const handleMouseLeave = () => {
  infoTimeout = setTimeout(() => {
  showUserInfo.value = false;
}, 800);
};

    // 页面加载时初始化认证状态
    onMounted(() => {
      authStore.initAuthState();
    });

    return {
      authStore,
      showUserInfo,
      handleMouseEnter,
      handleMouseLeave,
      goToAccountSettings,
      $imageBaseUrl
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 5px;
  min-height: 60px;
  background-color: #1a1a1a;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-nav {
  margin: 0 5px 0 0;
}

/* 用户控件区域样式 */
.user-controls {
  display: flex;
  align-items: center;
  margin-left: auto;
  height: 100%;
  padding: 0 5px;
  flex-shrink: 1;
}


.logged-in-controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  width: auto;
  height: 100%;
}

.logged-in-controls > * {
  flex-shrink: 0;
}

.user-nav-links {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 100%;
  white-space: nowrap;
}

/* 邮件图标样式 */
.mail-icon {
  display: flex;
  align-items: center;
  height: 100%;
}
.mail-icon .icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: opacity 0.3s;
  vertical-align: middle;
}

.mail-icon .icon:hover {
  opacity: 0.8;
}

/* 用户头像区域样式 */
.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4CAF50;
}

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -6px;
  background-color: #4CAF50;
  color: white;
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 用户信息卡片样式 */
.user-info-card {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  width: 180px;
  background-color: #2c3e50;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 15px;
  padding-bottom: 0px;
  z-index: 100;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.info-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-main {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 3px;
}

.user-id {
  font-size: 12px;
  color: #b0b0b0;
  margin-bottom: 2px;
}

.user-level {
  font-size: 12px;
  color: #4CAF50;
}

.user-info-divider {
  height: 1px;
  background-color: #3d5a80;
  margin: 10px 0;
}

.user-balance {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 15px 0;
}

.user-actions {
  text-align: center;
  padding: 10px 0;
}

.user-actions .action-link, .user-actions .logout-link {
  display: inline-block;
  text-align: center;
  margin: 0 10px;
}

.funds-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.balance-label {
  font-size: 14px;
  color: #b0b0b0;
}

.balance-amount {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
}

.withdraw-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.withdraw-btn:hover {
  background-color: #45a049;
}

.user-actions {
  text-align: left;
}

.user-actions .action-link {
  display: block;
  color: #ecf0f1;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid #34495e;
}

.user-actions .action-link:last-child {
  border-bottom: none;
}

.user-actions .logout-link {
  color: #e74c3c;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  margin-top: 5px;
  display: block;
  transition: color 0.3s;
}

.logout-link:hover {
  color: #ff1a1a;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  width: auto;
}

/* 导航链接样式 */
.main-nav {
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0 20px;
}

.user-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-nav-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-nav-links {
  display: flex;
  gap: 15px;
}

.nav-text-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.nav-text-link:hover {
  color: #4CAF50;
}

.user-nav-links {
  display: flex;
  gap: 15px;
  margin-right: auto;
}

.nav-text-link {
  color: white;
  background-color: #1A1A1A;
  padding: 3px 6px;
  margin: 0 1px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
}

.nav-img {
  height: 32px;
  width: auto;
  background-color: #1A1A2E;
}

router-link {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

/* 确保所有导航链接文字为白色 */
.main-nav router-link, .user-nav router-link {
  color: white !important;
}

router-link:hover {
  background-color: #2c3e50;
}

router-link.active {
  background-color: #4CAF50;
}

.login-btn {
  padding: 8px 16px;
  background-color: #1A1A1A;
  color: white;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

/* 路由视图容器样式 */
router-view {
  padding: 20px;
}
</style>
