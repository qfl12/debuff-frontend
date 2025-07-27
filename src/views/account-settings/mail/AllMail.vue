<template>
  <div class="mail-list-container">
    <h2>全部邮件</h2>
    <div class="mail-filters">
      <input type="text" placeholder="搜索邮件..." class="search-input" v-model="searchQuery">
      <select class="filter-select" v-model="sortOrder">
        <option value="newest">最新优先</option>
        <option value="oldest">最早优先</option>
      </select>
    </div>
    <div class="mail-list">
      <div v-for="mail in filteredMails" :key="mail.id" class="mail-item">
        <div class="mail-sender">{{ mail.sender }}</div>
        <div class="mail-subject">{{ mail.subject }}</div>
        <div class="mail-preview">{{ mail.preview }}</div>
        <div class="mail-date">{{ formatDate(mail.date) }}</div>
      </div>
      <div v-if="filteredMails.length === 0" class="no-mails">暂无邮件</div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useMailStore } from '../../../store';
import { formatDate } from '../../../utils/date-utils';

export default {
  name: 'AllMail',
  setup() {
    const mailStore = useMailStore();
    const searchQuery = ref('');
    const sortOrder = ref('newest');

    // 获取所有邮件并排序
    const filteredMails = computed(() => {
      let mails = [...mailStore.allMails];

      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        mails = mails.filter(mail => 
          mail.sender.toLowerCase().includes(query) || 
          mail.subject.toLowerCase().includes(query) || 
          mail.preview.toLowerCase().includes(query)
        );
      }

      // 排序
      mails.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
      });

      return mails;
    });

    return {
      searchQuery,
      sortOrder,
      filteredMails,
      formatDate
    };
  }
};
</script>

<style scoped>
.mail-list-container {
  padding: 20px;
}

.mail-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.mail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mail-item {
  padding: 12px 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  gap: 15px;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mail-item:hover {
  background-color: #f9f9f9;
}

.mail-sender {
  font-weight: 500;
}

.mail-preview {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-mails {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 6px;
}
</style>