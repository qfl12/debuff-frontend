<template>
  <div class="settings-page" v-if="isMounted">
    <h2>个人资料设置</h2>
    <div class="profile-section">
      <div class="avatar-wrapper">
        <img 
            ref="avatarImg"
            :src="`${$imageBaseUrl}${authStore.user.avatarUrl || 'default-avatar-2.svg'}`"
            :alt="用户头像"
            class="avatar-img"
          >
        <button class="change-avatar-btn">更换头像</button>
      </div>
      <div class="profile-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="输入用户名">
        </div>
        <div class="form-group">
          <label>用户ID</label>
          <input type="text" v-model="userId" disabled placeholder="用户唯一标识">
        </div>
        <div class="form-group">
          <label>等级</label>
          <input type="text" v-model="level" disabled placeholder="用户等级">
        </div>
        <button class="save-btn">保存修改</button>
      </div>
    </div>
  </div>
</template>



<script>
import { useAuthStore } from '../store/auth';
import { ref, onMounted, onBeforeUnmount, watch, getCurrentInstance } from 'vue';

export default {
  name: 'UserProfile',
  setup() {
    const authStore = useAuthStore();
    const { proxy } = getCurrentInstance();
    const $imageBaseUrl = proxy.$imageBaseUrl;
    const username = ref('');
    const userId = ref('');
    const level = ref('');
    const avatarUrl = ref('');
    const avatarImg = ref(null);
    const isMounted = ref(false);

    const handleImageError = (e) => {
      if (e.target) {
        e.target.src = `${proxy.$imageBaseUrl}/default-avatar-2.svg`;
      }
    };

    onMounted(() => {
      isMounted.value = true;
      if (avatarImg.value) {
        avatarImg.value.addEventListener('error', handleImageError);
      }
      if (isMounted.value) {
        const user = authStore.user;
        username.value = user?.username || '';
        userId.value = 'U' + (user?.id || '0000000000');
        level.value = user?.level || 1;
      }
    });

    onBeforeUnmount(() => {
      if (avatarImg.value) {
        avatarImg.value.removeEventListener('error', handleImageError);
        // Use blank data URL to cancel load without error
          avatarImg.value.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      }
      isMounted.value = false;
    });

    watch(
      () => authStore.user,
      (newUser) => {
        if (isMounted.value) {
          username.value = newUser?.username || '';
          userId.value = 'U' + (newUser?.id || '0000000000');
          level.value = newUser?.level || 1;
          avatarUrl.value = newUser?.avatarUrl || 'default-avatar-2.svg';
        }
      }
    );

    return {
      username,
        userId,
        level,
        authStore,
        isMounted,
        avatarUrl,
        $imageBaseUrl
    }



  }
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.profile-section {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4CAF50;
}

.change-avatar-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.change-avatar-btn:hover {
  background-color: #45a049;
}

.profile-form {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

save-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

save-btn:hover {
  background-color: #45a049;
}
</style>