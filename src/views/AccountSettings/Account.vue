<template>
  <div class="account-settings">
    <h2 class="page-title">账号设置</h2>
    <el-form ref="accountForm" :model="userInfo" :rules="rules" label-width="120px" class="settings-form">
      <!-- 基础信息区域 -->
      <el-card class="settings-card">
        <template #header><div class="card-header">
          <h3>基础信息</h3>
        </div></template>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email" type="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userInfo.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="其他"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="userInfo.birthDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="userInfo.bio" type="textarea" rows="4" placeholder="请输入个人简介"></el-input>
        </el-form-item>
      </el-card>

      <!-- Steam账号绑定区域 -->
      <el-card class="settings-card" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <h3>Steam账号绑定</h3>
          </div>
        </template>
        <el-form-item label="Steam ID" prop="steamId">
          <el-input v-model="userInfo.steamId" placeholder="请输入Steam ID"></el-input>
        </el-form-item>
        <el-form-item label="API密钥" prop="apiKey">
          <el-input v-model="userInfo.apiKey" placeholder="请输入Steam API密钥"></el-input>
        </el-form-item>
        <el-form-item label="交易链接" prop="tradeLink">
          <el-input v-model="userInfo.tradeLink" placeholder="请输入Steam交易链接"></el-input>
        </el-form-item>
      </el-card>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submitForm">保存修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

import { getUserInfo, updateUserInfo } from '../../utils/api'; // 假设已存在API模块

export default {
  name: 'AccountSettings',
  setup() {
    const accountForm = ref(null);
    const userInfo = reactive({
      username: '',
      email: '',
      phone: '',
      gender: '',
      birthDate: '',
      bio: '',
      steamId: '',
      apiKey: '',
      tradeLink: ''
    });

    // 表单验证规则
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      steamId: [
        { pattern: /^\d+$/, message: 'Steam ID必须为数字', trigger: 'blur' }
      ]
    };

    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        Object.assign(userInfo, response.data);
      } catch (error) {
        ElMessage.error('获取用户信息失败');
        console.error(error);
      }
    };

    // 提交表单
    const submitForm = async () => {
      accountForm.value.validate(async (valid) => {
        if (valid) {
          try {
            await updateUserInfo(userInfo);
            ElMessage.success('账号信息更新成功');
          } catch (error) {
            ElMessage.error({ message: '更新失败，请稍后重试', duration: 2000 });
            console.error(error);
          }
        } else {
          ElMessage.error({ message: '表单验证失败，请检查输入', duration: 2000 });
          return false;
        }
      });
    };

    // 重置表单
    const resetForm = () => {
      accountForm.value.resetFields();
    };

    onMounted(() => {
      fetchUserInfo();
    });

    return {
      userInfo,
      rules,
      accountForm,
      submitForm,
      resetForm
    };
  }
};
</script>

<style scoped>
.account-settings {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.settings-form {
  max-width: 800px;
}

.settings-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
:deep(.el-message--error .el-icon-error) {
  font-size: 16px !important;
}

</style>