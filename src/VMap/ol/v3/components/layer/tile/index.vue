<!--
 * @Description: tile
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-29 10:19:52
-->
<template>
  <Layer :map-provider="mapProvider" />
</template>

<script setup>
import Layer from '../layer/index.vue'
import { isString } from '@/VMap/public/utils/base/validate'

const props = defineProps({
  mapProvider: {
    type: String,
    default: '',
    require: true,
    validator(value) {
      return (
        isString(value) &&
        ['tdt', 'wmts', 'xyz', 'supermap', 'arcgistile'].includes(
          value.toLowerCase()
        )
      )
    },
  },
})
</script>

<script>
export default {
  name: 'OlTile',
}
</script>
<style lang="scss" scoped></style>
