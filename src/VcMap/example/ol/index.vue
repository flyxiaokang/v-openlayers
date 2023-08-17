<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 13:44:32
-->
<template>
  <div id="app-container">
    <div class="tools-view">
      <el-tabs v-model="activeName" class="demo-tabs" style="margin:0 10px;">
        <el-tab-pane label="layer" name="first">
          <el-checkbox v-model="checkStatus">编辑</el-checkbox>
          <el-button type="primary" size="small" @click="handleChangePolygon"
            >更新面</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>

    <OlMap
      class="app-content"
      show-basemapbar
      show-toolbar
      @ready="handleMapReady"
      @mouse-click="handleMouseClick"
      @mouse-move="handleMouseMove"
    >
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

      <OlVector
        :layer-id="null"
        :features="PolygonJson"
        :modifiable="checkStatus"
        @select-change="handleSelectChange"
      />
    </OlMap>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import OlMap from '@/VcMap/ol/v3/components/OlMap.vue'
import OlOverlay from '@/VcMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VcMap/ol/v3/components/layer/vector/index.vue'

const activeName = ref('first')
const checkStatus = ref(false)

import MultLinesJson from '../data/wkt/multlines'
import PointsJson from '../data/wkt/points'
import MultPolygonsJson from '../data/wkt/multpolygons'
import VcUtils from '../../public/utils/base/index'

const handleMapReady = () => {}

const handleMouseClick = () => {}

const handleMouseMove = () => {}

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
