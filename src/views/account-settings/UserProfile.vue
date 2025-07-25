<template>
  <div class="settings-page" v-show="isMounted">
    <!-- 基本设置区域 -->
    <div class="section-card">
      <h2>基本设置</h2>
      <div class="profile-section">
        <div class="avatar-wrapper" style="position: relative;">
          <img 
              ref="avatarImg"
              :src="`${$imageBaseUrl}${avatarUrl || '/avatars/default-avatar.svg'}`"
              :alt="用户头像"
              class="avatar-img"
            >
          <div v-show="loading" class="loading-overlay">
            <el-icon><Loading /></el-icon>
          </div>
          <input type="file" ref="fileInput" accept="image/*" class="avatar-input" @change="handleFileChange">
          <button class="change-avatar-btn" @click="openFileDialog">更换头像</button>
        </div>
        <div class="profile-info">
          <div class="info-item">
            <span class="label">昵称</span>
            <span class="value">{{ username }}</span>
            <button class="edit-btn" @click="handleEditNickname">修改昵称</button>
          </div>
          <div class="info-item">
            <span class="label">性别</span>
            <span class="value">{{ genderLabel }}</span>
            <button class="edit-btn" @click="handleEditGender">修改性别</button>
          </div>
          <div class="info-item">
            <span class="label">出生日期</span>
            <span class="value">{{ birthDate || '未设置' }}</span>
            <button class="edit-btn" @click="handleEditBirthDate">修改生日</button>
          </div>
          <div class="info-item">
            <span class="label">个人简介</span>
            <span class="value">{{ bio || '未填写' }}</span>
            <button class="edit-btn" @click="handleEditBio">修改简介</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 安全设置区域 -->
    <div class="section-card">
      <h2>安全设置</h2>
      <div class="security-item">
        <div class="info-with-label">
          <span class="label">邮箱账号</span>
          <span class="status">
            <el-icon v-if="emailVerified" class="success-icon"><Check /></el-icon>
            <el-icon v-else class="error-icon"><Close /></el-icon>
            {{ emailVerified ? '已绑定: ' + email : '未绑定' }}
          </span>
        </div>
        <button class="action-btn" @click="handleChangeEmail">更换邮箱</button>
      </div>

      <!-- <div class="security-item">
        <div class="info-with-label">
          <span class="label">手机账号</span>
          <span class="status">
            <el-icon v-if="phoneVerified" class="success-icon"><Check /></el-icon>
            <el-icon v-else class="error-icon"><Close /></el-icon>
            {{ phoneVerified ? '已绑定: ' + formattedPhone : '未绑定' }}
          </span>
        </div>
        <button class="action-btn" @click="handleChangePhone">更换手机</button>
      </div> -->

      <!-- <div class="security-item">
        <div class="info-with-label">
          <span class="label">实名认证</span>
          <span class="status">
            <el-icon v-if="isVerified" class="success-icon"><Check /></el-icon>
            <el-icon v-else class="error-icon"><Close /></el-icon>
            {{ isVerified ? '已认证' : '未认证' }}
          </span>
        </div>
        <button class="action-btn" @click="handleIdentityVerify">前往认证</button>
      </div> -->

      <div class="security-item">
          <div class="info-with-label">
            <span class="label">Steam绑定</span>
            <span class="status" :class="steamBound ? 'text-success' : 'text-gray-500'">
              <el-icon v-if="steamBound" class="success-icon"><Check /></el-icon>
              <el-icon v-else class="error-icon"><Close /></el-icon>
              {{ steamBound ? '已绑定: ' + steamId : '未绑定' }}
            </span>
          </div>
          <button class="action-btn" v-if="!steamBound" @click="handleSteamBind">前往绑定</button>
          <button class="action-btn" v-if="steamBound" @click="handleSteamUnbind">解除绑定</button>
        </div>
        <!-- <div class="security-item">
          <div class="info-with-label">
            <span class="label">支付宝绑定</span>
            <span class="status">
              <el-icon v-if="alipayVerified" class="success-icon"><Check /></el-icon>
              <el-icon v-else class="error-icon"><Close /></el-icon>
              {{ alipayVerified ? '已绑定: ' + formattedAlipay : '未绑定' }}
            </span>
          </div>
          <button class="action-btn" @click="handleAlipayBind">前往绑定</button>
        </div> -->

      <div class="security-item">
        <div class="info-with-label">
          <span class="label">密码设置</span>
          <span class="status">已设置</span>
        </div>
        <button class="action-btn" @click="handleChangePassword">修改密码</button>
      </div>
    </div>

    <!-- Steam账号区域 -->
    <div class="section-card">
      <h2>Steam账号</h2>
      <div class="steam-account">
        <div class="steam-item">
          <span class="label">Steam账号</span>
          <span class="value">{{ steamId || '未绑定' }}</span>
          <button class="action-btn" @click="handleSteamBind">
            {{ steamBound ? '更换绑定' : '前往绑定' }}
          </button>
        </div>

        <div class="steam-api">
          <div class="form-group">
            <label>API key</label>
            <div class="input-with-help">
              <input type="text" v-model="apiKey" placeholder="请输入API key">
              <el-tooltip effect="dark" content="前往Steam获取API Key" placement="top">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <button class="save-small-btn" @click="saveApiKey">修改</button>
          </div>

          <div class="form-group">
            <label>交易链接</label>
            <div class="input-with-help">
              <input type="text" v-model="tradeLink" placeholder="请输入交易链接">
              <el-tooltip effect="dark" content="前往Steam获取交易链接" placement="top">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <button class="save-small-btn" @click="saveTradeLink">修改</button>
          </div>
        </div>

      </div>
    </div>
  </div>
     <!-- 编辑对话框 -->
    <el-dialog title="修改昵称" v-model="editNicknameDialog" width="30%">
      <el-input v-model="tempUsername" placeholder="请输入新昵称"></el-input>
      <template #footer>
        <el-button @click="editNicknameDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditNickname">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="修改性别" v-model="editGenderDialog" width="30%">
      <el-select v-model="tempGender" placeholder="请选择性别">
        <el-option v-for="option in genderOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <template #footer>
        <el-button @click="editGenderDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditGender">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="修改出生日期" v-model="editBirthDateDialog" width="30%">
      <el-date-picker v-model="tempBirthDate" type="date" placeholder="选择日期"></el-date-picker>
      <template #footer>
        <el-button @click="editBirthDateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditBirthDate">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="修改个人简介" v-model="editBioDialog" width="50%">
      <el-input type="textarea" v-model="tempBio" :rows="4" placeholder="请输入个人简介" maxlength="50" show-word-limit></el-input>
      <template #footer>
        <el-button @click="editBioDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditBio">确认</el-button>
      </template>
    </el-dialog>
</template>



<script>
import { useAuthStore } from '../../store/auth';
import { getUserInfo, uploadAvatar, updateUserInfo } from '../../utils/api';
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { ElMessage, ElDialog, ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from 'element-plus';




export default {
  name: 'UserProfilePage',
  components: {
    ElDialog,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElButton
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const username = ref('');
const userId = ref('');
const phone = ref('');
const email = ref('');
const apiKey = ref('');
const tradeLink = ref('');
const isVerified = ref(false);
const steamId = ref('');
const steamNickname = ref('');
const alipayAccount = ref('');
const alipayVerified = ref(false);
const avatarUrl = ref('default-avatar-2.svg');
const gender = ref('');
const birthDate = ref('');
const bio = ref('');
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
];
const genderLabel = computed(() => {
  const option = genderOptions.find(item => item.value === gender.value);
  return option ? option.label : '未设置';
});
const steamBound = computed(() => !!steamId.value);
const avatarImg = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const isMounted = ref(false);
const messageListener = ref(null);

// 编辑对话框状态
const editNicknameDialog = ref(false);
const editGenderDialog = ref(false);
const editBirthDateDialog = ref(false);
const editBioDialog = ref(false);

// 临时编辑数据
const tempUsername = ref('');
const tempGender = ref('');
const tempBirthDate = ref('');
const tempBio = ref('');

    const openFileDialog = () => {
  fileInput.value.click();
};

/**
 * 处理文件选择变化事件
 * @param {Event} e - 文件输入事件对象
 */
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // 前端文件验证
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只允许上传图片文件');
    return;
  }
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过2MB');
    return;
  }
  
  // 调用头像上传函数
  await uploadAvatarFile(file);
};

/**
 * 上传头像文件到服务器
 * @param {File} file - 选中的头像文件
 */

const handleEditNickname = async () => {
  tempUsername.value = username.value;
  editNicknameDialog.value = true;
};

const confirmEditNickname = async () => {
  try {
    const response = await updateUserInfo({ username: tempUsername.value });
    if (response.code === 200) {
      username.value = tempUsername.value;
      authStore.user.username = tempUsername.value;
      ElMessage.success('昵称修改成功');
      editNicknameDialog.value = false;
    } else {
      ElMessage.error(response.message || '昵称修改失败');
    }
  } catch (error) {
    ElMessage.error('昵称修改失败');
  }
};

const handleEditGender = () => {
  tempGender.value = gender.value;
  editGenderDialog.value = true;
};

const confirmEditGender = async () => {
  try {
    const response = await updateUserInfo({ gender: tempGender.value });
    if (response.code === 200) {
      gender.value = tempGender.value;
      authStore.user.gender = tempGender.value;
      ElMessage.success('性别修改成功');
      editGenderDialog.value = false;
    } else {
      ElMessage.error(response.message || '性别修改失败');
    }
  } catch (error) {
    ElMessage.error('性别修改失败');
  }
};

const handleEditBirthDate = () => {
  tempBirthDate.value = birthDate.value ? new Date(birthDate.value) : null;
  editBirthDateDialog.value = true;
};

const confirmEditBirthDate = async () => {
  try {
    const date = new Date(tempBirthDate.value);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const formattedBirthDate = `${year}-${month}-${day}`;
const response = await updateUserInfo({ birthDate: formattedBirthDate });
    if (response.code === 200) {
      birthDate.value = tempBirthDate.value.toLocaleDateString();
      authStore.user.birthDate = tempBirthDate.value;
      ElMessage.success('出生日期修改成功');
      editBirthDateDialog.value = false;
    } else {
      ElMessage.error(response.message || '出生日期修改失败');
    }
  } catch (error) {
    ElMessage.error('出生日期修改失败');
  }
};

const handleEditBio = () => {
  tempBio.value = bio.value;
  editBioDialog.value = true;
};

const confirmEditBio = async () => {
  try {
    const response = await updateUserInfo({ bio: tempBio.value });
    if (response.code === 200) {
      bio.value = tempBio.value;
      authStore.user.bio = tempBio.value;
      ElMessage.success('个人简介修改成功');
      editBioDialog.value = false;
    } else {
      ElMessage.error(response.message || '个人简介修改失败');
    }
  } catch (error) {
    ElMessage.error('个人简介修改失败');
  }
};

const handleChangeEmail = () => {
  // 跳转到邮箱更换页面或打开模态框
  ElMessage.info('邮箱暂时不能更换');
};

/**
 * 保存Steam API Key
 */
const saveApiKey = async () => {
  try {
    const response = await updateUserInfo({ apiKey: apiKey.value });
    if (response.code === 200) {
      ElMessage.success('API Key保存成功');
    } else {
      ElMessage.error(response.message || 'API Key保存失败');
    }
  } catch (error) {
    ElMessage.error('API Key保存失败');
  }
};

/**
 * 保存Steam交易链接
 */
const saveTradeLink = async () => {
  try {
    const response = await updateUserInfo({ tradeLink: tradeLink.value });
    if (response.code === 200) {
      ElMessage.success('交易链接保存成功');
    } else {
      ElMessage.error(response.message || '交易链接保存失败');
    }
  } catch (error) {
    ElMessage.error('交易链接保存失败');
  }
};

const handleChangePhone = () => {
  // 跳转到手机更换页面或打开模态框
  ElMessage.info('前往更换手机页面');
};

const handleIdentityVerify = () => {
  // 跳转到实名认证页面
  ElMessage.info('前往实名认证页面');
};

const handleAlipayBind = () => {
  // 跳转到支付宝绑定页面
  ElMessage.info('前往支付宝绑定页面');
};

const handleChangePassword = () => {
  // 在新标签页打开密码重置页面并传递邮箱参数
  window.open(`/reset-password?email=${encodeURIComponent(email.value)}`, '_blank');
};

/**
 * 处理Steam账号绑定点击事件
 * 直接打开登录窗口并监听结果，增加窗口状态检查以区分不同错误类型
 */
const handleSteamBind = () => {
  const steamLoginUrl = `http://192.168.110.7:8080/api/steam/auth/login`;
  //const steamLoginUrl = `http://localhost:8080/api/steam/auth/login`;

  // 1. 打开真正的弹窗（宽高必须 >100 才能叫 popup）
  const popup = window.open(
    steamLoginUrl,
    'steamLogin',
    'width=800,height=600,menubar=no,toolbar=no,status=no,scrollbars=yes,resizable=yes'
  );

  // 添加超时计时器
  const initialTimeoutTimer = setTimeout(() => {
    if (popup && !popup.closed) {
      popup.close();
      ElMessage.error('请求超时，请重试');
      window.location.reload();
    }
  }, 100000); // 30秒超时

  // 添加超时检查
  const steamBindTimeoutTimer = setTimeout(() => {
    if (!popup?.closed) {
      console.error('Steam绑定超时未收到响应');
      popup?.close();
      // 延迟移除监听器以确保所有消息都能被处理
      setTimeout(() => { window.removeEventListener('message', messageListener.value); }, 2000);
      ElMessage.error('Steam绑定超时，请重试');
    }
  }, 30000); // 30秒超时

  // 2. 监听弹窗发回来的消息
  messageListener.value = (event) => {
      console.log('收到postMessage:', event);
      // 安全校验
      const allowedOrigins = [window.location.origin, 'http://192.168.110.7:8080'];
      //const allowedOrigins = [window.location.origin, 'http://localhost:8080'];
      if (!allowedOrigins.includes(event.origin)) {
        console.warn('拒绝来自未授权源的消息:', event.origin);
        return;
      }

      // 清除定时器和弹窗的通用函数
      const cleanup = () => {
        popup?.close();
        clearTimeout(initialTimeoutTimer);
        clearTimeout(steamBindTimeoutTimer);
        clearInterval(pollingTimer);
        window.removeEventListener('message', messageListener.value);
      };

      if (event.data?.type === 'steam-bind-success') {
        ElMessage.success('Steam绑定成功');
        if (event.data.token) {
          localStorage.setItem('token', event.data.token);
        }
        cleanup();
        window.location.reload();
      } else if (event.data?.type === 'steam-bind-fail') {
        ElMessage.error(`绑定失败: ${event.data.msg || '未知错误'}`);
        cleanup();
        window.location.reload();
      } else if (event.data?.type === 'steam-bind-error') {
        console.error('Steam绑定错误:', event.data.msg);
        ElMessage.error(event.data.msg || 'Steam账号绑定失败');
        cleanup();
      } else {
        console.log('未知消息类型:', event.data?.type);
      }
      // 强制页面刷新以更新steamId
      window.location.reload();
  };

  window.addEventListener('message', messageListener.value);
  // 3. 兜底：定时轮询弹窗是否已关闭
  const pollingTimer = setInterval(() => {
    if (popup?.closed) {
      clearInterval(pollingTimer);
      window.removeEventListener('message', messageListener.value);
    }
  }, 1000);
};

const formattedPhone = computed(() => {
  if (!phone.value) return '';
  return phone.value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
});

const emailVerified = computed(() => !!email.value);
const formattedAlipay = computed(() => {
  if (!alipayAccount.value) return '';
  if (alipayAccount.value.includes('@')) {
    const [local, domain] = alipayAccount.value.split('@');
    return `${local.substring(0, 2)}****@${domain}`;
  } else if (/^\d+$/.test(alipayAccount.value)) {
    return alipayAccount.value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  }
  return alipayAccount.value;
});
const phoneVerified = computed(() => !!phone.value);

    const uploadAvatarFile = async (file) => {
      const formData = new FormData();
      formData.append('file', file); // 修复参数名称，与后端@RequestParam("file")保持一致
      loading.value = true;
      try {
        const { data } = await uploadAvatar(formData);
        if (data.code === 200) {
          // 直接使用后端返回的新头像URL
          avatarUrl.value = data.data;
          // 更新本地存储的用户信息
          authStore.$patch({
            user: {
              ...authStore.user,
              avatarUrl: data.data,
              avatarUpdateTime: Date.now()
            }
          });
          ElMessage.success('头像上传成功');
          // 直接更新头像图片src，避免页面刷新
          if (avatarImg.value) {
            avatarImg.value.src = `${proxy.$imageBaseUrl}${data.data}?t=${Date.now()}`;
          }
          // 重新获取用户信息以同步所有数据
          // 获取最新用户信息并处理可能的响应格式
          let updatedUserInfo = null;
          try {
            const userResponse = await getUserInfo();
            // 根据API实际响应结构提取用户数据
            updatedUserInfo = userResponse?.data || userResponse;
            if (!updatedUserInfo) {
              throw new Error('用户信息获取失败: 响应数据为空');
            }
            // 保存最新用户信息到localStorage
            localStorage.setItem('user', JSON.stringify(updatedUserInfo));
            // 刷新authStore缓存
            authStore.initAuthState();
            // 强制页面刷新以更新头像
            window.location.reload();
          } catch (error) {
            console.error('更新用户信息失败:', error);
            ElMessage.error('更新用户信息失败，请重试');
          }
        } else {
          ElMessage.error(data.message || '头像上传失败');
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '头像上传失败');
      } finally {
        loading.value = false;
        fileInput.value.value = '';
      }
      // 声明变量以修复未定义错误
      let updatedUserInfo = null;
      try {
        // 获取最新用户信息
        const userResponse = await getUserInfo();
        updatedUserInfo = userResponse?.data || userResponse;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        ElMessage.error('更新用户信息失败，请重试');
        return;
      }
      // 保存最新用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));
      // 刷新authStore缓存
      authStore.initAuthState();
      // 强制页面刷新以更新头像
      window.location.reload();
    };

    onMounted(() => {
      isMounted.value = true;
      const steamBindStatus = route.query.steam_bind;
      if (steamBindStatus === 'success') {
        ElMessage.success('Steam账号绑定成功');
        getUserInfo().then(({ data }) => {
          steamId.value = data.steamId ?? '';
          steamNickname.value = data.steamNickname ?? '';
        });
      } else if (steamBindStatus === 'error') {
        ElMessage.error(route.query.msg || 'Steam账号绑定失败');
      }
      router.replace({ query: {} });

      getUserInfo()
        .then(({ data }) => {
      const user = data;
      
      username.value = user.username ?? '';
      userId.value = 'U' + (user.userId ?? '0000000000');
      phone.value = user.phone ?? '';
      email.value = user.email ?? '';
      isVerified.value = user.isVerified === 1;
      steamId.value = user.steamId ?? '';
      steamNickname.value = user.steamNickname ?? '';
      avatarUrl.value = user.avatarUrl ?? 'default-avatar-2.svg';
      gender.value = user.gender ?? '';
      birthDate.value = user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '';
      bio.value = user.bio ?? '';
      apiKey.value = user.apiKey ?? '';
      tradeLink.value = user.tradeLink ?? '';
      // 模拟数据 - 实际项目中应从后端获取
      alipayAccount.value = user.alipayAccount ?? '';
      alipayVerified.value = !!user.alipayAccount;
    })
        .catch(() => ElMessage.error('获取用户信息失败'));
    });

    onBeforeUnmount(() => {
  isMounted.value = false;
  if (messageListener.value) {
    window.removeEventListener('message', messageListener.value);
    console.log('移除事件监听器');
  }
});

    return {
        username,
        userId,
        email,
        phone,
        isVerified,
        steamId,
        steamNickname,
        alipayVerified,
        avatarUrl,
        genderLabel,
        birthDate,
        bio,
        avatarImg,
        fileInput,
        loading,
        isMounted,
        apiKey,
        tradeLink,
        openFileDialog,
        handleFileChange,
        handleEditNickname,
        handleChangePhone,
        handleIdentityVerify,
        handleAlipayBind,
        handleChangePassword,
        handleSteamBind,
        handleEditGender,
        gender,
        steamBound,
        editNicknameDialog,
        editGenderDialog,
        editBirthDateDialog,
        editBioDialog,
        tempUsername,
        tempGender,
        tempBirthDate,
        tempBio,
        genderOptions,
        confirmEditNickname,
        confirmEditGender,
        handleEditBirthDate,
        confirmEditBirthDate,
        handleEditBio,
        confirmEditBio,
        emailVerified,
        formattedPhone,
        phoneVerified,
        alipayAccount,
        formattedAlipay,
        handleChangeEmail,
        saveApiKey,
        saveTradeLink
    };
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.section-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.profile-info {
  flex: 1;
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.label {
  width: 100px;
  color: #666;
  font-size: 14px;
}

.value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.security-item:last-child {
  border-bottom: none;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.success-icon {
  color: #4CAF50;
}

.error-icon {
  color: #F56C6C;
}

.action-btn {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.steam-account {
  padding: 10px 0;
}

.steam-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.steam-api {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.input-with-help {
  display: flex;
  align-items: center;
  gap: 10px;
}

.help-icon {
  color: #666;
  cursor: help;
}

.save-small-btn {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 10px;
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

.avatar-input {
  display: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.edit-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #45a049;
}

.security-settings {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.security-item:last-child {
  border-bottom: none;
}

.info-with-btn {
  display: flex;
  align-items: center;
  gap: 10px;
}

.security-item label {
  margin-bottom: 0;
  font-weight: 500;
  color: #333;
}

.security-item span {
  color: #666;
  font-size: 14px;
}
</style>