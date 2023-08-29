<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 14:02:06
-->
<template>
  <div class="vcmap-mapbar">
    <a class="active" @click="handleToggle">
      <!-- <icon-vc-toolbox/> -->
      <img class="toolbox" :src="toolboxSrc" title="工具箱" />
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
import { getConfig } from '@/VMap/ol/config'
import { onMounted, ref, toRefs, watch } from 'vue'

import toolboxSrc from '../../assets/image/toolbar/toolbox.png'

const props = defineProps({
  toolIndex: {
    type: Number,
    default: -1,
  },
})

const emits = defineEmits(['on-change'])

let isCollapse = ref(false)
let menus = ref([])

const { toolIndex } = toRefs(props)
let curToolIndex = props.toolIndex

watch(toolIndex, (nv, ov) => {
  if (toolIndex !== 6) {
    curToolIndex = toolIndex
  }
})

onMounted(() => {
  menus.value = getConfig().toolbar.filter((e) => e.visible)
})

const handleToggle = () => {
  isCollapse.value = !isCollapse.value
}

const handleClick = (item, index) => {
  if (index !== 6) {
    curToolIndex = index
  } else {
    curToolIndex = -1
  }
  const { key, handler } = item
  emits('on-change', { key, handler: handler }, index)
}
</script>
<style scoped>
.vcmap-mapbar {
  position: absolute;
  top: 70px;
  right: 17px;
  width: 36px;
  text-align: center;
  /* box-shadow: 2px 1px 3px #888888; */
}

.vcmap-mapbar a {
  background-color: #fff;
  color: black;
  display: block;
  /* padding: 2px 1px; */
}

.vcmap-mapbar a:hover {
  background-color: #c5e8ff;
}

.vcmap-mapbar a.active {
  /* background-color: #409eff; */
  color: white;
  border-radius: 5px;
  /* padding: 5px 0; */
  padding: 5px 0 0 0;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 2px 1px 3px #888888;
}

.vcmap-mapbar .toolbox {
  width: 24px;
  height: 24px;
}

.vcmap-mapbar .navItem {
  width: 30px;
  height: 30px;
}

.vcmap-mapbar .active2 {
  background-color: #c5e8ff;
  /* color: white; */
}

.vcmap-mapbar .tool {
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
