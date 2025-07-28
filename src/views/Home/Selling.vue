<template>
  <!-- 编辑商品对话框 -->
  <el-dialog v-model="isEditDialogVisible" title="编辑商品" width="500px">
    <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="editForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="挂牌价格(元)" prop="price">
        <el-input v-model.number="editForm.price" type="number" placeholder="请输入价格" step="0.01"></el-input>
      </el-form-item>
      <el-form-item label="卖家备注" prop="sellerNote">
        <el-input v-model="editForm.sellerNote" type="textarea" :rows="3" placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isEditDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleEditSubmit" :loading="editLoading">
        保存修改
      </el-button>
    </template>
  </el-dialog>

  <div class="page-container">
    <h1>我的出售</h1>
    <el-tabs v-model="activeTab" class="selling-tabs">
      <el-tab-pane label="已上架" name="onSale">
        <div class="tab-content">
          <div class="empty-state" v-if="onSaleItems.length === 0">
            <img src="../../assets/selling-icon.svg" alt="已上架" class="empty-icon">
            <p>您当前没有已上架的饰品</p>
            <button class="primary-btn">去库存上架</button>
          </div>
          <div class="items-list" v-else>
  <div class="item-card" v-for="item in onSaleItems" :key="item.id">
    <div class="item-actions">
      <button class="action-btn edit-btn" title="编辑" @click="openEditDialog(item)">
        <img src="../../assets/edit-icon.svg" alt="编辑">
      </button>
      <button class="action-btn remove-btn" title="下架" @click="handleRemoveListing(item.id)">
        <img src="../../assets/remove-icon.svg" alt="下架">
      </button>
    </div>
    <div class="item-image-container">
  <div class="item-tag" v-if="getCondition(item.market_name)" :style="{ backgroundColor: getConditionColor(getCondition(item.market_name)) }">{{ getCondition(item.market_name) }}</div>
  <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.image_url}/330x192?allow_animated=1`" :alt="item.item_name" class="item-image">
</div>
    <div class="item-info">
      <h3 class="item-name">{{ item.item_name?.split('(')[0]?.trim() || '未知物品' }}</h3>
      <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
      <div class="item-meta">
        <span class="seller-desc" v-if="item.seller_note">卖家描述: {{ item.seller_note.slice(0, 8) }}{{ item.seller_note.length > 8 ? '...' : '' }}</span>
        <span class="item-status" :style="{ backgroundColor: getStatusColor(item.status) }">{{ getStatusText(item.status) }}</span>
        <span class="item-time">{{ formatTime(item.createdAt) }}</span>
      </div>
      <div class="onsale-badge" v-if="item.status === 'ON_SALE'">{{ getStatusText(item.status) }}</div>
    </div>
  </div>
</div>
<div class="pagination-controls">
  <div class="page-navigation">
    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">上一页</button>
    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
    <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">下一页</button>
  </div>
</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="交易中" name="trading">
        <div class="tab-content">
          <div class="empty-state" v-if="tradingItems.length === 0">
            <img src="../../assets/selling-icon.svg" alt="交易中" class="empty-icon">
            <p>您当前没有交易中的饰品</p>
          </div>
          <div class="items-list" v-else>
            <div class="item-card" v-for="item in tradingItems" :key="item.id">
              <div class="item-image-container">
                <div class="item-tag" v-if="getCondition(item.itemName)" :style="{ backgroundColor: getConditionColor(getCondition(item.itemName)) }">{{ getCondition(item.itemName) }}</div>
                <img :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.item.imageUrl}/330x192?allow_animated=1`" :alt="item.itemName" class="item-image">
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.name?.split('(')[0]?.trim() || '未知物品' }}</h3>
                <p class="item-price">¥{{ item.marketListing.price.toFixed(2) }}</p>
                <div class="item-meta">
                  <span class="item-status" :style="getStatusColor('TRADING')">{{ getStatusText('TRADING') }}</span><span class="tradeoffer-id" v-if="item.tradeofferid">交易ID: {{ item.tradeofferid }}</span>
                  <span class="item-time">{{ formatTime(item.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="交易完成" name="completed">
        <div class="tab-content">
          <div class="empty-state" v-if="completedItems.length === 0">
            <img src="../../assets/selling-icon.svg" alt="交易完成" class="empty-icon">
            <p>您当前没有交易完成的饰品</p>
          </div>
          <div class="items-list" v-else>
            <div class="item-card" v-for="item in completedItems" :key="item.id">
              <div class="item-info">
                <div class="item-tag" v-if="getCondition(item.itemName)" :style="{ backgroundColor: getConditionColor(getCondition(item.itemName)) }">{{ getCondition(item.itemName) }}</div>
                <h3 class="item-name">{{ item.itemName?.split('(')[0]?.trim() || '未知物品' }}</h3>
                <div class="item-meta">
                  <span class="item-status" :style="getStatusColor('COMPLETED')">{{ getStatusText('COMPLETED') }}</span>
                  <span class="item-time">{{ formatTime(item.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { ElTabs, ElTabPane, ElMessage, ElMessageBox, ElLoading, ElDialog, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import service from '../../utils/request';
import { useAuthStore } from '../../store/auth';


/**
 * 我的出售页面组件
 * 包含三个标签页：已上架、交易中、交易完成
 */
export default {
  name: 'SellingView',
  components: {
    ElTabs,
    ElTabPane,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const authStore = useAuthStore();
const isAuthInitialized = ref(false);
authStore.initAuthState();
isAuthInitialized.value = true;
console.log('用户认证状态初始化完成:', authStore.user);
console.log('用户认证状态:', authStore.user);
    // 当前激活的标签页
    const activeTab = ref('onSale');
    // 数据加载状态
    const loading = ref(false);
    // 分页相关变量
    const currentPage = ref(1);
    const pageSize = ref(24);
    const totalItems = ref(0);
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
    // 编辑对话框状态
    const isEditDialogVisible = ref(false);
    const currentEditingItem = ref(null);
    const editFormRef = ref(null);
    const editForm = ref({
      name: '',
      price: 0,
      sellerNote: ''
    });
    const editLoading = ref(false);
    // 编辑表单验证规则
    const editRules = ref({
      price: [
        { required: true, message: '请输入挂牌价格', trigger: 'blur' },
        { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
      ],
      sellerNote: [
        { max: 200, message: '备注不能超过200个字符', trigger: 'blur' }
      ]
    });

    // 商品数据
    const onSaleItems = ref([]);
    const tradingItems = ref([]);
    const completedItems = ref([]);

    /**
     * 格式化时间
     */
    const formatTime = (timeString) => {
      if (!timeString) return '';
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    /**
     * 获取状态文本
     */
    const getStatusText = (status) => {
      const statusMap = {
        'ON_SALE': '已上架',
        'TRADING': '交易中',
        'COMPLETED': '交易完成',
        'CANCELED': '已取消'
      };
      return statusMap[status] || status;
    };

    /**
     * 获取状态颜色
     */
    /**
 * 从物品名称中提取品质状态
 * @param {string} itemName - 物品名称
 * @returns {string|null} 提取的品质状态或null
 */
const getCondition = (itemName) => {
  if (!itemName) return null;
  const match = itemName.match(/\((.*?)\)/);
  return match ? match[1] : null;
};

/**
 * 根据品质状态获取对应的背景颜色
 * @param {string} condition - 物品品质状态
 * @returns {string} 背景颜色值
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

const getStatusColor = (status) => {
      const colorMap = {
        'ON_SALE': '#4CAF50',
        'TRADING': '#FF9800',
        'COMPLETED': '#2196F3',
        'CANCELED': '#F44336'
      };
      return { backgroundColor: colorMap[status] || '#9E9E9E' };
    };

    /**
     * 打开编辑对话框
     */
    const openEditDialog = (item) => {
      currentEditingItem.value = { ...item };
      editForm.value = {
        name: item.item_name,
          price: item.price,
          sellerNote: item.seller_note || ''
      };
      isEditDialogVisible.value = true;
    };

    /**
     * 提交编辑表单
     */
    const handleEditSubmit = async () => {
      if (!currentEditingItem.value) return;

      try {
        // 触发表单验证
        const valid = await editFormRef.value.validate();
        if (!valid) return;

        editLoading.value = true;

        const response = await service.put(`/market/listings/${currentEditingItem.value.id}`, {
          price: editForm.value.price,
          sellerNote: editForm.value.sellerNote
        });

        if (response.code === 200) {
          ElMessage.success('商品更新成功');
          isEditDialogVisible.value = false;
          // 刷新商品列表
          fetchOnSaleItems();
        } else {
          ElMessage.error(response.message || '商品更新失败');
        }
      } catch (error) {
        if (error === 'cancel') {
          // 表单验证失败不显示错误提示
          return;
        }
        ElMessage.error('更新失败，请稍后重试');
        console.error('编辑商品失败:', error);
      } finally {
        editLoading.value = false;
      }
    };

    /**
     * 获取用户已上架商品列表
     */
    const fetchOnSaleItems = async () => {
      if (!authStore.isLoggedIn) return;

      const loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        const response = await service.get(`/market/listings/user?page=${currentPage.value}&size=${pageSize.value}`);
        if (response.code === 200) {
          onSaleItems.value = response.data.records || [];
          totalItems.value = response.data.total || 0;
        } else {
          ElMessage.error(response.message || '获取已上架商品失败');
        }
      } catch (error) {
        ElMessage.error('网络错误，无法连接到服务器');
        console.error('获取已上架商品失败:', error);
      } finally {
        loadingInstance.close();
      }
    };

    /**
     * 处理商品下架
     */
    const handleRemoveListing = async (listingId) => {
      try {
        await ElMessageBox.confirm(
          '确定要下架该商品吗？',
          '下架确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );

        const response = await service.delete(`/market/listings/${listingId}`);
        if (response.code === 200) {
          ElMessage.success('商品下架成功');
          // 重新获取商品列表
          fetchOnSaleItems();
        } else {
          ElMessage.error(response.message || '商品下架失败');
        }
      } catch (error) {
        if (error === 'cancel') {
          // 用户取消确认
          return;
        }
        ElMessage.error('操作失败，请稍后重试');
        console.error('商品下架失败:', error);
      }
    };

    /**
     * 获取交易中商品列表
     */
    const fetchTradingItems = async () => {
      if (!authStore.isLoggedIn) return;

      const loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        if (!authStore.user || !authStore.user.userId) {
    if (isAuthInitialized.value) {
      console.error('用户信息不完整:', authStore.user);
      ElMessage.error('用户信息获取失败，请重新登录');
    }
    return;
  }
const response = await service.get(`/tradeconfirmations/user-trades?userId=${Number(authStore.user.userId)}&status=TRADING`);
        tradingItems.value = response || []; // 直接赋值数组
    console.log('获取交易中商品成功:', response);

      } catch (error) {
        ElMessage.error('网络错误，无法获取交易中商品');
        console.error('获取交易中商品失败:', error);
      } finally {
        loadingInstance.close();
      }
    };

    /**
     * 获取交易完成商品列表
     */
    const fetchCompletedItems = async () => {
      if (!authStore.isLoggedIn) return;

      const loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        if (!authStore.user || !authStore.user.userId) {
    if (isAuthInitialized.value) {
      ElMessage.error('用户信息获取失败，请重新登录');
    }
    return;
  }
const response = await service.get(`/tradeconfirmations/user-trades?userId=${Number(authStore.user.userId)}&status=COMPLETED`);
        tradingItems.value = response || []; // 直接赋值数组
    console.log('获取交易中商品成功:', response);

      } catch (error) {
        ElMessage.error('网络错误，无法获取交易完成商品');
        console.error('获取交易完成商品失败:', error);
      } finally {
        loadingInstance.close();
      }
    };

    /**
     * 处理分页变更
     */
    const handlePageChange = (page) => {
      currentPage.value = page;
      if (activeTab.value === 'onSale') {
        fetchOnSaleItems();
      } else if (activeTab.value === 'trading') {
        fetchTradingItems();
      } else if (activeTab.value === 'completed') {
        fetchCompletedItems();
      }
    };

    /**
     * 处理每页条数变更
     */
    const handlePageSizeChange = (size) => {
      pageSize.value = size;
      currentPage.value = 1;
      if (activeTab.value === 'onSale') {
        fetchOnSaleItems();
      } else if (activeTab.value === 'trading') {
        fetchTradingItems();
      } else if (activeTab.value === 'completed') {
        fetchCompletedItems();
      }
    };

    // 页面加载时获取数据
    onMounted(() => {
      if (activeTab.value === 'onSale') {
        fetchOnSaleItems();
      } else if (activeTab.value === 'trading') {
        fetchTradingItems();
      } else if (activeTab.value === 'completed') {
        fetchCompletedItems();
      }
    });

    // 监听标签页切换
    watch(activeTab, (newTab) => {
      if (newTab === 'onSale') {
        fetchOnSaleItems();
      } else if (newTab === 'trading') {
        fetchTradingItems();
      } else if (newTab === 'completed') {
        fetchCompletedItems();
      }
    });

    return {
      activeTab,
      onSaleItems,
      tradingItems,
      completedItems,
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      handleRemoveListing,
      handlePageChange,
      handlePageSizeChange,
      fetchOnSaleItems,
      loading,
      editRules,
      handleEditSubmit,
      getStatusText,
      getStatusColor,
      openEditDialog,
      formatTime,
      isEditDialogVisible,
      editForm,
      editFormRef,
      getCondition,
      getConditionColor,
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

.selling-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

.empty-state {
  margin-top: 40px;
  color: #666;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.primary-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.item-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 1;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 1;
}

.edit-btn {
  background-color: rgba(76, 175, 80, 0.8);
}

.remove-btn {
  background-color: rgba(244, 67, 54, 0.8);
}

.action-btn img {
  width: 16px;
  height: 16px;
  filter: invert(1);
}

.item-image-container {
  position: relative;
  width: 100%;
}
.item-image {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
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

.item-name {
  font-size: 14px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 8px;
}

.onsale-badge {
  position: absolute;
  bottom: 15px;
  right: 15px;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  gap: 8px;
}

.seller-desc {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
}

.item-status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}
</style>