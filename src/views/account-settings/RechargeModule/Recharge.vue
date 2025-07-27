<template>
  <div class="recharge-page">
    <h2>支付宝充值</h2>
    <div class="recharge-form">
      <div class="form-group">
        <label>充值金额 (¥)</label>
        <input type="number" v-model="amount" min="1" step="0.01" class="amount-input" placeholder="请输入充值金额">
      </div>
      <div class="amount-options">
        <button v-for="option in amountOptions" :key="option" @click="selectAmount(option)">{{ option }}¥</button>
      </div>
      <button @click="handleRecharge" class="recharge-btn">确认充值</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserInfo } from '@/utils/api';
import { ElMessage } from 'element-plus';




import { requestAlipayPayment } from '@/utils/api';

export default {
  name: 'AccountRecharge',
  setup() {

    const amount = ref('');
    const amountOptions = [100, 200, 500, 1000, 2000];
    const userId = ref(null);

    onMounted(() => {
      getUserInfo()
        .then(({ data }) => {
          userId.value = data.id;
        })
        .catch(() => ElMessage.error('获取用户信息失败'));
    });

    const selectAmount = (option) => {
      amount.value = option;
    };

    const handleRecharge = async () => {
      if (!amount.value || amount.value <= 0) {
        alert('请输入有效的充值金额');
        return;
      }

      try {
        const response = await requestAlipayPayment({
          userId: userId.value,
          amount: amount.value,
          type: 'recharge'
        });
        // 调用支付宝支付接口
        window.location.href = response.payUrl;
      } catch (error) {
        console.error('充值失败:', error);
        alert('充值请求失败，请稍后重试');
      }
    };

    return {
      amount,
      amountOptions,
      selectAmount,
      handleRecharge
    };
  }
};
</script>

<style scoped>
.recharge-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.recharge-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.amount-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.amount-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.amount-options button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-options button:hover,
.amount-options button.active {
  border-color: #409eff;
  background-color: #f0f7ff;
  color: #409eff;
}

.recharge-btn {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recharge-btn:hover {
  background-color: #337ecc;
}
</style>