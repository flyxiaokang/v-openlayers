<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-22 20:15:17
-->
<template>
  <div style="width: 100%; height: 100%">
    <div style="height: 100px; display: flex; flex-direction: column">
      <div>
        <el-checkbox v-model="visibleValue">点线面</el-checkbox>
        <el-checkbox v-model="modifyableValue">编辑</el-checkbox>
        <el-checkbox v-model="tdtVisibleValue">tdt</el-checkbox>
        <el-checkbox v-model="supermapVisibleValue">supermap</el-checkbox>
        <el-checkbox v-model="wmtsVisibleValue">wmts</el-checkbox>
        <el-checkbox v-model="vectorTileVisibleValue">vectorTile</el-checkbox>
        <el-checkbox v-model="arcgisImageVisibleValue">arcgisimage</el-checkbox>
        <el-checkbox v-model="wmsVisibleValue">wms</el-checkbox>
      </div>
      <div>
        <el-button type="primary" size="small" @click="handleChangePolygon"
          >update polygon</el-button
        >
      </div>
      <el-slider
        style="width: 150px"
        v-model="opacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </div>
    <OlMap
      style="height: calc(100% - 100px)"
      theme="light"
      :map-config="mapConfig"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
    >
      <OlToolbar></OlToolbar>
      <OlBasemap></OlBasemap>

      <!-- overlay -->
      <OlOverlay :title="'test3'" :position="overlayPosition" :theme="'dark'">
        <div
          style="display: flex; flex-direction: row"
          v-for="(value, key) in featureProperties"
        >
          <div style="min-width: 100px; text-align: right">{{ key }}:</div>
          <div style="min-width: 100px; text-align: left; margin-left: 10px">
            {{ value }}
          </div>
        </div>
      </OlOverlay>

      <!-- popup -->
      <OlPopup title="属性" :position="curPosition"> </OlPopup>

      <!-- <OlPopup
        title="属性"
        :position="curPosition"
      >
         <template v-slot="slotProps">
          <div v-for="(item,index) in slotProps.data" :key="index">
            {{ item.value }}
          </div>
         </template>
      </OlPopup> -->

      <OlVector
        :features="PointsJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :layer-style="pointStyle2"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      />

      <OlVector
        :visible="visibleValue"
        :features="MultLinesJson"
        :modifiable="modifyableValue"
        :layer-style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      />

      <OlVector
        :visible="visibleValue"
        :features="PolygonJson"
        :modifiable="modifyableValue"
        :z-index="103"
        :layer-style="polygonStyle"
        @select-change="handleSelectChange"
      />

      <!-- <OlVector
        :features="PointGeojson"
        :modifiable="modifyableValue"
        :style="pointStyle"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      /> -->

      <!-- <OlVector
        :features="PolylineGeojson"
        :modifiable="modifyableValue"
        :style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      /> -->

      <OlVector
        :features="PolygonGeojson"
        :modifiable="modifyableValue"
        :layer-style="polygonStyle"
        :z-index="103"
        @select-change="handleSelectChange"
      />

      <!-- <OlTdt
        map-style="img"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->
      <!-- <OlTdt
        map-style="img_label"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

      <!-- supermap webmocat -->
      <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl"
        :request-params="requestParamsWebmocat"
        :visible="supermapVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

      <!-- <OlTile
        map-provider="wmts"
        :url="wmtsUrl"
        :request-params="requestParamsWmts"
        :visible="wmtsVisibleValue"
        :opacity="opacity"
      /> -->

      <OlVectortile
        :url="vectorTileUrl"
        :layer-style="vectorTileStyle"
        :request-params="vectorTileParams"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
      />

      <OlVectortile
        :url="vectorTileUrlMapbox"
        :layer-id="'xxxxxxxxxxxx'"
        :layer-style="vectorTileStyle"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
      />

      <!-- <OlArcgis
        :url="arcgisImageUrl"
        :visible="arcgisImageVisibleValue"
        :opacity="opacity"
      /> -->

      <!-- <OlArcgis
        map-provider="tile"
        :url="arcgisTileUrl"
        :visible="arcgisImageVisibleValue"
        :opacity="opacity"
      /> -->

      <!-- <OlTile
        map-provider="arcgistile"
        :url="xyzUrl"
        :visible="arcgisVisible"
        :opacity="opacity"
      /> -->

      <!-- <OlWms
        map-provider="image"
        :url="wmsUrl"
        :visible="wmsVisibleValue"
        :request-params="wmsRequest"
        :opacity="opacity"
      /> -->

      <!-- <MapDrawer
        class="vmap-drawer"
        :snap-enable="true"
        :once-only="true"
      ></MapDrawer> -->
      <!-- <OlEagle
        class="vmap-eagle"
        :init-zoom="5"
        :init-width="300"
        :init-height="300"
        :init-center="[116.5, 40]"
      ></OlEagle> -->

      <!-- <MapDrawer
        class="vmap-drawer"
        :snap-enable="true"
        :once-only="true"
        @draw-end="handleDrawend"
      ></MapDrawer> -->
    </OlMap>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import OlMap from '@/VMap/ol/v3/components/OlMap.vue'
import OlBasemap from '@/VMap/ol/v3/components/toolbar/MapBaseLayer.vue'
import OlToolbar from '@/VMap/ol/v3/components/toolbar/MapBar.vue'
import OlPopup from '@/VMap/ol/v3/components/layer/popup/index.vue'

import OlOverlay from '@/VMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VMap/ol/v3/components/layer/vector/index.vue'
import OlTile from '@/VMap/ol/v3/components/layer/tile/index.vue'
import OlTdt from '@/VMap/ol/v3/components/layer/tdt/index.vue'
import OlSupermap from '@/VMap/ol/v3/components/layer/supermap/index.vue'
import OlWms from '@/VMap/ol/v3/components/layer/wms/index.vue'
import OlArcgis from '@/VMap/ol/v3/components/layer/arcgis/index.vue'
import OlVectortile from '@/VMap/ol/v3/components/layer/vectorTile/index.vue'

import OlEagle from '@/VMap/ol/v3/components/eagle/index.vue'
import MapDrawer from '@/VMap/ol/v3/components/toolbar/MapDrawer.vue'

import PointsJson from '../../data/wkt/points.json'
import MultLinesJson from '../../data/wkt/multlines.json'
import MultPolygonsJson from '../../data/wkt/multpolygons.json'
import VcUtils from '../../../public/utils/base/index'

import PolygonGeojson from '../../data/geojson/polygon.json'
import PolylineGeojson from '../../data/geojson/polyline.json'
import PointGeojson from '../../data/geojson/point.json'

import { getOlHandler } from '@/VMap/ol/init'
import VUtils from '@/VMap/public/utils/base'
import mapConfig from '../mapConfig'

const opacity = ref(1)

let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
}
const handleMouseMove = (e) => {}

const overlayPosition = ref([])
let featureProperties = reactive({})
const showOverlay = (e) => {
  const coordinate = e.coordinate
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || []
  if (features.length === 0) {
    overlayPosition.value = undefined
    return
  }
  featureProperties = reactive({})
  const properties = features[0].getProperties()
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key]
      if (VcUtils.isString(element)) {
        featureProperties[key] = element
      }
    }
  }
  console.log(featureProperties)
  if (Object.keys(featureProperties).length > 0) {
    overlayPosition.value = coordinate
  }
}

const handleMouseClick = (e) => {
  // overlay
  showOverlay(e)
  // popup
  // showFeaturePopup(e)
}

const tableHeader = [
  {
    label: '第一列',
    value: 'label',
    width: 200,
  },
  {
    label: '第二列',
    value: 'value',
    width: 120,
  },
]

const featurePopup = ref({})
const curPosition = ref([])
const curProperties = ref([])
const showFeaturePopup = (e) => {
  const coordinate = e.coordinate
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || []
  if (features.length === 0) {
    // curPosition.value = undefined
    return
  }
  const properties = features[0].getProperties()
  curPosition.value = coordinate
  curProperties.value = VcUtils.object2Array(properties)
  console.log(curProperties.value)
  // featurePopup.value = {
  //   location: coordinate,
  //   attributes: VcUtils.object2Array(properties),
  // }
}

// 样式
const pointStyle = ref({
  icon: {
    src: new URL('../../../public/static/svg/map/location.svg', import.meta.url)
      .href,
    scale: 1,
  },
  text: {
    backgroundColor: 'green',
    padding: [0, 5, 0, 5],
  },
})

const pointStyle2 = ref({
  icon: {
    src: new URL('../../../public/static/svg/map/location.svg', import.meta.url)
      .href,
    scale: 1,
  },
  text: {
    backgroundColor: 'green',
    padding: [0, 5, 0, 5],
  },
})

const clusterOptions = reactive({
  showLabel: false,
  distance: 20,
  minDistance: 0,
})

const lineStyle = ref({
  stroke: {
    color: 'orange',
    width: '6',
  },
})

const polygonStyle = ref({
  fill: {
    color: '#00ff002a',
  },
  stroke: {
    color: 'blue',
    width: 5,
  },
})

const visibleValue = ref(false)
const modifyableValue = ref(false)
const handleSelectChange = () => {}
const PolygonJson = ref(MultPolygonsJson)
const handleChangePolygon = () => {
  PolygonJson.value.forEach((p) => {
    p['style'] = {
      fill: {
        color: VcUtils.getRandomRgb(0.6),
      },
      stroke: {
        width: 0,
        color: '#ff000000',
      },
    }
  })
}

const tdtVisibleValue = ref(false)

const supermapVisibleValue = ref(false)
const superMapWmtsUrl = ref(
  'http://10.243.45.80:8090/iserver/services/map-ugcv5-China3857/wmts100'
)

const requestParamsWebmocat = {
  layer: 'China3857',
  tilematrixset: 'CUSTOM_China3857',
  origin: [6654301.934394397, 7795048.144522272],
}

// wmts
const wmtsVisibleValue = ref(false)
const wmtsUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
const requestParamsWmts = reactive({
  layer: 'kjr:China_3857',
  tilematrixset: 'EPSG:3857',
  matrixSetPrefix: 'EPSG:3857:',
  // format: 'image/png',
})

const vectorTileVisibleValue = ref(false)
const vectorTileUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
const requestParamsVectorTile = ref({
  id: 'vt-layer-id',
  layer: 'kjr:China_3857',
  style: {
    stroke: {
      color: 'red',
      width: '1',
    },
    fill: {
      color: 'rgba(0,0,255,0.6)',
    },
  },
  style: (feature, resolution) => {
    // console.log(feature)
    const { StyleHandler } = olHandler
    const code = feature.get('adcode')
    if (code === '440000') {
      return StyleHandler.getStyle({
        stroke: {
          color: 'blue',
          width: '1',
        },
        fill: {
          color: 'rgba(0,255,0,0.6)',
        },
      })
    } else {
      return StyleHandler.getStyle({
        stroke: {
          color: 'blue',
          width: '1',
        },
        fill: {
          color: 'rgba(0,0,255,0.6)',
        },
      })
    }
  },
})


const vectorTileParams = ref({
  layer: 'kjr:China_3857',
})

const vectorTileStyle = ref((feature, resolution) => {
  console.log(feature.getProperties())
  const { StyleHandler } = olHandler
  const code = feature.get('adcode')
  if (code === '440000') {
    return StyleHandler.getStyle({
      stroke: {
        color: 'blue',
        width: '1',
      },
      fill: {
        color: 'rgba(0,255,0,0.6)',
      },
    })
  } else if(code === 140600){
    return StyleHandler.getStyle({
      stroke: {
        color: 'blue',
        width: '1',
      },
      fill: {
        color: 'rgba(255,0,0,0.6)',
      },
    })
  } else {
    return StyleHandler.getStyle({
      stroke: {
        color: 'blue',
        width: '1',
      },
      fill: {
        color: 'rgba(0,0,255,0.6)',
      },
    })
  }
})

const vectorTileUrlMapbox = 'http://localhost/mapboxApi/sx/{z}/{x}/{y}.pbf'
// const vectorTileUrlMapbox = "http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3AChina_3857@EPSG%3A3857@pbf/{z}/{x}/{y}.pbf"


const handleGetLayer = () => {
  const aaa = VUtils.getRandomRgba()
  console.log(aaa)
  const getStyle = (feature) => {
    const { StyleHandler } = olHandler
    const code = feature.get('adcode')
    if (code === '440000') {
      return StyleHandler.getStyle({
        stroke: {
          color: 'blue',
          width: '1',
        },
        fill: {
          color: 'rgba(255,0,255,0.6)',
        },
      })
    } else {
      return StyleHandler.getStyle({
        stroke: {
          color: 'blue',
          width: '1',
        },
        fill: {
          color: aaa,
        },
      })
    }
  }

  vectorTileStyle.value = getStyle
  // const l = olHandler.getLayerById(vectorTileParams.value.id)
  // l.setStyle(getStyle)
}

const arcgisImageVisibleValue = ref(false)
const arcgisImageUrl = ref(
  'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer'
)

const arcgisTileUrl =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'

const wmsVisibleValue = ref(false)
const wmsUrl = 'http://localhost:8080/geoserver/jinshui/wms'
const wmsRequest = {
  layers: 'basin:BAS1',
}

const handleEagleChange = (center) => {
  olHandler.map.getView().setCenter(center)
}
</script>

<style scoped>
.vmap-eagle {
  position: absolute;
  bottom: 50px;
  right: 70px;
  z-index: 1999;
}

.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 70px;
}
</style>
