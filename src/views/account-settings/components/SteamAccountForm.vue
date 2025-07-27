<template>
  <el-card class="settings-card" style="margin-top: 20px;">
    <template #header>
      <div class="card-header">
        <h3>Steam账号绑定</h3>
      </div>
    </template>
    <el-form-item label="Steam ID" prop="steamId">
      <el-input :modelValue="steamId" @update:modelValue="emit('update:steamId', $event)" placeholder="请输入Steam ID"></el-input>
    </el-form-item>
    <el-form-item label="API密钥" prop="apiKey">
      <el-input :modelValue="apiKey" @update:modelValue="emit('update:apiKey', $event)" placeholder="请输入Steam API密钥"></el-input>
    </el-form-item>
    <el-form-item label="交易链接" prop="tradeLink">
      <el-input :modelValue="tradeLink" @update:modelValue="emit('update:tradeLink', $event)" placeholder="请输入Steam交易链接"></el-input>
    </el-form-item>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  steamId: String,
  apiKey: String,
  tradeLink: String
});

const emit = defineEmits(['update:steamId', 'update:apiKey', 'update:tradeLink']); // eslint-disable-line no-unused-vars
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