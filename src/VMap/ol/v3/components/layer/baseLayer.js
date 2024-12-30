/*
 * @Description: base layer
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:12:48
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-23 16:07:15
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
  layerName: {
    type: String,
    default: '',
  },
  layerStyle: {
    type: [Object, Function],
    default() {
      return {}
    },
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: [Number, String],
    default: 1,
  },
  extent: {
    type: Array,
    default: [],
  },
  zIndex: {
    type: [Number, String, undefined],
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

export const useEmits = ['ready', 'error']

export const useWatch = (
  { visible, zIndex, opacity, minZoom, maxZoom, layerStyle, requestParams },
  layer
) => {
  watch(visible, (nv) => {
    layer.value.setVisible(nv)
  })
  watch(zIndex, (nv) => {
    layer.value.setZindex(Number(nv))
  })
  watch(opacity, (nv) => {
    layer.value.setOpacity(Number(nv))
  })
  watch(minZoom, (nv) => {
    layer.value.setMinZoom(Number(nv))
  })
  watch(maxZoom, (nv) => {
    layer.value.seMaxZoom(Number(nv))
  })
  layerStyle &&
    watch(layerStyle, (nv) => {
      layer.value.setStyle(nv)
    })
  requestParams &&
    watch(
      requestParams,
      (nv) => {
        layer.value.getSource().updateParams(nv)
      },
      {
        deep: true,
      }
    )
}

export const useSelect = (selectable) => {
  function addSelect() {}
  watch(selectable, (nv) => {})
}
