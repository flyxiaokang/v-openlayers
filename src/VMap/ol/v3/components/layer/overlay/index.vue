<!--
 * @Description: overlay
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:11:12
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-21 16:34:35
-->
<template>
  <div v-show="false" :id="popupId" :class="getClass">
    <div v-if="showTitle" class="vcmap-title">
      <span class="popup-title">{{ title }}</span>
      <span
        class="popup-close"
        @click="handleClose"
      ></span>
    </div>
    <div :id="contentId" class="popup-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'
import {
  ref,
  toRefs,
  onMounted,
  computed,
  watch,
  reactive,
  provide,
  inject,
  nextTick,
  onUnmounted,
} from 'vue'

const THEME_ENUM = {
  normal: 1,
  light: 2,
  dark: 3,
}

const olHandler = inject('olHandler')

const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '标题',
  },
  position: {
    type: [Array, String],
    default() {
      return undefined
    },
  },
  content: {
    type: Object,
    default() {
      return {}
    },
  },
  contentHtml: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['on-close'])

const popupId = ref('overlay-id-' + uuidOnlyStr())
const contentId = ref(popupId.value + '_content')

let overlay = null
const { position, theme } = toRefs(props)
watch(position, () => {
  if (isValidPostion.value) {
    if (overlay) {
      overlay.setPosition(position.value)
    } else {
      init()
    }
  }
})

const getClass = computed(() => {
  return ['vcmap-ol-popup', theme.value]
})

onMounted(() => {
  nextTick((e) => {
    init()
  })
})

const init = () => {
  if (isValidPostion.value) {
    if (overlay) {
      olHandler.map.removeOverlay(overlay)
    }
    overlay = olHandler.createOverlay({
      popupId: popupId.value,
      center: position.value,
      offset: [0, 0],
      collection: false,
      options:{
        className:'vcmap-overlay-top'
      }
    })
  }
}

const isValidPostion = computed(() => {
  if (
    (position.value instanceof Array && position.value.length === 2) ||
    position.value === undefined
  ) {
    return true
  } else {
    console.warn('不合法的postion')
    return false
  }
})

const handleClose = () => {
  if (overlay) {
    overlay.setPosition(undefined)
  }
  emits('on-close')
}

onUnmounted(() => {
  if (overlay) {
    olHandler.map.removeOverlay(overlay)
  }
})
</script>

<style lang="scss" scoped>
.vcmap-ol-popup {
  position: absolute;
  background-color: rgba(255, 255, 255, 0) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 99px !important;
}

.vcmap-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #409eff;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.vcmap-ol-popup:after,
.vcmap-ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.vcmap-ol-popup.light:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vcmap-ol-popup.dark:after {
  border-top-color: rgb(0, 0, 0, 0.5);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vcmap-ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.popup-close {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.popup-close:after {
  content: '✖';
}

.popup-title {
  position: absolute;
  color: white;
  font-weight: bold;
  top: 0px;
  left: 8px;
}

.light .popup-content {
  background-color: white;
  color: black;
}

.dark .popup-content {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.popup-content {
  width: 100%;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  // max-height: 300px;
  // overflow-y: auto;
}


</style>
