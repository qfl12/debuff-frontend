<template>
  <div class="home-container">
    <!-- 首页横幅区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1>画加APP</h1>
        <p>简单便捷定制你的玩家秀</p>
        <div class="hero-buttons">
          <button class="primary-btn">立即开始</button>
        </div>
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
        <a href="#" class="view-all">进入市场 <span>→</span></a>
      </div>
      <div class="items-grid">
        <!-- 饰品卡片示例 -->
        <div class="item-card">
          <img src="../../assets/item1.svg" alt="饰品图片">
          <div class="item-info">
            <h3>2级炫彩</h3>
            <p class="price">¥165</p>
          </div>
        </div>
        <div class="item-card">
          <img src="../../assets/item2.svg" alt="饰品图片">
          <div class="item-info">
            <h3>崭新出厂 SunTrack</h3>
            <p class="price">¥598</p>
          </div>
        </div>
        <div class="item-card">
          <img src="../../assets/item3.svg" alt="饰品图片">
          <div class="item-info">
            <h3>崭新出厂</h3>
            <p class="price">¥856</p>
          </div>
        </div>
        <div class="item-card">
          <img src="../../assets/item4.svg" alt="饰品图片">
          <div class="item-info">
            <h3>破损不堪</h3>
            <p class="price">¥557</p>
          </div>
        </div>
        <div class="item-card">
          <img src="../../assets/item5.svg" alt="饰品图片">
          <div class="item-info">
            <h3>无涂装</h3>
            <p class="price">¥818</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
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
  font-size: px;
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
.img2 { top: px; left: 180px; transform: rotate(5deg); }
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

.view-all {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.item-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.item-card:hover {
  transform: translateY(-5px);
}

.item-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.item-info {
  padding: 16px;
}

.item-info h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}
</style>