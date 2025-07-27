import axios from 'axios';

const marketApi = {
  /**
   * 购买商品
   * @param {Object} params - 购买参数
   * @param {number} params.itemId - 商品ID
   * @param {number} params.buyerId - 买家ID
   * @returns {Promise<Object>} 购买结果
   */
  purchaseItem: (params) => {
    console.log('购买请求参数:', params);
    return axios.post('/api/tradeconfirmations/purchase', {
      itemId: params.itemId,
      buyerId: params.buyerId
    });
  },
  /**
   * 检查商品是否已上架
   * @param {Array<number>} itemIds - 商品ID列表
   * @returns {Promise<Object>} 包含商品ID和上架状态的映射
   */
  checkItemListingStatus: async (itemIds) => {
    return await axios.post('/api/market/listings/check-on-sale', itemIds);
  },

  /**
   * 获取随机上架的饰品
   * @param {number} limit - 获取数量
   * @returns {Promise<Object>} 随机上架的饰品列表
   */
  getRandomOnSaleListings: async (limit = 6) => {
    return await axios.get('/api/market/listings/random-on-sale', {
      params: { limit }
    });
  },

  /**
   * 根据ID获取商品挂牌详情
   * @param {number} id - 商品挂牌ID
   * @returns {Promise<Object>} 商品详情信息
   */
  getListingById: async (id) => {
    return await axios.get(`/api/market/listings/check-on-sale/${id}`);
  }
};

export default marketApi;