<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:09:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-10-18 18:05:14
-->

<template>
  <div>
    <el-button type="primary" circle @click="handleDraw('Point')">
      <el-icon class="custom-class" size="22"> <IconVcPoint /> </el-icon
    ></el-button>
    <el-button type="primary" circle @click="handleDraw('LineString')">
      <el-icon class="custom-class" size="22"> <IconVcPolyline /> </el-icon
    ></el-button>
    <el-button type="primary" circle @click="handleDraw('Polygon')">
      <el-icon class="custom-class" size="22"> <IconVcPolygon /> </el-icon
    ></el-button>
    <el-button type="primary" circle @click="handleDraw('Clear')">
      <el-icon class="custom-class" size="22" color="white">
        <IconVcClean /> </el-icon
    ></el-button>
    <el-button type="danger" circle @click="handleClose">
      <el-icon class="custom-class" size="14"> <IconVcClose /> </el-icon
    ></el-button>
  </div>
</template>
<script setup>
const emits = defineEmits(['draw-change', 'close'])

const handleDraw = (type) => {
  emits('draw-change', type)
}

const handleClose = () => {
  emits('close')
}
</script>
<style scoped>
.custom-class {
  cursor: pointer;
}
</style>
