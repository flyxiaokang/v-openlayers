<!--
 * @Description: 工具条
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-10-24 17:50:30
-->
<template>
  <div class="vmap-mapbar" :style="getStyle">
    <a class="active" @click="handleToggle">
      <icon-vc-toolbox />
    </a>
    <transition name="el-zoom-in-top">
      <div v-show="!isCollapse" class="tool">
        <a
          v-for="(item, index) in menus"
          :key="index"
          :class="curToolIndex === index ? 'active2' : ''"
          @click="handleClick(item, index)"
        >
          <img class="navItem" :src="item.image" :title="item.label" />
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, watch, inject } from 'vue'
import { V_MOUSE_STATUS } from '@/VMap/global'
import { useProps, useEmits, usePosition } from '@/VMap/public/use/usePosition'

const olHandler = inject('olHandler')
const mapConfig = inject('mapConfig')

const props = defineProps({
  ...useProps,
  offset: {
    type: Array,
    default() {
      return [0, 50]
    },
  },
  expand: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits([...useEmits])

const { expand } = toRefs(props)

const getPosition = usePosition(toRefs(props))
const getStyle = ref({
  ...getPosition.value,
  width: '34px',
  'text-align': 'center',
})

let menus = ref([])
onMounted(() => {
  menus.value = mapConfig.toolbar.filter((e) => e.visible)
})

let isCollapse = ref(!expand.value)
const handleToggle = () => {
  isCollapse.value = !isCollapse.value
}

const curToolIndex = ref(-1)
const handleClick = (item, index) => {
  if (index !== 6) {
    curToolIndex.value = index
  } else {
    curToolIndex.value = -1
  }
  const { key, handler } = item
  handleMapTool({ key, handler: handler }, index)
}

const handleMapTool = (item, index) => {
  const { key, handler } = item
  if (handler) {
    emits('change', handler)
    return
  }
  switch (key) {
    case 'fullExtent':
      olHandler.fullExtent()
      break
    case 'zoomIn':
      olHandler.dragZoom(false)
      break
    case 'zoomOut':
      olHandler.dragZoom(true)
      break
    case 'pointer':
      olHandler.endDragZoom()
      olHandler.map.set('mouseStatus', V_MOUSE_STATUS.none)
      break
    case 'LineString': // 测距
      olHandler.getMeasureHandler().measureLength()
      break
    case 'Polygon': // 测面
      olHandler.getMeasureHandler().measureArea()
      break
    case 'clear':
      olHandler.getMeasureHandler().clearResult()
      break
    case 'xzq':
      break
    case 'layer':
      break
    case 'locate':
      break
    case 'draw':
      break
    default:
      break
  }
}
</script>

<script>
export default {
  name: 'OlToolbar',
}
</script>
<style scoped>
.vmap-mapbar {
}

.vmap-mapbar a {
  background-color: #fff;
  color: black;
  display: block;
}

.vmap-mapbar a:hover {
  background-color: #c5e8ff;
}

.vmap-mapbar a.active {
  color: white;
  border-radius: 5px;
  padding: 3px 0 0 0;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 2px 1px 3px #888888;
}

.vmap-mapbar .toolbox {
  width: 24px;
  height: 24px;
}

.vmap-mapbar .navItem {
  width: 30px;
  height: 30px;
}

.vmap-mapbar .active2 {
  background-color: #c5e8ff;
  /* color: white; */
}

.vmap-mapbar .tool {
  margin-top: 6px;
  box-shadow: 2px 1px 3px #888888;
  border-radius: 10px;
}
</style>

<style>
.el-tooltip__popper.is-light {
  border: 0px !important;
}
</style>
