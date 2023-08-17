<!--
 * @Description: vector layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-16 11:03:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 09:58:59
-->
<template></template>
<script setup>
import {
  onMounted,
  onUnmounted,
  nextTick,
  inject,
  watch,
  computed,
  toRefs,
  reactive,
  ref,
} from 'vue'
import { useProps, useEmits, useWatch } from '../baseLayer'
import InteractionHandler from '@/VcMap/ol/lib/core/plugins/InteractionHandler'
import { uuid } from '@/VcMap/public/utils/base/string'

const olHandler = inject('olHandler')

const props = defineProps({
  ...useProps,
  layerId: {
    type: String,
    default: '',
  },
  source: {
    type: Object,
    default() {
      return {
        features: [],
      }
    },
  },
  features: {
    type: Array,
    default() {
      return []
    },
  },
  geometrys: {
    type: Array,
    default() {
      return []
    },
  },
  style: {
    type: Object,
    default() {
      return {}
    },
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  modifiable: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([...useEmits, 'select-change', 'modify-end'])

const {
  layerId,
  source,
  features,
  geometrys,
  style,
  visible,
  opacity,
  zIndex,
  selectable,
  modifiable,
} = toRefs(props)

onMounted(() => {
  nextTick(() => {
    init()
  })
})

let vectorLayer = ref(null)
useWatch(toRefs(props), vectorLayer)

watch(
  features,
  () => {
    init()
  },
  {
    deep: true,
  }
)

watch(selectable, () => {
  handleSelect()
})

watch(modifiable, () => {
  handleModify()
})

const init = () => {
  if (isValidFeatures.value && isValidLayerId()) {
    vectorLayer.value = olHandler.getLayerHandler().createCustomLayer({
      layerId: getLayerId(),
      features: features.value,
      visible: visible.value,
      style: style.value,
      opacity: opacity.value,
      zIndex: zIndex.value,
      clear: true,
    })
    handleSelect()
    handleModify()
    emits('ready', vectorLayer.value)
  }
}

const layerUUID = uuid()
const getLayerId = () => {
  return layerId.value ? layerId.value : layerUUID
}
const isValidLayerId = () => {
  if (layerId.value) {
    if (olHandler.getLayerById(layerId.value)) {
      console.warn('重复的图层id')
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

const isValidFeatures = computed(() => {
  if (features.value instanceof Array) {
    return true
  } else {
    return false
  }
})

let interactionHandler = null
const handleSelect = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(getLayerId())],
    })
  }
  interactionHandler.enableSelect(selectable.value, (e) => {
    emits('select-change', e)
  })
}

const handleModify = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(getLayerId())],
    })
  }
  interactionHandler.enableModify(modifiable.value, (e) => {
    emits('modify-end', e)
  })
}

onUnmounted(() => {
  if (interactionHandler) {
    interactionHandler.release()
    interactionHandler = null
  }
})
</script>
<style lang=""></style>
