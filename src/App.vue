<script setup lang="ts">
/**
 * 根组件只提供路由出口。
 * 不承载编辑器布局或画布（feat-004 / feat-005）。
 */
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
