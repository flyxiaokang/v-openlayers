/*
 * @Description: v-openlayers
 * @Version: 1.0.0
 * @Author: kangjinrui
 * @Date: 2023-02-10 21:32:55
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-25 10:27:44
 */

// 按需引入
export { V_MAP_PROVIDER as V_MAP_TYPE } from '@/VMap/global'
export { default as OlHandler } from '@/VMap/ol/lib/business/OlHandler'
export { default as VUtils } from '@/VMap/public/utils/base/index.js'
export { default as VMapUtils } from '@/VMap/public/utils/map/index.js'
// components
import OlMap from '@/VMap/ol/v3/components/OlMap.vue'
import OlBasemap from '@/VMap/ol/v3/components/toolbar/baseLayer/index.vue'
import OlToolbar from '@/VMap/ol/v3/components/toolbar/bar/index.vue'
import OlDrawer from '@/VMap/ol/v3/components/toolbar/drawer/index.vue'
import OlEagle from '@/VMap/ol/v3/components/eagle/index.vue'


import OlPopup from '@/VMap/ol/v3/components/layer/popup/index.vue'
import OlOverlay from '@/VMap/ol/v3/components/layer/overlay/index.vue'
import OlVector from '@/VMap/ol/v3/components/layer/vector/index.vue'
import OlTile from '@/VMap/ol/v3/components/layer/tile/index.vue'
import OlTdt from '@/VMap/ol/v3/components/layer/tdt/index.vue'
import OlSupermap from '@/VMap/ol/v3/components/layer/supermap/index.vue'
import OlArcgis from '@/VMap/ol/v3/components/layer/arcgis/index.vue'
import OlWms from '@/VMap/ol/v3/components/layer/wms/index.vue'
import OlVectortile from '@/VMap/ol/v3/components/layer/vectorTile/index.vue'

import VueDraggable from '@/VMap/components/v2/Draggable/index.vue'

export {
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
}
