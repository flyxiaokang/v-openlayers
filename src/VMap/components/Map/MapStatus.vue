<!--
 * @Description: 状态条
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-19 14:32:40
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-01 14:09:59
-->

<template>
  <div class="vmap-status-bar">
    <div
      :class="['item',getClass]"
      style="display: flex; justify-content: space-around; width: 350px"
    >
      <span>{{ parseLonLat[0] }}</span>
      <span>{{ parseLonLat[1] }}</span>
      层级：
      {{ parseInt(zoom) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, nextTick ,toRefs} from 'vue'
import { toLonLat } from 'ol/proj'
import { getConfig } from '@/VMap/ol/config'
const olHandler = inject('olHandler')

import { V_THEME } from '@/VMap/global'
import { getClassByTheme } from '@/VMap/public/use/theme'

const props = defineProps({
  theme: {
    type: String,
    default: V_THEME.light,
  },
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
  let labelX = '经度：'
  let labelY = '纬度：'
  let unit = '°'
  let [lon, lat] = props.position
  if (lon < 180 && lon > -180) {
  } else {
    ;[lon, lat] = toLonLat(props.position, getConfig().prj)
  }
  return [
    labelX + parseFloat(lon).toFixed(4) + unit,
    labelY + parseFloat(lat).toFixed(4) + unit,
  ]
})

const { theme } = toRefs(props)
const getClass = computed(() => {
  return [ getClassByTheme(theme.value)]
})
</script>

<style scope>
@import url('@/VMap/public/static/css/toolbar.css');
</style>
