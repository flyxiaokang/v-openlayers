<!--
 * @Description: wms
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 19:43:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-30 10:50:08
-->
<template>
  <OlTile v-bind="$attrs" v-on="$listeners" :map-provider="getMapProvider" />
</template>
<script setup>
import OlTile from '../layer/index.vue'
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
<style lang="scss" scoped></style>
