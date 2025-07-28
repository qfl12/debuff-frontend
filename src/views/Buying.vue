<template>
  <div class="page-container">
    <h1>我的求购</h1>
    <div class="placeholder-content">
      <p>登录后可管理您的求购订单</p>
      <div class="empty-state">
        <img src="../assets/buying-icon.svg" alt="求购中" class="empty-icon">
        <p>您当前没有活跃的求购订单</p>
        <button class="primary-btn">去市场求购</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuyingView'
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