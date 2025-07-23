<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">账号登录</h2>
      <form class="login-form" @submit.prevent="handleLogin">
          <div class="login-method">
            <label class="method-label">
              <input type="radio" v-model="loginMethod" value="password" checked>
              <span>密码登录</span>
            </label>
            <label class="method-label">
              <input type="radio" v-model="loginMethod" value="code">
              <span>验证码登录</span>
            </label>
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="请输入邮箱地址"
            >
          </div>
        <div class="form-group" v-if="loginMethod === 'password'">
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
<!-- 移除验证按钮 -->
          </div>
        </div>
        <div class="form-group code-group" v-if="loginMethod === 'code'">
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
import { ref, computed, onUnmounted, onMounted, watch } from 'vue';
import service from '@/utils/request';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    // 表单数据
    const email = ref('');
    const password = ref('');
    const imageCode = ref('');
    const emailCode = ref('');
    const captchaUrl = ref('');
    const showEmailCode = ref(false);
    const codeButtonText = ref('获取验证码');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);
    const timer = ref(null);
    const loginMethod = ref('password');
    
    // 状态管理和路由
    const authStore = useAuthStore();
    const router = useRouter();
    
    // 表单验证
    const isFormValid = computed(() => {
      // 邮箱验证码仅在需要时验证
      if (loginMethod.value === 'password') {
        return email.value && password.value && imageCode.value;
      } else {
        return email.value && imageCode.value && emailCode.value && showEmailCode.value;
      }
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

    // 监听登录方式切换，重置表单状态
    watch(loginMethod, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        if (newVal === 'code') {
          password.value = '';
        } else {
          emailCode.value = '';
          showEmailCode.value = false;
        }
        imageCode.value = '';
        refreshCaptcha();
      }
    });

    // 发送邮箱验证码
    const sendVerificationCode = async () => {
      // 先验证图片验证码
      if (!imageCode.value) {
        alert('请输入图片验证码');
        return;
      }
      try {
        const verifyRes = await service.post('/captcha/verify', { code: imageCode.value }, { withCredentials: true });
        if (verifyRes.code !== 0) {
          alert('图片验证码错误: ' + verifyRes.message);
          refreshCaptcha();
          return;
        }
        showEmailCode.value = true;
      } catch (error) {
        alert('图片验证码验证失败');
        return;
      }
      // 移除多余的验证码验证检查
      // 图片验证码已在上方验证通过
      

      if (loginMethod.value === 'password' && (!email.value || !password.value)) {
        alert('请先输入邮箱和密码');
        return;
      } else if (loginMethod.value === 'code' && !email.value) {
        alert('请先输入邮箱');
        return;
      }

      try {
        // 调用后端API发送验证码
        isCodeButtonDisabled.value = true;
        codeButtonText.value = `重新发送(${countdown.value}s)`;

        const sendCodeResponse = await service.post('/login/send-verification-code', {
      email: email.value,
      password: password.value
    }, { timeout: 15000, withCredentials: true });

        if (!sendCodeResponse.success) {
          alert('发送验证码失败: ' + sendCodeResponse.message);
          isCodeButtonDisabled.value = false;
          return;
        }
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
        alert('发送验证码失败：' + (error.response?.message || '未知错误'));
        isCodeButtonDisabled.value = false;
      }
    };

    // 登录处理函数
    const handleLogin = async () => {
      // 这里简化处理，实际项目中应调用后端API验证
      try {
        // 调用后端API验证登录
        let payload;
    // 密码登录时先验证图片验证码
    if (loginMethod.value === 'password') {
      if (!imageCode.value) {
        alert('请输入图片验证码');
        return;
      }
      try {
        const verifyRes = await service.post('/captcha/verify', { code: imageCode.value }, { withCredentials: true });
        if (verifyRes.code !== 0) {
          alert('图片验证码错误: ' + verifyRes.message);
          refreshCaptcha();
          return;
        }
      } catch (error) {
        alert('图片验证码验证失败: ' + (error.response?.message || '网络错误'));
        return;
      }
      payload = { email: email.value || '', password: password.value || '', loginType: loginMethod.value || 'password', code: imageCode.value || '' };
    } else {
      payload = { email: email.value || '', code: emailCode.value || '', loginType: loginMethod.value || 'code' };
    }
    const response = await service.post('/login', payload, { withCredentials: true });
// 调试日志：打印完整响应数据
console.log('Login response:', response);
if (!response || !response.success) {
      alert('登录失败：' + (response?.message || '服务器返回格式错误'));
      refreshCaptcha();
      return;
    }

    // 存储用户信息
    // 提取并传递token
const userWithToken = { ...response.user, token: response.token };
authStore.login(userWithToken);
    router.push('/');
      } catch (error) {
          const errorMsg = error.response?.message || '登录请求失败';
          // 区分验证码错误和其他错误
          if (errorMsg.includes('验证码')) {
            alert('验证码错误：' + errorMsg);
          } else if (errorMsg.includes('邮箱') || errorMsg.includes('密码')) {
            alert('账号或密码错误：' + errorMsg);
          } else {
            alert('登录失败：' + errorMsg);
          }
          // 仅在验证码错误时刷新验证码，保留表单数据
          if (errorMsg.includes('验证码')) {
            refreshCaptcha();
          }
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
      email,
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
      handleLogin,
      loginMethod
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

.login-method {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.method-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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

.verify-captcha-btn {
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
}

.verify-captcha-btn:hover {
  background-color: #45a049;
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