<template>
  <div class="settings-page">
    <h2>交易记录</h2>
    <div class="filter-controls">
      <select v-model="selectedType" class="filter-select">
        <option value="all">全部类型</option>
        <option value="recharge">充值</option>
        <option value="purchase">购买</option>
        <option value="sale">出售</option>
        <option value="withdraw">提现</option>
      </select>
      <div class="date-range">
        <input type="date" v-model="startDate" class="date-input">
        <span>至</span>
        <input type="date" v-model="endDate" class="date-input">
      </div>
    </div>
    <div class="transactions-list">
      <div v-for="transaction in filteredTransactions" :key="transaction.id" class="transaction-item">
        <div class="transaction-id">{{ transaction.id }}</div>
        <div class="transaction-details">
          <div class="transaction-type" :class="'type-' + transaction.type.toLowerCase()">{{ transaction.type }}</div>
          <div class="transaction-status" :class="'status-' + transaction.status.toLowerCase()">{{ transaction.status }}</div>
        </div>
        <div class="transaction-amount" :class="transaction.amount > 0 ? 'amount-positive' : 'amount-negative'">{{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}¥</div>
        <div class="transaction-date">{{ transaction.date }}</div>
      </div>
      <div v-if="filteredTransactions.length === 0" class="no-transactions">暂无交易记录</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'UserTransactions',
  setup() {
    
    const transactions = ref([]);
    const selectedType = ref('all');
    const startDate = ref('');
    const endDate = ref('');

    onMounted(() => {
      // 模拟交易数据，实际项目中应从API获取
      transactions.value = [
        { id: 'TRA20250701001', type: '充值', amount: 200, date: '2025-07-01', status: '成功' },
        { id: 'TRA20250703002', type: '购买', amount: -89, date: '2025-07-03', status: '成功' },
        { id: 'TRA20250705003', type: '出售', amount: 150, date: '2025-07-05', status: '成功' },
        { id: 'TRA20250708004', type: '提现', amount: -100, date: '2025-07-08', status: '处理中' }
      ];
    });

    const filteredTransactions = computed(() => {
      return transactions.value.filter(transaction => {
        const typeMatch = selectedType.value === 'all' || transaction.type.toLowerCase() === selectedType.value;
        const dateMatch = (!startDate.value || new Date(transaction.date) >= new Date(startDate.value)) &&
                          (!endDate.value || new Date(transaction.date) <= new Date(endDate.value));
        return typeMatch && dateMatch;
      });
    });

    return {
      transactions,
      selectedType,
      startDate,
      endDate,
      filteredTransactions
    };
  }
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-range {
  display: flex;
  gap: 10px;
  align-items: center;
}

.date-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.transaction-item {
  padding: 12px 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 200px 1fr 120px 150px;
  gap: 15px;
  align-items: center;
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: #f9f9f9;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.no-transactions {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.type-recharge {
  color: #28a745;
}

.type-purchase {
  color: #dc3545;
}

.type-sale {
  color: #17a2b8;
}

.type-withdraw {
  color: #ffc107;
}

.amount-positive {
  color: #28a745;
  font-weight: bold;
}

.amount-negative {
  color: #dc3545;
  font-weight: bold;
}

.status-成功 {
  color: #28a745;
}

.status-处理中 {
  color: #ffc107;
}

.status-失败 {
 color: #dc3545;
}

.no-data {
  text-align: center;
  color: #6c757d;
  padding: 30px;
}
</style>