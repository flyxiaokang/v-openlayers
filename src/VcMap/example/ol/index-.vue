<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-02-17 13:37:39
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-16 18:31:04
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="layer" name="first">
          <span>{{ prj }}</span>
          <el-button size="small" @click="handleGetMap"> 获取prj </el-button>

          <el-button @click="handleExtent" size="small">extent</el-button>
          <br />
          <i class="el-icon-s-flag">WMTS</i>
          <el-checkbox v-model="model_wmts_template"
            >geoserver wmts</el-checkbox
          >
          <el-checkbox v-model="model_supermap_Wmts"
            >superMap wmts(4326)</el-checkbox
          >

          <el-checkbox v-model="model_supermap_Wmts3857"
            >superMap wmts(3857)</el-checkbox
          >
          <el-checkbox v-model="model_tdt_img">tdt img(3857)</el-checkbox>

          <el-checkbox v-model="model_Retina_Tiles"
            >XYZ Retina Tiles</el-checkbox
          >
          <el-checkbox v-model="model_arcgisXYZ">arcgis xyz</el-checkbox>

          <el-checkbox v-model="model_arcgisTileLayer"
            >arcgis tilelayer</el-checkbox
          >
          <el-checkbox v-model="model_gaode">gaode</el-checkbox>
          <el-checkbox v-model="model_baidu">baidu</el-checkbox>

          <br />
          <i class="el-icon-s-flag">WMS</i>
          <el-checkbox v-model="model_wms_tiles">wms tiles</el-checkbox>
          <el-checkbox v-model="model_wms_image">wms image</el-checkbox>
          <br />
          <i class="el-icon-s-flag">arcgis image</i>
          <el-checkbox v-model="model_arcgis_image"
            >arcgis image(存在偏移)</el-checkbox
          >
          <el-checkbox v-model="model_arcgis_imageTile"
            >arcgis image tile</el-checkbox
          >

          <i class="el-icon-s-flag"></i>

          <el-button @click="handleGeojson">geojson</el-button>
          <el-checkbox v-model="model_selectable"></el-checkbox>

          <VFileUpload @on-success="handleUploadSuccess"></VFileUpload>

          <br />
          <!-- <el-button @click="handleWmtsUser">localWmts</el-button>
                    <el-button @click="handleWmtsUser">localWmts</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="draw" name="second">
          draw:
          <el-button size="small" @click="handleDrawPoint"> point </el-button>
          <el-button size="small" @click="handleDrawLine"> Line </el-button>
          <el-checkbox v-model="model_snap">snap</el-checkbox>
          <el-checkbox v-model="model_modify">modify</el-checkbox>
          <el-select
            v-model="valueType"
            size="small"
            placeholder="请选择"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button size="small" @click="handleDrawEnd"> end </el-button>

          <el-button size="small" @click="handleClear"> clear </el-button>

          <el-button size="small" @click="handleActiveSnap">
            active snap
          </el-button>

          <el-button size="small" @click="handleOver"> over </el-button>

          <el-button size="small" @click="handleBackward"> 后退 </el-button>

          <el-button size="small" @click="handleSplice"> 截取 </el-button>

          <el-checkbox v-model="checkStatus">状态</el-checkbox>

          <!-- <el-button size="small" @click="handleForward"> 前进 </el-button> -->
        </el-tab-pane>
        <el-tab-pane label="spatial analysis" name="third">
          <div style="display: flex; padding: '5px'">
            <el-button @click="handleRadomPoint">Radom Point</el-button>
            <el-button @click="handleInterpolate">interpolate</el-button>
            <el-button @click="handleHeatMap">heatMap</el-button>
            <el-slider v-model="value_blur" style="width: 100px" />
            <el-slider v-model="value_radius" style="width: 100px" />
            <el-button @click="handleTestChazhi">插值</el-button>
            <el-button @click="handleTestCluster">cluster</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="popup" name="fourth">
          <el-button @click="handleAddPopup">add popup</el-button>
          <el-button @click="handleRemovePopup">delete popup</el-button>
        </el-tab-pane>

        <el-tab-pane label="wfs" name="fivth">
          <el-input type="textarea" v-model="wfsUrl" rows="1"></el-input>

          <el-input type="textarea" v-model="wfsUrl2" rows="1"></el-input>

          <el-button type="primary" @click="handleLoadWMS" size="small"
            >加载wms</el-button
          >

          <el-button type="primary" @click="handleLoadWMTS" size="small"
            >加载wmts</el-button
          >

          <el-button type="danger" size="small" @click="handleRemoveLayer('')"
            >删除</el-button
          >

          <el-button type="primary" size="small" @click="handleQuery"
            >query</el-button
          >

          <el-button type="primary" size="small" @click="handleAdd"
            >增</el-button
          >

          <el-button type="danger" size="small" @click="handleDelete"
            >删</el-button
          >
        </el-tab-pane>

        <el-tab-pane label="test" name="six">
          <el-button type="primary" size="small" @click="handleMultpolygons"
            >multipolygons</el-button
          >

          <el-button type="primary" size="small" @click="handleMultlines"
            >multilines</el-button
          >
          <el-button type="primary" size="small" @click="handlePoints"
            >points</el-button
          >

          <el-input-number v-model="longitude" :min="1" :max="180" />
          <el-input-number v-model="latitude" :min="1" :max="90" />

          <el-checkbox v-model="checkStatus">状态</el-checkbox>

        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <MapOl
            class="app-content"
            :map-config="mapConfig"
            :controls="controls"
            show-toolbar
            show-basemapbar
            feature-popup-title="标题"
            feature-popup-enable
            :feature-popup="featurePopup"
            multiple-popups-enable
            :multiple-popups="popups"
            @ready="handleMapReady"
            @mouse-click="handleMouseClick"
        /> -->

    <!-- <OlMap
            class="app-content"
            :map-config="mapConfig"
            :controls="controls"
            show-toolbar
            show-basemapbar
            feature-popup-title="标题"
            feature-popup-enable
            :feature-popup="featurePopup"
            multiple-popups-enable
            :multiple-popups="popups"
            @ready="handleMapReady"
            @mouse-click="handleMouseClick"
        /> -->

    <OlMap
      class="app-content"
      show-basemapbar
      show-toolbar
      :identify="false"
      :showFeaturePopup="fase"
      :feature-popup="featurePopup"
      :showMultiplePopup="false"
      :multiple-popup="popups"
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
      @tool-change="handleToolChange"
      @draw-end="handleDrawEnd2"
    >
      <!-- <template #popup>
        <div
          v-show="showCustomPopup"
          class="ol-popup"
          :id="custom_popup_id"
          style="background: blue; border: 1px solid #dddddd"
        >
          1212
        </div>
      </template> -->
      <!-- <OlOverlay :show-title="false" theme="dark" :position="[111, 34]">
        <div>
          1
        </div>
        <div>
          2
        </div>
      </OlOverlay> -->
      <!-- <OlOverlay :title="'test3'" :position="overlayPosition">
        <span>{{ overlayPosition ? overlayPosition.join(',') : '-' }}</span>
      </OlOverlay> -->

      <!-- <OlPoint
        layerId="point-layer-id"
        :features="PointsJson"
        :style="pointStyle"
        :modifiable="checkStatus"
        @select-change="handleSelectChange"
      /> -->

      <OlVector
        :features="MultLinesJson"
        :modifiable="checkStatus"
        @select-change="handleSelectChange"
      />

      <OlVector
        :features="PointsJson"
        :modifiable="checkStatus"
        @select-change="handleSelectChange"
      />
    </OlMap>
  </div>
</template>

<script>
import OlMap from '@/VcMap/ol/v3/components/OlMap.vue'
import OlOverlay from '@/VcMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VcMap/ol/v3/components/layer/vector/index.vue'
// import OlPolyline from '@/VcMap/ol/v3/components/layer/vector/Polyline.vue'
import {
  createPointsFromBox,
  createPointsFromBoxWithProperty,
  interpolateFromPoints,
} from '@/VcMap/public/utils/map/turf.js'
import mapConfig from './mapConfig'
import { intersects } from 'ol/format/filter'

import riverJson from '@/assets/json/river.json'
import { getOlHandler } from '@/VcMap/ol/init'
import { MAP_TYPE_ENUM } from '@/VcMap/global'
import VcUtils from '@/VcMap/public/utils/base'
import { OlHandler, VcMapUtils, VcUtils } from '@/entry/ol.entry'
// import { dataChazhi } from "./assets/js/data";
let olInstance = getOlHandler()

import MultLinesJson from '../data/wkt/multlines'
import PointsJson from '../data/wkt/points'
import MultPolygonsJson from '../data/wkt/multpolygons'

export default {
  name: 'ol_service3',
  components: {
    OlMap,
    OlOverlay,
    OlVector,
    // OlPolyline
  },
  data() {
    return {
      controls: {
        showBasemap: true,
        zoom: false,
      },
      mapConfig: mapConfig,
      activeName: 'first',
      value: '4326',
      esriUtils: null,

      valueType: '',
      optionsType: [
        {
          label: 'Point',
          value: 'Point',
        },
        {
          label: 'LineString',
          value: 'LineString',
        },
        {
          label: 'Polygon',
          value: 'Polygon',
        },
        {
          label: 'Circle',
          value: 'Circle',
        },
        {
          label: 'Box',
          value: 'Box',
        },
        {
          label: 'Ring',
          value: 'Ring',
        },
      ],

      prj: '',

      model_wmts_template: false,
      model_arcgisXYZ: false,
      model_Retina_Tiles: false,
      model_wms_tiles: false,
      model_wms_image: false,
      model_arcgis_image: false,
      model_arcgis_imageTile: false,
      model_supermap_Wmts: false,
      model_supermap_Wmts3857: false,
      model_arcgisTileLayer: false,
      model_tdt_img: false,
      model_gaode: false,
      model_baidu: false,

      model_snap: false,
      model_modify: false,

      model_selectable: false,

      value_blur: 10,
      value_radius: 10,

      featurePopup: {},
      popups: [],

      popupIndex: 2,

      // wfsUrl: "http://10.1.102.189:8877/geoserver/wms?layers=DZ:hj_dfsz_dike_geom_spa",
      wfsUrl:
        'http://10.1.102.189:8877/geoserver/wms?layers=PG:dy_gisobj_point_test',
      wfsUrl2: '',

      featurePopupTitle: '',

      showCustomPopup: false,
      custom_popup_id: 'custom_popup_id',

      drawCoordinates: '',
      splicePoints: [],

      checkStatus: false,

      overlayPosition: [],
      longitude: 121,
      latitude: 35,

      PointsJson: PointsJson,
      pointStyle: {
        // image: {
        //   color: 'red',
        //   radius: 12,
        // },
        // text: {
        //   field: 'gateName',
        // },
      },

      MultLinesJson:MultLinesJson
    }
  },
  watch: {
    longitude() {
      this.overlayPosition = [this.longitude, this.latitude]
    },
    latitude() {
      this.overlayPosition = [this.longitude, this.latitude]
    },
    model_supermap_Wmts3857() {
      // olInstance.addSuperMapLayer({
      //   id: 'layerId_supermap_wmts',
      //   visible: this.model_supermap_Wmts3857,
      //   // url:'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&style=default&tilematrixset=Custom_m_dem30m&Format=image%2Fpng&tilecol={x}&tilerow={y}&tilematrix={z}'
      //   // url:'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100/m_dem30m/default/Custom_m_dem30m?k=HzxwyaaeOc7z1KRENNqH0A==',

      //   // url:'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=w&request=gettile&tilematrixset=w&request=gettile&tilesize=512',

      // })

      // olInstance.addXYZLayer({
      //   id: '121212',
      //   visible: true,
      //   // url: 'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=wt&tilematrixset=wt&Service=WMTS&Request=GetTile&Version=1.0.0&tilecol={x}&tilerow={y}&tilematrix={z}',
      //   // url:'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&request=gettile&tilesize=512&tilematrixset=Custom_m_dem30m&tilecol={x}&tilerow={y}&tilematrix={z}'
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100/m_dem30m/default/GoogleMapsCompatible_m_dem30m/{z}/{y}/{x}.png?k=HzxwyaaeOc7z1KRENNqH0A==',
      //   // url:'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=w&request=gettile&tilesize=512&tilematrixset=w&tilematrix={z}&tilerow={y}&tilecol={x}',
      // })

      // olInstance.addLayerByType({
      //   id: '121212',
      //   visible: true,
      //   url: '',
      // })

      // olInstance.addSuperMapXYZ({
      //   id: '1212',
      //   visible: true,
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100/m_dem30m/default/Custom_m_dem30m',
      // })

      // olInstance.addLayerByType({
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&style=default&tilematrixset=GoogleMapsCompatible_m_dem30m',
      //   id: '121212',
      //   type: MAP_TYPE_ENUM.wmts,
      // })

      // olInstance.addXYZLayer({
      //   id: '121212',
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100/m_dem30m/default/GoogleMapsCompatible_m_dem30m/{z}/{y}/{x}.png?k=HzxwyaaeOc7z1KRENNqH0A==',
      // })

      // olInstance.addWmtsLayer({
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&style=default&tilematrixset=GoogleMapsCompatible_m_dem30m',
      // })

      // olInstance.addTdtLayer({
      //   id: '121212',
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&request=gettile&tilesize=512&tilematrixset=GoogleMapsCompatible_m_dem30m&tilecol={x}&tilerow={y}&tilematrix={z}',
      // })

      olInstance.addLayerByType({
        url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_dem30m&style=default&tilematrixset=GoogleMapsCompatible_m_dem30m',
        id: '121212',
        visible: this.model_supermap_Wmts3857,
        type: MAP_TYPE_ENUM.superMap,
      })

      // olInstance.addLayerByType({
      //   id: '121212',
      //   url: 'https://gatewayproxy-jcpt.mwr.cn/mdem30m/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==',
      //   type: MAP_TYPE_ENUM.wmts,
      //   params: {
      //     layer:'m_dem30m',
      //     matrixSet: 'GoogleMapsCompatible_m_dem30m',
      //   },
      // })

      // olInstance.addTdtLayer({
      //   id:'121212',
      //   visible:true,
      //   url:'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=w&request=gettile&tilesize=512&tilematrixset=w&tilematrix={z}&tilerow={y}&tilecol={x}',
      // })
    },
    model_supermap_Wmts() {
      olInstance.addSuperMapLayer({
        id: 'layerId_supermap_wmts',
        visible: this.model_supermap_Wmts,
        type: 'superMap',
        // url: 'http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m',
        // url: 'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=4326&style=10&tilematrixset=l&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fwebpimage%2Fpngimage%2Fjpeg',
        url: 'https://proxy.mwr.cn/usmaps/usmaps?k=MH9dDPhe3quZQTfDhacLpg==&urls=/mnt/usdata/2022_2m.usrmp&layer=4326&tilematrixset=l&Service=WMTS&Request=GetTile&Version=1.0.0',
      })
    },
    model_wmts_template() {
      olInstance.addLayerByType({
        id: 'layerId_wmts',
        visible: this.model_wmts_template,
        type: 'geoserverWmts',
        url: 'http://10.1.102.189:8877/geoserver/gwc/service/wmts?layer=basin:BAS1&matrixSet=EPSG:4326&Service=WMTS&format=image/png',
        params: {
          layer: 'basin:BAS1',
          matrixSet: 'EPSG:4326',
        },
        // url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3AChina&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        // url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&matrixSet=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',

        // 'type': 'wmts',
        // 'url': 'http://10.1.102.189:8877/geoserver/gwc/service/wmts?layer=basin:BAS1&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG:4326:{z}&TileCol={x}&TileRow={y}',
        // 'url': 'http://10.1.102.189:8877/geoserver/gwc/service/wmts',
        // layer: 'basin:BAS1',
        // matrixSet: 'EPSG:4326',
        // format: 'image/png',
        // style: 'default'
      })
    },
    model_Retina_Tiles() {
      // olInstance.addXYZLayer({
      //   id: 'model_Retina_Tiles',
      //   visible: this.model_Retina_Tiles,
      //   url:
      //     'https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=' +
      //     'get_your_own_D6rA4zTHduk6KOKTXzGB',
      //   tilePixelRatio: 2,
      // })

      olInstance.addLayerByType({
        id: '121212',
        visible: this.model_Retina_Tiles,
        type: 'xyz',
        url:
          'https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=' +
          'get_your_own_D6rA4zTHduk6KOKTXzGB',
      })
    },
    model_wms_tiles() {
      olInstance.addLayerByType({
        id: 'layerId_wms_tile',
        visible: this.model_wms_tiles,
        type: 'wms',
        url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
      })
    },
    model_wms_image() {
      olInstance.addLayerByType({
        id: 'layerId_wms_tile2',
        visible: this.model_wms_image,
        type: 'wmsImage',
        url: 'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI',
      })
    },
    model_arcgisXYZ() {
      // olInstance.addXYZLayer({
      //   id: 'model_arcgisXYZ',
      //   visible: this.model_arcgisXYZ,
      //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      // })
      olInstance.addLayerByType({
        id: 'model_arcgisXYZ',
        visible: this.model_arcgisXYZ,
        type: 'arcgis_wmts',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      })
    },
    model_arcgisTileLayer() {
      olInstance.addLayerByType({
        id: 'model_arcgisTileLayer',
        visible: this.model_arcgisTileLayer,
        type: 'arcgis_wmts',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      })
    },
    model_arcgis_image() {
      // 问题 arcgis_mapImage存在坐标偏移   arcgis_mapTile不存在偏移
      olInstance.addLayerByType({
        id: 'layerId_arcgis_image',
        visible: this.model_arcgis_image,
        type: 'arcgis_mapImage',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        // 'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
      })
    },

    model_arcgis_imageTile() {
      olInstance.addLayerByType({
        id: 'layerId_arcgis_image_tile',
        visible: this.model_arcgis_imageTile,
        type: 'arcgis_mapTile',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        // 'url': 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
      })
    },

    model_tdt_img() {
      olInstance.addLayerByType({
        id: 'tdt_img_w',
        type: 'tdt',
        visible: this.model_tdt_img,
        url: 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
      })
    },

    model_gaode() {
      olInstance.addLayerByType({
        id: 'asasas',
        type: 'gdMap',
        visible: this.model_gaode,
      })
    },

    model_baidu() {
      olInstance.addLayerByType({
        id: 'asasa121s',
        type: 'bdMap',
        visible: this.model_baidu,
      })
    },

    model_snap() {
      this.handleTypeChange()
    },

    model_modify() {
      this.handleTypeChange()
    },
    value_blur(nv, ov) {
      this.heatLayer.setBlur(nv)
    },
    value_radius(nv, ov) {
      this.heatLayer.setRadius(nv)
    },

    model_selectable(nv) {
      olInstance.getInteraction().enableModify(nv, (e) => {
        console.log('select...', e)
      })
    },
  },
  mounted() {},
  methods: {
    handleMapReady(olIns) {
      olInstance = olIns
      console.log(olInstance)

      // setInterval(() => {
      //   this.longitude += 0.3
      //   this.latitude += 0.3
      //   this.overlayPosition = [this.longitude,this.latitude]
      // }, 2000)
    },
    showCustomPopupF(e) {
      olInstance.createOverlay({
        popupId: this.custom_popup_id,
        center: e.coordinate,
      })

      this.showCustomPopup = true
    },
    handleMouseClick(e) {
      // this.showCustomPopupF(e)
      // return
      let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
      const coordinate = e.coordinate
      // this.overlayPosition = coordinate
      // console.log('from index...', features, coordinate)

      if (features.length === 0) {
        return
      }
      features.forEach((feature) => {
        let properties = feature.getProperties()
        let geometry = feature.getGeometry().getCoordinates()
      })
      this.featurePopup = {
        location: coordinate,
        attributes: VcUtils.object2Array(features[0].getProperties()),
      }
      this.featurePopupTitle = Math.random().toString()
    },

    handleMouseMove(e) {
      const coordinate = e.coordinate
      let features = olInstance.map.getFeaturesAtPixel(e.pixel) || []
      if (features.length === 0) {
        this.overlayPosition = undefined
        return
      }
      this.overlayPosition = coordinate
    },
    handleChange(value) {},
    handleGetMap() {
      // console.log('map,', olInstance.getMap())
      // console.log(olInstance.getMap().getView().getProjection())
      this.prj = olInstance.getMap().getView().getProjection().getCode()
    },
    handleArcgisXYZ() {
      olInstance.addXYZLayer({
        id: '1212',
        visible: true,
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      })
    },

    handleTypeChange() {
      const { map } = olInstance
      let drawInstance = olInstance.getDrawHandler()
      const { TransHandler, layerHandler } = olInstance
      console.log(TransHandler.tranMeters2Radius(map, 11100))
      let innerR = TransHandler.tranMeters2Radius(map, 10000)
      let outerR = TransHandler.tranMeters2Radius(map, 50000)
      if (this.valueType) {
        drawInstance.drawByType({
          type: this.valueType,
          snapEnable: this.model_snap,
          modifyEnable: this.model_modify,
          onceOnly: false,
          selectEnable: false,
          style: {
            radius: 10,
            innerR,
            outerR,
          },
          // conditions: {
          //   showTip: false,
          //   maxLength: 10000000,
          // },
          drawEndHandle: (e) => {
            console.log('drawend...', e)
            olInstance.getCenterByFeature(e.feature.getGeometry())
            this.drawCoordinates = e.coordinates
            // const { coordinates } = e
            // if (this.valueType === 'Ring') {
            //   if(this.ringLayer){
            //     map.removeLayer(this.ringLayer)
            //   }
            //   const layer = olInstance.getLayerHandler().createRingLayer({
            //     map,
            //     center: coordinates,
            //     outerR: outer,
            //     innerR: inner,
            //   })
            //   map.addLayer(layer)
            //   this.ringLayer = layer
            // }
          },
        })
      }
    },

    handleDrawPoint() {
      olInstance.getDrawHandler()?.drawPoint()
    },
    handleDrawLine() {
      olInstance.getDrawHandler()?.drawByType({
        type: 'LineString',
      })
      const plugin = olInstance.getDrawCondtions()
      olInstance.installPlugin(plugin)
    },
    handleDrawEnd() {
      this.valueType = ''
      olInstance.getDrawHandler()?.endDraw()
    },
    handleClear() {
      olInstance.getDrawHandler()?.clear()
    },

    handleActiveSnap() {
      olInstance.getDrawHandler()?.activeSnap()
    },

    handleOver() {
      olInstance.getDrawHandler()?.endInteraction()
    },

    handleBackward() {
      olInstance.getDrawHandler()?.backward()
    },

    handleSplice() {
      // const layer = olInstance.getDrawHandler().getLayer()
      if (this.checkStatus) {
        olInstance.getDrawHandler().endSpliceLine()
        return
      }
      const layer = this.multilineLayer
      olInstance.getDrawHandler().spliceLine({
        source: layer.getSource(),
        style: {
          image: {
            color: 'blue',
          },
        },
        callback: (e) => {
          olInstance.getLayerHandler().createLines({
            lines: [
              {
                geom: olInstance.getWktHandler().geojson2wkt(e),
                id: VcUtils.UUIDGenerator(),
              },
            ],
          })
        },
      })
      // olInstance.getDrawHandler()?.activeSnap()
    },

    handleForward() {
      // olInstance.getDrawHandler()?.forward()
    },

    handleWmtsUser() {
      // olInstance.localWmts({
      //     id: "12121",
      //     prj: this.prj,
      //     url: "http://localhost/tiles/{z}/{x}_{y}.png",
      // });
    },
    handleExtent() {
      console.log(olInstance.getExtent())
    },
    // 随机点
    handleRadomPoint() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      olInstance.zoomToExtent(extent)

      const pointsGeojson = createPointsFromBoxWithProperty(50, extent)
      const pointsWithValue = createPointsFromBoxWithProperty(50, extent)

      this.pointsWithValue = pointsWithValue

      olInstance.addLayerByType({
        id: 'test_geojson',
        once: true,
        type: 'geojson',
        geojson: pointsWithValue,
        field: 'solRad',
        // labelField:"solRad"
      })
    },

    // turf插值
    handleInterpolate() {
      // let extent = [117.57071648609964, 29.612017196294367, 118.56681691790034, 30.1558200567]
      // olInstance.zoomToExtent(extent)
      // const pointsGeojson = createPointsFromBoxWithProperty(50, extent)

      const geojson = interpolateFromPoints(this.pointsWithValue, 1, {
        gridType: 'square',
        property: 'solRad',
        units: 'miles',
      })

      olInstance.addLayerByType({
        id: 'test_chazhi',
        visible: true,
        once: true,
        type: 'geojson',
        geojson: geojson,
        field: 'solRad',
      })
    },

    // 热力图
    handleHeatMap() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      olInstance.zoomToExtent(extent)

      let field = 'hot_weight'

      const pointsGeojson = createPointsFromBoxWithProperty(
        150,
        extent,
        field,
        {
          start: 0,
          end: 1,
        }
      )

      // let aaa = interpolateFromPoints(pointsGeojson, 10, {
      //     gridType: 'point',
      //     property: field,
      //     units: 'miles'
      // })

      // olInstance.addLayerByType({
      //     id: 'test_chazhi',
      //     visible: true,
      //     once: true,
      //     type: 'geojson',
      //     geojson: aaa,
      //     field: field
      // })

      this.heatLayer = olInstance.addLayerByType({
        id: 'layerId_heatmap',
        type: 'heatMap',
        once: true,
        geojson: pointsGeojson,
        field: field,
      })
    },
    // 测试插值
    handleTestChazhi() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      let padding = 100
      olInstance.zoomToExtent(extent, {
        padding: [padding, padding, padding, padding],
      })

      let field = 'testField'
      const pointsWithValue = createPointsFromBoxWithProperty(30, extent, field)

      olInstance.interpolation({
        id: 'test_geojson',
        visible: true,
        type: 'geojson',
        geojson: pointsWithValue,
        field,
        labelField: field,
      })
    },
    //测试聚合
    handleTestCluster() {
      let extent = [
        117.57071648609964, 29.612017196294367, 118.56681691790034,
        30.1558200567,
      ]
      let padding = 100
      olInstance.zoomToExtent(extent, {
        padding: [padding, padding, padding, padding],
      })

      let field = 'testField'
      const pointsWithValue = createPointsFromBoxWithProperty(
        130,
        extent,
        field
      )

      olInstance.addLayerByType({
        id: 'test_geojson_cluster',
        once: true,
        visible: true,
        type: 'clusterMap',
        geojson: pointsWithValue,
      })
    },

    handleAddPopup() {
      this.popups.push({
        location: [VcUtils.getRandomNum(100, 130), VcUtils.getRandomNum(25, 35)],
        attributes: [
          {
            label: 'bbb',
            value: 222222222222222,
          },
          {
            label: 'bbb',
            value: 222,
          },
        ],
      })
    },

    handleRemovePopup() {
      olInstance.removeAllOverlay()
    },

    handleLoadWMTS() {
      //
      olInstance.removeLayerById('vectorLayerPoint___test')
      olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'geoserverWmts',
        visible: true,
        url: `${this.wfsUrl2}`,
      })
    },

    handleLoadWMS() {
      olInstance.removeLayerById('vectorLayerPoint___test')

      olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'wms',
        visible: true,
        url: `${this.wfsUrl}&CQL_FILTER=1=1&t=t_${Math.random()}`,
      })

      return
      const coordinate = [
        [86.92686575490978, 43.16448199423321],
        [87.01136370000059, 40.68703343744539],
        [89.78659380309928, 41.28253489952021],
        [89.63750951002642, 43.2375154249803],
        [86.92686575490978, 43.16448199423321],
      ]
      let str = ''
      coordinate.forEach((element) => {
        str += element.join(' ') + ','
      })
      str = str.substring(0, str.length - 1)

      let geo_FILTER = `INTERSECTS(the_geom, POLYGON((${str})))`
      geo_FILTER = `INTERSECTS(geom, POLYGON((86.92686575490978 43.16448199423321, 87.01136370000059 40.68703343744539, 89.78659380309928 41.28253489952021,86.92686575490978 43.16448199423321)))`
      olInstance.addLayerByType({
        id: 'vectorLayerPoint___test',
        type: 'wms',
        visible: true,
        url: `${
          this.wfsUrl
        }&CQL_FILTER=1=1 and ${geo_FILTER}&t=t_${Math.random()}`,
      })
    },

    handleRemoveLayer() {
      olInstance.removeLayerById('vectorLayerPoint___test')
    },

    handleQuery() {
      let drawInstance = olInstance.getDrawHandler()
      const wfsHandler = olInstance.getWfsHandler()
      drawInstance.drawByType({
        type: 'Polygon',
        snapEnable: true,
        modifyEnable: false,
        drawEndHandle: ({ e, coordinates, type, feature }) => {
          drawInstance?.endDraw()
          const polygon = wfsHandler.applyTransform(
            feature.getGeometry().clone()
          )
          const geoserverData = {
            uri: 'http://localhost/geoserver',
            wsName: 'pg',
            layer: 'dy_gisobj_point_test',
          }

          const filter = intersects('geom', polygon, 'EPSG:4326')
          wfsHandler
            .queryByCondition('http://localhost/geoserver/PG/wfs', {
              srsName: 'EPSG:4326',
              featureNS: geoserverData.uri,
              featurePrefix: geoserverData.wsName,
              featureTypes: [geoserverData.layer],
              outputFormat: 'application/json',
              filter,
            })
            .then((e) => {
              console.log('result...', e)
            })
        },
      })
    },

    // 增
    handleAdd() {
      let drawInstance = olInstance.getDrawHandler()
      drawInstance.drawByType({
        type: 'Point',
        drawEndHandle: ({ type, feature, coordinates }) => {
          drawInstance?.endDraw()
          drawInstance?.clear()
          const id = 'neiliuqu_' + parseInt(Math.random() * 100000)
          feature.setProperties({
            stcd: 'test',
            sttp: 'RR',
            stnm: '站名——' + id,
            visible: 1,
          })
          let geom = feature.getGeometry().clone()

          feature.setGeometryName('geom')
          feature.setGeometry(geom)

          this.handleTransact(feature, 'insert')
        },
      })
    },
    //  改
    handleVisible(value) {
      let feature = this.curFeature.clone()
      feature.setId(this.curFeature.getId())

      WfsUtils.Geometry.applyTransform(feature.getGeometry())
      feature.setGeometryName('geom')

      const properties = feature.getProperties()
      properties['visible'] = value
      delete properties.geometry
      feature.setProperties(properties)
      this.handleTransact(feature, 'update')
    },
    // 删
    handleDelete() {
      if (this.curFeature) {
        let feature = this.curFeature
        this.handleTransact(feature, 'delete')
      }
    },

    handleTransact(feature, type) {
      const wfsHandler = olInstance.getWfsHandler()

      const geoserverData = {
        uri: 'http://10.1.102.189:8877/geoserver/pg',
        wsName: 'pg',
        layer: 'dy_gisobj_point_test',
      }

      wfsHandler
        .transact('http://localhost/geoserver/PG/wfs', {
          transactType: type,
          features: [feature],
          srsName: 'EPSG:4326',
          featureNS: geoserverData.wsName,
          featureType: geoserverData.layer,
        })
        .then((res) => {
          console.log(res)
        })
    },

    handleGeojson() {
      olInstance.addGeojsonLayer({
        id: '1212',
        visible: true,
        geojson: riverJson,
      })
    },

    handleToolChange(handler) {
      console.log('tool', handler)
    },

    handleUploadSuccess(e) {
      console.log(e)
    },

    handleDrawEnd2(e) {
      console.log('end..', e)
    },

    handleMultpolygons() {
      // MultPolygonsJson.forEach((element) => {
      //   const color = VcUtils.getRandomRgb(0.6)
      //   olInstance.getLayerHandler().createPolygons({
      //     layerId:'asasasasasas',
      //     features: [element],
      //     style: {
      //       fill: {
      //         color
      //       },
      //       stroke:{
      //         color,
      //         width:0
      //       }
      //     },
      //   })
      // })

      MultPolygonsJson.forEach((element) => {
        const color = VcUtils.getRandomRgb(0.6)
        element['style'] = {
          fill: {
            color,
          },
          stroke: {
            color,
            width: 0,
          },
        }
      })

      olInstance.getLayerHandler().createPolygons({
        layerId: 'asasasasasas',
        features: MultPolygonsJson,
        clear: true,
      })
    },

    handleMultlines() {
      this.multilineLayer = olInstance.getLayerHandler().createMultiLines({
        features: MultLinesJson,
        style: {
          stroke: {
            color: 'blue',
            width: 12,
          },
        },
      })

      olInstance.getLayerHandler().createLines({
        features: MultLinesJson,
        style: {
          stroke: {
            color: 'red',
            width: 4,
          },
        },
      })
    },

    handlePoints() {
      olInstance.getLayerHandler().createPoints({
        features: PointsJson,
        style: {
          image: {
            color: 'red',
            radius: 12,
          },
          text: {
            // field: 'gateName',
          },
        },
      })
    },
    handleSelectChange(e){
    }
  },
}
</script>

<style scoped>
#app-container {
  width: 100%;
  height: 100%;
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
  padding: 0 10px;
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
  height: calc(100% - 200px);
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
</style>
