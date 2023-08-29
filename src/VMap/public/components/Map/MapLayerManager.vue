<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-17 14:07:02
-->
<template>
  <el-tree
    :data="treeData"
    show-checkbox
    node-key="id"
    :default-expand-all="false"
    :default-checked-keys="defaultChecked"
    :default-expanded-keys="defaultChecked"
    :props="defaultProps"
    @check-change="checkedChange"
  />
</template>

<script setup>
import { getConfig } from '@/VMap/ol/config'
import { onMounted, reactive, ref, toRefs } from 'vue'

const props = defineProps({
  defaultChecked: {
    type: Array,
    default() {
      return []
    },
  },
})
const emits = defineEmits(['on-checkchange', 'on-close'])
let defaultProps = reactive({
  children: 'children',
  label: 'label',
})

let treeData = ref(getConfig().businessLayers)
const { defaultChecked } = toRefs(props)
onMounted((e) => {
})

const checkedChange = (data, checked, indeterminate) => {
  emits('on-checkchange', data, checked, indeterminate)
}

const closeLayerPanel = () => {
  emits('on-close')
}
</script>
<style scoped>
:deep(.el-tree) {
  height: 100%;
  overflow-y: auto;
}
</style>
