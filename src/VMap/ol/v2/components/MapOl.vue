<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-12 15:55:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-14 11:01:25
-->
<template>
  <div
    class="vmap-container"
    style="width: 100%; position: relative"
    element-loading-text="加载中，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <div :id="target" class="map-view" />
    <slot name="popup"></slot>
    <!-- popup -->
    <MapPopup
      v-show="showFeaturePopup"
      :popupId="popupId"
      :title="featurePopupTitle"
      :contentHtml="popupContentHtml"
      @on-close="handleClosePopup"
    />
    <!-- multiple popup -->
    <div v-if="multiplePopupsEnable" :id="popupsId">
      <div
        v-for="item in computePopups"
        :id="item.id"
        class="model_popup"
        :key="item.id"
      >
        <div :id="item.id + '_content'" class="popup-content"></div>
        <div class="triangle"></div>
      </div>
    </div>
    <!-- 工具条 -->
    <MapBar
      v-if="showToolbar"
      :tool-index="curToolIndex"
      @on-change="mapToolHandler"
    />
    <!-- 地图状态条 -->
    <MapStatus v-if="showStatusbar" :latlon="latlon" :zoom="zoom"/>
    <!-- 底图 -->
    <MapBaseLayer v-if="showBasemapbar" @on-toggle="toggleMap" />
    <!-- 绘制 -->
    <MapDraw
      v-if="showMapDraw"
      class="vcmap_draw"
      @on-drawchange="handleDrawChange"
    />
    <!-- 图层管理 -->
    <transition name="el-zoom-in-top">
      <DraggablePanel
        v-if="layerManagerVisible"
        title="图层列表"
        :initTop="0"
        :init-left="0"
        :initWidth="200"
        :initHeight="400"
        @closeDraggable="handleCloseTool"
      >
        <MapLayerManager
          :default-checked="defaultCheckLayerIds"
          @on-checkchange="handleCheckChange"
        />
      </DraggablePanel>
    </transition>
  </div>
</template>

<script>
import { getOlHandler } from '@/VMap/ol/init'
import VUtils from '@/VMap/public/utils/base'
import { setConfig, getConfig } from '@/VMap/ol/config'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

import MapBaseLayer from './MapBaseLayer.vue'
import MapBar from './MapBar.vue'
import MapLayerManager from '@/VMap/public/components-v2/Map/MapLayerManager.vue'
import MapPopup from './popup/MapPopup.vue'
import MapStatus from '@/VMap/public/components-v2/Map/MapStatus.vue'
import MapDraw from '@/VMap/public/components-v2/Map/MapDraw.vue'
import DraggablePanel from '@/VMap/components/Draggable/index.vue'

const olInstance = getOlHandler()
export default {
  name: 'OlMap',
  components: {
    DraggablePanel,
    MapStatus,
    MapBaseLayer,
    MapBar,
    MapLayerManager,
    MapPopup,
    MapDraw,
  },
  props: {
    mapConfig: {
      type: Object,
      default() {
        return getConfig()
      },
    },
    featurePopupEnable: {
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

    multiplePopupsEnable: {
      type: Boolean,
      default: false,
    },

    multiplePopups: {
      type: Array,
      default() {
        return []
      },
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
  },
  data() {
    return {
      target: `VMap-map${uuidOnlyStr()}`,
      mapReady: false,
      // 实时坐标
      latlon: [0, 0],
      curToolIndex: -1,
      // 图层管理
      layerManagerVisible: false,
      showFeaturePopup: false, //feature popup
      popupId: 'ol-custom-popup-id',
      popupsId: 'ol-custom-popups-id',
      overlay: null,
      attributeOverlay: null,
      popupContentHtml: '',
      popupContent: '',
      popupPrefix: 'm-custom-popup-',
      multiplePopupReady: true,
      updatePopups: false,
      // 已勾选图层
      defaultCheckLayerIds: [],
      showMapDraw: false,
      zoom:0
    }
  },
  computed: {
    computePopups() {
      return this.multiplePopups.map((e) => {
        return {
          ...e,
          id: this.popupPrefix + parseInt(Math.random() * 10000),
        }
      })
    },
  },
  watch: {
    multiplePopups: {
      handler(nv, ov) {
        // console.log("popup...", nv, this.mapReady);
        if (this.mapReady && this.multiplePopupsEnable) {
          setTimeout(() => {
            this.bindMultiplePopup()
          }, 500)
        }
      },
      deep: true,
    },

    featurePopup: {
      handler(nv, ov) {
        if (
          this.mapReady &&
          JSON.stringify(nv) != '{}' &&
          this.featurePopupEnable
        ) {
          console.log('featurePopup...', nv)
          const { location, attributes } = nv
          if (attributes instanceof Array && attributes.length > 0) {
            this.openFeaturePopup(location, attributes)
          }
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {},
  beforeCreate() {},
  created() {
    setConfig(this.mapConfig)
  },
  mounted() {
    const { target, controls } = this
    olInstance.target = target
    this.olInstance = olInstance
    olInstance.initMap((map) => {
      this.mapReady = true
      this.$emit('ready', olInstance)
      // this.bindPopup();
      this.bindMultiplePopup()
      this.bindEvent()
      this.zoom = map.getView().getZoom()
    }, controls)
  },
  methods: {
    getOlHandler() {
      return this.olInstance
    },
    bindEvent() {
      const { olInstance } = this
      olInstance.registerMouseMove((e) => {
        this.latlon = [e.coordinate[0].toFixed(4), e.coordinate[1].toFixed(4)]
        this.$emit('mouse-move', e)
      })

      olInstance.registerMouseClick((e) => {
        this.$emit('mouse-click', e)
        // const features =
        //     olInstance.map.getFeaturesAtPixel(e.pixel) || [];

        // const coordinate = e.coordinate;

        // let pixel = olInstance.map.getEventPixel(e.originalEvent);
        // olInstance.map.forEachFeatureAtPixel(
        //     pixel,
        //     (feature, layer) => {
        //         console.log(
        //             "forEachFeatureAtPixel  layer...",
        //             feature?.getProperties(),
        //             layer?.getProperties()
        //         );
        //     }
        // );

        // this.popupVisible && this.openPopup(coordinate);
        // if (features.length === 0) {
        //     return;
        // }

        // const properties = features[0].getProperties();
        // this.featurePopupEnable &&
        //     this.openFeaturePopup(
        //         coordinate,
        //         this.object2Array(properties)
        //     );
        // for (let index = 0; index < features.length; index++) {
        //     const element = features[index];
        //     const { layerId } = element.getProperties();
        //     if (layerId && layerId.indexOf("vectorLayerPoint") != -1) {
        //         pointClickHandler(
        //             element.getProperties(),
        //             e,
        //             olInstance.map
        //         );
        //         break;
        //     }
        // }
      })

      olInstance.registerMouseMoveEnd((e) => {
        this.$emit('mouse-moveend', e)
        this.zoom = olInstance.map.getView().getZoom()
      })
    },

    bindPopup() {
      const container = document.getElementById(this.popupId)
      /**
       * Create an overlay to anchor the popup to the map.
       */
      this.overlay = this.olInstance.addOverlay(container)
      this.attributeOverlay = this.olInstance.addOverlay()
    },

    bindMultiplePopup() {
      if (this.multiplePopupsEnable) {
        this.computePopups.forEach((popup) => {
          const { id, location, attributes } = popup
          this.olInstance.createOverlay({
            popupId: id,
            center: location,
            html: this.getHtml(attributes),
            offset: [0, 0],
          })
        })
      }
    },

    handleClosePopup() {
      this.overlay.setPosition(undefined)
      return false
    },

    openPopup(coordinate) {
      // const content = document.getElementById(
      //     this.$refs.refForPopup.contentId
      // );
      // content.innerHTML = `<p>当前坐标:</p>${coordinate.join(",")}`;
      this.popupContentHtml = `<p>当前坐标:</p>${coordinate.join(',')}`
      this.overlay.setPosition(coordinate)
    },

    object2Array(properties) {
      const attributes = []
      for (const key in properties) {
        if (Object.hasOwnProperty.call(properties, key)) {
          const element = properties[key]
          console.log('key...', key, element)
          if (typeof element !== 'object') {
            attributes.push({
              label: key,
              value: element,
            })
          }
        }
      }

      return attributes
    },

    openFeaturePopup(location, attributes) {
      this.overlay = this.olInstance.createOverlay({
        popupId: this.popupId,
        center: location,
        html: this.getHtml(attributes),
        offset: [0, 0],
        collection: false,
      })

      // content.innerHTML = `<p>You clicked here:</p>${str}`;
      // this.popupContent = properties
      // this.popupContentHtml = `<p>You clicked here:</p>${str}`;

      // this.popupContentHtml = this.getHtml(attributes);
      // this.overlay.setPosition(coordinate);
      this.showFeaturePopup = true
    },

    getHtml(data) {
      let html = ''
      data.forEach((element) => {
        const { value, label } = element
        html += `<div style="display:flex;padding:2px;"><div style="width:50%;text-align:left;background-clor:azure;">${label}：</div><div style="width:auto;text-align:left;">${value}</div></div>`
      })

      html += ''
      return html
    },

    toggleMap(layerid) {
      this.olInstance.toggleBaseLayer(layerid)
    },

    mapToolHandler({ key, handler }, index) {
      console.log(key, handler)
      this.curToolIndex = index
      if (handler) {
        this.$emit('tool-change', handler)
        return
      }

      switch (key) {
        case 'fullExtent':
          this.olInstance.fullExtent()
          break
        case 'zoomIn':
          this.olInstance.dragZoom(false)
          break
        case 'zoomOut':
          this.olInstance.dragZoom(true)
          break
        case 'pointer':
          this.olInstance.endDragZoom()
          break
        case 'LineString': // 测距
          alert()
          olInstance.getMeasureHandler().measureLength()
          break
        case 'xzq':
          this.showXzqPanel = !this.showXzqPanel
          break
        case 'Polygon': // 测面
          olInstance.getMeasureHandler().measureArea()
          break
        case 'layer':
          this.layerManagerVisible = true
          break
        case 'locate':
          this.showMapLocateWindow = !this.showMapLocateWindow
          break
        case 'clear':
          olInstance.getMeasureHandler().clearResult()
          break
        case 'draw':
          this.showMapDraw = true
          break
        default:
          break
      }
    },

    handleCloseTool() {
      this.curToolIndex = -1
      this.layerManagerVisible = false
    },

    handleCheckChange(item, checked, indeterminate) {
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
          VUtils.pushNoReapeat(this.defaultCheckLayerIds, id, checked)
          olInstance.addLayerByType({ ...layer, visible: checked })
        })
      } else if (!item.hasOwnProperty('children') && !indeterminate) {
        // single
        // console.log("single", item.id);
        VUtils.pushNoReapeat(this.defaultCheckLayerIds, item.id, checked)
        olInstance.addLayerByType({ ...item, visible: checked })
      }
    },

    handleDrawChange(type, snapEnable, modifyEnable) {
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
            console.log('drawend...', e)
          },
        })
      }
    },
  },
}
</script>

<style scoped>
.custom-icon-container {
  position: absolute;
  top: 100px;
  left: 50px;
  z-index: 3999;
}
.map-view {
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

.model_popup {
  display: none;
  padding: 3px 5px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  min-width: 20px !important;
  left: -20px !important;
  text-align: center;
}

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

.vcmap_draw {
  position: absolute;
  top: 20px;
  right: 150px;
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
