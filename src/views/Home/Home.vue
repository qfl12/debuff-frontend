<template>
  <div class="home-container">
    <!-- 首页横幅区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1>卖枪皮急出？来Debuff秒速变现！</h1>
        <p>我知道你为了什么而来</p>
      </div>
      <div class="hero-images">
        <!-- 示例图片，实际项目中替换为真实图片路径 -->
        <img src="../../assets/weapon1.svg" alt="武器皮肤展示" class="weapon-img img1">
        <img src="../../assets/weapon2.svg" alt="武器皮肤展示" class="weapon-img img2">
        <img src="../../assets/weapon3.svg" alt="武器皮肤展示" class="weapon-img img3">
        <img src="../../assets/weapon4.svg" alt="武器皮肤展示" class="weapon-img img4">
      </div>
    </section>

    <!-- 热门饰品区域 -->
    <section class="popular-items">
      <div class="section-header">
        <h2>热门饰品</h2>
        <a href="/marketplace" class="view-all">进入市场 <span>→</span></a>
      </div>
      <div class="items-grid">
        <!-- 动态渲染随机上架饰品 -->
        <div v-for="item in randomListings" :key="item.listingId" class="item-card">
          <router-link :to="`/market/item/${item.listingId}`">
            <div class="item-tag" v-if="item.marketName?.match(/\((.*?)\)/)?.[1]" :style="{ backgroundColor: getConditionColor(item.marketName?.match(/\((.*?)\)/)?.[1]) }">{{ item.marketName.match(/\((.*?)\)/)[1] }}</div>
            <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.imageUrl}/400x600?allow_animated=1`" :alt="item.name" class="item-image">
          </router-link>
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-description">{{ truncateText(item.sellerNote || '无描述信息', 10) }}</p>
            <div class="price-section">
              <p class="price">¥{{ item.price }}</p>
              <button class="buy-btn" @click="goToItemDetail(item.listingId)">购买</button>
            </div>
            <p class="seller-info">卖家: {{ item.sellerUsername || '未知卖家' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import marketApi from '../../services/marketApi';

export default {
  name: 'HomeView',
  setup() {
    // 随机上架饰品列表
    const randomListings = ref([]);

    /**
     * 获取随机上架的饰品
     * @param {number} limit 获取数量
     */
    const fetchRandomListings = async (limit = 8) => {
      try {
        const response = await marketApi.getRandomOnSaleListings(limit);
        randomListings.value = response.data;
      } catch (error) {
        console.error('获取随机上架饰品失败:', error);
      }
    };

    /**
 * 根据物品状态获取对应的背景颜色
 * @param {string} condition - 物品状态（崭新出厂、略有磨损等）
 * @returns {string} 对应的背景颜色值
 */
const router = useRouter();

/**
 * 跳转到商品详情页面
 * @param {number} listingId - 商品 listing ID
 */
const goToItemDetail = (listingId) => {
  router.push(`/market/item/${listingId}`);
};

const getConditionColor = (condition) => {
  const colors = {
    '崭新出厂': '#86B5E5',
    '略有磨损': '#A0C3E8',
    '久经沙场': '#C7D5E0',
    '战痕累累': '#D9C9B0',
    '破损不堪': '#B8A693'
  };
  return colors[condition] || '#CCCCCC';
};

    // 组件挂载时获取随机上架饰品
    onMounted(() => {
      fetchRandomListings();
    });

    /**
     * 截断文本并添加省略号
     * @param {string} text - 原始文本
     * @param {number} length - 最大显示长度
     * @returns {string} 截断后的文本
     */
    const truncateText = (text, length) => {
      if (!text) return '';
      return text.length > length ? text.slice(0, length) + '...' : text;
    };

    return {
      randomListings,
      truncateText,
      getConditionColor
    };
  }
}
</script>

<style scoped>
/* 首页容器样式 */
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 横幅区域样式 */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  margin-bottom: 40px;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  padding: 0 40px;
  color: white;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ffffff;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.primary-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-btn:hover {
  background-color: #45a049;
}

.hero-images {
  flex: 1;
  position: relative;
  height: 300px;
}

.weapon-img {
  position: absolute;
  width: 220px;
  height: auto;
  transition: transform 0.3s ease;
}

.weapon-img:hover {
  transform: scale(1.05);
}

.img1 { top: 20px; left: 50px; transform: rotate(-15deg); }
.img2 { top: 50px; left: 180px; transform: rotate(5deg); }
.img3 { bottom: 20px; left: 80px; transform: rotate(-8deg); }
.img4 { bottom: 50px; left: 250px; transform: rotate(12deg); }

/* 热门饰品区域样式 */
.popular-items {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 28px;
  color: #1a1a2e;
}

.item-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  z-index: 1;
}

.view-all {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 两列网格布局 */
.items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.item-card {
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.item-card:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f5f5f5;
}

.item-info {
  padding: 2px;
}

.item-info h3 {
  font-size: 14px;
  margin-bottom: 3px;
  color: #333;
  line-height: 1.3;
}

.item-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
  height: 18px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
  line-height: 1.5;
}

.buy-btn {
  padding: 4px 10px;
  background-color: #FF6B00;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.5;
}
.buy-btn:hover {
  background-color: #E05A00;
  transform: scale(1.05);
}

.buy-btn:hover {
  background-color: #E05A00;
}

.seller-info {
  font-size: 10px;
  color: #999;
  margin-top: 3px;
  text-align: left;
  line-height: 1.3;
}
</style>