<!--
 * @Description: 鹰眼
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-06-19 16:51:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-10-18 18:22:34
-->

<template>
  <OlMap
    :map-config="_mapConfig"
    :style="getStyle"
    theme="light"
    :show-statusbar="false"
    :controls="controls"
    :dragPan="false"
    @ready="handleMapReady"
  >
    <icon-vc-min
      v-if="!isMin"
      @click="minWindow"
      style="
        font-size: 24px;
        color: #4395d5;
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: white;
        border-radius: 5px;
      "
    />
    <icon-vc-max
      v-else
      @click="maxWindow"
      style="
        font-size: 24px;
        color: #4395d5;
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: white;
        border-radius: 5px;
      "
    />

    <div
      v-show="!isMin"
      :id="eagleId"
      class="vmap-eagle-eye"
      :style="getEyeStyle"
    ></div>
  </OlMap>
</template>
<script setup>
import OlMap from '@/VMap/ol/v3/components/OlMap.vue'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

import { ref, onMounted, computed, toRefs, inject, watch } from 'vue'
import VcUtils from '@/VMap/public/utils/base/index'
import { OlHandler } from '@/VMap/ol/init'
import { nextTick } from 'vue'

import { useProps, useEmits, usePosition } from '@/VMap/public/use/usePosition'

const olHandlerParent = inject('olHandler')
const mapConfig = inject('mapConfig')

const emits = defineEmits(['ready'])
const eagleId = ref('vmap-eye-' + uuidOnlyStr(8))

const props = defineProps({
  ...useProps,
  position: {
    type: String,
    default: 'bottom-right',
  },
  initWidth: {
    type: Number,
    default: 250,
  },
  initHeight: {
    type: Number,
    default: 250,
  },
  initZoom: {
    type: Number,
    default: 3,
  },
  initCenter: {
    type: Array,
    default() {
      return []
    },
  },
  controls: {
    type: Object,
    default() {
      return {
        zoom: false,
        scaleLine: false,
      }
    },
  },
  expand: {
    type: Boolean,
    default: false,
  },
})

const { initWidth, initHeight, initZoom, initCenter, expand } = toRefs(props)

const getPosition = usePosition(toRefs(props))
// const getStyle = ref({
// })

const eyeWidth = 40
const mapCenter = inject('mapCenter')
watch(mapCenter, (nv, ov) => {
  const screenP = olHandler.map.getPixelFromCoordinate(nv)
  // console.log(nv, screenP)
  const top = screenP[1] - eyeWidth / 2
  const left = screenP[0] - eyeWidth / 2
  if (checkEyePosition(top, left)) {
    eyeTop.value = top
    eyeLeft.value = left
  }
})

const c = VcUtils.deepClone(mapConfig)
c.defaultView.zoom = initZoom.value
c.defaultView.minZoom = initZoom.value
c.defaultView.maxZoom = initZoom.value
if (initCenter.value.length === 2) {
  c.defaultView.center = initCenter.value
}
const _mapConfig = ref(c)

onMounted(() => {
  nextTick(() => {
    if(!expand.value){
      minWindow()
    }
    setTimeout(() => {
      bindEvent()
    }, 500)
  })
})

let olHandler = new OlHandler()
const handleMapReady = (e) => {
  olHandler = e
  emits('ready', olHandler)
}

const windowWidth = ref(initWidth.value)
const windowHeight = ref(initHeight.value)
const isMin = ref(!expand.value)
const minWindow = () => {
  isMin.value = true
  windowWidth.value = 20
  windowHeight.value = 20
}
const maxWindow = () => {
  isMin.value = false
  windowWidth.value = initWidth.value
  windowHeight.value = initHeight.value
}

const getStyle = computed(() => {
  return {
    ...getPosition.value,
    width: windowWidth.value + 'px',
    height: windowHeight.value + 'px',
    'border-radius': '6px',
  }
})

const eyeTop = ref(0)
const eyeLeft = ref(0)
eyeTop.value = (initHeight.value - eyeWidth) / 2
eyeLeft.value = (initWidth.value - eyeWidth) / 2

const getEyeStyle = computed(() => {
  return {
    top: `${eyeTop.value}px`,
    left: `${eyeLeft.value}px`,
    'background-color': 'rgba(247, 34, 34, 0.267)',
    position: 'absolute',
    width: eyeWidth + 'px',
    height: eyeWidth + 'px',
  }
})

const checkEyePosition = (top, left) => {
  if (
    left <= 0 ||
    top <= 0 ||
    left >= initWidth.value - eyeWidth ||
    top >= initHeight.value - eyeWidth
  ) {
    false
  } else {
    return true
  }
}

const bindEvent = () => {
  //获取元素
  var dv = document.getElementById(eagleId.value)
  var x = 0
  var y = 0
  var l = 0
  var t = 0
  var isDown = false
  let centerX = 0
  let centerY = 0
  //鼠标按下事件
  dv.onmousedown = function (e) {
    //获取x坐标和y坐标
    x = e.clientX
    y = e.clientY

    //获取左部和顶部的偏移量
    l = dv.offsetLeft
    t = dv.offsetTop
    //开关打开
    isDown = true
    //设置样式
    dv.style.cursor = 'move'
  }
  //鼠标移动
  dv.onmousemove = function (e) {
    if (isDown == false) {
      return
    }
    //获取x和y
    var nx = e.clientX
    var ny = e.clientY
    //计算移动后的左偏移量和顶部的偏移量
    var nl = nx - (x - l)
    var nt = ny - (y - t)
    // console.log('.........', nl, nt)

    if (!checkEyePosition(nt, nl)) {
      return
    }
    dv.style.left = nl + 'px'
    dv.style.top = nt + 'px'
    centerX =
      parseFloat(dv.style.width.replace('px', '')) / 2 +
      parseFloat(dv.style.left.replace('px', ''))
    centerY =
      parseFloat(dv.style.height.replace('px', '')) / 2 +
      parseFloat(dv.style.top.replace('px', ''))
  }
  //鼠标抬起事件
  dv.onmouseup = function () {
    //开关关闭
    isDown = false
    updateMapCenter([centerX, centerY])
    // dv.style.cursor = 'default';
  }
}

const updateMapCenter = (p) => {
  const a = olHandler.map.getCoordinateFromPixel(p)
  olHandlerParent.map.getView().setCenter(a)
}
</script>

<script>
export default {
  name: 'OlEagle',
}
</script>
<style lang="scss" scoped>
.vmap-eagle-eye {
}

.vmap-eagle-eye:hover {
  cursor: move;
}
</style>
