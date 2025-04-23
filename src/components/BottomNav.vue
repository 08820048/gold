<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = computed(() => {
  return (path) => route.path === path
})
</script>

<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
      <div class="nav-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="nav-text">首页</div>
    </router-link>
    
    <router-link to="/about" class="nav-item" :class="{ active: isActive('/about') }">
      <div class="nav-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div class="nav-text">关于</div>
    </router-link>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #222;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: #aaa;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item.active {
  color: #ffd700;
}

.nav-icon {
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
}

/* 响应式调整 */
@media screen and (max-width: 480px) {
  .bottom-nav {
    height: 50px;
  }
  
  .nav-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .nav-text {
    font-size: 10px;
  }
}
</style>
