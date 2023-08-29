<!--
 * @Description: ol-map
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-12 19:55:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-29 14:26:04
-->
<template>
  <div class="vmap-container">
    <!-- map -->
    <div :id="target" class="vmap-view" />
    <slot name="popup"></slot>
    <slot></slot>
    <!-- 工具条 -->
    <MapBar
      v-if="showToolbar"
      :tool-index="curToolIndex"
      @on-change="handleMapTool"
    />
    <!-- 地图状态条 -->
    <MapStatus v-if="showStatusbar" :latlon="latlon" />
    <!-- 底图 -->
    <MapBaseLayer v-if="showBasemapbar" @on-toggle="toggleMap" />
    <!-- popup -->
    <MapPopup
      v-show="showFeaturePopupLocal"
      :popupId="popupId"
      :title="featurePopupTitle"
      :contentHtml="popupContentHtml"
      @on-close="handleClosePopup"
    >
      <TableWidget
        style="height: 300px"
        :table-header="singlePopupConfig.tableHeader"
        :table-data="singlePopupConfig.tableData"
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
          style="height: 160px"
          :table-header="multiplePopupConfig.tableHeader"
          :table-data="item.attributes"
        />
      </MapPopup>
    </div>
    <!-- identify -->
    <MapPopup
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
            style="height: 300px"
            :table-header="singlePopupConfig.tableHeader"
            :table-data="item.attributes"
          />
        </el-tab-pane>
      </el-tabs>
    </MapPopup>
    <!-- 绘制 -->
    <MapDraw
      v-if="showMapDraw"
      class="vmap-drawer"
      @draw-change="handleDrawChange"
      @close="handleCloseDraw"
    />
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
import { getOlHandler } from '@/VMap/ol/init'
import { setConfig, getConfig } from '@/VMap/ol/config'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'
import VcUtils from '@/VMap/public/utils/base'

import MapBar from './toolbar/MapBar.vue'
import MapBaseLayer from './toolbar/MapBaseLayer.vue'
import MapPopup from './popup/index.vue'
// import MapLayerManager from '@/VMap/public/components/Map/MapLayerManager.vue'
import MapStatus from '@/VMap/public/components/Map/MapStatus.vue'
import MapDraw from '@/VMap/public/components/Map/MapDraw.vue'

import TableWidget from '@/VMap/public/components/Table/index.vue'
import Draggable from '@/VMap/components/Draggable/index.vue'
import { ref, toRefs, onMounted, computed, watch, reactive, provide } from 'vue'
import { V_MOUSE_STATUS_ENUM } from '@/VMap/global'

const olInstance = getOlHandler()

provide('olHandler', olInstance)

const props = defineProps({
  mapConfig: {
    type: Object,
    default() {
      return getConfig()
    },
  },

  showFeaturePopup: {
    type: Boolean,
    default: false,
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

  showIcons: {
    type: Boolean,
    default: false,
  },

  showToolbar: {
    type: Boolean,
    default: false,
  },

  showBasemapbar: {
    type: Boolean,
    default: false,
  },

  showStatusbar: {
    type: Boolean,
    default: true,
  },

  controls: {
    type: Object,
    default() {
      return {
        showBasemap: true,
        zoom: true,
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
  showFeaturePopup,
  showMultiplePopup,
  identify,
} = toRefs(props)

const emits = defineEmits([
  'ready',
  'mouse-move',
  'mouse-click',
  'mouse-dbclick',
  'mouse-moveend',
  'draw-end',
  'tool-change',
  'basemap-change',
])

const target = `${uuidOnlyStr()}-vmap-map`

let mapReady = false
// 实时坐标
let latlon = ref([0, 0])

let curToolIndex = -1
let layerManagerVisible = ref(false)

let showFeaturePopupLocal = ref(false)
let showMultiplePopupLocal = ref(false)
let overlay = null
const popupId = 'ol-custom-popup-id'
const popupsId = 'ol-custom-popups-id'
let attributeOverlay = null
let popupContentHtml = ''
const popupContent = ''
const popupPrefix = 'm-custom-popup-'
const multiplePopupReady = true
const updatePopups = false

let showIdentify = ref(false)
let activeIdentify = ref('')
let identifyList = ref([])

let singlePopupConfig = reactive({
  tableHeader: [
    {
      label: '属性',
      value: 'label',
    },
    {
      label: '值',
      value: 'value',
      width: 100,
    },
  ],
  tableData: [],
})

let multiplePopupConfig = reactive({
  tableHeader: [
    {
      label: '属性',
      value: 'label',
      width: 80,
    },
    {
      label: '值',
      value: 'value',
      width: 80,
    },
  ],
})

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
let showMapDraw = ref(false)
setConfig(mapConfig.value)

onMounted(() => {
  olInstance.target = target
  olInstance.initMap((map) => {
    mapReady = true
    map.set('mouseStatus', V_MOUSE_STATUS_ENUM.none)
    emits('ready', olInstance)
    bindEvent()
  }, controls.value)
})

// 事件
const bindEvent = () => {
  olInstance.registerMouseMove((e) => {
    latlon.value = [e.coordinate[0].toFixed(4), e.coordinate[1].toFixed(4)]
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
  })
}

// i查询
const handleIdentify = (e) => {
  let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
  const coordinate = e.coordinate
  if (features.length === 0) {
    return
  }
  openIdentifyPopup(coordinate)
  identifyList.value = []
  features.forEach((feature, index) => {
    activeIdentify.value = '要素_' + 1
    identifyList.value.push({
      name: '要素_' + (index + 1),
      location: coordinate,
      attributes: VcUtils.object2Array(feature.getProperties()),
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
  singlePopupConfig.tableData = attributes
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

const toggleMap = (layerid) => {
  olInstance.toggleBaseLayer(layerid)
  emits('basemap-change', layerid)
}

// 工具条
const handleMapTool = (item, index) => {
  curToolIndex = index
  const { key, handler } = item
  if (handler) {
    emits('tool-change', handler)
    return
  }
  const { map } = olInstance
  switch (key) {
    case 'fullExtent':
      olInstance.fullExtent()
      break
    case 'zoomIn':
      olInstance.dragZoom(false)
      break
    case 'zoomOut':
      olInstance.dragZoom(true)
      break
    case 'pointer':
      olInstance.endDragZoom()
      map.set('mouseStatus', V_MOUSE_STATUS_ENUM.none)
      break
    case 'LineString': // 测距
      olInstance.getMeasureHandler().measureLength()
      break
    case 'xzq':
      showXzqPanel = !showXzqPanel
      break
    case 'Polygon': // 测面
      olInstance.getMeasureHandler().measureArea()
      break
    case 'layer':
      layerManagerVisible.value = true
      break
    case 'locate':
      showMapLocateWindow = !showMapLocateWindow
      break
    case 'clear':
      olInstance.getMeasureHandler().clearResult()
      handleClearMap()
      break
    case 'draw':
      showMapDraw.value = true
      break
    default:
      break
  }
}

const handleClearMap = () => {}

const handleCloseTool = () => {
  curToolIndex = -1
  layerManagerVisible.value = false
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
    VcUtils.tree2list(item.children, list)
    list.forEach((layer) => {
      let { id } = layer
      layer['visible'] = checked
      // console.log("all", layer.id);
      VcUtils.pushNoReapeat(defaultCheckLayerIds.value, id, checked)
      olInstance.addLayerByType({ ...layer, visible: checked })
    })
  } else if (!item.hasOwnProperty('children') && !indeterminate) {
    // single
    // console.log("single", item.id);
    VcUtils.pushNoReapeat(defaultCheckLayerIds.value, item.id, checked)
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
  height: 100%;
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

.vmap-overlay-top{
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
  bottom: 35px !important;
}
</style>
