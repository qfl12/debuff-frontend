<template>
  <div class="settings-page">
    <h2>意见反馈</h2>
    <div class="feedback-form-container">
      <form class="feedback-form" @submit.prevent="submitFeedback">
        <div class="form-group">
          <label for="feedback-type">反馈类型</label>
          <select id="feedback-type" v-model="feedbackType" required class="form-control">
            <option value="">请选择反馈类型</option>
            <option value="bug">功能故障</option>
            <option value="suggestion">功能建议</option>
            <option value="account">账号问题</option>
            <option value="other">其他问题</option>
          </select>
        </div>
        <div class="form-group">
          <label for="feedback-content">反馈内容</label>
          <textarea id="feedback-content" v-model="feedbackContent" required rows="5" placeholder="请详细描述您遇到的问题或建议..." class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="contact-info">联系方式（选填）</label>
          <input type="text" id="contact-info" v-model="contactInfo" placeholder="邮箱或手机号，方便我们联系您" class="form-control">
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">提交反馈</button>
        </div>
      </form>
      <div class="feedback-guidelines">
        <h3>反馈须知</h3>
        <ul>
          <li>请详细描述您遇到的问题，以便我们更好地为您解决</li>
          <li>涉及账号安全的问题请通过官方渠道联系我们</li>
          <li>我们将在1-3个工作日内处理您的反馈</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'UserFeedback',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const feedbackType = ref('');
    const feedbackContent = ref('');
    const contactInfo = ref('');

    const submitFeedback = () => {
      // 模拟提交反馈，实际项目中应发送API请求
      console.log('提交反馈:', {
        userId: authStore.user.id,
        type: feedbackType.value,
        content: feedbackContent.value,
        contact: contactInfo.value,
        submitTime: new Date().toISOString()
      });

      // 显示提交成功提示（实际项目中应使用UI组件库的提示组件）
      alert('反馈提交成功，感谢您的宝贵意见！');
      router.push('/account-settings');
    };

    return {
      feedbackType,
      feedbackContent,
      contactInfo,
      submitFeedback
    };
  }
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.feedback-form-container {
  display: flex;
  gap: 30px;
}

.feedback-form {
  flex: 2;
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feedback-guidelines {
  flex: 1;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  resize: vertical;
}

.form-actions {
  margin-top: 25px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.feedback-guidelines h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
}

.feedback-guidelines ul {
  padding-left: 20px;
}

.feedback-guidelines li {
  color: #6c757d;
  margin-bottom: 8px;
  font-size: 14px;
}
</style>