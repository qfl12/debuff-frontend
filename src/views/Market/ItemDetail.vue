<template>
  <div class="item-detail-container">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="$router.go(-1)">← 返回</button>

    <!-- 商品详情主体 -->
    <div v-if="item" class="item-detail-content">
      <!-- 商品图片区域 -->
      <div class="item-image-section">
        <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.imageUrl}/800x1200?allow_animated=1`" :alt="item.name" class="main-image">
      </div>

      <!-- 商品信息区域 -->
      <div class="item-info-section">
        <template v-if="item">
          <h1 class="item-name">{{ item.name }}</h1>
          <div class="item-meta">
            <span class="item-id">商品ID: {{ item.listingId }}</span>
            <span class="item-status">{{ item.status === 'ON_SALE' ? '在售' : '已售出' }}</span>
            <span class="item-created">上架时间: {{ new Date(item.createdAt).toLocaleString() }}</span>
          </div>

        <div class="item-properties">
          <span class="item-property">磨损度: {{ item.marketName?.match(/\((.*?)\)/)?.[1] || '未知' }}</span>
          <span class="item-property">类型: {{ item.type?.split(' ')?.pop() || '未知' }}</span>
          <span class="item-property">品质: {{ item.type?.split(' ')[0] || '未知' }}</span>
        </div>

        <div class="price-section">
            <p class="current-price">¥{{ item.price }}</p>
            <p class="original-price" v-if="item.originalPrice && item.originalPrice > item.price">¥{{ item.originalPrice }}</p>
          </div>

          <!-- 卖家信息 -->
          <div class="seller-section">
            <h3>卖家信息</h3>
            <div class="seller-info">
              <img :src="`${$imageBaseUrl}${item.sellerAvatarUrl || '/avatars/default-avatar.svg'}`" alt="卖家头像" class="seller-avatar">
              <div class="seller-details">
                <p class="seller-name">{{ item.sellerUsername || '未知卖家' }}</p>
                <!-- <p class="seller-rating">信誉: ★★★★★ ({{ item.sellerRating || 0 }})</p> -->
              </div>
            </div>
          </div>

          <!-- 卖家描述 -->
          <div class="description-section">
            <h3>卖家描述</h3>
            <p class="item-description">{{ item.sellerNote || '无描述信息' }}</p>
          </div>

          <!-- 购买按钮 -->
          <button class="buy-now-btn" :disabled="item.status !== 'ON_SALE' || loading" @click="handleBuyClick">{{ item.status === 'ON_SALE' ? '立即购买' : '已售出' }}</button>

          <!-- 商品描述
          <div class="description-section">
            <h3>商品描述</h3>
            <p class="item-description">{{ item.description || '无描述信息' }}</p>
          </div> -->


        </template>
        <div v-else class="loading-section">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import marketApi from '../../services/marketApi';

export default {
  name: 'ItemDetailView',
  setup() {
    const route = useRoute();
  const authStore = useAuthStore();
    authStore.initAuthState();
  const item = ref(null);
    const loading = ref(true);
    const error = ref(null);

    /**
     * 获取商品详情
     * 通过路由参数id从API获取商品完整信息
     */
    const handleBuyClick = async () => {
      if (!item.value) return;

      try {
        const confirmResult = await ElMessageBox.confirm(
          `您确定要以 ¥${item.value.price} 购买【${item.value.name}】吗？`,
          '购买确认',
          {
            confirmButtonText: '确认购买',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
        );

        if (confirmResult === 'confirm') {
          loading.value = true;
          // 获取当前登录用户ID
          const localStorageUserId = localStorage.getItem('userId');
              const authUser = authStore.user;
              const storeUserId = authUser?.userId || null;
              console.log('localStorage中的userId:', localStorageUserId);
              console.log('authStore中的user对象:', authUser);
              console.log('authStore中的userId:', storeUserId);
              const userId = localStorageUserId || storeUserId;
          console.log('最终获取的userId:', userId);
          if (!userId) {
            ElMessage.error('请先登录');
            return;
          }
          const purchaseParams = { itemId: item.value.id, buyerId: parseInt(userId) };
          console.log('发送购买请求参数:', purchaseParams);
          const response = await marketApi.purchaseItem(purchaseParams);
          ElMessage.success('购买请求已提交，请等待交易完成');
          // 可以在这里跳转到交易确认页面
          route.push({ name: 'TradeConfirmation', params: { orderId: response.data.orderId } });
        }
      } catch (err) {
        if (err === 'cancel') {
          ElMessage.info('已取消购买');
          return;
        }
        ElMessage.error(err.response?.data?.message || '购买失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    const fetchItemDetail = async () => {
      try {
        loading.value = true;
        const listingId = route.params.listingId; // 使用更新后的路由参数名listingId
        const response = await marketApi.getListingById(listingId);
        item.value = response.data;
      } catch (err) {
        console.error('获取商品详情失败:', err);
        error.value = '无法加载商品详情，请稍后重试';
      } finally {
        loading.value = false;
      }
    };

    // 组件挂载时获取商品详情
    onMounted(() => {
      fetchItemDetail();
    });

    return {
      item,
      loading,
      error,
      handleBuyClick
    };
  }
};
</script>

<style scoped>
.item-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.item-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.item-name {
  font-size: 24px;
  color: #1a1a2e;
  margin-bottom: 15px;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.item-properties {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.item-property {
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 4px;
}

.price-section {
  margin-bottom: 30px;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 5px;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.seller-section {
  margin-bottom: 30px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.seller-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-weight: 500;
  margin-bottom: 3px;
}

.seller-rating {
  color: #666;
  font-size: 14px;
}

.description-section {
  margin-bottom: 30px;
}

.item-description {
  line-height: 1.6;
  color: #333;
  font-size: 16px;
  white-space: pre-line;
}

.buy-now-btn {
  width: 100%;
  padding: 15px;
  background-color: #FF6B00;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.buy-now-btn:hover:not(:disabled) {
  background-color: #E05A00;
  transform: translateY(-2px);
}

.buy-now-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 加载状态样式 */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #FF6B00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .item-detail-content {
    grid-template-columns: 1fr;
  }
}
</style>