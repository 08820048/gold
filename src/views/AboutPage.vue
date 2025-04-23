<script setup>
// 关于页面组件
</script>

<template>
  <div class="about-container">
    <h1 class="about-title">关于我们</h1>

    <div class="about-content">
      <div class="about-section welcome-section">
        <h2>欢迎您</h2>
        <p>你好! 金奢收欢迎你，了解更多业务请致电客服电话： 15555521595</p>
      </div>

      <div class="about-section image-section">
        <div class="store-image">
          <img src="/about.jpg" alt="店铺照片" class="about-img">
        </div>
      </div>

      <div class="about-section">
        <h2>业务介绍</h2>
        <p>我们以黄金，铂金，钯金等贵金属回收和提纯兑换，以及金条定制为主营业务，详细请咨询电话。</p>
      </div>

      <div class="about-section contact-section">
        <h2>联系我们</h2>
        <div class="contact-info-grid">
          <div class="contact-label">联系电话：</div>
          <div class="contact-value">15555521595（微信同号）</div>
          <div class="contact-label">地址一：</div>
          <div class="contact-value">杭州市萧山区金慧路241号黄金回收手机电脑专卖快修</div>
          <div class="contact-label">地址二：</div>
          <div class="contact-value">杭州市上城区新风路695号立奢黄金回收手机电脑专卖抵押</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
  padding-bottom: 70px; /* 为底部导航留出空间 */
}

.about-title {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
  text-align: center;
  margin: 30px 0;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  background-color: #222;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.about-section {
  margin-bottom: 30px;
}

.about-section h2 {
  color: #ffd700;
  font-size: 22px;
  margin-bottom: 15px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.about-section p {
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 10px;
}

.about-section ul {
  padding-left: 20px;
}

.about-section li {
  margin-bottom: 10px;
  color: #ddd;
  line-height: 1.6;
}

.image-section {
  text-align: center;
}

.store-image {
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.about-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.about-img:hover {
  transform: scale(1.02);
}

.welcome-section {
  text-align: center;
  padding: 10px 20px;
  background-color: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 25px;
}

.contact-section {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.contact-label {
  color: #ffd700;
  font-weight: bold;
  text-align: left;
  padding: 5px 0;
}

.contact-value {
  text-align: left;
  padding: 5px 0;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .about-title {
    font-size: 24px;
    margin: 20px 0;
  }

  .about-content {
    padding: 15px;
  }

  .about-section h2 {
    font-size: 20px;
  }
}

@media screen and (max-width: 480px) {
  .about-title {
    font-size: 20px;
    margin: 15px 0;
  }

  .about-content {
    padding: 10px;
  }

  .about-section h2 {
    font-size: 18px;
  }

  .about-section p,
  .about-section li {
    font-size: 14px;
  }

  .welcome-section {
    padding: 8px 12px;
  }

  .contact-section {
    padding: 10px;
  }

  .contact-info-grid {
    gap: 5px;
  }

  .contact-label,
  .contact-value {
    padding: 3px 0;
    font-size: 13px;
  }

  .store-image {
    margin: 10px 0;
  }
}
</style>
