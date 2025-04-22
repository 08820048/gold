<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { priceConfig, processPrice } from './config/priceConfig'

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

const fetchGoldPrice = async () => {
  try {
    console.log('开始请求黄金价格...')
    const response = await axios.get('/api/gold-price', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log('黄金价格响应:', response)
    
    if (response.data && response.data.code === 1) {
      const goldData = response.data.data.list.Au9999
      const platinumData = response.data.data.list.PT9995
      
      // 更新黄金价格
      const goldIndex = priceData.value.findIndex(item => item.type === '黄金')
      if (goldIndex !== -1) {
        const item = priceData.value[goldIndex]
        item.error = ''
        const basePrice = processPrice(goldData.price, priceConfig.gold)
        item.buyPrice = basePrice
        item.sellPrice = basePrice
        item.highPrice = processPrice(goldData.price, priceConfig.gold)
        item.lowPrice = processPrice(goldData.price, priceConfig.gold)
      }
      
      // 更新18K金价格（使用配置参数）
      const k18Index = priceData.value.findIndex(item => item.type === '18K金')
      if (k18Index !== -1) {
        const item = priceData.value[k18Index]
        item.error = ''
        const basePrice = goldData.price
        item.buyPrice = processPrice(basePrice, priceConfig.k18)
        item.sellPrice = processPrice(basePrice, priceConfig.k18)
        item.highPrice = processPrice(basePrice, priceConfig.k18)
        item.lowPrice = processPrice(basePrice, priceConfig.k18)
      }

      // 更新铂金价格
      const platinumIndex = priceData.value.findIndex(item => item.type === '铂金')
      if (platinumIndex !== -1 && platinumData) {
        const item = priceData.value[platinumIndex]
        item.error = ''
        item.buyPrice = processPrice(platinumData.price, priceConfig.platinum)
        item.sellPrice = processPrice(platinumData.price, priceConfig.platinum)
        item.highPrice = processPrice(platinumData.maxprice || platinumData.price, priceConfig.platinum)
        item.lowPrice = processPrice(platinumData.minprice || platinumData.price, priceConfig.platinum)
      }
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
    console.log('开始请求白银价格...')
    const response = await axios.get('/api/silver-price', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log('白银价格响应:', response)
    
    if (response.data && response.data.code === 1) {
      // 使用第一个可用的白银数据
      const silverData = Object.values(response.data.data.list).find(item => 
        item.typename && item.typename.toLowerCase().includes('银')
      )
      if (silverData) {
        const silverIndex = priceData.value.findIndex(item => item.type === '白银')
        if (silverIndex !== -1) {
          const item = priceData.value[silverIndex]
          item.buyPrice = processPrice(silverData.price, priceConfig.silver)
          item.sellPrice = processPrice(silverData.price, priceConfig.silver)
          item.highPrice = processPrice(silverData.high || silverData.price, priceConfig.silver)
          item.lowPrice = processPrice(silverData.low || silverData.price, priceConfig.silver)
        }
      }
    }
  } catch (error) {
    console.error('获取白银价格时出错:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
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
      <div class="price-table">
        <div class="table-header">
          <div class="col type-col">类型</div>
          <div class="col">买入价</div>
          <div class="col">卖出价</div>
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
      <div class="contact-info">
        <p>联系热线：手机号15555521595（微信同号）</p>
        <p>地址：杭州市上城区九堡镇客运中心斜旁。</p>
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
  margin: 0 auto;
  padding: 20px;
  padding-top: 100px; /* 为 logo 预留空间 */
  background: #1a1a1a;
}

.title {
  text-align: center;
  color: #ffd700;
  font-size: 24px;
  margin-bottom: 20px;
}

.price-table {
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #333;
  padding: 12px 0;
  font-weight: bold;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: rgba(255, 215, 0, 0.05);
}

.col {
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
}

.type-col {
  color: #ffd700;
  font-weight: bold;
}

.trend-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-up {
  color: #ff4444;
  font-weight: 600;
}

.price-down {
  color: #44ff44;
  font-weight: 600;
}

.disclaimer {
  font-size: 14px;
  color: #888;
  margin: 20px 0;
  line-height: 1.6;
  padding: 15px;
  background: #2a2a2a;
  border-radius: 8px;
}

.contact-info {
  text-align: center;
  color: #ffd700;
  padding: 15px;
  background: #2a2a2a;
  border-radius: 8px;
}

.contact-info p {
  margin: 10px 0;
  font-size: 14px;
}

.qr-code {
  margin-top: 15px;
}

.qr-image {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: block;
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
    font-size: 28px;
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

/* 大屏幕电脑 */
@media screen and (min-width: 1440px) {
  .content-wrapper {
    max-width: 1400px;
    padding: 50px;
    gap: 30px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .col {
    font-size: 18px;
    padding: 20px;
  }

  .table-header {
    font-size: 18px;
  }

  .disclaimer {
    font-size: 16px;
  }

  .contact-info p {
    font-size: 16px;
  }

  .qr-image {
    width: 180px;
    height: 180px;
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
    font-size: 20px;
    margin-top: 0;
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
    font-size: 18px;
    margin-top: 0;
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

.price-value {
  display: inline-block;
  min-width: 80px;
}

/* 价格更新动画 */
.price-update-enter-active {
  animation: price-flash 0.5s ease-out;
}

@keyframes price-flash {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  50% {
    opacity: 0.5;
    transform: translateY(0);
    color: #ffd700;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

