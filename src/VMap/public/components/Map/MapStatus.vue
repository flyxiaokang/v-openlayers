<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-19 14:32:40
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-04 15:53:26
-->

<template>
  <div class="vmap-status-bar">
    <div
      class="item"
      style="
        display: flex;
        justify-content: space-around;
        width: 280px;
      "
    >
      <span>{{ parseLonLat[0] }}</span>
      <span>{{ parseLonLat[1] }}</span>
    </div>
    <div class="item">
      地图级别
      {{ parseInt(zoom) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, nextTick } from 'vue'

const olHandler = inject('olHandler')

const props = defineProps({
  position: {
    type: Array,
    default() {
      return [-1, -1]
    },
  },
  zoom: {
    type: Number,
    default: 0,
  },
})

const parseLonLat = computed(() => {
  let [lon, lat] = props.position
  let labelX = 'X '
  let labelY = 'Y '
  let unit = '米'
  if (lon < 180 && lon > -180) {
    labelX = '经度 '
    labelY = '纬度 '
    unit = ''
  }
  return [
    labelX + parseFloat(lon).toFixed(4) + unit,
    labelY + parseFloat(lat).toFixed(4) + unit,
  ]
})
</script>

<style scope>
@import url('../../static/css/toolbar.css');
</style>
