<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:09:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-07-10 17:05:32
-->

<template>
  <el-button-group>
    <!-- <el-button
      v-for="item in drawOptions"
      type="primary"
      @click="handleDraw('Point')"
    >
      <el-icon class="custom-class" size="22">
        <IconVcPoint />
      </el-icon>
    </el-button> -->
    <el-button type="primary" @click="handleDraw('Point')">
      <el-icon class="custom-class" size="22"> <IconVcPoint /> </el-icon
    ></el-button>
    <el-button type="primary" @click="handleDraw('LineString')">
      <el-icon class="custom-class" size="22"> <IconVcPolyline /> </el-icon
    ></el-button>
    <el-button type="primary" @click="handleDraw('Polygon')">
      <el-icon class="custom-class" size="22"> <IconVcPolygon /> </el-icon
    ></el-button>
    <!-- <el-button type="primary" @click="handleDraw('End')"></el-button> -->
    <el-button type="primary" @click="handleDraw('Clear')">
      <el-icon class="custom-class" size="22"> <Delete /> </el-icon
    ></el-button>
    <el-button type="danger" @click="handleClose">
      <el-icon class="custom-class" size="22"> <Close /> </el-icon
    ></el-button>
  </el-button-group>
</template>
<script setup>
import { Delete } from '@element-plus/icons-vue'

const emits = defineEmits(['draw-change', 'close'])

const drawOptions = [
  {
    label: '点',
    value: 'Point',
  },
  {
    label: '线',
    value: 'LineString',
  },
  {
    label: '面',
    value: 'Polygon',
  },
]

const handleDraw = (type) => {
  emits('draw-change', type)
}

const handleClose = () => {
  emits('close')
}
</script>
<style></style>
