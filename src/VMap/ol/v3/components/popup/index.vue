<!--
 * @Description: overlay
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:11:12
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-07 14:03:54
-->
<template>
  <div v-show="visible" :id="popupId" :class="getClass">
    <div v-if="showTitle" class="vmap-title">
      <span class="popup-title">{{ title }}</span>
      <span
        class="popup-title-close"
        @click="handleClose"
      ></span>
    </div>
    <div :id="contentId" class="vmap-popup-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
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

import { V_MAP_THEME } from '@/VMap/global'

const props = defineProps({
  theme: {
    type: String,
    default: V_MAP_THEME.dark,
  },
  visible:{
    type:Boolean,
    default:false
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '标题',
  },
  popupId: {
    require: true,
    type: String,
    default: '',
  },
  contentHtml: {
    type: String,
    default: '',
  },
})
const { theme, popupId } = toRefs(props)
const emits = defineEmits(['on-close'])

let contentId = ref(popupId.value + '_content')

const handleClose = () => {
  emits('on-close')
}

const getClass = computed(() => {
  return ['vmap-ol-popup', theme.value]
})



onMounted(() => {
  nextTick((e) => {
  })
})

onUnmounted(() => {
})
</script>

<style lang="scss" scoped>
.vmap-ol-popup {
  position: absolute;
  background-color: rgba(255, 255, 255, 0) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 99px !important;
}

.vmap-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #409eff;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.vmap-ol-popup:after,
.vmap-ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.vmap-ol-popup.light:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vmap-ol-popup.dark:after {
  border-top-color: rgb(0, 0, 0, 0.5);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.vmap-ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}



.popup-title-close:after {
  content: '✖';
}

.popup-title {
  position: absolute;
  color: white;
  font-weight: bold;
  top: 0px;
  left: 8px;
}

.popup-title-close {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.light .vmap-popup-content {
  background-color: white;
  color: black;
}

.dark .vmap-popup-content {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.vmap-popup-content {
  width: 100%;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  // max-height: 300px;
  // overflow-y: auto;
}
</style>
