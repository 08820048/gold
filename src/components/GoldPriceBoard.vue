<template>
  <div class="container">
    <header class="title">杭州大傻</header>
    <table class="price-table">
      <thead>
        <tr>
          <th>品类</th>
          <th>回购</th>
          <th>销售</th>
          <th>最新价</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in prices" :key="item.name">
          <td>{{ item.name }}</td>
          <td :class="item.buyClass">{{ item.buy }}</td>
          <td :class="item.sellClass">{{ item.sell }}</td>
          <td :class="item.latestClass">{{ item.latest }}</td>
        </tr>
      </tbody>
    </table>
    <section class="notice">
      <p>声明：<span class="notice-bold">●</span> 上图黄金当前报价参考上海黄金交易所Au9999实时金价进行预估的回收价，金量工艺达到99.99%，回收时以实际含金量进行打秤， 也以您的初步商品进行检测，并按当下的实时金价及检测结果进行报价。检测过程和报价提供的信息有误差，或实时金价发生变化，实际回收价格可能产生变化，手表款也会发生变化。<span class="notice-bold">●</span> 提醒：全部数据供体验测试,如不对本表负责。实金交易务必当面交易，谨防受骗，如发现相关情况请及时报警。</p>
      <p>（黄金品类手续费率：金条2%，金饰2.4%，其他类目回收请咨询为准）。破除后方克数破除后含金量不足实时含价-1(服务费率) = 黄金最终回收价格。</p>
      <p>联系方式：<span class="notice-bold">手机号15555521595（微信同号）</span></p>
      <p>地址：杭州市上城区久境街运营中心站旁。</p>
    </section>
    <div class="qrcode-section">
      <img class="qrcode" src="/code.png" alt="微信二维码" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const prices = reactive([
  { name: '黄金', buy: '787.00', sell: '787.80', latest: '788.00', buyClass: '', sellClass: '', latestClass: 'up' },
  { name: '白银', buy: '7.650', sell: '7.700', latest: '7.700', buyClass: '', sellClass: 'up', latestClass: 'up' },
  { name: '18K金', buy: '590.25', sell: '590.85', latest: '591.00', buyClass: '', sellClass: '', latestClass: 'up' },
  { name: '铂金950', buy: '215.65', sell: '217.07', latest: '217.05', buyClass: '', sellClass: 'up', latestClass: '' },
  { name: '钯金990', buy: '217.80', sell: '219.28', latest: '219.88', buyClass: '', sellClass: 'up', latestClass: 'up' },
])
</script>

<style scoped>
.container {
  max-width: 900px;
  min-width: 320px;
  margin: 32px auto;
  background: #181818;
  color: #f3f3f3;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.15);
  padding: 32px 24px 32px 24px;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}
.title {
  text-align: center;
  font-size: 2.6rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 18px;
  letter-spacing: 2px;
}
.price-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 18px;
  font-size: 1.15rem;
}
.price-table th, .price-table td {
  border: 1px solid #333;
  padding: 12px 0;
  text-align: center;
}
.price-table th {
  background: #232323;
  color: #ffd700;
  font-weight: 600;
}
.price-table td.up {
  color: #ff3c3c;
}
.price-table td {
  color: #f3f3f3;
}
.notice {
  font-size: 1rem;
  background: #202020;
  border-radius: 8px;
  padding: 12px 16px;
  color: #bbb;
  margin-bottom: 18px;
}
.notice-bold {
  color: #ffd700;
  font-weight: bold;
}
.qrcode-section {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
.qrcode {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: #fff;
  padding: 8px;
}
@media (max-width: 900px) {
  .container {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
}
@media (max-width: 600px) {
  .container {
    max-width: 100vw;
    border-radius: 0;
    padding: 8px 0 14px 0;
    margin: 0;
  }
  .title {
    font-size: 1.5rem;
  }
  .qrcode {
    width: 90px;
    height: 90px;
  }
  .notice {
    font-size: 0.85rem;
    padding: 8px 4px;
  }
  .price-table th, .price-table td {
    padding: 7px 0;
    font-size: 0.96rem;
  }
}
</style>
