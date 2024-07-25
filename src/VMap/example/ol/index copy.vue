<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-06 16:53:22
-->
<template>
  <div id="app-container">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      style="margin: 0 10px; height: 100%"
    >
      <el-tab-pane label="4326-map" name="first">
        <div style="width: 100%; height: 100px">
          <el-checkbox v-model="tdtVisible">天地图影像</el-checkbox>
          <el-checkbox v-model="supermapVisible">超图wmts</el-checkbox>
          <el-checkbox v-model="arcgisVisible">arcgis切片</el-checkbox>
          <el-checkbox v-model="wmtsVisible">wmts</el-checkbox>
          <el-checkbox v-model="wmsVisible">wms</el-checkbox>
          <el-checkbox v-model="arcgisImageVisible">arcgisimage</el-checkbox>
          <el-checkbox v-model="geoserverVtVisible">geoserverVt</el-checkbox>
          <br />
          <el-checkbox v-model="checkStatus">编辑</el-checkbox>
          <el-checkbox v-model="checkVisible">显示</el-checkbox>
          <el-button type="primary" size="small" @click="handleChangePolygon"
            >更新面</el-button
          >
          <el-button @click="handleGetLayer">get layer</el-button>

          <el-slider
            style="width: 150px"
            v-model="opacity"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </div>
        <OlMap
          class="app-content"
          theme="light"
          :map-config="mapConfig"
          @ready="handleMapReady"
          @mouse-click="handleMouseClick"
          @mouse-move="handleMouseMove"
        >
          <OlToolbar></OlToolbar>
          <OlBasemap></OlBasemap>
          <OlOverlay
            :title="'test3'"
            :position="overlayPosition"
            :theme="'dark'"
          >
            <div
              style="display: flex; flex-direction: row"
              v-for="(value, key) in featureProperties"
            >
              <div style="min-width: 100px; text-align: right">{{ key }}:</div>
              <div
                style="min-width: 100px; text-align: left; margin-left: 10px"
              >
                {{ value }}
              </div>
            </div>
          </OlOverlay>

          <OlPopup
            title="属性"
            :position="curPosition"
            :properties="curProperties"
            :table-height="220"
            :table-header="tableHeader"
            :show-header="true"
          >
            <!-- 支持自定义内容 -->
          </OlPopup>

          <OlVector
            :features="PointsJson"
            :visible="checkVisible"
            :modifiable="checkStatus"
            :layer-style="pointStyle2"
            :z-index="1000"
            :cluster-options="clusterOptions"
            @select-change="handleSelectChange"
          />
          <OlVector
            :visible="checkVisible"
            :features="MultLinesJson"
            :modifiable="checkStatus"
            :layer-style="lineStyle"
            :z-index="104"
            @select-change="handleSelectChange"
          />

          <OlVector
            :visible="checkVisible"
            :features="PolygonJson"
            :modifiable="checkStatus"
            :z-index="103"
            :layer-style="polygonStyle"
            geom-field="wktstr2"
            @select-change="handleSelectChange"
          />

          <!-- <OlVector
        :features="PointGeojson"
        :modifiable="checkStatus"
        :style="pointStyle"
        :z-index="1000"
        :cluster-options="clusterOptions"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PolylineGeojson"
        :modifiable="checkStatus"
        :style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PolygonGeojson"
        :modifiable="checkStatus"
        :style="polygonStyle"
        :z-index="103"
        @select-change="handleSelectChange"
      /> -->

          <!-- <OlTdt
        map-style="img_label"
        :visible="checkVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

          <!-- supermap -->
          <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl"
        :request-params="requestParams"
        :visible="supermapVisible"
        :opacity="opacity"
        :min-zoom="4"
        :max-zoom="10"
      /> -->

          <!-- supermap webmocat -->
          <!-- <OlTile
        map-provider="supermap"
        :url="superMapWmtsUrl"
        :request-params="requestParamsWebmocat"
        :visible="checkVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
      /> -->

          <!-- tdt -->
          <!-- <OlTdt
        map-style="img"
        :visible="tdtVisible"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :z-index="10"
      /> -->

          <OlSupermap
            :url="superMapWmtsUrl"
            :request-params="requestParamsWebmocat"
            :visible="supermapVisible"
            :opacity="opacity"
            :z-index="10"
          >
          </OlSupermap>

          <!-- <OlTile
        map-provider="wmts"
        :url="wmtsUrl"
        :request-params="requestParamsWmts"
        :visible="wmtsVisible"
        :opacity="opacity"
      /> -->

          <!-- <OlVectortile
        :url="vectorTileUrl"
        :layer-id="requestParamsVectorTile.id"
        :layer-name="requestParamsVectorTile.layer"
        :layer-style="requestParamsVectorTile.style"
        :visible="geoserverVtVisible"
        :opacity="opacity"
        :z-index="20"
      /> -->

          <!-- <OlTile
        map-provider="arcgistile"
        :url="xyzUrl"
        :visible="arcgisVisible"
        :opacity="opacity"
      /> -->

          <!-- <OlWms
        :url="wmsUrl"
        :visible="wmsVisible"
        :request-params="wmsRequest"
        :opacity="opacity"
      /> -->

          <!-- <OlArcgis
        :url="arcgisImageUrl"
        :visible="arcgisImageVisible"
        :opacity="opacity"
      /> -->

          <!-- <MapDrawer
        class="vmap-drawer"
        :snap-enable="true"
        :once-only="true"
        @draw-end="handleDrawend"
      ></MapDrawer> -->
        </OlMap>
      </el-tab-pane>
      <el-tab-pane label="4326-map" name="first" lazy>
        <LayerWgs84 style="height: 70vh"></LayerWgs84>
      </el-tab-pane>
      <el-tab-pane label="3857-map" name="second" lazy>
        <LayerWebmocat style="height: 70vh"></LayerWebmocat>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'

import LayerWebmocat from './components/LayerWebmocat.vue'
import LayerWgs84 from './components/LayerWgs84.vue'

import OlMap from '@/VMap/ol/v3/components/OlMap.vue'
import OlOverlay from '@/VMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VMap/ol/v3/components/layer/vector/index.vue'
import OlTile from '@/VMap/ol/v3/components/layer/tile/index.vue'
import OlTdt from '@/VMap/ol/v3/components/layer/tdt/index.vue'
import OlSupermap from '@/VMap/ol/v3/components/layer/supermap/index.vue'
import OlWms from '@/VMap/ol/v3/components/layer/wms/index.vue'
import OlArcgis from '@/VMap/ol/v3/components/layer/arcgis/index.vue'
import OlVectortile from '@/VMap/ol/v3/components/layer/vectorTile/index.vue'

import OlBasemap from '@/VMap/ol/v3/components/toolbar/MapBaseLayer.vue'
import OlToolbar from '@/VMap/ol/v3/components/toolbar/MapBar.vue'
import OlPopup from '@/VMap/ol/v3/components/layer/popup/index.vue'
import MapDrawer from '@/VMap/ol/v3/components/toolbar/MapDrawer.vue'

import mapConfig from './mapConfig'

let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
}

const activeName = ref('first')
const checkStatus = ref(false)
const checkVisible = ref(true)
const tdtVisible = ref(false)
const supermapVisible = ref(false)
const arcgisVisible = ref(false)
const wmtsVisible = ref(false)
const wmsVisible = ref(false)
const arcgisImageVisible = ref(false)
const opacity = ref(1)
const geoserverVtVisible = ref(true)

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

  requestParamsVectorTile.value.style = getStyle
  // const l = olHandler.getLayerById(requestParamsVectorTile.value.id)
  // l.setStyle(getStyle)
}
// watch(geoserverVtVisible, (nv) => {
//   olHandler.addLayerByType({
//     url: 'http://localhost:8080/geoserver/gwc/service/wmts',
//     type: 'mvt',
//     visible: nv,
//     params: {
//       layer: 'kjr:China_3857',
//       tilematrixset: 'EPSG:3857',
//       matrixSetPrefix: 'EPSG:3857:',
//       matrixSet: 'EPSG:3857',
//       format: 'application/vnd.mapbox-vector-tile',
//       style: '',
//     },
//   })
// })

const tdtUrl = ref('http://t{s}.tianditu.gov.cn/img_w/wmts')

// const superMapWmtsUrl = ref(
//   'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=4326&style=10&tilematrixset=l&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fwebpimage%2Fpngimage%2Fjpeg'
// )

const arcgisTileUrl = ref(
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/WMTS/tile'
)

const arcgisImageUrl = ref(
  'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer'
)

const requestParams = reactive({
  layer: '4326',
  tilematrixset: 'l',
  k: 'MH9dDPhe3quZQTfDhacLpg==',
  urls: '/mnt/usdata/2022_2m.usrmp',
  // style: 10,
})

// const requestParamsWebmocat = reactive({
//   layer: 'wt',
//   tilematrixset: 'wt',
//   k: 'MH9dDPhe3quZQTfDhacLpg==',
//   urls: '/mnt/usdata/2022_2m.usrmp',
//   // style: 10,
// })

// const superMapWmtsUrl = ref('https://proxy.mwr.cn/usmaps/usmaps')
const superMapWmtsUrl = ref(
  // 'http://10.243.45.80:8090/iserver/services/map-ugcv5-HeBeiTerrainV2/wmts100'
  'http://10.243.45.80:8090/iserver/services/map-ugcv5-China3857/wmts100'
  // 'http://10.243.45.80:8090/iserver/services/map-ugcv5-China/wmts100'
)

const requestParamsWebmocat = {
  layer: 'China3857',
  tilematrixset: 'CUSTOM_China3857',
  origin: [6654301.934394397, 7795048.144522272],
  // layer: 'China',
  // tilematrixset: 'CUSTOM_China',
  // origin: [60.095214843750085, 54.95361328124993],
  // resolutions: [
  //   1.4062500000022087, 0.7031249999891485, 0.35156250000645817,
  //   0.17578124999134512, 0.08789062499567256, 0.04394531250972024,
  //   0.02197265625486012, 0.01098632812743006, 0.00549316406371503,
  //   0.002746582031857515, 0.0013732910159287575, 6.866454960804162e-4,
  //   3.4332275992417075e-4, 1.7166136807812276e-4, 8.583068403906138e-5,
  //   4.291534201953069e-5, 2.1457682893727956e-5, 1.0728841446863978e-5,
  //   5.364420723431989e-6, 2.6822103617159945e-6, 1.3411051808579973e-6,
  // ],
  // style: 10,
}

// const wmtsUrl = 'https://mrdata.usgs.gov/mapcache/wmts'
// const requestParamsWmts = reactive({
//   layer: 'sgmc2',
//   matrixSet: 'GoogleMapsCompatible',
//   format: 'image/png',
//   style: 'default',
// })

// const wmtsUrl = 'http://10.1.102.189:8877/geoserver/gwc/service/wmts'
const wmtsUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
const requestParamsWmts = reactive({
  layer: 'basin:BAS1',
  layer: 'kjr:China_3857',
  tilematrixset: 'EPSG:3857',
  matrixSetPrefix: 'EPSG:3857:',
  // format: 'image/png',
})

const xyzUrl = ref(
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer'
)

const wmsUrl = ref('http://10.1.102.189:8877/geoserver/basin/wms')

const wmsRequest = ref({
  layers: 'basin:BAS1',
})

import PointsJson from '../data/wkt/points.json'
import MultLinesJson from '../data/wkt/multlines.json'
import MultPolygonsJson from '../data/wkt/multpolygons.json'
import VcUtils from '../../public/utils/base/index'

import PolygonGeojson from '../data/geojson/polygon.json'
import PolylineGeojson from '../data/geojson/polyline.json'
import PointGeojson from '../data/geojson/point.json'
import { getOlHandler } from '@/VMap/ol/init'
import { OlHandler, VUtils } from '@/entry/ol.entry'
// import Point2Geojson from '../data/geojson/point-cluster.json'
console.log(PolygonGeojson)

const overlayPosition = ref([])
let featureProperties = reactive({})
const handleMouseClick = (e) => {
  // overlay
  showOverlay(e)
  // popup
  // showFeaturePopup(e)
}
const handleMouseMove = (e) => {}

const showOverlay = (e) => {
  const coordinate = e.coordinate
  let features = olHandler.map.getFeaturesAtPixel(e.pixel) || []
  if (features.length === 0) {
    overlayPosition.value = undefined
    return
  }
  debugger
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
  // featurePopup.value = {
  //   location: coordinate,
  //   attributes: VcUtils.object2Array(properties),
  // }
}

const handleSelectChange = () => {}

const PolygonJson = ref(MultPolygonsJson)
const handleChangePolygon = () => {
  PolygonJson.value.forEach((p) => {
    p['style'] = {
      fill: {
        color: VcUtils.getRandomRgb(0.6),
      },
    }
  })
}

const pointStyle = ref({
  // icon: {
  //   src: new URL('../public/static/svg/map/location.svg', import.meta.url)
  //     .href,
  //   scale: 1,
  // },
  text: {
    field: 'gateName',
    backgroundColor: 'green',
    padding: [0, 5, 0, 5],
  },
})

const pointStyle2 = ref({
  icon: {
    src: new URL('../../public/static/svg/map/location.svg', import.meta.url)
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

const handleDrawend = (e) => {
  console.log(e)
}
</script>

<style scoped>
#app-container {
  width: 100%;
  height: 100%;
  background-color: white;
}

#map-view {
  width: 100%;
  height: calc(100vh - 120px);
}

.tools-view {
  z-index: 3999;
  width: 100%;
  height: 190px;
  margin-bottom: 10px;
  overflow-y: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  border-radius: 6px;
  background-color: white;
  /* padding: 0 10px; */
}

.tools-view .row {
  padding: 8px;
}

.map_contaniner {
  z-index: 199;
  position: relative;
  width: 100%;
  height: 100%;
}

.app-content {
  width: 100%;
  height: 600px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.popup_content {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 228, 196, 0);
  border-radius: 5px;
  -webkit-transform: translate(-50%, -50%);
}

.status_bar {
  z-index: 1999;
  position: absolute;
  left: 50px;
  bottom: 60px;
  background-color: white;
}

.el-icon-s-flag {
  margin-right: 20px;
}

:deep(.el-tabs__content) {
  height: calc(100% - 60px);
}
</style>

<style lang="scss" scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  /* padding: 15px; */
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
}

.popup_title_div {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #409eff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.ol-popup-closer:after {
  content: '✖';
}

.ol-popup-title {
  position: absolute;
  color: white;
  font-weight: bold;
  top: 0px;
  left: 8px;
}

.popup_content {
  padding: 10px;
  background-color: white;
}

.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 70px;
}
</style>
