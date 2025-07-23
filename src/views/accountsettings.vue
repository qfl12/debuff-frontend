<template>
  <div class="settings-container">
    <div class="settings-sidebar">
      <h1 class="sidebar-header">账号设置</h1>

      <router-link to="/account-settings/profile" class="sidebar-item" active-class="active"><span>个人信息</span></router-link>
      <div class="sidebar-group">
        <div class="sidebar-group-title" @click="isTransactionOpen = !isTransactionOpen">我的交易 <span class="arrow">{{ isTransactionOpen ? '▼' : '►' }}</span></div>
        <div v-if="isTransactionOpen">
          <router-link to="/account-settings/funds/all" class="sidebar-subitem" active-class="active">全部交易</router-link>
          <router-link to="/account-settings/funds/active" class="sidebar-subitem" active-class="active">正在交易</router-link>
          <router-link to="/account-settings/funds/completed" class="sidebar-subitem" active-class="active">交易完成</router-link>
        </div>
      </div>
      
      <div class="sidebar-group">
        <div class="sidebar-group-title" @click="isMailOpen = !isMailOpen">邮件 <span class="arrow">{{ isMailOpen ? '▼' : '►' }}</span></div>
        <div v-if="isMailOpen">
          <router-link to="/account-settings/mail/all" class="sidebar-subitem" active-class="active">全部邮件</router-link>
          <router-link to="/account-settings/mail/read" class="sidebar-subitem" active-class="active">已读邮件</router-link>
          <router-link to="/account-settings/mail/unread" class="sidebar-subitem" active-class="active">未读邮件</router-link>
        </div>
      </div>
      
      <div class="sidebar-group">
        <div class="sidebar-group-title" @click="isRechargeOpen = !isRechargeOpen">
          充值 <span class="arrow">{{ isRechargeOpen ? '▼' : '►' }}</span>
        </div>
        <div v-if="isRechargeOpen">
          <router-link to="/account-settings/recharge/new" class="sidebar-subitem" active-class="active">充值</router-link>
          <router-link to="/account-settings/recharge/history" class="sidebar-subitem" active-class="active">交易流水</router-link>
        </div>
      </div>
      <router-link to="/account-settings/feedback" class="sidebar-item" active-class="active"><span>我要反馈</span></router-link>
      <router-link to="/account-settings/basic" class="sidebar-item" active-class="active"><span>基本设置</span></router-link>
      <button class="sidebar-item logout-btn" @click="logout"><span>退出登录</span></button>
    </div>
    <div class="settings-content">
      <router-view />
    </div>
  </div>
  </template>

<script>
import { useAuthStore } from '../store/auth';
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

  export default {
    name: 'AccountSettings',
  components: {
    RouterLink,
    RouterView
  },
  setup() {
    const isTransactionOpen = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();
    const activeTab = ref('basic');
    const isMailOpen = ref(false);
    const isRechargeOpen = ref(false);
    const user = ref(authStore.user);

    const bindSteam = () => {
      // 跳转到Steam绑定页面
      router.push('/bind-steam');
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      isTransactionOpen,
      activeTab,
      user,
      bindSteam,
      logout,
      isMailOpen,
      isRechargeOpen
    };
  }
};
</script>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.settings-sidebar {
  width: 200px;
  margin-right: 20px;
  padding-top: 10px;
}

.sidebar-header {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  padding-left: 15px;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  line-height: 1.5;
}

.sidebar-title {
  font-size: 18px;
  margin-bottom: 15px;
  padding-left: 15px;
}

.sidebar-item {
  padding: 12px 15px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 6px;
  display: block;
  text-decoration: none;
  color: inherit;
}

.sidebar-group {
  margin: 15px 0;
}

.sidebar-group-title {
  padding: 8px 15px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.sidebar-group-title .arrow {
  font-size: 0.8em;
  transition: transform 0.2s;
}

.sidebar-subitem {
  padding: 8px 15px 8px 30px;
  margin-bottom: 3px;
  cursor: pointer;
  border-radius: 6px;
  display: block;
  text-decoration: none;
  color: inherit;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 12px 15px;
  margin-top: 15px;
  color: #ff4d4f;
}

.sidebar-item.active,
.sidebar-subitem.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.settings-content {
  flex: 1;
}

.setting-item {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-text {
  color: #666;
}

.edit-btn, .bind-btn, .upload-btn {
  padding: 8px 15px;
  border: 1px solid #4CAF50;
  background-color: white;
  color: #4CAF50;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover, .bind-btn:hover, .upload-btn:hover {
  background-color: #f5f5f5;
}
</style>