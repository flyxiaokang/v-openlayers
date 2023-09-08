<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-09-04 20:56:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-07 09:36:39
-->
<template>
  <MapPopup
    v-show="showPopup"
    :title="title"
    :show-title="showTitle"
    :popupId="popupId"
    :contentHtml="popupContentHtml"
    @on-close="handleClosePopup"
    :class="popupClass"
  >
    <TableWidget
      :style="{ height: tableHeight + 'px' }"
      :table-header="tableHeader"
      :table-data="tableData"
    />
  </MapPopup>
</template>
<script setup>
import { ref, toRefs, watch, inject, onUnmounted } from 'vue'
import MapPopup from '../../popup/index.vue'
import TableWidget from '@/VMap/components/Table/index.vue'
import { useProps } from './usePopup'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

const olHandler = inject('olHandler')
const props = defineProps({
  ...useProps,
  showTitle: {
    type: Boolean,
    default: true,
  },
  position: {
    type: Array,
    default() {
      return []
    },
  },
  properties: {
    type: Array,
    default() {
      return []
    },
  },
})

const popupId = 'vmap-popup-id-' + uuidOnlyStr()
const popupContentHtml = ref('')
const showPopup = ref(false)
const popupClass = ref('vmap-popup-visible-' + uuidOnlyStr())

const { showTitle, position, properties } = toRefs(props)
watch(
  properties,
  (nv) => {
    openFeaturePopup(position.value, properties.value)
  },
  {
    deep: true,
  }
)

let overlay = null
const tableData = ref([])

const openFeaturePopup = (position, properties) => {
  handleReset()
  overlay = olHandler.createOverlay({
    popupId,
    center: position,
    offset: [0, 0],
    collection: false,
  })
  tableData.value = properties
  showPopup.value = true
}

const handleClosePopup = () => {
  overlay.setPosition(undefined)
  return false
}

const handleReset = ()=>{
  if (overlay) {
    olHandler.map.removeOverlay(overlay)
    overlay = null
  }
}
onUnmounted(() => {
  handleReset()
})
</script>
<style lang="scss" scoped></style>
