<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">账号登录</h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="请输入用户名"
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="请输入密码"
          >
        </div>
        <button type="submit" class="login-btn">登录</button>
        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    // 表单数据
    const username = ref('');
    const password = ref('');
    
    // 状态管理和路由
    const authStore = useAuthStore();
    const router = useRouter();
    
    // 登录处理函数
    const handleLogin = () => {
      // 这里简化处理，实际项目中应调用后端API验证
      if (username.value && password.value) {
        // 模拟登录成功，存储用户信息
        authStore.login({
          username: username.value,
          // 可以添加其他用户信息
        });
        // 登录成功后重定向到首页
        router.push('/');
      } else {
        alert('请输入用户名和密码');
      }
    };
    
    return {
      username,
      password,
      handleLogin
    };
  }
}
</script>

<style scoped>
/* 登录页面容器 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 减去导航栏高度 */
  background-color: #f5f5f5;
  padding: 20px;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* 标题样式 */
.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 24px;
  color: #1a1a2e;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

/* 按钮样式 */
.login-btn {
  padding: 14px;
  background-color: #1A1A1A;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #333333;
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}
</style>