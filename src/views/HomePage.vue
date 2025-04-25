<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { priceConfig } from '../config/priceConfig'

const errorMessage = ref('')

const priceData = ref([
  {
    type: '黄金',
    buyPrice: '0.00',
    sellPrice: '0.00',
    highPrice: '0.00',
    lowPrice: '0.00',
    error: ''
  },
  {
    type: '白银',
    buyPrice: '0.00',
    sellPrice: '0.00',
    highPrice: '0.00',
    lowPrice: '0.00',
    error: ''
  },
  {
    type: '18K金',
    buyPrice: '0.00',
    sellPrice: '0.00',
    highPrice: '0.00',
    lowPrice: '0.00',
    error: ''
  },
  {
    type: '铂金',
    buyPrice: '0.00',
    sellPrice: '0.00',
    highPrice: '0.00',
    lowPrice: '0.00',
    error: ''
  }
])

// 处理价格数据的通用函数
const processPrice = (price, config) => {
  if (!price || !config) return '0.00'

  let result = parseFloat(price)

  // 按照配置顺序处理：除法 -> 乘法 -> 加法 -> 减法
  if (config.divisor !== 1) result = result / config.divisor
  if (config.multiplier !== 1) result = result * config.multiplier
  if (config.addition !== 0) result = result + config.addition
  if (config.subtraction !== 0) result = result - config.subtraction

  // 格式化小数位数
  return result.toFixed(config.decimalPlaces)
}

const fetchGoldPrice = async () => {
  try {
    const response = await axios.get('/api/gold-price')
    const data = response.data

    if (data && data.code === 1) {
      const goldData = data.data.list.Au9995;
      if (!goldData) {
        errorMessage.value = '未获取到Au9995数据';
        return;
      }
      const goldIndex = priceData.value.findIndex(item => item.type === '黄金');
      if (goldIndex !== -1) {
        const item = priceData.value[goldIndex];
        item.error = '';
        const basePrice = processPrice(goldData.price, priceConfig.gold);
        item.buyPrice = basePrice;
        item.sellPrice = (parseFloat(basePrice) + 1).toFixed(2);
        item.highPrice = processPrice(goldData.maxprice || goldData.maxPrice, priceConfig.gold);
        item.lowPrice = processPrice(goldData.minprice || goldData.minPrice, priceConfig.gold);
      }

      // 更新18K金价格（使用配置参数）
      const k18Index = priceData.value.findIndex(item => item.type === '18K金')
      if (k18Index !== -1) {
        const item = priceData.value[k18Index]
        item.error = ''
        const basePrice = processPrice(goldData.price, priceConfig.k18)
        item.buyPrice = basePrice
        item.sellPrice = (parseFloat(basePrice) + 1).toFixed(2)
        item.highPrice = processPrice(goldData.maxPrice, priceConfig.k18)
        item.lowPrice = processPrice(goldData.minPrice, priceConfig.k18)
      }

      // 更新铂金价格
      const platinumData = data.data.list.PT9995;
      const platinumIndex = priceData.value.findIndex(item => item.type === '铂金')
      if (platinumIndex !== -1 && platinumData) {
        const item = priceData.value[platinumIndex]
        item.error = ''
        const basePrice = processPrice(platinumData.price, priceConfig.platinum)
        item.buyPrice = basePrice
        item.sellPrice = (parseFloat(basePrice) + 1).toFixed(2)
        item.highPrice = processPrice(platinumData.maxprice || platinumData.maxPrice, priceConfig.platinum)
        item.lowPrice = processPrice(platinumData.minprice || platinumData.minPrice, priceConfig.platinum)
      }
    } else {
      errorMessage.value = data.msg || '获取价格失败'
    }
  } catch (error) {
    console.error('获取黄金价格时出错:', error)
    const goldIndex = priceData.value.findIndex(item => item.type === '黄金')
    const k18Index = priceData.value.findIndex(item => item.type === '18K金')
    const platinumIndex = priceData.value.findIndex(item => item.type === '铂金')

    if (goldIndex !== -1) {
      const item = priceData.value[goldIndex]
      if (error.response?.status === 429 || (error.response?.status === 403 && error.response?.data?.message?.includes('quota'))) {
        item.error = '价格更新已达今日限额，请稍后再试'
      } else {
        item.error = '获取价格失败，请稍后再试'
      }
    }
    if (k18Index !== -1) {
      const item = priceData.value[k18Index]
      item.error = '获取价格失败，请稍后再试'
    }
    if (platinumIndex !== -1) {
      const item = priceData.value[platinumIndex]
      item.error = '获取价格失败，请稍后再试'
    }
  }
}

const fetchSilverPrice = async () => {
  try {
    const response = await axios.get('/api/silver-price')
    const data = response.data

    if (data && data.code === 1) {
      const silverData = data.data.list[1]
      console.log("白银数据：",silverData)
      // 更新白银价格
      const silverIndex = priceData.value.findIndex(item => item.type === '白银')
      if (silverIndex !== -1 && silverData) {
        const item = priceData.value[silverIndex]
        item.error = ''
        const basePrice = processPrice(silverData.price, priceConfig.silver)
        item.buyPrice = basePrice
        item.sellPrice = (parseFloat(basePrice) + 1).toFixed(2)
        item.highPrice = processPrice(silverData.maxprice, priceConfig.silver)
        item.lowPrice = processPrice(silverData.minprice, priceConfig.silver)
      }
    } else {
      errorMessage.value = data.msg || '获取价格失败'
    }
  } catch (error) {
    console.error('获取白银价格时出错:', error)
    const silverIndex = priceData.value.findIndex(item => item.type === '白银')
    if (silverIndex !== -1) {
      const item = priceData.value[silverIndex]
      if (error.response?.status === 429 || (error.response?.status === 403 && error.response?.data?.message?.includes('quota'))) {
        item.error = '价格更新已达今日限额，请稍后再试'
      } else {
        item.error = '获取价格失败，请稍后再试'
      }
    }
  }
}

const updateAllPrices = async () => {
  await Promise.all([
    fetchGoldPrice(),
    fetchSilverPrice()
  ])
}

onMounted(() => {
  updateAllPrices()
  // 使用配置的刷新间隔
  setInterval(updateAllPrices, priceConfig.refreshInterval)
})
</script>

<template>
  <div class="page-container">
    <img src="/logo.jpg" alt="Logo" class="logo">
    <div class="content-wrapper">
      <h1 class="title">杭州金奢收</h1>
      <div class="scrolling-text-container">
        <div class="scrolling-text">你好! 金奢收欢迎你，了解更多业务请致电客服电话： 15555521595 | 我们以黄金，铂金，钯金等贵金属回收和提纯兑换，以及金条定制为主营业务，详细请咨询电话。</div>
      </div>
      <div class="price-table">
        <div class="table-header">
          <div class="col type-col">类型</div>
          <div class="col">回购</div>
          <div class="col">销售</div>
          <div class="col trend-col">
            <div>最高价</div>
            <div>最低价</div>
          </div>
        </div>
        <div v-for="item in priceData" :key="item.type" class="table-row">
          <div class="col type-col">
            {{ item.type }}
            <div v-if="item.error" class="error-message">{{ item.error }}</div>
          </div>
          <div class="col">
            <transition name="price-update">
              <span :key="item.buyPrice" class="price-value">{{ item.buyPrice }}</span>
            </transition>
          </div>
          <div class="col">
            <transition name="price-update">
              <span :key="item.sellPrice" class="price-value">{{ item.sellPrice }}</span>
            </transition>
          </div>
          <div class="col trend-col">
            <transition name="price-update">
              <div :key="item.highPrice" class="price-up">{{ item.highPrice }}</div>
            </transition>
            <transition name="price-update">
              <div :key="item.lowPrice" class="price-down">{{ item.lowPrice }}</div>
            </transition>
          </div>
        </div>
      </div>
      <div class="disclaimer">
        声明：①上图黄金当前预估价格是基于当前上海黄金交易所Au9999实时金价进行预估的回收价格。如黄金物品含金量达不到99.99%，回收时将以实际含金量进行计算。在收到您的物品后进行检测，并按当下的实时金价及检测结果进行报价。*如测试结果和您提供的信息有差异，或实时金价发生变化，实际回收价可能产生变化，手续费也会发生变化。②提醒：全部破损性检测,外观不支持复原。
      </div>
      <div class="contact-info" style="max-width: 800px; width: 100%;">
        <p>联系热线：手机号15555521595（微信同号）</p>
        <div class="address-row">
          <span class="address-item">地址一：杭州市萧山区金慧路241号黄金回收手机电脑专卖快修</span>
          <span class="address-item">地址二：杭州市上城区新风路695号立奢黄金回收手机电脑专卖抵押</span>
        </div>
        <div class="qr-code">
          <img src="/code.png" alt="微信二维码" class="qr-image">
          <p>长按扫码添加客服</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  position: relative;
  padding-bottom: 70px; /* 为底部导航留出空间 */
}

.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  height: auto;
  z-index: 1;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(26, 26, 26, 0.8);
  padding: 8px;
  backdrop-filter: blur(5px);
  opacity: 0.9;
}

.logo:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.15);
  opacity: 1;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 60px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffd700;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.price-table {
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  background-color: #222;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: #333;
  padding: 15px 0;
  font-weight: bold;
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 15px 0;
  text-align: center;
  border-bottom: 1px solid #333;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.type-col {
  font-weight: bold;
  color: #ffd700;
}

.trend-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.price-up {
  color: #ff6b6b;
}

.price-down {
  color: #4ecdc4;
}

.price-value {
  font-weight: bold;
  min-width: 80px;
  display: inline-block;
}

.disclaimer {
  font-size: 14px;
  color: #aaa;
  text-align: justify;
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  line-height: 1.6;
}

.contact-info {
  margin-top: 20px;
  text-align: center;
  color: #ddd;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  max-width: 800px !important;
  margin-left: auto;
  margin-right: auto;
}

.contact-info p {
  margin: 10px 0;
  line-height: 1.5;
}

.contact-info p:first-child {
  color: #ffd700;
  font-weight: bold;
}

.address-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
  width: 100%;
}

.address-item {
  display: inline-block;
  text-align: left;
  font-size: 14px;
  flex: 1;
  min-width: 300px;
}

.qr-code {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-image {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: block;
}

/* 价格更新动画 */
.price-update-enter-active,
.price-update-leave-active {
  transition: all 0.5s ease;
}

.price-update-enter-from,
.price-update-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 电脑端布局 */
@media screen and (min-width: 769px) {
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px;
  }

  .title {
    grid-column: 1 / -1;
    font-size: 42px;
  }

  .price-table {
    width: 100%;
    max-width: 800px;
  }

  .contact-info {
    width: 100%;
    max-width: 400px;
  }

  .disclaimer {
    width: 100%;
    max-width: 1000px;
    margin: 20px auto;
  }

  .col {
    font-size: 16px;
    padding: 15px;
  }

  .table-header {
    font-size: 16px;
  }

  .qr-image {
    width: 160px;
    height: 160px;
  }
}

/* 平板尺寸 */
@media screen and (max-width: 768px) {
  .logo {
    width: 80px;
    top: 15px;
    left: 15px;
    padding: 6px;
    backdrop-filter: blur(3px);
  }

  .content-wrapper {
    padding-top: 80px;
    max-width: 95%;
  }

  .title {
    font-size: 28px;
    margin-top: 0;
    letter-spacing: 1px;
  }

  .col {
    padding: 10px;
    font-size: 13px;
  }

  .table-header {
    font-size: 13px;
  }

  .qr-image {
    width: 100px;
    height: 100px;
  }

  .price-table {
    max-width: 95%;
    margin: 0 auto 20px;
  }

  .address-container {
    gap: 10px;
  }

  .address-item {
    padding: 8px;
  }

  .contact-title {
    font-size: 15px;
  }
}

/* 手机尺寸 */
@media screen and (max-width: 480px) {
  .logo {
    width: 60px;
    top: 10px;
    left: 10px;
    padding: 4px;
    backdrop-filter: blur(2px);
  }

  .content-wrapper {
    padding: 60px 10px 10px 10px;
    max-width: 100%;
  }

  .title {
    font-size: 24px;
    margin-top: 0;
    letter-spacing: 1px;
  }

  .col {
    padding: 8px 4px;
    font-size: 12px;
  }

  .table-header {
    font-size: 12px;
  }

  .disclaimer {
    font-size: 12px;
    padding: 10px;
  }

  .contact-info {
    padding: 10px;
  }

  .contact-info p {
    font-size: 12px;
    margin: 8px 0;
  }

  .address-row {
    gap: 8px;
    margin: 8px 0;
    flex-direction: column;
  }

  .address-item {
    font-size: 12px;
    min-width: 100%;
    text-align: center;
  }

  .qr-code p {
    font-size: 12px;
    margin: 8px 0;
  }

  .qr-image {
    width: 100px;
    height: 100px;
  }

  .price-table {
    max-width: 100%;
    margin: 0 auto 15px;
  }

  .error-message {
    font-size: 10px;
  }

  .price-value {
    min-width: 60px;
  }
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  font-weight: normal;
}

/* 滚动文字效果 */
.scrolling-text-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 20px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 8px 0;
}

.scrolling-text {
  display: inline-block;
  color: #ff3333;
  font-weight: bold;
  white-space: nowrap;
  animation: scrollText 30s linear infinite;
  padding-left: 100%;
}

@keyframes scrollText {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
