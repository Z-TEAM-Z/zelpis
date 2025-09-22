<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row type="flex" align="middle" class="header-row">
        <!-- 左上方title -->
        <el-row type="flex" align="middle" class="title-panel">
          <img src="./asserts/logo.png" class="logo" />
          <el-row class="text">
            {{ title }}
          </el-row>
        </el-row>
        <!-- 插槽：菜单区域 -->
        <slot name="menu-content" />
        <!-- 右上方区域 -->
        <el-row type="flex" align="middle" justify="end" class="setting-panel">
          <!-- 插槽：设置区域 -->
          <slot name="setting-content" />
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <!-- 外部拓展填充区域 -->
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: 'elpis',
  },
});
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;
  .header {
    max-height: 120px;
    border-bottom: 1px solid #ebeef5;
    .header-row {
      height: 60px;
      padding: 0 20px;
      .title-panel {
        width: 180px;
        .logo {
          margin-right: 10px;
          width: 25px;
          border-radius: 50%;
        }
        .text {
          font-size: 16px;
          line-height: 60px;
          font-weight: 800;
        }
      }
      .setting-panel {
        margin-left: auto;
        min-width: 180px;
      }
    }
  }
  .main-container {
  }
}

:deep(.el-header) {
  padding: 0;
}
</style>
