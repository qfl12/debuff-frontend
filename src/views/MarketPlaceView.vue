<template>
  <div class="marketplace-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-form">
        <el-input
          v-model="searchParams.keyword"
          placeholder="输入商品名称或描述"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearch"></el-button>
          </template>
        </el-input>

        <el-select v-model="searchParams.weaponType" placeholder="武器类型" class="filter-select">
  <el-option label="所有类型" value=""></el-option>
  <el-option label="匕首" value="匕首"></el-option>
  <el-option label="手套" value="手套"></el-option>
  <el-option label="步枪" value="步枪"></el-option>
  <el-option label="手枪" value="手枪"></el-option>
  <el-option label="微型冲锋枪" value="微型冲锋枪"></el-option>
  <el-option label="霰弹枪" value="霰弹枪"></el-option>
  <el-option label="机枪" value="机枪"></el-option>
  <el-option label="印花" value="印花"></el-option>
  <el-option label="探员" value="探员"></el-option>
  <el-option label="其他" value="其他"></el-option>
</el-select>

        <el-select v-model="searchParams.rarity" placeholder="品质" class="filter-select">
  <el-option label="所有品质" value=""></el-option>
  <el-option label="消费级" value="消费级"></el-option>
  <el-option label="工业级" value="工业级"></el-option>
  <el-option label="军规级" value="军规级"></el-option>
  <el-option label="受限" value="受限"></el-option>
  <el-option label="保密" value="保密"></el-option>
  <el-option label="隐秘" value="隐秘"></el-option>
  <el-option label="违禁" value="违禁"></el-option>
  <el-option label="非凡" value="非凡"></el-option>
  <el-option label="卓越" value="卓越"></el-option>
  <el-option label="奇异" value="奇异"></el-option>
  <el-option label="高级" value="高级"></el-option>
  <el-option label="普通级" value="普通级"></el-option>
  <el-option label="探员品质" value="探员品质"></el-option>
</el-select>

        <el-select v-model="searchParams.category" placeholder="类别" class="filter-select">
  <el-option label="所有类别" value=""></el-option>
  <el-option label="普通级" value="普通级"></el-option>
  <el-option label="纪念品" value="纪念品"></el-option>
  <el-option label="StatTrak™" value="StatTrak™"></el-option>
  <el-option label="★ StatTrak™" value="★ StatTrak™"></el-option>
</el-select>

        <el-select v-model="searchParams.exterior" placeholder="外观" class="filter-select">
  <el-option label="所有外观" value=""></el-option>
  <el-option label="崭新出厂" value="崭新出厂"></el-option>
  <el-option label="略有磨损" value="略有磨损"></el-option>
  <el-option label="久经沙场" value="久经沙场"></el-option>
  <el-option label="破损不堪" value="破损不堪"></el-option>
  <el-option label="战痕累累" value="战痕累累"></el-option>
  <el-option label="无涂装" value="无涂装"></el-option>
</el-select>
      </div>
    </div>

    <!-- 商品列表区域 -->
    <div class="list-section">
      <div v-if="loading" class="loading-container">
        <el-spinner size="large"></el-spinner>
        <p>加载中...</p>
      </div>

      <div v-else-if="listings.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon size="60"><SearchNotFound /></el-icon>
        </div>
        <h3>未找到匹配商品</h3>
        <p>尝试调整筛选条件或搜索关键词</p>
        <el-button @click="resetFilters">重置筛选条件</el-button>
      </div>

      <div class="items-grid">
        <div class="item-card" v-for="item in paginatedItems" :key="item.listingId">
          <router-link :to="`/market/item/${item.listingId}`">
            <div class="item-image">
              <div class="item-tag" v-if="item.marketName?.match(/\((.*?)\)/)?.[1]" :style="{ backgroundColor: getConditionColor(item.marketName?.match(/\((.*?)\)/)?.[1]) }">{{ item.marketName.match(/\((.*?)\)/)[1] }}</div>
              <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.imageUrl}/400x600?allow_animated=1`" :alt="item.name" @error="handleImageError($event)">
            </div>
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-description">{{ item.sellerNote.length > 10 ? item.sellerNote.slice(0, 10) + '...' : item.sellerNote }}</p>
              <div class="price-section">
        <span class="price">{{ item.price }} 元</span>
        <el-button type="primary" size="small" class="buy-btn">购买</el-button>
      </div>
              <p class="seller-info">卖家: {{ item.sellerUsername || '未知卖家' }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <el-pagination
  class="pagination-section"
  v-if="listings.length > 0"
  :current-page="currentPage"
  :page-size="pageSize"
  :page-sizes="pageSizes"
  :total="listings.length"
  @size-change="handlePageSizeChange"
  @current-change="(page) => currentPage = page"
  layout="sizes, prev, pager, next, jumper"
></el-pagination>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { ElInput, ElButton, ElSelect, ElOption, ElSpinner, ElIcon, ElMessage } from 'element-plus';
import { SearchNotFound } from '@element-plus/icons-vue';
import axios from 'axios';
import { useRoute } from 'vue-router';


// 搜索参数
const searchParams = reactive({
  keyword: '',
weaponType: '',
rarity: '',
category: '',
exterior: ''
});

// 分页参数 - 前端分页实现
const currentPage = ref(1);
const pageSize = ref(8);
const pageSizes = ref([8, 16, 24, 32]);

// 商品列表数据
const listings = ref([]);
// 加载状态
const loading = ref(false);
// 总记录数
// 计算总页数
const filteredListings = computed(() => {
  return listings.value.filter(item => {
    // 武器类型筛选
    if (searchParams.weaponType && item.type?.split(' ')?.pop() !== searchParams.weaponType) {
      return false;
    }
    // 品质筛选
    if (searchParams.rarity && item.type?.split(' ')[0] !== searchParams.rarity) {
      return false;
    }
    // 类别筛选
    if (searchParams.category && item.type?.split(' ')[0] !== searchParams.category) {
      return false;
    }
    // 外观筛选
    if (searchParams.exterior && item.marketName?.match(/\((.*?)\)/)?.[1] !== searchParams.exterior) {
      return false;
    }
    return true;
  });
});

// const totalPages = computed(() => {
//   return Math.ceil(filteredListings.value.length / pageSize.value);
// });
// 前端分页处理
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredListings.value.slice(startIndex, startIndex + pageSize.value);
});
// 路由对象
const route = useRoute();

/**
 * 处理图片加载失败
 * @param {Event} e - 错误事件对象
 */
const handleImageError = (e) => {
  // 防止默认图片加载失败导致无限循环
  if (!e.target.src.includes('default-item.png')) {
    e.target.src = '/images/default-item.png';
  }
};

/**
 * 处理搜索请求
 */
const handleSearch = () => {
  // 重置到第一页
  currentPage.value = 1;
  // 执行搜索
  fetchListings();
};

/**
 * 重置筛选条件
 */
const resetFilters = () => {
  // 清空所有搜索参数
  Object.keys(searchParams).forEach(key => {
    searchParams[key] = '';
  });
  // 重置到第一页
  currentPage.value = 1;
  // 重新获取列表
  fetchListings();
};

/**
 * 处理分页大小变化
 * @param {number} size - 新的每页大小
 */
/**
 * 处理分页大小变更
 */
/**
 * 处理分页大小变更
 * 当用户选择不同的每页显示数量时触发
 * 重置到第一页以确保分页数据正确
 */
/**
 * 根据物品状态获取对应的背景颜色
 * @param {string} condition - 物品状态（崭新出厂、略有磨损等）
 * @returns {string} 对应的背景颜色值
 */
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

const handlePageSizeChange = () => {
  currentPage.value = 1; // 重置到第一页
};



/**
 * 从后端获取商品列表
 */
const fetchListings = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = {
  keyword: searchParams.keyword
};

    // 调用后端API
    const response = await axios.get('/api/market/listings/search', { params });
    const result = response.data;

    // 更新列表数据
    listings.value = result.records;
    // 更新总记录数
    

    console.log('商品列表加载完成，共', result.total, '条记录');
  } catch (error) {
    console.error('加载商品列表失败:', error);
    ElMessage.error('加载商品列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 监听列表数据变化，重置分页
watch(listings, () => {
  currentPage.value = 1;
});

// 监听筛选条件变化，重置到第一页
watch(searchParams, () => {
  currentPage.value = 1;
}, { deep: true });

// 页面加载时获取商品列表
onMounted(() => {
  // 从URL参数中获取搜索条件（如果有）
  const query = route.query;
  if (Object.keys(query).length > 0) {
    Object.assign(searchParams, query);
    if (query.page) currentPage.value = Number(query.page);
    if (query.size) pageSize.value = Number(query.size);
  }
  fetchListings();
});

</script>

<style scoped>
.marketplace-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
}

.search-form {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  width: 160px;
}

.list-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  min-height: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #606266;
}

.empty-icon {
  margin-bottom: 16px;
  color: #c0c4cc;
}

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
}

.item-card:hover {
  transform: translateY(-5px) scale(1.05);
}

.item-card a {
  text-decoration: none;
}

.item-image {
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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

.item-image img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  transform: none !important;
}

.item-image img {
  max-width: 100%;
  max-height: 140px;
  object-fit: contain;
}

.item-info {
  padding: 2px;
}

.item-name {
  font-size: 14px;
  margin-bottom: 3px;
  color: #333;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.seller-info {
  font-size: 10px;
  color: #999;
  margin-top: 3px;
  text-align: left;
  line-height: 1.3;
}

.price-tag {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.item-seller-note {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.note-text {
  margin-left: 4px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.page-size-selector span {
  margin-right: 8px;
  color: #606266;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #606266;
}

.page-navigation {
  display: flex;
  align-items: center;
}

.page-btn {
  padding: 8px 16px;
  margin: 0 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #606266;
  cursor: pointer;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  margin: 0 12px;
  color: #606266;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>