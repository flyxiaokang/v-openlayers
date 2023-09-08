<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-09-05 22:49:10
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-07 14:59:01
-->
<template>
  <MapPopup
    v-for="(item, index) in computePopups"
    :popupId="item.id"
    :key="item.id"
    :show-title="showTitle"
    @on-close="handleClosePopup(index)"
    :class="popupClass"
  >
    <slot :data="item">
      <TableWidget
        :style="{ height: tableHeight + 'px' }"
        :table-header="tableHeader"
        :table-data="item.properties"
      />
    </slot>
  </MapPopup>
</template>
<script setup>
import { ref, toRefs, watch, computed, inject, onUnmounted } from 'vue'
import MapPopup from '../../../popup/index.vue'
import TableWidget from '@/VMap/components/Table/index.vue'
import { useProps } from '../usePopup'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

const olHandler = inject('olHandler')

const props = defineProps({
  ...useProps,
  showTitle: {
    type: Boolean,
    default: false,
  },
  tableHeight: {
    type: Number,
    default: 200,
  },
  tableHeader: {
    type: Array,
    default() {
      return [
        {
          label: '属性',
          value: 'label',
        },
        {
          label: '值',
          value: 'value',
        },
      ]
    },
  },
  popups: {
    type: Array,
    default() {
      return [
        {
          position: [],
          properties: [],
        },
      ]
    },
  },
})

const { tableHeight, tableHeader, popups, visible } = toRefs(props)

const popupsId = ref('vmap-multiple-popup-id')
const popupPrefix = 'vmap-popup-id-'
const popupClass = ref('vmap-popup-visible-' + uuidOnlyStr())

const computePopups = computed(() => {
  return popups.value.map((e) => {
    return {
      ...e,
      id: popupPrefix + parseInt(Math.random() * 10e5),
    }
  })
})

watch(
  popups,
  (nv, ov) => {
    setTimeout(() => {
      bindMultiplePopup()
    }, 0)
  },
  {
    deep: true,
  }
)

watch(visible, (nv) => {
  const elements = document.getElementsByClassName(popupClass.value)
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index]
    element.style.display = nv ? 'block' : 'none'
  }
})

let overlayList = []
const bindMultiplePopup = () => {
  handleReset()
  computePopups.value.forEach((popup) => {
    const { id, location, attributes } = popup
    const overlay = olHandler.createOverlay({
      popupId: id,
      center: location,
      offset: [0, 0],
    })
    overlayList.push(overlay)
  })
}

const handleClosePopup = (index) => {
  overlayList[index].setPosition(undefined)
  return false
}

const handleReset = () => {
  overlayList.forEach((overlay) => {
    olHandler.map.removeOverlay(overlay)
  })
  overlayList = []
}

onUnmounted(() => {
  handleReset()
})
</script>
<style lang="scss" scoped></style>
