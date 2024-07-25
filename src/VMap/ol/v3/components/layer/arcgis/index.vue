<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 19:43:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-06 15:55:03
-->
<template>
  <!-- <Layer v-bind="$attrs" v-on="$listeners" :map-provider="getMapProvider" /> -->
  <Layer :map-provider="getMapProvider" />
</template>
<script setup>
import { computed, toRefs } from 'vue'
import Layer from '../layer/index.vue'
import { isString } from '@/VMap/public/utils/base/validate'
const props = defineProps({
  mapProvider: {
    type: String,
    default: 'imagetile',
    validator(value) {
      return (
        isString(value) &&
        ['imagetile', 'image', 'tile'].includes(value.toLowerCase())
      )
    },
  },
})
const { mapProvider } = toRefs(props)
const getMapProvider = computed(() => {
  return 'arcgis' + mapProvider.value.toLowerCase()
})
</script>

<script>
export default {
  name: 'OlArcgis',
}
</script>
<style lang="scss" scoped></style>
