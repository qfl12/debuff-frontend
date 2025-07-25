<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">账号注册</h2>
      <form class="register-form" @submit.prevent="handleRegister">
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
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="请输入邮箱"
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
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="请再次输入密码"
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
        <div class="form-group code-group">
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
              :disabled="!imageCode || isCodeButtonDisabled"
              @click="sendVerificationCode"
            >
              {{ codeButtonText }}
            </button>
          </div>
        </div>
        <button type="submit" class="register-btn" :disabled="!isFormValid">注册</button>
        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted, onActivated, onMounted } from 'vue';
import service from '@/utils/request';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterView',
  setup() {
    // 表单数据
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const imageCode = ref('');
const showEmailCode = ref(false);
    const emailCode = ref('');
    const captchaUrl = ref('');
    
    const codeButtonText = ref('获取验证码');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);
    const timer = ref(null);

    // 状态管理和路由
  
    const router = useRouter();


    // 表单验证
    const isFormValid = computed(() => {
      return username.value && email.value && password.value && confirmPassword.value && emailCode.value && password.value === confirmPassword.value;
    });

    // 获取图片验证码
    const refreshCaptcha = async () => {
      // 调用后端接口获取图片验证码
      try {
        const response = await service.get(`/captcha/image?timestamp=${Date.now()}`, { responseType: 'blob', withCredentials: true });
        captchaUrl.value = URL.createObjectURL(response.data);
      } catch (error) {
        alert('获取验证码失败，请重试');
      }
    };

    // 验证图片验证码
    const verifyImageCode = async () => {
      if (!imageCode.value) {
        alert('请输入图片验证码');
        return;
      }

      try {
        const response = await service.post('/captcha/verify', {
          code: imageCode.value
        }, { withCredentials: true });

        if (response.code === 0 && response.data) {
          alert('图片验证码验证成功');
          return true;
        } else {
          alert('图片验证码错误');
          refreshCaptcha();
          return false;
        }
      } catch (error) {
          alert('验证码验证失败，请重试');
          refreshCaptcha();
          return false;
        }
    };

    // 发送邮箱验证码
    const sendVerificationCode = async () => {
      // 先验证图片验证码
      // 验证图片验证码
        const isVerified = await verifyImageCode();
        if (!isVerified) return;

      if (!email.value) {
        alert('请输入邮箱');
        return;
      }

      // 简单邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        alert('请输入有效的邮箱地址');
        return;
      }

      try {
        // 模拟发送验证码请求
        isCodeButtonDisabled.value = true;
        codeButtonText.value = `重新发送(${countdown.value}s)`;

        // 调用后端API发送验证码
        await service.post('/send-verification-code', {
          email: email.value
        });

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
        alert('发送验证码失败，请重试');
        isCodeButtonDisabled.value = false;
      }
    };

    // 注册处理函数
    const handleRegister = async () => {
      try {
        // 1. 检查邮箱是否已注册
        const emailCheckResponse = await service.get(`/check-email?email=${encodeURIComponent(email.value)}`);
        if (!emailCheckResponse.available) {
          alert('邮箱已注册，请使用其他邮箱');
          return;
        }

        // 2. 提交注册信息
        await service.post('/register', {
          username: username.value,
          email: email.value,
          password: password.value,
          emailCode: emailCode.value
        });
        alert('注册成功！');
        router.push('/login');
      } catch (error) {
        alert('注册失败：' + (error.response?.data?.message || error.message || '未知错误'));
      }
    };

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    onMounted(() => {
      refreshCaptcha();
    });

    onActivated(() => {
      refreshCaptcha();
    });

    return {
      username,
      email,
      password,
      confirmPassword,
      imageCode,
      emailCode,
      captchaUrl,
      showEmailCode,
      codeButtonText,
      isCodeButtonDisabled,
      isFormValid,
      refreshCaptcha,
      sendVerificationCode,
      handleRegister
    };
  }
};
</script>

<style scoped>
/* 注册页面容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 减去导航栏高度 */
  background-color: #1A1A1A;
  padding: 20px;
}

/* 注册卡片 */
.register-card {
  width: 100%;
  max-width: 400px;
  background-color: #2A2A2A;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 30px;
}

/* 标题样式 */
.captcha-img {
  width: 120px;
  height: 40px;
  cursor: pointer;
  margin-left: 10px;
}

.verify-code-btn {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
 cursor: pointer;
 &:hover {
   background-color: #359469;
 }
 &:disabled {
   background-color: #cccccc;
   cursor: not-allowed;
 }
  
background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.verify-code-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.register-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 24px;
  color: white;
}

/* 表单样式 */
.register-form {
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
  color: white;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 16px;
  background-color: #333;
  color: white;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

/* 验证码输入组 */
.code-group {
  position: relative;
}

.code-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
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

/* 按钮样式 */
.register-btn {
  padding: 14px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.register-btn:hover:not(:disabled) {
  background-color: #45a049;
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  color: #CCCCCC;
}

.login-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}
</style>