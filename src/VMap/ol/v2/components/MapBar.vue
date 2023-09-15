<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-14 10:16:27
-->
<template>
  <div class="vcmap-mapbar">
    <a class="active" @click="handleToggle">
      <el-icon v-if="!isCollapse">
        <caret-bottom />
      </el-icon>
      <el-icon v-else>
        <caret-top />
      </el-icon>
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

<script>
import { getConfig } from '@/VMap/ol/config'
export default {
  props: {
    toolIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      isCollapse: false,
      curToolIndex: this.toolIndex,
      menus: [],
    }
  },
  computed: {},
  watch: {
    toolIndex() {
      console.log(this.toolIndex)
      if (this.toolIndex !== 6) {
        this.curToolIndex = this.toolIndex
      }
    },
  },
  created() {},
  mounted() {
    this.menus = getConfig().toolbar.filter((e) => e.visible)
  },
  methods: {
    handleToggle() {
      this.isCollapse = !this.isCollapse
    },
    handleClick(item, index) {
      if (index !== 6) {
        this.curToolIndex = index
      } else {
        this.curToolIndex = -1
      }
      this.$emit('on-change', item, index)
    },
  },
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
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  padding: 7px 0;
  cursor: pointer;
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
