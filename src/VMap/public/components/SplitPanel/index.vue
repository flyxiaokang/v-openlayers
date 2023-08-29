<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-11-18 11:05:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-11-22 14:07:00
-->
<template>
  <div class="split-panel-container">
    <div
      class="panel_left"
      ref="refLeftContanier"
      :style="{
        width: `${leftWidth - leftMoveNum}px`,
        height: '100%',
        display: 'inline-block',
        'min-width': minWidthComp,
      }"
    >
      <slot name="left"></slot>
    </div>
    <div class="drag_bar" @mousedown="handleSplitLine">
      <i class="el-icon-d-caret"></i>
    </div>
    <div
      class="panel_right"
      :style="{
        width: `calc(100% - ${2 - leftMoveNum + leftWidth}px )`,
        height: '100%',
        'min-width': minWidthComp,
      }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SplitPanel',
  props: {
    leftWidth: {
      type: Number,
      default: 300,
    },
    minWidth: {
      type: Number,
      default: 200,
    },
  },

  data() {
    return {
      leftMoveNum: 0,
    }
  },

  computed: {
    minWidthComp() {
      return this.minWidth + 'px'
    },
    leftWidthComp() {
      return this.leftWidth - this.leftMoveNum
    },
    rightWidthComp() {
      return 2 - this.leftMoveNum + this.leftWidth
    },
  },

  mounted() {
    console.log(this.minWidthComp)
  },

  methods: {
    handleSplitLine(e) {
      let that = this
      var disx = e.pageX
      let flag = true
      let aaa = 0
      document.onmousemove = function (e) {
        var plus = disx - e.pageX
        if (that.leftMoveNum !== 0 && flag) {
          aaa = that.leftMoveNum
        }
        that.leftMoveNum = aaa + plus
        flag = false
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    },
  },
}
</script>
<style scoped>
.split-panel-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.drag_bar {
  width: 2px;
  height: 100%;
  position: relative;
  background-color: #dddddd;
  cursor: ew-resize;
}

.el-icon-d-caret {
  position: absolute;
  top: 50%;
  left: -7px;
  transform: rotate(90deg);
}

.panel_left {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
  padding: 5px;
}

.panel_right {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
  padding: 5px;
}
</style>
