<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-07 17:03:27
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
        <el-checkbox v-model="popupVisibleValue">popup显隐</el-checkbox>
        <el-button @click="handleAddPopup">增加</el-button>
      </div>
      <div>
        <el-button type="primary" size="small" @click="handleChangePolygon"
          >update polygon</el-button
        >
        <el-button type="primary" size="small" @click="handleGetLayer"
          >update vectorTile</el-button
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
      use-element-plus
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
      <OlPopup title="属性" theme="light" :position="curPosition">
        <label>自定义内容</label>
      </OlPopup>

      <OlPopup
        v-if="popupVisibleValue"
        v-for="item in popups"
        title="属性"
        :show-title="false"
        :position="item.position"
      >
        <div
          style="
            width: 100%;
            height: 60px;
            background: #8dd9b5;
            border-radius: 5px;
          "
        >
          {{ item.label }}
        </div>
      </OlPopup>

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
        :cluster-options="clusterOptions"
        :z-index="1000"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="MultLinesJson"
        :visible="visibleValue"
        :modifiable="modifyableValue"
        :layer-style="lineStyle"
        :z-index="104"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PolygonJson"
        :visible="visibleValue"
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

      <!-- <OlVector
        :features="PolygonGeojson"
        :modifiable="modifyableValue"
        :layer-style="polygonStyle"
        :z-index="103"
        @select-change="handleSelectChange"
      /> -->

      <!-- tianditu -->
      <OlTdt
        map-style="img"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :z-index="10"
      />
      <OlTdt
        map-style="img_label"
        :visible="tdtVisibleValue"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :z-index="11"
      />

      <!-- supermap webmocat -->
      <OlTile
        map-provider="supermap"
        :visible="supermapVisibleValue"
        :url="superMapWmtsUrl"
        :request-params="requestParamsWebmocat"
        :opacity="opacity"
        :min-zoom="3"
        :max-zoom="10"
        :origin="origin"
        :resolutions="resolutions"
        :z-index="11"
      />

      <OlTile
        map-provider="wmts"
        :url="wmtsUrl"
        :request-params="requestParamsWmts"
        :visible="wmtsVisibleValue"
        :opacity="opacity"
        :z-index="11"
      />

      <OlVectortile
        :url="vectorTileUrl"
        :layer-style="vectorTileStyle"
        :request-params="vectorTileParams"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
        :max-zoom="18"
        :z-index="11"
      />

      <!-- <OlVectortile
        :url="vectorTileUrlMapbox"
        :layer-style="vectorTileStyle"
        :visible="vectorTileVisibleValue"
        :opacity="opacity"
      /> -->

      <!-- <OlArcgis
        :url="arcgisImageUrl"
        :visible="arcgisImageVisibleValue"
        opacity="0.6"
        z-index="100"
      /> -->

      <OlArcgis
        map-provider="tile"
        :url="arcgisTileUrl"
        :visible="arcgisImageVisibleValue"
        opacity="0.6"
        z-index="99"
      />

      <!-- <OlTile
        map-provider="arcgistile"
        :url="xyzUrl"
        :visible="arcgisVisible"
        :opacity="opacity"
      /> -->

      <OlWms
        :url="wmsUrl"
        :visible="wmsVisibleValue"
        :request-params="wmsRequest"
        :opacity="opacity"
      />

      <OlDrawer
        class="vmap-drawer"
        :snap-enable="true"
        :once-only="false"
        @draw-end="handleDrawend"
      ></OlDrawer>

      <!-- 鹰眼 -->
      <OlEagle class="vmap-eagle" :offset="[0, 30]" expand></OlEagle>
    </OlMap>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'

// com
import {
  OlMap,
  OlBasemap,
  OlToolbar,
  OlDrawer,
  OlEagle,
  OlPopup,
  OlOverlay,
  OlVector,
  OlTile,
  OlTdt,
  OlSupermap,
  OlArcgis,
  OlWms,
  OlVectortile,
  VueDraggable,
} from '@/VMap/ol/v3/components/index'

// wkt
import PointsJson from '../../data/wkt/points.json'
import MultLinesJson from '../../data/wkt/multlines.json'
import MultPolygonsJson from '../../data/wkt/multpolygons.json'
// geojson
import PolygonGeojson from '../../data/geojson/polygon.json'
import PolylineGeojson from '../../data/geojson/polyline.json'
import PointGeojson from '../../data/geojson/point.json'

// tool
import VUtils from '@/VMap/public/utils/base/index'
import { OlHandler } from '@/VMap/ol/init'
import mapConfig from '../config/mapConfig-4326'

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
      if (VUtils.isString(element)) {
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
  // console.log('mouse-click===',e, olHandler.map.get('mouseStatus'))
  // overlay
  // showOverlay(e)
  // popup
  showFeaturePopup(e)
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

const popupVisibleValue = ref(false)
const popups = ref([
  {
    label: '我在新疆',
    position: [88, 36],
  },
  {
    label: '我在湖南',
    position: [110, 27],
  },
  {
    label: '我在北京',
    position: [116, 39],
  },
])
const handleAddPopup = () => {
  const lonlat = [
    parseInt(20 * Math.random() + 100),
    parseInt(10 * Math.random() + 30),
  ]
  popups.value.push({
    label: '我在' + lonlat.join(','),
    position: lonlat,
  })
}

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
  curProperties.value = VUtils.object2Array(properties)
  console.log(curProperties.value)
  // featurePopup.value = {
  //   location: coordinate,
  //   attributes: VUtils.object2Array(properties),
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
    src: new URL(
      '../../../public/static/svg/map/location2.svg',
      import.meta.url
    ).href,
    scale: 0.2,
  },
  text: {
    backgroundColor: 'green',
    // padding: [0, 5, 0, 5],
    field: 'gateName',
  },
})

const clusterOptions = reactive({
  showLabel: true,
  distance: 50,
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

const visibleValue = ref(true)
const modifyableValue = ref(false)
const handleSelectChange = () => {}
const PolygonJson = ref(VUtils.deepClone(MultPolygonsJson))
const handleChangePolygon = () => {
  PolygonJson.value.forEach((p) => {
    p['style'] = {
      fill: {
        color: VUtils.getRandomRgb(0.6),
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
  'https://10.243.45.83/hebei-map/iserver/services/map-ugcv5-China4326/wmts100'
)

const requestParamsWebmocat = {
  layer: 'China4326',
  tilematrixset: 'Custom_China4326',
}

const origin = [62.88574218750019, 66.75292968750006]
const resolutions = [
  1.4062500000022087, 0.7031249999891485, 0.35156250000645817,
  0.17578124999134512, 0.08789062499567256, 0.04394531250972024,
  0.02197265625486012, 0.01098632812743006, 0.00549316406371503,
  0.002746582031857515, 0.0013732910159287575, 6.866454960804162e-4,
  3.4332275992417075e-4, 1.7166136807812276e-4, 8.583068403906138e-5,
  4.291534201953069e-5, 2.1457682893727956e-5, 1.0728841446863978e-5,
  5.364420723431989e-6, 2.6822103617159945e-6, 1.3411051808579973e-6,
]

// wmts
const wmtsVisibleValue = ref(false)
const wmtsUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
const requestParamsWmts = reactive({
  layer: 'kjr:countries_3857',
  tilematrixset: 'EPSG:4326',
  matrixSetPrefix: 'EPSG:4326:',
  // format: 'image/png',
})

const vectorTileVisibleValue = ref(false)
const vectorTileUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
const vectorTileParams = ref({
  layer: 'kjr:countries_4326_vt',
  // layer: 'kjr:China_3857',
})

// const vectorTileUrl = '/geoserverApi189/gwc/service/wmts'
// const vectorTileParams = ref({
//   layer: 'basin:dy_gisobj_point',

//   // layer: 'kjr:China_3857',
// })

// const vectorTileUrlMapbox = 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/kjr%3Acountries_4326_vt@EPSG%3A4326@pbf/{z}/{x}/{y}.pbf'

const vectorTileStyle = ref((feature, resolution) => {
  console.log(feature.getProperties())
  const { StyleHandler } = olHandler
  const code = feature.get('adcode')
  const CONTINENT = feature.get('CONTINENT')
  if (code === '440000' || CONTINENT === 'Asia') {
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

// draw
const handleDrawend = (e) => {
  console.log(e)
}
</script>

<style scoped>
.vmap-drawer {
  position: absolute;
  top: 20px;
  right: 70px;
}

.vmap-eagle {
  /* position: absolute;
  bottom: 60px;
  right: 70px;
  width: 230px;
  height: 230px;
  z-index: 1999; */
}
</style>
