<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 19:43:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-30 16:28:28
-->
<template>
  <OlTile v-bind="$attrs" v-on="$listeners" :map-provider="getMapProvider" />
</template>
<script setup>
import { computed, toRefs } from 'vue'
import OlTile from '../layer/index.vue'
import { isString } from '@/VMap/public/utils/base/validate';
const props = defineProps({
  mapProvider: {
    type: String,
    default: 'imagetile',
    validator(value){
      return isString(value) && ['imagetile','image','tile'].includes(value.toLowerCase())
    }
  },
})
const { mapProvider } = toRefs(props)
const getMapProvider = computed(() => {
  return 'arcgis' + mapProvider.value.toLowerCase()
})
</script>
<style lang="scss" scoped></style>
