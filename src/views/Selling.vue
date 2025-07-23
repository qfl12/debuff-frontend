<template>
  <div class="page-container">
    <h1>我的出售</h1>
    <div class="placeholder-content">
      <p>登录后可管理您正在出售的饰品</p>
      <div class="empty-state">
        <img src="../assets/selling-icon.svg" alt="出售中" class="empty-icon">
        <p>您当前没有正在出售的饰品</p>
        <button class="primary-btn">去库存上架</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellingView'
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