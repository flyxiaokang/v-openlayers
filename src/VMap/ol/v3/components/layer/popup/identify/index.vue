<!--
 * @Description: identify
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-09-04 20:56:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-10-01 09:13:17
-->
<template>
  <MapPopup
    v-show="showPopup"
    :theme="theme"
    :title="title"
    :show-title="showTitle"
    :popupId="popupId"
    :contentHtml="popupContentHtml"
    @on-close="handleClosePopup"
    :class="popupClass"
  >
    <el-tabs
      v-model="activeIdentify"
      style="max-width: 600px"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in features"
        :label="item.name"
        :name="item.name"
        :key="index"
      >
        <TableWidget
          :style="{ height: identifyConfig.height + 'px', padding: '0' }"
          :table-header="identifyConfig.header"
          :show-header="identifyConfig.showHeader"
          :table-data="item.attributes"
        />
      </el-tab-pane>
    </el-tabs>
  </MapPopup>
</template>
<script setup>
import { ref, toRefs, watch, inject, onUnmounted } from 'vue'
import MapPopup from '@/VMap/ol/v3/components/popup/index.vue'
import TableWidget from '@/VMap/components/Table/index.vue'
import { useProps } from '../usePopup'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

const olHandler = inject('olHandler')
const props = defineProps({
  ...useProps,
  features: {
    type: Array,
    default() {
      return []
    },
  },
  identifyConfig: {
    type: Object,
    default() {
      return {}
    },
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  showHeader: {
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

const { showTitle, position, properties, features } = toRefs(props)
watch(
  properties,
  (nv) => {
    openFeaturePopup(position.value, properties.value)
  },
  {
    deep: true,
  }
)

watch(
  position,
  (nv) => {
    if (overlay === null) {
      openFeaturePopup(nv)
    }
    overlay.setPosition(nv)

    if (features.value.length > 0) {
      activeIdentify.value = features.value[0].name
    }
  },
  {
    deep: true,
  }
)

let overlay = null
const tableData = ref([])

const openFeaturePopup = (position, properties = []) => {
  // handleReset()
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

const handleReset = () => {
  if (overlay) {
    olHandler.map.removeOverlay(overlay)
    overlay = null
  }
}

const activeIdentify = ref('')
const handleClick = () => {}

onUnmounted(() => {
  handleReset()
})
</script>
<style lang="scss" scoped></style>
