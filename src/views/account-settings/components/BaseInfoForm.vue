<template>
  <el-card class="settings-card">
    <template #header>
      <div class="card-header">
        <h3>基础信息</h3>
      </div>
    </template>
    <el-form-item label="用户名" prop="username">
      <el-input :modelValue="username" @update:modelValue="emit('update:username', $event)" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input :modelValue="email" @update:modelValue="emit('update:email', $event)" type="email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input :modelValue="phone" @update:modelValue="emit('update:phone', $event)" placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group :modelValue="gender" @update:modelValue="emit('update:gender', $event)">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
        <el-radio label="其他"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="出生日期">
      <el-date-picker
          :modelValue="birthDate" @update:modelValue="emit('update:birthDate', $event)"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
    </el-form-item>
    <el-form-item label="个人简介">
      <el-input :modelValue="bio" @update:modelValue="emit('update:bio', $event)" type="textarea" rows="4" placeholder="请输入个人简介"></el-input>
    </el-form-item>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

  defineProps({
  username: String,
  email: String,
  phone: String,
  gender: String,
  birthDate: String,
  bio: String
});

defineEmits(['update:username', 'update:email', 'update:phone', 'update:gender', 'update:birthDate', 'update:bio']);
</script>

<style scoped>
.settings-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  font-weight: 500;
  font-size: 16px;
}
</style>