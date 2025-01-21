<!--
 * @Description: 工具条
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-07-05 15:50:45
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-02 14:12:28
-->
<template>
  <div :class="getClass" :style="getStyle">
    <el-radio-group size="small" v-model="curIndex" @change="handleSelChange">
      <el-radio-button
        v-for="(item, index) in myTools"
        :key="index"
        :label="item.index"
        ><i :class="item.iconClass"></i>{{ item.label }}</el-radio-button
      >
    </el-radio-group>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, watch } from 'vue'
import VcUtils from '../../utils/base'
import { mapToolsClosed } from './js/tools'
import {
  useProps,
  useEmits,
  usePosition,
} from '@/VMap/public/use/usePosition'
import { getConfig, setConfig } from '@/VMap/cesium/config'

const curIndex = ref(-1)
let isOpen = true

const props = defineProps({
  ...useProps,
  activeName: {
    type: String,
    default: '',
  },
  // offset: {
  //   type: Array,
  //   default() {
  //     return [0, 0]
  //   },
  // },
  mapConfig: {
    type: Object,
    default() {
      return getConfig()
    },
  },
})

const { activeName } = toRefs(props)
watch(activeName, () => {
  curIndex.value = activeName.value
})

let myTools = reactive(props.mapConfig.toolbar)
const mapTools = VcUtils.deepClone(myTools)
const emits = defineEmits([...useEmits])
const getPosition = usePosition(toRefs(props))
const getStyle = ref({
  ...getPosition.value,
  display: 'flex',
  'text-align': 'center',
  'z-index': 1999,
})

const getClass = ref(['vmap-tools', props.theme])

const handleSelChange = (e) => {
  emits('change', e)
  if (e === 'bar') {
    curIndex.value = -1
    isOpen = !isOpen
    if (isOpen) {
      myTools.splice(0)
      mapTools.forEach((element) => {
        myTools.push(element)
      })
    } else {
      myTools.splice(0)
      myTools.push(VcUtils.deepClone(mapToolsClosed))
    }
  }
}

function releaseTool() {
  curIndex.value = -1
}

defineExpose({
  releaseTool,
})
</script>

<script>
export default {
  name: 'ArcgisToolbar',
}
</script>

<style>
@import url('../../static/css/iconfont/iconfont.css');
@import url('../../static/css/iconfont2/iconfont.css');
</style>

<style scoped>
.vmap-tools {
}

.vmap-tools .cur {
  background-color: rgb(231, 229, 229);
}

.vmap-tools > div {
  color: aquamarine;
}

.vmap-tools .transition-box {
  color: rgb(46, 44, 44) !important;
}

.vmap-tools span {
  position: absolute;
  right: 0px;
  bottom: 0px;
}

.transition-box {
  cursor: pointer;
  width: 120px;
  height: 30px;
  color: black;
  background-color: rgba(3, 0, 0, 0);
  text-align: center;
  color: #fff;
  padding: 8px 5px 6px;
  box-sizing: border-box;
}

.transition-box:hover {
  background-color: rgb(231, 229, 229);
}

.highlight {
  font-weight: bold;
}

.el-icon-d-arrow-right {
  border-radius: 5px 0px 0px 5px;
}

.icon-tuceng {
  border-radius: 0px 5px 5px 0px;
}

.el-icon-box {
  border-radius: 5px 5px 5px 5px;
}

.tool-name {
  margin-top: 1px;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
</style>

<style>
.vmap-tools.light .el-radio-button--small .el-radio-button__inner {
  border-radius: 16px;
  color: black;
  background: rgb(255, 255, 255);
}

.vmap-tools.light .el-radio-button--small .el-radio-button__inner:hover {
  color: rgb(77, 179, 251);
}

.vmap-tools.light .el-radio-button--small.is-active .el-radio-button__inner {
  color: rgb(77, 179, 251);
}

.vmap-tools.dark .el-radio-button--small .el-radio-button__inner {
  border-radius: 16px;
  color: white;
  background: rgb(0 0 0 / 47%);
}

.vmap-tools.dark .el-radio-button--small .el-radio-button__inner:hover {
  color: rgb(77, 179, 251);
}

.vmap-tools.dark .el-radio-button--small.is-active .el-radio-button__inner {
  color: rgb(77, 179, 251);
}
</style>
