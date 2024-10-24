<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 09:20:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-09-30 17:25:51
-->
<template>
  <div id="app-container">
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      style="margin: 0 10px; height: 100%"
    >
      <el-tab-pane label="map" name="first">
        <div style="display: flex;">
          <LayerWgs84 style="height: 70vh;"></LayerWgs84>
          <!-- <LayerWgs84 style="height: 70vh;"></LayerWgs84>
          <LayerWebmocat style="height: 70vh;"></LayerWebmocat> -->
          <LayerWebmocat style="height: 70vh;"></LayerWebmocat>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'

import LayerWgs84 from './components/LayerWgs84.vue'
import LayerWebmocat from './components/LayerWebmocat.vue'

const activeName = ref('first')
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
  /* height: calc(100% - 60px); */
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
