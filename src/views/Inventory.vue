<template>
  <div class="page-container">
    <h1>我的库存</h1>
    <div class="placeholder-content">
      <p>登录后可查看您的饰品库存</p>
      <div class="empty-state">
        <img src="../assets/empty-box.svg" alt="空库存" class="empty-icon">
        <p>您的库存目前为空</p>
        <button class="primary-btn">去市场购买</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryView'
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.placeholder-content {
  text-align: center;
  padding: 40px 0;
}

.empty-state {
  margin-top: 40px;
  color: #666;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.primary-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>