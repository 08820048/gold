<script setup>
import BottomNav from './components/BottomNav.vue';
</script>

<template>
  <div class="app-container">
    <router-view />
    <BottomNav />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
}

/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #1a1a1a;
  color: white;
}
</style>
