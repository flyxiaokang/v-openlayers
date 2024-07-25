<!--
 * @Description: wms
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 19:43:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-06 15:56:00
-->
<template>
  <Layer :map-provider="getMapProvider" />
</template>
<script setup>
import Layer from '../layer/index.vue'
import { ref, toRefs, computed } from 'vue'
import { isString } from '@/VMap/public/utils/base/validate'

const props = defineProps({
  mapProvider: {
    type: String,
    default: 'imagetile',
    validator(value) {
      return isString(value) && ['imagetile', 'image'].includes(value)
    },
  },
})

const { mapProvider } = toRefs(props)
const getMapProvider = computed(() => {
  return 'wms' + mapProvider.value.toLowerCase()
})
</script>

<script>
export default {
  name: 'OlWms',
}
</script>
<style lang="scss" scoped></style>
