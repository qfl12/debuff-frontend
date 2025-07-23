<template>
  <div class="form-actions">
    <el-button type="primary" @click="handleSubmit">保存修改</el-button>
    <el-button @click="handleReset">重置</el-button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['submit', 'reset']);

const handleSubmit = () => {
  emit('submit');
};

const handleReset = () => {
  emit('reset');
};
</script>

<style scoped>
.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>