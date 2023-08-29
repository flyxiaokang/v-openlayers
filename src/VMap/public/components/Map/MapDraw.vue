<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:09:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-18 14:05:09
-->

<template>
  <el-button-group>
    <el-button type="primary" @click="handleDraw('Point')">
      <el-icon class="custom-class" size="22"> <IconVcPoint /> </el-icon
    ></el-button>
    <el-button type="primary" @click="handleDraw('LineString')">
      <el-icon class="custom-class" size="22"> <IconVcPolyline /> </el-icon
    ></el-button>
    <el-button type="primary" @click="handleDraw('Polygon')">
      <el-icon class="custom-class" size="22"> <IconVcPolygon /> </el-icon
    ></el-button>
    <el-button type="primary" @click="handleDraw('Clear')">
      <el-icon class="custom-class" size="22" color="white"> <IconVcClean /> </el-icon
    ></el-button>
    <el-button type="danger" @click="handleClose">
      <el-icon class="custom-class" size="22"> <IconVcClose/> </el-icon
    ></el-button>
  </el-button-group>
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
<style></style>
