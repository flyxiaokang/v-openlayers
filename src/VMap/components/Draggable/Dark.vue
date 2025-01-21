<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-04-06 22:13:34
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-18 13:54:16
-->
<template>
  <div
    id="draggableContainer"
    class="draggable-container-class"
    ref="draggableRef"
    :style="{
      top: initPosition.top + 'px',
      left: initPosition.left + 'px',
      width: initPosition.width + 'px',
      height: initPosition.height + 'px',
      'border-radius': '7px',
    }"
  >
    <div
      v-if="showTitle && !showCollapseBtn"
      :class="{ draggableTitleClass: true }"
      @mousedown="mousedownfun"
    >
      <div style="font-size: 16px; white-space: nowrap">{{ title }}</div>
      <icon-vc-close
        v-if="showCloseBtn"
        class="draggableClose"
        @click="closeResult"
      ></icon-vc-close>
    </div>

    <div
      v-if="showCollapseBtn"
      :class="{ draggableTitleClass2: true }"
      @mousedown="mousedownfun"
    >
      <el-icon style="margin-top: 5px" @click="handleCollapse">
        <ArrowUpBold v-if="!collapse" style="color: black" />
        <ArrowDownBold v-else style="color: black" />
      </el-icon>
    </div>
    <div
      v-show="showContent"
      class="draggable_content"
      style=""
      :style="{ height: 'calc(100% - 26px)' }"
    >
      <div
        @mousedown="mousedown_left"
        class="leftClass"
        :style="{
          'border-left': marginNum + 'px solid rgb(255, 255, 255)',
        }"
        v-show="!showCollapseBtn"
      ></div>
      <div class="slotClass" :style="{ 'padding-bottom': '0px' }">
        <slot></slot>
      </div>
      <div
        @mousedown="mousedown_right"
        class="rightClass"
        :style="{
          'border-right': marginNum + 'px solid rgb(255, 255, 255)',
        }"
        v-show="!showCollapseBtn"
      ></div>
    </div>
    <div
      @mousedown="mousedown_bottom"
      class="bottomClass"
      v-show="!showCollapseBtn"
      :style="{
        'border-bottom': marginNum + 1 + 'px solid rgb(255, 255, 255)',
      }"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'VDraggableDark',
  props: {
    title: {
      type: String,
      default: '',
    },
    initTop: {},
    initBottom: {},
    initLeft: {},
    initRight: {},
    initWidth: {},
    initHeight: {},
    marginNum: {
      type: Number,
      default: 2,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    showCloseBtn: {
      type: Boolean,
      default: true,
    },
    showCollapseBtn: {
      type: Boolean,
      default: false,
    },
    parentClassName: {
      type: String,
      default: 'vmap-container',
    },
  },
  data() {
    return {
      collapse: false,
      showContent: true,
      initPosition: {
        top: 100,
        left: 100,
        width: 100,
        height: 100,
      },
      offsetTop: 70,
    }
  },
  created: function () {
    if (this.initTop || this.initTop != null) {
      this.initPosition.top = this.initTop
    } else {
    }
    if (this.initLeft || this.initLeft != null) {
      this.initPosition.left = this.initLeft
    } else {
    }
    if (this.initWidth || this.initWidth != null) {
      this.initPosition.width = this.initWidth
    }
    if (this.initHeight || this.initHeight != null) {
      this.initPosition.height = this.initHeight
    }
    if (this.initBottom || this.initBottom != null) {
    }
    if (this.initRight || this.initRight != null) {
    }
    if (this.marginNum === undefined) {
      this.marginNum = 0
    }
  },
  mounted: function () {
    this.$nextTick((e) => {
      this.updatePosition()
    })
  },
  computed: {},
  methods: {
    updatePosition() {
      // const parent = document.getElementsByClassName(this.parentClassName)
      const width = document.getElementsByClassName(this.parentClassName)[0]
        .clientWidth
      const height = document.getElementsByClassName(this.parentClassName)[0]
        .clientHeight
      console.log(width, height)
      let contanierWidth = width
      let contanierHeight = height
      if (this.initTop || this.initTop != null) {
        this.initPosition.top = this.initTop
      } else {
        this.initPosition.top = (contanierHeight - this.initHeight) / 2
      }
      if (this.initLeft || this.initLeft != null) {
        this.initPosition.left = this.initLeft
      } else {
        this.initPosition.left = (contanierWidth - this.initWidth) / 2
      }
      if (this.initWidth || this.initWidth != null) {
        this.initPosition.width = this.initWidth
      }
      if (this.initHeight || this.initHeight != null) {
        this.initPosition.height = this.initHeight
      }
      if (this.initBottom || this.initBottom != null) {
        this.initPosition.top =
          contanierHeight - this.initHeight - this.initBottom
      }
      if (this.initRight || this.initRight != null) {
        this.initPosition.left =
          contanierWidth - this.initWidth - this.initRight
      }
    },
    closeResult: function () {
      this.$emit('closeDraggable')
    },
    btnMinPanel() {
      const width = document.getElementsByClassName(this.parentClassName)[0]
        .clientWidth
      this.showContent = !this.showContent
      this.initPosition.height = this.showContent ? this.initHeight : 30
      this.initPosition.width = this.showContent ? this.initWidth : 40
      // this.initPosition.top = this.showContent ? this.initTop : 20
      // this.initPosition.left = this.showContent ? this.initLeft : (width - 80)
    },
    mousedownfun: function (e) {
      let _this = this
      var el = this.$refs['draggableRef']
      var disx = e.pageX - el.offsetLeft
      var disy = e.pageY - el.offsetTop
      document.onmousemove = function (e) {
        // el.style.left = e.pageX - disx + "px";
        _this.initPosition.left = e.pageX - disx
        if (e.pageY - disy > 0) {
          // el.style.top = e.pageY - disy + "px";
          _this.initPosition.top = e.pageY - disy
        }
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    },
    mousedown_bottom: function (e) {
      var _self = this
      var el = _self.$refs['draggableRef']
      let offsetTop = 0
      if (document.getElementsByClassName(this.parentClassName).length > 0) {
        offsetTop =
          document.getElementsByClassName(this.parentClassName)[0].offsetTop +
          this.offsetTop
      }
      var curPageY = e.pageY
      var curHeight = _self.initPosition.height
      document.onmousemove = function (e) {
        // var num = e.pageY - el.offsetTop;
        // console.log(curPageY,e.pageY,_self.initPosition.height)
        _self.initPosition.height = parseFloat(curHeight) + (e.pageY - curPageY)
        // _self.initPosition.height = curHeight - 100
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    },
    mousedown_left: function (e) {
      let _self = this
      var el = this.$refs['draggableRef']
      let offsetParent = el.parentElement.offsetLeft
      var disx = e.pageX
      var temp = el.offsetWidth
      var curLeft = parseFloat(el.style.left.replace('px', ''))
      var curPageX = e.pageX
      document.onmousemove = function (e) {
        var left = el.offsetLeft - (disx - e.pageX)
        var num = disx - e.pageX + temp
        // console.log(disx, e.pageX, temp, curLeft, curPageX);
        // el.style.left = `${curLeft - (curPageX - e.pageX)}px` //`${e.pageX - offsetParent}px`;
        // el.style.width = `${num}px`;
        _self.initPosition.left = `${curLeft - (curPageX - e.pageX)}`
        _self.initPosition.width = `${num}`
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    },
    mousedown_right: function (e) {
      var _this = this
      var el = this.$refs['draggableRef']
      var disx = e.pageX
      var temp = el.offsetWidth
      document.onmousemove = function (e) {
        var num = e.pageX - disx + temp
        // el.style.width = num + "px";
        _this.initPosition.width = num + ''
        _this.$emit('sizeChange', num)
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    },
    handleCollapse() {
      this.collapse = !this.collapse
      this.btnMinPanel()
    },
  },
}
</script>
<style scoped>
#draggableContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 34%);
  z-index: 5;
  background-color: rgba(6, 163, 167, 0.6);
  border-radius: 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.draggableTitleClass {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 700;
  color: #268ae5;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
  cursor: move;
  border-bottom: 1px solid #dddddd;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.draggableTitleClass2 {
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.draggable_content {
  display: flex;
  flex-direction: row;
  width: 100%;
  /* background-color: rgba(255, 255, 255, 0.3); */
  border-radius: 7px;
}

.bottomClass {
  /* border-bottom: 2px solid rgb(255, 255, 255); */
  cursor: n-resize;
}

.leftClass {
  border-left: 2px solid rgb(255, 255, 255);
  cursor: w-resize;
}

.rightClass {
  border-right: 2px solid rgb(255, 255, 255);
  cursor: e-resize;
}

.draggable-container-class .slotClass {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 2px;
  /* background-color: hsla(0, 0%, 100%, 0.262); */
}

.draggableClose {
  padding-top: 2px;
  color: black;
  cursor: pointer;
  font-size: large;
  margin-right: 0px;
  line-height: 40px;
  margin-top: 8px;
}

.draggableClose:hover {
  color: blue;
}

.handle_icon {
  cursor: pointer;
  /* font-size: 20px;
    line-height: 20px; */
  width: 15px;
  height: 15px;
  margin-top: 2px;
}
/* 
@media screen and (max-width: 1366px) {
    .draggableTitleClass {
        height: 26px !important;
    }

    .draggableTitleClass p {
        font-size: 14px !important;
        margin-top: -2px !important;
    }

    .draggableClose {
        margin-right: -2px !important;
        margin-top: -3px !important;
    }

    .handle_icon {
        cursor: pointer;
        width: 13px;
        height: 13px;
        margin-top: 0px;
    }
} */
</style>
