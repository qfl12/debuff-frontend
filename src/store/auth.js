import { defineStore } from 'pinia';

// 定义认证状态管理Store
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 登录状态标记
    isLoggedIn: false,
    // 用户信息对象
    user: null
  }),
  actions: {
    /**
     * 用户登录操作
     * @param {Object} userInfo - 用户登录信息
     */
    login(userInfo) {
      this.isLoggedIn = true;
      this.user = userInfo;
      // 存储用户状态到本地存储，刷新页面后保持登录状态
      localStorage.setItem('user', JSON.stringify(userInfo));
    },
    /**
     * 用户登出操作
     */
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      // 清除本地存储中的用户信息
      localStorage.removeItem('user');
    },
    /**
     * 初始化登录状态（页面加载时调用）
     */
    initAuthState() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
      }
    }
  }
});