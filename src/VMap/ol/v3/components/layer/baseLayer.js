/*
 * @Description: base layer
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:12:48
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-24 15:39:20
 */

import { watch } from 'vue'

export const useProps = {
  name: {
    type: String,
    default: 'layer',
  },
  layerId: {
    type: String,
    default: '',
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  extent: {
    type: Array,
    default: [],
  },
  zIndex: {
    type: [Number, undefined],
    default: undefined,
  },
  minZoom: {
    type: [Number, undefined],
    default: undefined,
  },
  maxZoom: {
    type: [Number, undefined],
    default: undefined,
  },
  extent: {
    type: [Array, undefined],
    default: undefined,
  },
}

export const useEmits = ['ready','error']

export const useWatch = ({ visible, zIndex, opacity, minZoom,maxZoom }, layer) => {
  watch(visible, (nv) => {
    layer.value.setVisible(nv)
  })
  watch(zIndex, (nv) => {
    layer.value.setZindex(nv)
  })
  watch(opacity, (nv) => {
    layer.value.setOpacity(nv)
  })
  watch(minZoom, (nv) => {
    layer.value.setMinZoom(nv)
  })
  watch(maxZoom, (nv) => {
    layer.value.seMaxZoom(nv)
  })
}

export const useSelect = (selectable) => {
  function addSelect() {}
  watch(selectable, (nv) => {})
}
