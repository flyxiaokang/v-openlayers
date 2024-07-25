<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-04-10 10:18:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-04-10 10:18:21
-->
<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-07-07 10:49:43
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-07-07 10:49:45
-->
<template>
  <el-radio-group v-model="defaultDraw" size="large">
    <el-radio-button v-for="item in drawOptions" :label="item.value">{{
      item.label
    }}</el-radio-button>
  </el-radio-group>
</template>
<script setup>
import { ref } from 'vue'

const defaultDraw = ref('')
const drawOptions = [
  {
    label: '点',
    value: 'Point',
  },
  {
    label: '线',
    value: 'Polyline',
  },
  {
    label: '面',
    value: 'Polygon',
  },
]
</script>
<style lang="scss" scoped></style>
