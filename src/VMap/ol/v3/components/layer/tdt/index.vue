<!--
 * @Description: tdt
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-01-02 10:45:57
-->
<template>
  <Layer map-provider="tdt" :map-style="mapStyle" />
</template>

<script setup>
import Layer from '../layer/index.vue'
import { isString } from '@/VMap/public/utils/base/validate'

const props = defineProps({
  mapStyle: {
    type: [String,Array],
    default: 'img',
    validator(value) {
      return (
        isString(value) && ['img', 'vec', 'ter'].includes(value.toLowerCase())
      )
    },
  },
})
</script>

<script>
export default {
  name: 'OlTdt',
}
</script>
<style lang="scss" scoped></style>
