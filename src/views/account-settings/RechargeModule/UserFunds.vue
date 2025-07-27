<template>
  <div class="settings-page">
    <h2>资金管理</h2>
    <div class="funds-section">
      <div class="balance-card">
        <h3>当前余额</h3>
        <p class="balance-amount">¥{{ user?.balance || '0' }}</p>
        <button class="recharge-btn">充值</button>
      </div>
      <div class="transaction-history">
        <h3>最近交易</h3>
        <div class="transaction-list" v-if="transactions?.length > 0">
          <div class="transaction-item" v-for="transaction in transactions" :key="transaction.id">
            <div class="transaction-info">
              <span class="transaction-type">{{ transaction.type }}</span>
              <span class="transaction-date">{{ transaction.date }}</span>
            </div>
            <span class="transaction-amount">{{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}¥</span>
          </div>
        </div>
        <div class="no-transactions" v-else>
          暂无交易记录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserInfo } from '../../../utils/api';
import { ElMessage } from 'element-plus';

export default {
  name: 'UserFunds',
  setup() {
    const user = ref(null);
    const transactions = ref([]);

    onMounted(() => {
  getUserInfo()
    .then(({ data }) => {
      user.value = data.user;
      transactions.value = data.transactions;
    })
    .catch(() => ElMessage.error('获取资金信息失败'));
});

    return {
      user,
      transactions
    };
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

.funds-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.balance-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: #4CAF50;
  margin: 10px 0;
}

.recharge-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.recharge-btn:hover {
  background-color: #45a049;
}

transaction-history {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

transaction-list {
  margin-top: 15px;
}

transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

transaction-item:last-child {
  border-bottom: none;
}

transaction-type {
  font-weight: bold;
  margin-right: 10px;
}

transaction-date {
  color: #999;
  font-size: 12px;
}

transaction-amount {
  font-weight: bold;
}

transaction-amount[data-positive] {
  color: #4CAF50;
}

.no-transactions {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>