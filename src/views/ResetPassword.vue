<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <h2 class="reset-password-title">密码重置</h2>
      <form class="reset-password-form" @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="请输入注册邮箱"
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
        <div class="form-group">
          <label for="newPassword">新密码</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            placeholder="请输入新密码"
          >
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认新密码</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="请再次输入新密码"
          >
        </div>
        <button type="submit" class="reset-password-btn" :disabled="!isFormValid">重置密码</button>
        <!-- 移除返回登录链接 -->
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import service from '@/utils/request';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../store/auth';

export default {
  name: 'ResetPasswordView',
  setup() {
    // 表单数据
    const email = ref('');
    const imageCode = ref('');
    const emailCode = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const captchaUrl = ref('');
    const captchaKey = ref('');

    // 状态控制
    const codeButtonText = ref('获取验证码');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);
    const timer = ref(null);
    // 移除未使用的router变量
const route = useRoute();
    const authStore = useAuthStore();

    // 表单验证
    const isFormValid = computed(() => {
      return (
        email.value &&
        imageCode.value &&
        emailCode.value &&
        newPassword.value &&
        confirmPassword.value &&
        newPassword.value === confirmPassword.value
      );
    });

    // 获取图片验证码
    const refreshCaptcha = async () => {
      try {
        const response = await service.get('/captcha/image?timestamp=' + Date.now(), {
          responseType: 'blob',
          withCredentials: true
        });
        captchaUrl.value = URL.createObjectURL(response.data);
        captchaKey.value = response.headers['captcha-key'];
      } catch (error) {
        ElMessage.error('获取验证码失败，请重试');
      }
    };

    // 验证图片验证码
    const verifyImageCode = async () => {
      if (!imageCode.value) {
        ElMessage.warning('请输入图片验证码');
        return false;
      }

      try {
        const response = await service.post('/captcha/verify', {
          code: imageCode.value,
          captchaKey: captchaKey.value
        }, { withCredentials: true });

        if (response.code !== 0) {
          ElMessage.warning('图片验证码错误: ' + response.message);
          return false;
        }
        return true;
      } catch (error) {
        ElMessage.error('验证码验证失败，请重试');
        return false;
      }
    };

    // 发送邮箱验证码
    const sendVerificationCode = async () => {
      const isVerified = await verifyImageCode();
      if (!isVerified) {
        refreshCaptcha();
        return;
      }

      if (!email.value) {
        ElMessage.warning('请输入邮箱');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        ElMessage.warning('请输入有效的邮箱地址');
        return;
      }

      try {
        isCodeButtonDisabled.value = true;
        codeButtonText.value = `重新发送(${countdown.value}s)`;

        await service.post('/users/send-reset-code', {
          email: email.value,
          imageCode: imageCode.value,
          captchaKey: captchaKey.value
        });

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

        ElMessage.success('验证码发送成功');
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '发送验证码失败');
        isCodeButtonDisabled.value = false;
      }
    };

    // 处理密码重置
    const handleResetPassword = async () => {
      try {
        await service.post('/users/reset-password', {
          email: email.value,
          code: emailCode.value,
          newPassword: newPassword.value
        });

        ElMessage.success('密码重置成功，页面将自动关闭');
        // 清除认证状态并关闭当前页面
        authStore.logout();
        setTimeout(() => window.close(), 1500);
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '密码重置失败');
      }
    };

    onMounted(() => {
  refreshCaptcha();
  email.value = route.query.email || '';
});

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      email,
      imageCode,
      emailCode,
      newPassword,
      confirmPassword,
      captchaUrl,
      codeButtonText,
      isCodeButtonDisabled,
      isFormValid,
      refreshCaptcha,
      sendVerificationCode,
      handleResetPassword
    };
  }
};
</script>

<style scoped>
/* 样式参考Register.vue并适当调整 */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20px;
}

.reset-password-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.reset-password-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 24px;
  color: #333333;
}

.reset-password-form {
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
  color: #333333;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: #f9f9f9;
  color: #333;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

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

.reset-password-btn {
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

.reset-password-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.reset-password-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.login-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}
/* 使用更具体的选择器隐藏导航栏 */
::v-deep #app .header {
  display: none !important;
}


/* 全局样式 - 隐藏导航栏 */
#app .header {
  display: none !important;
}

</style>