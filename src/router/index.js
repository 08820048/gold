import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    // 路由懒加载
    component: () => import('../views/AboutPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
