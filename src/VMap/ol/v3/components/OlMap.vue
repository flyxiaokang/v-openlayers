<!--
 * @Description: ol-map
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-12 19:55:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-20 14:57:22
-->
<template>
  <div class="vmap-container">
    <!-- map -->
    <div :id="target" class="vmap-view" />
    <slot name="popup"></slot>
    <slot></slot>
    <!-- 地图状态条 -->
    <MapStatus
      v-if="showStatusbar"
      :theme="theme"
      :position="position"
      :zoom="curZoom"
    />
    <!-- popup -->
    <MapPopup
      v-show="showFeaturePopupLocal"
      :popupId="popupId"
      :title="featurePopupTitle"
      :contentHtml="popupContentHtml"
      @on-close="handleClosePopup"
    >
      <TableWidget
        :style="{ height: singlePopupTableHeight + 'px' }"
        :table-header="singlePopupTableHeader"
        :table-data="featureTableData"
      />
    </MapPopup>
    <!-- multiple popup -->
    <div v-show="showMultiplePopupLocal" :id="popupsId">
      <MapPopup
        v-for="(item, index) in computePopups"
        :popupId="item.id"
        :key="item.id"
        :show-title="false"
      >
        <TableWidget
          :style="{ height: multiplePopupTableHeight + 'px' }"
          :table-header="multiplePopupTableHeader"
          :table-data="item.attributes"
        />
      </MapPopup>
    </div>
    <!-- identify -->
    <!-- <MapPopup
      v-show="showIdentify"
      :popupId="popupId + '_identify_'"
      title="属性"
      @on-close="handleClosePopup"
    >
      <el-tabs
        v-model="activeIdentify"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in identifyList"
          :label="item.name"
          :name="item.name"
          :key="index"
        >
          <TableWidget
            :style="{ height: singlePopupTableHeight + 'px' }"
            :table-header="singlePopupTableHeader"
            :table-data="item.attributes"
          />
        </el-tab-pane>
      </el-tabs>
    </MapPopup> -->

    <!-- identify -->
    <OlIdentify
      title="属性"
      :theme="identifyConfig.theme"
      :position="curPosition"
    >
      <el-tabs
        v-model="activeIdentify"
        style="max-width: 200px"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in identifyList"
          :label="item.name"
          :name="item.name"
          :key="index"
        >
          <TableWidget
            :style="{ height: identifyConfig.height + 'px' }"
            :table-header="identifyConfig.header"
            :show-header="identifyConfig.showHeader"
            :table-data="item.attributes"
          />
        </el-tab-pane>
      </el-tabs>
    </OlIdentify>

    <!-- 绘制 -->
    <!-- <MapDraw
      v-if="showMapDraw"
      class="vmap-drawer"
      @draw-change="handleDrawChange"
      @close="handleCloseDraw"
    /> -->
    <!-- 图层管理 -->
    <!-- <transition name="el-zoom-in-top">
      <Draggable
        v-if="layerManagerVisible"
        title="图层列表"
        :initTop="0"
        :init-right="100"
        :initWidth="200"
        :initHeight="400"
        @closeDraggable="handleCloseTool"
      >
        <MapLayerManager
          :default-checked="defaultCheckLayerIds"
          @on-checkchange="handleCheckChange"
        />
      </Draggable>
    </transition> -->
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch, reactive, provide } from 'vue'
import { getOlHandler } from '@/VMap/ol/init'
import { setConfig, getConfig } from '@/VMap/ol/config'
import VUtils from '@/VMap/public/utils/base'

import OlIdentify from '@/VMap/ol/v3/components/layer/popup/Identify.vue'

import MapPopup from './popup/index.vue'
// import MapLayerManager from '@/VMap/public/components/Map/MapLayerManager.vue'
import MapStatus from '@/VMap/public/components/Map/MapStatus.vue'
import MapDraw from '@/VMap/public/components/Map/MapDraw.vue'

import TableWidget from '@/VMap/components/Table/index.vue'
//import Draggable from '@/VMap/components/Draggable/index.vue'
import { V_MOUSE_STATUS } from '@/VMap/global'
import { V_THEME } from '@/VMap/global'
import { useEmits } from '@/VMap/public/use/useEvent'

const olInstance = getOlHandler()

const curMapCenter = ref([])

provide('olHandler', olInstance)
provide('mapCenter', curMapCenter)

const props = defineProps({
  mapConfig: {
    type: Object,
    default() {
      return getConfig()
    },
  },
  theme: {
    type: String,
    default: V_THEME.light,
  },
  showFeaturePopup: {
    type: Boolean,
    default: false,
  },
  singlePopupTableHeight: {
    type: Number,
    default: 200,
  },
  singlePopupTableHeader: {
    type: Array,
    default() {
      return [
        {
          label: '属性',
          value: 'label',
        },
        {
          label: '值',
          value: 'value',
          width: 100,
        },
      ]
    },
  },
  multiplePopupTableHeight: {
    type: Number,
    default: 200,
  },
  multiplePopupTableHeader: {
    type: Array,
    default() {
      return [
        {
          label: '属性',
          value: 'label',
        },
        {
          label: '值',
          value: 'value',
          width: 100,
        },
      ]
    },
  },
  multiplePopupConfig: {
    type: Object,
    default() {
      return {
        tableHeight: 180,
      }
    },
  },
  featurePopupTitle: {
    type: String,
    default: '标题',
  },
  featurePopup: {
    type: Object,
    default() {
      return {}
    },
  },
  showMultiplePopup: {
    type: Boolean,
    default: false,
  },
  multiplePopup: {
    type: Array,
    default() {
      return []
    },
  },
  identify: {
    type: Boolean,
    default: false,
  },
  identifyConfig: {
    type: Object,
    default() {
      return {
        height: 200,
        header: [
          {
            label: '属性',
            value: 'label',
          },
          {
            label: '值',
            value: 'value',
          },
        ],
        showHeader: false,
        theme: 'light',
      }
    },
  },
  showStatusbar: {
    type: Boolean,
    default: true,
  },
  showBasemap: {
    type: Boolean,
    default: true,
  },
  dragPan: {
    type: Boolean,
    default: true,
  },
  controls: {
    type: Object,
    default() {
      return {
        zoom: true,
        scaleLine: true,
      }
    },
  },
})

const {
  featurePopupTitle,
  featurePopup,
  multiplePopup,
  mapConfig,
  controls,
  showBasemap,
  showFeaturePopup,
  showMultiplePopup,
  identify,
  dragPan,
} = toRefs(props)

const emits = defineEmits(useEmits)

const target = `${VUtils.uuidOnlyStr()}-vmap-id`
let mapReady = false
// 实时坐标
let position = ref([0, 0])

let layerManagerVisible = ref(false)
let showFeaturePopupLocal = ref(false)
let showMultiplePopupLocal = ref(false)
let overlay = null
const popupId = 'ol-custom-popup-id'
const popupsId = 'ol-custom-popups-id'
let attributeOverlay = null
let popupContentHtml = ''
const popupPrefix = 'm-custom-popup-'

let showIdentify = ref(false)
let activeIdentify = ref('')
let identifyList = ref([])

const featureTableData = ref([])

const computePopups = computed(() => {
  return multiplePopup.value.map((e) => {
    return {
      ...e,
      id: popupPrefix + parseInt(Math.random() * 10e5),
    }
  })
})
watch(
  featurePopup,
  (nv, ov) => {
    if (checkFeaturePopup(nv)) {
      const { location, attributes } = nv
      if (attributes instanceof Array && attributes.length > 0) {
        openFeaturePopup(location, attributes)
      }
    }
  },
  {
    deep: true,
  }
)
watch(
  multiplePopup,
  (nv, ov) => {
    if (checkMultiplePopup(nv)) {
      showMultiplePopupLocal.value = false
      setTimeout(() => {
        bindMultiplePopup()
      }, 0)
    }
  },
  {
    deep: true,
  }
)

const checkFeaturePopup = (nv) => {
  if (
    mapReady &&
    showFeaturePopup.value &&
    JSON.stringify(nv) != '{}' &&
    nv.hasOwnProperty('location') &&
    nv.hasOwnProperty('attributes')
  ) {
    return true
  } else return false
}

const checkMultiplePopup = (nv) => {
  if (mapReady && showMultiplePopup.value && nv instanceof Array) {
    return true
  } else return false
}

const handleClick = () => {}

const defaultCheckLayerIds = ref([])
let showMapDraw = ref(true)
setConfig(mapConfig.value)

const curZoom = ref(0)
onMounted(() => {
  olInstance.target = target
  olInstance.initMap(
    (map) => {
      mapReady = true
      map.set('mouseStatus', V_MOUSE_STATUS.none)
      emits('ready', olInstance)
      curZoom.value = map.getView().getZoom()
      bindEvent()
    },
    {
      controls: controls.value,
      showBasemap: showBasemap.value,
      dragPan: dragPan.value,
      view: mapConfig.value.defaultView,
    }
  )
})

// 事件
const bindEvent = () => {
  olInstance.registerMouseMove((e) => {
    position.value = [e.coordinate[0].toFixed(4), e.coordinate[1].toFixed(4)]
    emits('mouse-move', e)
  })

  olInstance.registerMouseClick((e) => {
    if (identify.value && !showFeaturePopup.value) {
      handleIdentify(e)
    }
    emits('mouse-click', e)
  })

  olInstance.registerMouseDbClick((e) => {
    emits('mouse-dbclick', e)
  })

  olInstance.registerMouseMoveEnd((e) => {
    emits('mouse-moveend', e)
    curZoom.value = olInstance.map.getView().getZoom()
    curMapCenter.value = olInstance.map.getView().getCenter()
  })
}
const curPosition = ref([])

// i查询
const handleIdentify = (e) => {
  let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
  const coordinate = e.coordinate
  if (features.length === 0) {
    return
  }
  // openIdentifyPopup(coordinate)
  curPosition.value = coordinate
  identifyList.value = []
  features.forEach((feature, index) => {
    activeIdentify.value = '要素_' + 1
    identifyList.value.push({
      name: '要素_' + (index + 1),
      location: coordinate,
      attributes: VUtils.object2Array(feature.getProperties()),
    })
  })
}

const openIdentifyPopup = (location) => {
  overlay = olInstance.createOverlay({
    popupId: popupId + '_identify_',
    center: location,
    offset: [0, 0],
    collection: false,
  })
  showIdentify.value = true
}

const bindPopup = () => {
  const container = document.getElementById(popupId)
  /**
   * Create an overlay to anchor the popup to the map.
   */
  overlay = olInstance.addOverlay(container)
  attributeOverlay = olInstance.addOverlay()
}

const openFeaturePopup = (location, attributes) => {
  overlay = olInstance.createOverlay({
    popupId: popupId,
    center: location,
    // html: getHtml(attributes),
    offset: [0, 0],
    collection: false,
  })
  featureTableData.value = attributes
  showFeaturePopupLocal.value = true
}

const getHtml = (data) => {
  let html = ''
  data.forEach((element) => {
    const { value, label } = element
    html += `<div style="display:flex;padding:2px;"><div style="width:50%;text-align:left;background-clor:azure;">${label}：</div><div style="width:auto;text-align:left;">${value}</div></div>`
  })

  html += ''
  return html
}

const bindMultiplePopup = () => {
  if (showMultiplePopup.value) {
    computePopups.value.forEach((popup) => {
      const { id, location, attributes } = popup
      olInstance.createOverlay({
        popupId: id,
        center: location,
        // html: getHtml(attributes),
        offset: [0, 0],
      })
    })

    showMultiplePopupLocal.value = true
  }
}

const handleClosePopup = () => {
  overlay.setPosition(undefined)
  return false
}

const openPopup = (coordinate) => {
  popupContentHtml = `<p>当前坐标:</p>${coordinate.join(',')}`
  overlay.setPosition(coordinate)
}

const object2Array = (properties) => {
  const attributes = []
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key]
      // console.log('key...', key, element)
      if (typeof element !== 'object') {
        attributes.push({
          label: key,
          value: element,
        })
      }
    }
  }

  return attributes
}

const handleCheckChange = (item, checked, indeterminate) => {
  // console.log(item, checked, indeterminate);
  if (
    item.hasOwnProperty('children') &&
    item.children.length > 0 &&
    !indeterminate
  ) {
    // all
    let list = []
    VUtils.tree2list(item.children, list)
    list.forEach((layer) => {
      let { id } = layer
      layer['visible'] = checked
      // console.log("all", layer.id);
      VUtils.pushNoReapeat(defaultCheckLayerIds.value, id, checked)
      olInstance.addLayerByType({ ...layer, visible: checked })
    })
  } else if (!item.hasOwnProperty('children') && !indeterminate) {
    // single
    // console.log("single", item.id);
    VUtils.pushNoReapeat(defaultCheckLayerIds.value, item.id, checked)
    olInstance.addLayerByType({ ...item, visible: checked })
  }
}

// 绘制
const handleDrawChange = (type, snapEnable = true, modifyEnable = false) => {
  if (type === 'End') {
    olInstance.getDrawHandler()?.endDraw()
  } else if (type === 'Clear') {
    olInstance.getDrawHandler()?.clear()
  } else {
    olInstance.getDrawHandler().drawByType({
      type,
      snapEnable,
      modifyEnable,
      drawEndHandle: (e) => {
        emits('draw-end', e)
      },
    })
  }
}

const handleCloseDraw = () => {
  showMapDraw.value = false
  olInstance.getDrawHandler()?.clear()
  olInstance.getDrawHandler()?.endDraw()
}
</script>

<script>
export default {
  name: 'OlMap',
}
</script>

<style lang="scss" scoped>
.vmap-container {
  width: 100%;
  // height: 100%;
  position: relative;
}
.custom-icon-container {
  position: absolute;
  top: 100px;
  left: 50px;
  z-index: 3999;
}
.vmap-view {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
}

.map-status {
  position: absolute;
  bottom: 0px;
  right: 20px;
}

.ol-map-layer-manager {
  position: absolute;
  top: 20px;
  right: 50px;
}

// .model_popup {
//   display: none;
//   padding: 3px 5px;
//   color: white;
//   font-size: 14px;
//   font-weight: bold;
//   min-width: 20px !important;
//   left: -20px !important;
//   text-align: center;
// }

.ol-popup {
  background-color: rgba(0, 0, 0, 0) !important;
}

.popup-content {
  background-color: white;
  padding: 5px 5px;
  border-radius: 5px;
  font-family: serif;
  font-size: 12px;
  color: black;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  user-select: none;
}

.triangle {
  display: inline-block;
  width: 0;
  height: 0;
  line-height: 0;
  border: 10px solid transparent;
  border-top-color: #46a6ff;
  border-bottom-width: 0;
}

.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 80px;
}

.vmap-overlay-top {
  z-index: 9999;
}

:deep(.ol-tooltip) {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}

:deep(.ol-tooltip-measure) {
  opacity: 1;
  font-weight: bold;
}

:deep(.ol-tooltip-static) {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

:deep(.ol-tooltip-measure:before),
:deep(.ol-tooltip-static:before) {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

:deep(.ol-tooltip-static:before) {
  border-top-color: #ffcc33;
}

:deep(.ol-dragzoom) {
  border: 2px dashed red;
}

:deep(.ol-scale-line.ol-unselectable) {
  // left: calc(100% - 120px);
  left: 10px;
  padding: 4px;
  bottom: 0px;
  background-color: rgb(255, 255, 255);
  // width: 100px;
}

:deep(.ol-scale-line-inner) {
  font-weight: bold;
  font-size: 12px;
}

// :deep(.vmap-ol-popup.dark .el-table tr) {
//   background-color: rgba(0, 0, 0, 0.5);
//   color: white;
// }

// :deep(.vmap-ol-popup.dark .el-scrollbar__wrap) {
//   background-color: rgba(0, 0, 0, 0.5);
//   color: white;
// }

:deep(.vmap-ol-popup.dark .el-tabs__item.is-active) {
  color: #dddddd;
}
</style>

<style>
@import url(../../../public/static/css/theme.css);
</style>
