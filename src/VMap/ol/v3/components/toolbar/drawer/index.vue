<!--
 * @Description: 绘制工具
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-07-07 10:49:43
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-23 17:04:47
-->
<template>
  <MapDraw @draw-change="handleDrawChange" @close="handleCloseDraw" />
</template>
<script setup>
import { ref, inject, toRefs } from 'vue'
import MapDraw from '@/VMap/components/Map/MapDraw.vue'

import { getOlHandler } from '@/VMap/ol/init'

const props = defineProps({
  snapEnable: {
    type: Boolean,
    default: false,
  },
  modifyEnable: {
    type: Boolean,
    default: false,
  },
  onceOnly: {
    type: Boolean,
    default: false,
  },
  selectEnable: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['draw-end', 'close'])

const { snapEnable, selectEnable, modifyEnable, onceOnly } = toRefs(props)

let olHandler = getOlHandler()
olHandler = inject('olHandler')

// 绘制
const handleDrawChange = (type) => {
  if (type === 'End') {
    olHandler.getDrawHandler()?.endDraw()
  } else if (type === 'Clear') {
    olHandler.getDrawHandler()?.clear()
  } else {
    olHandler.getDrawHandler().drawByType({
      type,
      snapEnable: snapEnable.value,
      modifyEnable: modifyEnable.value,
      onceOnly: onceOnly.value,
      selectEnable: selectEnable.value,
      drawEndHandle: (e) => {
        emits('draw-end', e)
      },
    })
  }
}

const handleCloseDraw = () => {
  olHandler.getDrawHandler()?.clear()
  olHandler.getDrawHandler()?.endDraw()
  emits('close')
}
</script>

<script>
export default {
  name: 'OlDrawer',
}
</script>
<style lang="scss" scoped></style>
