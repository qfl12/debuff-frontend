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
    <div class="transactions-table">
      <table>
        <thead>
          <tr>
            <th>交易ID</th>
            <th>类型</th>
            <th>金额</th>
            <th>日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td :class="'type-' + transaction.type.toLowerCase()">{{ transaction.type }}</td>
            <td :class="transaction.amount > 0 ? 'amount-positive' : 'amount-negative'">{{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}¥</td>
            <td>{{ transaction.date }}</td>
            <td :class="'status-' + transaction.status.toLowerCase()">{{ transaction.status }}</td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="5" class="no-data">暂无交易记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';


export default {
  name: 'TransactionHistory',
  setup() {
    // const authStore = useAuthStore();
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
  justify-content: space-between;
  margin-bottom: 20px;
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

transactions-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
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