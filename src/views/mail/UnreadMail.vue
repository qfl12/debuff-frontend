<template>
  <div class="mail-container">
    <h2>未读邮件</h2>
    <div class="mail-list">
      <div class="mail-item unread" v-for="mail in mails" :key="mail.id">
        <div class="mail-sender">{{ mail.sender }}</div>
        <div class="mail-subject">{{ mail.subject }}</div>
        <div class="mail-date">{{ mail.date }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'UnreadMail',
  setup() {
    const mails = ref([]);

    onMounted(() => {
      // 模拟未读邮件数据
      mails.value = [
        { id: 3, sender: '系统通知', subject: '新功能上线通知', date: '2025-07-11' },
        { id: 4, sender: '交易市场', subject: '您的物品已售出', date: '2025-07-11' }
      ];
    });

    return { mails };
  }
};
</script>

<style scoped>
.mail-container {
  padding: 20px;
}

.mail-list {
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.mail-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mail-item.unread {
  background-color: #f8f9fa;
  font-weight: bold;
}

.mail-item:last-child {
  border-bottom: none;
}

.mail-sender {
  font-weight: 500;
  width: 150px;
}

.mail-subject {
  flex: 1;
  margin: 0 20px;
}

.mail-date {
  color: #666;
  font-size: 14px;
}
</style>