<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-03-26 15:52:04
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-07-10 15:49:22
-->
<template>
  <el-card v-show="stationLegend.length > 0" class="vmap-legend">
    <div class="legend">
      <div
        v-for="(item, index) in stationLegend[0]"
        :key="index"
        class="text item"
      >
        <el-checkbox
          :key="index"
          v-model="item.checked"
          @change="handleChange(item)"
        >
        </el-checkbox>
        <img v-if="item.url !== undefined" :src="item.url" alt="" />
        <div
          v-else
          class="color"
          :style="{ 'background-color': item.color }"
        ></div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
    <div class="legend">
      <div
        v-for="(item, index) in stationLegend[1]"
        :key="index"
        class="text item"
      >
        <el-checkbox
          :key="index"
          v-model="item.checked"
          @change="handleChange(item)"
        >
        </el-checkbox>
        <img v-if="item.url !== undefined" :src="item.url" alt="" />
        <div
          v-else
          class="color"
          :style="{ 'background-color': item.color }"
        ></div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

const legends = [
  {
    color: '#ed3543',
    label: '巨警',
  },
  {
    color: '#ff7723',
    label: '重警',
  },
  {
    color: '#f8c800',
    label: '中警',
  },
  {
    color: '#1dc996',
    label: '轻警',
  },
  {
    color: '#1c76f2',
    label: '无警',
  },
]
export default {
  components: {},
  props: {
    legendData: {
      type: Array,
      default: function () {
        return legends
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['stationLegend']),
  },
  watch: {},
  created() {},

  mounted() {},
  methods: {
    handleChange(item) {
      item['visible'] = item.checked
      this.$emit('event:handleChange', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.vmap-legend {
  .legend {
    display: flex;
  }

  .item {
    padding: 5px 15px;
  }

  .label {
    vertical-align: middle;
    font-size: 14px;
    margin-left: 3px;
  }

  .color {
    width: 15px;
    height: 15px;
    opacity: 1;
    border-radius: 15px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
  }

  .label {
    /* width: 30px; */
    /* line-height: 36px;
		height: 20px;
		opacity: 1;
		border-radius: 4px;
		display: inline-block; */
  }

  img {
    vertical-align: middle;
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }

  :deep(.el-card__body) {
    padding: 0px !important;
    display: inline-block;
  }
}
</style>
