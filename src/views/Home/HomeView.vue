<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteName } from '@/constants/enum/route'

const router = useRouter()

const navigateToEditor = () => {
  router.push({ name: RouteName.ADD })
}
</script>

<template>
  <div class="home-view">
    <div class="home-container">
      <h1 class="home-title">PixiJS 图形编辑器</h1>
      <p class="home-description">基于 Vue 3 + PixiJS v8 构建的专业图形编辑器</p>
      <div class="home-actions">
        <button class="btn-primary" @click="navigateToEditor">开始使用</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.home-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home-container {
  color: #fff;
  text-align: center;
}

.home-title {
  margin-bottom: 16px;
  font-size: 48px;
  font-weight: 700;
}

.home-description {
  margin-bottom: 32px;
  font-size: 18px;
  opacity: 0.9;
}

.home-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
    transform: translateY(-2px);
  }
}
</style>
