<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">实用前端工具</div>
      <el-menu :default-active="activeMenu" @select="(index: string) => activeMenu = index" class="el-menu-vertical">
        <el-menu-item index="1">
          <el-icon><DataAnalysis /></el-icon>
          <span>Java DTO 转 TS</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Document /></el-icon>
          <span>ZIP 压缩/解压</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <div v-show="activeMenu === '1'">
        <ZipTool />
      </div>
      <div v-show="activeMenu === '2'">
        <JavaToTs />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, DataAnalysis } from '@element-plus/icons-vue'
import ZipTool from './components/ZipTool.vue'
import JavaToTs from './components/JavaToTs.vue'

const activeMenu = ref('1')
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
}
.el-aside {
  background-color: #f5f7fa;
  border-right: solid 1px var(--el-menu-border-color);
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-light);
}
.el-menu-vertical {
  border-right: none;
  background-color: transparent;
}
.el-main {
  background-color: #ffffff;
  padding: 20px;
}
</style>
