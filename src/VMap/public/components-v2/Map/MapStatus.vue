<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-10-19 08:57:07
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-14 11:04:04
-->
<template>
  <div class="vmap-status-bar">
    <div style="width: 150px; text-align: left">经度：{{ latlon[0] }}</div>
    <div style="width: 150px; text-align: left">纬度：{{ latlon[1] }}</div>
    <div style="width: 100px; text-align: left">级别：{{ zoom.toFixed(0) }}</div>
  </div>
</template>

<script>
export default {
  name: 'MapStatus',
  components: {},
  props: {
    latlon: {
      type: Array,
      default() {
        return [0, 0]
      },
    },
    zoom: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      curLatlon: [...this.latlon],
    }
  },
}
</script>

<style scoped>
.vmap-status-bar {
  display: flex;
  flex-direction: row;
  position: absolute;
  /* width: 100%; */
  height: 30px;
  line-height: 25px;
  right: 0px;
  bottom: 0px;
  font-size: 14px;
  font-weight: bold;
  background-color: #ebeef58c;
  border-radius: 5px;
  text-align: right;
  font-family: monospace;
  user-select: none;
  padding: 2px 10px;
}

@media screen and (max-width: 1366px) {
  .vmap-status-bar {
    font-size: 12px;
  }
}
</style>
