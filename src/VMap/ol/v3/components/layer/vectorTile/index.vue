<!--
 * @Description: vectortile
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-06 16:02:20
-->
<template>
  <Layer :map-provider="getMapProvider" />
</template>

<script setup>
import { toRefs, computed } from 'vue'
import Layer from '../layer/index.vue'

const props = defineProps({
  mapProvider: {
    type: String,
    default: 'geoserverMvt',
  },
})

const { mapProvider } = toRefs(props)

const getMapProvider = computed(() => {
  return 'geoservermvt'
  // return mapProvider.value.toLowerCase() + 'Mvt'
})
</script>

<script>
export default {
  name: 'OlVectortile',
}
</script>
<style lang="scss" scoped></style>
