<template>
  <div class="basic-settings-container">
    <h2>基本设置</h2>
    <div class="settings-section">
      <div class="setting-item">
        <label>账号安全</label>
        <div class="status-item">
          <span class="status-text">密码修改</span>
          <button class="edit-btn">修改</button>
        </div>
      </div>
      <div class="setting-item">
        <label>通知设置</label>
        <div class="status-item">
          <span class="status-text">邮件通知已开启</span>
          <button class="edit-btn">编辑</button>
        </div>
      </div>
      <div class="setting-item">
        <label>隐私设置</label>
        <div class="status-item">
          <span class="status-text">个人资料公开</span>
          <button class="edit-btn">编辑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicSettings'
};
</script>

<style scoped>
.basic-settings-container {
  padding: 20px;
}

.settings-section {
  margin-top: 20px;
}

.setting-item {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-text {
  color: #666;
}

.edit-btn {
  padding: 8px 15px;
  border: 1px solid #4CAF50;
  background-color: white;
  color: #4CAF50;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #f5f5f5;
}
</style>