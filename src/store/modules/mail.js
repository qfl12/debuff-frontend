import { defineStore } from 'pinia';

export const useMailStore = defineStore('mail', {
  state: () => ({
    allMails: [
      // Sample data
      {
        id: 1,
        sender: 'system@debuff.com',
        subject: '账户验证通知',
        preview: '请点击链接完成账户验证...',
        date: '2025-07-10T10:30:00'
      },
      {
        id: 2,
        sender: 'support@debuff.com',
        subject: '订单更新提醒',
        preview: '您的订单 #12345 已发货...',
        date: '2025-07-09T15:45:00'
      }
    ]
  }),
  getters: {
    // Getters can be added here
  },
  actions: {
    // Actions can be added here
  }
});