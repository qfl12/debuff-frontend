<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">账号登录</h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">昵称</label>
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
        <div class="form-group code-group">
          <label for="imageCode">图片验证码</label>
          <div class="code-input-group">
            <input
              type="text"
              id="imageCode"
              v-model="imageCode"
              required
              placeholder="请输入图片中的验证码"
            >
            <img
              :src="captchaUrl"
              @click="refreshCaptcha"
              class="captcha-img"
              alt="验证码图片"
            >
          </div>
        </div>
        <div class="form-group code-group" v-if="showEmailCode">
          <label for="emailCode">邮箱验证码</label>
          <div class="code-input-group">
            <input
              type="text"
              id="emailCode"
              v-model="emailCode"
              required
              placeholder="请输入邮箱验证码"
            >
            <button
              type="button"
              class="get-code-btn"
              :disabled="isCodeButtonDisabled"
              @click="sendVerificationCode"
            >
              {{ codeButtonText }}
            </button>
          </div>
        </div>
        <button type="submit" class="login-btn" :disabled="!isFormValid">登录</button>
        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import service from '@/utils/request';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    // 表单数据
    const username = ref('');
    const password = ref('');
    const imageCode = ref('');
    const emailCode = ref('');
    const captchaUrl = ref('');
    const showEmailCode = ref(false);
    const codeButtonText = ref('获取验证码');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);
    const timer = ref(null);
    
    // 状态管理和路由
    const authStore = useAuthStore();
    const router = useRouter();
    
    // 表单验证
    const isFormValid = computed(() => {
      // 邮箱验证码仅在需要时验证
      return username.value && password.value && imageCode.value && (!showEmailCode.value || emailCode.value);
    });

    // 获取图片验证码
    const refreshCaptcha = async () => {
      // 调用后端接口获取图片验证码
      try {
        const response = await service.get(`/captcha/image?timestamp=${Date.now()}`, { responseType: 'blob', withCredentials: true, timeout: 15000 });
        captchaUrl.value = URL.createObjectURL(response.data);
      } catch (error) {
        console.error('获取验证码失败:', error);
alert(`获取验证码失败: ${error.message || '网络错误，请重试'}`);
      }
    };

    onMounted(() => {
      refreshCaptcha();
    });

    // 验证图片验证码
    const verifyImageCode = async () => {
      if (!imageCode.value) {
        alert('请输入图片验证码');
        return;
      }

      try {
        const response = await service.post('/captcha/verify', {
            code: imageCode.value
          }, { withCredentials: true, timeout: 15000 });
        if (response.data.success) {
          showEmailCode.value = true;
          // 自动发送邮箱验证码
          sendVerificationCode();
        } else {
          alert('图片验证码错误');
          refreshCaptcha();
        }
      } catch (error) {
        alert('验证码验证失败，请重试');
        refreshCaptcha();
      }
    };

    // 发送邮箱验证码
    const sendVerificationCode = async () => {
      if (!showEmailCode.value) {
        await verifyImageCode();
        return;
      }

      if (!username.value || !password.value) {
        alert('请先输入昵称和密码');
        return;
      }

      try {
        // 调用后端API发送验证码
        isCodeButtonDisabled.value = true;
        codeButtonText.value = `重新发送(${countdown.value}s)`;

        await service.post('/login/send-verification-code', {
      username: username.value,
      password: password.value
    }, { timeout: 15000 });

        // 启动倒计时
        timer.value = setInterval(() => {
          countdown.value--;
          codeButtonText.value = `重新发送(${countdown.value}s)`;

          if (countdown.value <= 0) {
            clearInterval(timer.value);
            codeButtonText.value = '获取验证码';
            isCodeButtonDisabled.value = false;
            countdown.value = 60;
          }
        }, 1000);
      } catch (error) {
        alert('发送验证码失败：' + (error.response?.data?.message || '未知错误'));
        isCodeButtonDisabled.value = false;
      }
    };

    // 登录处理函数
    const handleLogin = async () => {
      // 这里简化处理，实际项目中应调用后端API验证
      try {
        // 调用后端API验证登录
        const response = await service.post('/login', {
      username: username.value,
      password: password.value,
      emailCode: emailCode.value
    });

        // 存储用户信息
        authStore.login(response.data.user);
        router.push('/');
      } catch (error) {
        alert('登录失败：' + (error.response?.data?.message || '用户名、密码或验证码错误'));
      }
        // 模拟登录成功，存储用户信息

    };
    
    // 清理定时器
    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      username,
      password,
      imageCode,
      emailCode,
      captchaUrl,
      showEmailCode,
      codeButtonText,
      isCodeButtonDisabled,
      isFormValid,
      refreshCaptcha,
      sendVerificationCode,
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

/* 验证码输入组 */
.code-group {
  position: relative;
}

.code-input-group {
  display: flex;
  gap: 10px;
}

.code-input-group input {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 44px;
  cursor: pointer;
  border-radius: 6px;
}

.get-code-btn {
  padding: 12px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.get-code-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}
</style>