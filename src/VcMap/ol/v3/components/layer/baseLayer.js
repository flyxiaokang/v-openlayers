/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-08-16 11:12:48
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 15:42:16
 */

import { watch } from 'vue'

export const useProps = {
  name: {
    type: String,
    default: 'layer',
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
    type: Number,
    default: 10,
  },
}

export const useEmits = ['ready']

export const useWatch = ({ visible, zIndex, opacity }, layer) => {
  watch(visible, (nv) => {
    layer.value.setVisible(nv)
  })
  watch(zIndex, (nv) => {
    layer.value.setZindex(nv)
  })
  watch(opacity, (nv) => {
    layer.value.setOpacity(nv)
  })
}

export const useSelect = (selectable,)=>{
  function addSelect(){
  }
  watch(selectable,(nv)=>{
  })
}

