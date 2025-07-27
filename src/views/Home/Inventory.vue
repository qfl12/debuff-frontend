<template>
<!-- 上架商品模态框 -->
  <el-dialog v-model="isListingDialogVisible" title="上架商品" width="500px">
    <!-- 添加 ref 绑定 -->
    <el-form ref="listingFormRef" :model="listingForm" :rules="listingRules" label-width="100px" >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="listingForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="挂牌价格(元)" prop="price">
        <!-- 修改 v-model 绑定方式 -->
        <el-input v-model.number="listingForm.price" type="number" placeholder="请输入价格" step="0.01"></el-input>
      </el-form-item>
      <el-form-item label="卖家备注" prop="sellerNote">
        <el-input v-model="listingForm.sellerNote" type="textarea" :rows="3" placeholder="选填备注信息"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeListingDialog">取消</el-button>
      <el-button type="primary" @click="handleListingSubmit" :loading="listingLoading">
        确认上架
      </el-button>
    </template>
  </el-dialog>

  <div class="page-container">
    <h1>我的库存 <span class="inventory-count">({{ inventoryItems.length }}件)</span> <button class="sync-inventory-btn" @click="syncInventory">同步库存</button></h1>
    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
      <p>正在加载库存数据...</p>
    </div>
    <div v-else-if="errorMsg" class="error-message">{{ errorMsg }}</div>
    <div v-else>
      <div class="inventory-filters">
  <input type="text" v-model="searchQuery" placeholder="搜索物品..." class="search-input">
  
  <!-- 武器类型筛选 -->
  <select v-model="selectedWeaponType" class="filter-select">
    <option value="">所有类型</option>
    <option value="匕首">匕首</option>
    <option value="手套">手套</option>
    <option value="步枪">步枪</option>
    <option value="手枪">手枪</option>
    <option value="微型冲锋枪">微型冲锋枪</option>
    <option value="霰弹枪">霰弹枪</option>
    <option value="机枪">机枪</option>
    <option value="印花">印花</option>
    <option value="探员">探员</option>
    <option value="其他">其他</option>
  </select>
  
  <!-- 品质筛选 -->
  <select v-model="selectedRarity" class="filter-select">
    <option value="">所有品质</option>
    <option value="消费级">消费级</option>
    <option value="工业级">工业级</option>
    <option value="军规级">军规级</option>
    <option value="受限">受限</option>
    <option value="保密">保密</option>
    <option value="隐秘">隐秘</option>
    <option value="违禁">违禁</option>
    <option value="非凡">非凡</option>
    <option value="卓越">卓越</option>
    <option value="奇异">奇异</option>
    <option value="高级">高级</option>
    <option value="普通级">普通级</option>
    <option value="探员品质">探员品质</option>
  </select>
  
  <!-- 类别筛选 -->
  <select v-model="selectedCategory" class="filter-select">
    <option value="">所有类别</option>
    <option value="普通级">普通</option>
    <option value="纪念品">纪念品</option>
    <option value="StatTrak™">StatTrak™</option>
    <option value="★ StatTrak™">★ StatTrak™</option>
  </select>
  
  <!-- 外观筛选 -->
  <select v-model="selectedExterior" class="filter-select">
    <option value="">所有外观</option>
    <option value="崭新出厂">崭新出厂</option>
    <option value="略有磨损">略有磨损</option>
    <option value="久经沙场">久经沙场</option>
    <option value="破损不堪">破损不堪</option>
    <option value="战痕累累">战痕累累</option>
    <option value="无涂装">无涂装</option>
  </select>
  
  <!-- 显示状态筛选 -->
  <select v-model="selectedStatus" class="filter-select">
    <option value="">显示全部</option>
    <option value="可交易">显示可交易</option>
    <option value="可出售">显示可出售</option>
  </select>
</div>
    </div>
    <div v-if="!isSteamBound" class="bind-steam-prompt">
      <div class="bind-icon">
        <img src="../../assets/steam-icon.svg" alt="Steam绑定">
      </div>
      <p>检测到您还未绑定Steam，继续操作前请先完成Steam账号绑定</p>
      <router-link to="/account-settings/profile" class="bind-btn">前往绑定</router-link>
    </div>
    <div v-else>
      <div v-if="filteredItems.length > 0" class="inventory-grid">
        <div class="item-card" v-for="item in paginatedItems" :key="item.id" @mouseenter="adjustDetailPosition">
          <!-- 仅显示指定的五种磨损状态 -->
          <!-- 仅显示指定的五种磨损状态 -->
          <div v-if="['崭新出厂', '略有磨损', '久经沙场', '破损不堪', '战痕累累'].includes(item.marketName?.match(/\((.*?)\)/)?.[1])" class="item-condition-badge" :style="{ backgroundColor: getConditionColor(item.marketName?.match(/\((.*?)\)/)?.[1]) }">{{ item.marketName?.match(/\((.*?)\)/)?.[1] }}</div>
          <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.imageUrl}/330x192?allow_animated=1`" :alt="item.name" class="item-image">
          <div class="item-info">
            <h3 class="item-name">{{ item.name?.split('(')[0]?.trim() || '未知物品' }}</h3>
            <p class="item-type">{{ item.type }}</p>
            <div class="item-meta">
              <!-- 显示item.type的前两个字作为类型标签 -->
              <span class="item-rarity" :style="{ backgroundColor: getRarityColor(item.rarity) }">{{ item.type?.substring(0, 2) || '普通' }}</span>
              <el-button link class="item-price" :disabled="item.tradable !== 1 || item.hasListing" @click="openListingDialog(item)">
                {{ item.hasListing ? '已上架' : (item.tradable === 1 ? '上架' : '不可交易') }}
              </el-button>
            </div>
          </div>
          <!-- 新增悬停详情面板 -->
          <div class="item-detail">
            <div class="detail-image-container">
              <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.imageUrl}/330x192?allow_animated=1`" :alt="item.name" class="detail-image">
            </div>
            <div class="detail-info">
              <h2 class="detail-name">{{ item.name }}</h2>
              <!-- 仅显示指定的五种磨损状态 -->
              <p v-if="['崭新出厂', '略有磨损', '久经沙场', '破损不堪', '战痕累累'].includes(item.marketName?.match(/\((.*?)\)/)?.[1])" class="detail-condition">获取磨损: {{ item.marketName?.match(/\((.*?)\)/)?.[1] }}</p>
              <div v-if="['崭新出厂', '略有磨损', '久经沙场', '破损不堪', '战痕累累'].includes(item.marketName?.match(/\((.*?)\)/)?.[1])" class="detail-divider"></div>
              <div class="detail-properties">
                <p><strong>属性描述</strong></p>
                <p>{{ item.type }}</p>
                <p>外观: {{ item.marketName?.match(/\((.*?)\)/)?.[1] || '未知' }}</p>
                <p>{{ getDescription(item) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <img src="../../assets/empty-box.svg" alt="空库存" class="empty-icon">
        <p>您的库存目前为空</p>
        <button class="primary-btn">去市场购买</button>
      </div>
    </div>
        <div class="pagination-controls">
      <div class="page-size-selector">
        <span>每页显示:</span>
        <select v-model="pageSize" @change="handlePageSizeChange" class="filter-select">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
      <div class="page-navigation">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">上一页</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../store/auth';
import service from '../../utils/request';
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

/**
 * 库存页面组件
 * 展示用户Steam库存物品，支持搜索、筛选功能
 */
export default {
  name: 'InventoryView',
  setup() {
    const authStore = useAuthStore();
    const isSteamBound = ref(false);
    const inventoryItems = ref([]);
    const loading = ref(false);
    const errorMsg = ref('');
    const searchQuery = ref('');
const selectedRarity = ref('');
const selectedWeaponType = ref('');
const selectedCategory = ref('');
const selectedExterior = ref('');
const selectedStatus = ref('');
    const isLoggedIn = computed(() => authStore.isLoggedIn);

    // 分页相关变量
    const currentPage = ref(1);
    const pageSize = ref(24);
    const pageSizes = ref([24, 30, 48, 60]);

    /**
     * 获取库存数据
     * 从后端API获取用户Steam库存信息
     */
    // 上架商品相关变量
const isListingDialogVisible = ref(false);
const listingLoading = ref(false);
const listingFormRef = ref(null);
const listingForm = ref({
  itemId: null,
  name: '',
  price: 0.01,
  sellerNote: ''
});
const listingRules = ref({
  price: [
    { required: true, message: '请输入挂牌价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  sellerNote: [
    { required: true, message: '请输入卖家备注', trigger: 'blur' }
  ]
});

// 关闭上架对话框
const closeListingDialog = () => {
  isListingDialogVisible.value = false;
};

// 打开上架对话框
const openListingDialog = (item) => {
  console.log('Opening listing dialog for item:', item);
  listingForm.value = {
    userId: authStore.user.id,
    itemId: item.id,
    name: item.name,
    price: '',
    sellerNote: ''
  };
  console.log('Setting isListingDialogVisible to true, listingForm:', listingForm);
  isListingDialogVisible.value = true;
};

// 提交上架表单
const handleListingSubmit = async () => {
  try {
    // 触发表单验证
    const valid = await listingFormRef.value.validate();
    if (!valid) {
      return;
    }

    listingLoading.value = true;

    const response = await axios.post(`/api/market/listings/${authStore.user.userId}`, {
      itemId: listingForm.value.itemId,
      price: listingForm.value.price,
      sellerNote: listingForm.value.sellerNote
    });

    if (response.data.code === 200 || response.data.message === 'success') {
      ElMessage.success('商品上架成功');
      isListingDialogVisible.value = false;
      // 刷新库存列表
      window.location.reload();
    } else {
      ElMessage.error(response.data.message || '商品上架失败');
    }
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试');
    console.error('Listing submit error:', error);
  } finally {
    listingLoading.value = false;
  }
};

const fetchInventory = async (sync = false) => {
      if (!isLoggedIn.value || !isSteamBound.value) return;

      loading.value = true;
      errorMsg.value = '';
      try {
        // 默认只查询本地数据
        const response = await service.get(`/steam/inventory?sync=${sync}`);
        if (response.code === 200) {
          inventoryItems.value = response.data || [];
          // 获取商品挂牌状态
          await fetchItemListingStatus();
        } else {
          errorMsg.value = response.message || '获取库存失败，错误码: ' + response.code;
        }
      } catch (error) {
        errorMsg.value = '网络错误，无法连接到服务器';
        console.error('库存加载失败:', error);
      } finally {
        loading.value = false;
      }
    };

    /**
     * 获取商品挂牌状态
     * 调用后端接口检查商品是否已上架，并更新商品的hasListing属性
     */
    const fetchItemListingStatus = async () => {
      if (inventoryItems.value.length === 0) return;

      try {
        const itemIds = inventoryItems.value.map(item => item.id);
        const response = await service.post('/market/listings/check-on-sale', itemIds);
        
        const listingStatusMap = response;   // 本身就是对象
        inventoryItems.value.forEach(item => {
        item.hasListing = listingStatusMap[item.id] || false;
      });
      } catch (error) {
        console.error('获取商品挂牌状态出错:', error);
        ElMessage.error('获取商品挂牌状态时发生错误');
      }
    };

    const syncInventory = () => {
      // 同步库存方法实现
      loading.value = true;
      errorMsg.value = '';
      fetchInventory(true);
    };

    onMounted(() => {
      // 从用户信息中获取Steam绑定状态
      isSteamBound.value = !!authStore.user?.steamId;
      if (isLoggedIn.value && isSteamBound.value) {
        fetchInventory();
      }
    });

    // 监听用户信息变化，实时更新Steam绑定状态
    watch(
      () => authStore.user,
      (newUser) => {
        isSteamBound.value = !!newUser?.steamId;
        // 如果用户刚绑定Steam，自动加载库存
        if (isLoggedIn.value && isSteamBound.value) {
          fetchInventory();
        }
      },
    { immediate: true }
  );

    // 监听筛选结果变化，重置页码
    /**
     * 获取品质颜色
     * 根据物品品质返回对应的背景颜色
     * @param {string} rarity - 物品品质
     * @returns {string} 背景颜色CSS值
     */
    const getRarityColor = (rarity) => {
      const colors = {
        '消费级': '#B0C3D9',
        '工业级': '#62929E',
        '军规级': '#4A6FA5',
        '受限': '#5D478B',
        '保密': '#B24E51',
        '隐秘': '#D4AF37'
      };
      return colors[rarity] || '#CCCCCC';
    };

    /**
     * 获取物品状态颜色
     * 根据物品状态返回对应的背景颜色
     * @param {string} condition - 物品状态
     * @returns {string} 背景颜色CSS值
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

    /**
     * 筛选物品
     * 根据搜索关键词和稀有度筛选库存物品
     */
    const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRarity = !selectedRarity.value || item.type?.split(' ')[0]  === selectedRarity.value;
    // 从type字段中提取空格后的武器类型部分进行匹配
    const weaponType = item.type?.trim().split(/\s+/).pop() || item.type;
    const matchesWeaponType = !selectedWeaponType.value || weaponType === selectedWeaponType.value;
    const matchesCategory = !selectedCategory.value || item.type?.split(' ')[0] === selectedCategory.value;
    const matchesExterior = !selectedExterior.value || (item.marketName?.match(/\((.*?)\)/)?.[1] === selectedExterior.value);
    const matchesStatus = !selectedStatus.value || 
      (selectedStatus.value === '可交易' && item.tradable) ||
      (selectedStatus.value === '可出售' && item.commodity);
    
    return matchesSearch && matchesRarity && matchesWeaponType && matchesCategory && matchesExterior && matchesStatus;
  });
});

    /**
     * 分页处理后的物品列表
     */
    const paginatedItems = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      return filteredItems.value.slice(startIndex, startIndex + pageSize.value);
    });

    watch(filteredItems, () => {
      currentPage.value = 1;
    });

    /**
     * 总物品数量
     */
    const totalItems = computed(() => filteredItems.value.length);

    /**
     * 总页数
     */
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

    /**
     * 处理每页显示数量变更
     */
    const handlePageSizeChange = () => {
      currentPage.value = 1;
    };

    const adjustDetailPosition = (event) => {
  const card = event.currentTarget;
  const detail = card.querySelector('.item-detail');
  
  if (!detail) return;
  
  const cardRect = card.getBoundingClientRect();
  const detailWidth = 450; // 使用固定宽度替代动态获取，解决隐藏元素宽度为0的问题
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 计算面板右侧是否超出视口
  const rightOverflow = cardRect.left + detailWidth > viewportWidth;
  const leftOverflow = cardRect.left - detailWidth < 0;
  const detailHeight = detail.offsetHeight || 300; // 动态获取面板高度，默认300
  const bottomOverflow = cardRect.bottom + detailHeight > viewportHeight;
  const topOverflow = cardRect.top - detailHeight < 0;
  
  // 垂直位置调整
  if (bottomOverflow && !topOverflow) {
    // 底部空间不足，显示在上方
    detail.style.top = 'auto';
    detail.style.bottom = '100%';
  } else if (topOverflow && !bottomOverflow) {
    // 顶部空间不足，显示在下方
    detail.style.top = '100%';
    detail.style.bottom = 'auto';
  } else {
    // 上下空间都不足，默认显示在下方并允许滚动
    detail.style.top = '100%';
    detail.style.bottom = 'auto';
    detail.style.maxHeight = '300px';
    detail.style.overflowY = 'auto';
  }

  // 水平位置调整
  if (rightOverflow && !leftOverflow) {
    detail.style.left = 'auto';
    detail.style.right = '0';
  } else if (leftOverflow && !rightOverflow) {
    detail.style.left = '0';
    detail.style.right = 'auto';
  } else {
    detail.style.left = '0';
    detail.style.right = 'auto';
  }
};

/**
 * 获取物品描述信息，对武器箱类型物品进行特殊处理
 * @param {Object} item - 物品对象
 * @returns {string} 处理后的描述文本
 */
const getDescription = (item) => {
  // 检查物品类型是否包含"武器箱"
  const isWeaponCase = item.type?.includes('武器箱');
  if (isWeaponCase && item.description) {
    const chinese = (item.description || '').match(/[\u4e00-\u9fa5]+[。，、, . ！？：；""''（）【】]/g);
    return chinese ? chinese.join('') : '该武器箱暂无有效描述';
  }
  return item.description || '该物品暂无描述信息';
};

return {
      listingLoading,
      isSteamBound,
      isLoggedIn,
      inventoryItems,
      loading,
      errorMsg,
      searchQuery,
      selectedRarity,
      selectedWeaponType,
      selectedCategory,
      selectedExterior,
      selectedStatus,
      filteredItems,
      fetchInventory,
      syncInventory,
      getRarityColor,
      getConditionColor,
      adjustDetailPosition,
      getDescription,
      currentPage,
      pageSize,
      pageSizes,
      totalItems,
      totalPages,
      paginatedItems,
      handlePageSizeChange,
      listingRules,
      listingForm,
      openListingDialog,
      handleListingSubmit,
      isListingDialogVisible,
      closeListingDialog,
      listingFormRef,
    };
  }
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.loading-overlay {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px 0;
  color: #ff4444;
}

.inventory-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
}

.bind-steam-prompt {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}

.bind-icon img {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.bind-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #1da1f2;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-top: 16px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.list-item-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  color: white;
}

.item-card {
  position: relative;

  background-color: #fff;
  border-radius: 8px;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  position: relative;
    z-index: 1000;
}

  /* 新增悬停详情面板样式 */
  .item-detail {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 450px;
    background-color: #1a1a1a;
    pointer-events: auto;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    padding: 16px;
    color: white;
    z-index: 2147483647;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease, top 0.2s ease, bottom 0.2s ease;
    pointer-events: none;
  }

  .item-card:hover {
    z-index: 9999;
  }

  .item-card:hover .item-detail {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  .detail-image-container {
    width: 180px;
    height: 180px;
    float: left;
    margin-right: 16px;
  }

  .detail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-info {
    overflow: hidden;
  }

  .detail-name {
    font-size: 18px;
    margin-bottom: 8px;
    color: #fff;
  }

  .detail-condition {
    color: #b0c3d9;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .detail-divider {
    border-bottom: 1px solid #333;
    margin: 12px 0;
  }

  .detail-properties p {
    margin: 6px 0;
    font-size: 14px;
    color: #ddd;
  }

  .detail-properties strong {
    color: #fff;
  }
.item-card:hover {
  transform: translateY(-4px);
}

.item-condition-badge {
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

.item-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  background-color: #f0f0f0;
}

.item-info {
  padding: 12px;
}

.item-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-rarity {
  font-size: 12px;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.item-price {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}

.item-quantity {
  font-size: 12px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.primary-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.inventory-count {
  margin-left: 10px;
  color: #666;
  font-size: 16px;
  font-weight: normal;
}
.sync-inventory-btn {
  margin-left: 15px;
  padding: 6px 12px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sync-inventory-btn:hover {
  background-color: #337ecc;
}

.sync-inventory-btn:active {
  background-color: #2868b3;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  padding: 6px 12px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #333;
}
</style>

/**
 * 获取商品挂牌状态
 */
const fetchItemListingStatus = async () => {
  if (inventoryItems.value.length === 0) return;

  try {
    const itemIds = inventoryItems.value.map(item => item.id);
    const response = await service.post('/api/market/listings/check-on-sale', itemIds);
    
    if (response.code === 200) {
      const listingStatusMap = response.data;
      // 更新每个商品的挂牌状态
      inventoryItems.value.forEach(item => {
        item.hasListing = listingStatusMap[item.id] || false;
      });
    } else {
      ElMessage.warning('获取商品挂牌状态失败: ' + response.message);
    }
  } catch (error) {
    console.error('获取商品挂牌状态出错:', error);
    ElMessage.error('获取商品挂牌状态时发生错误');
  }
};