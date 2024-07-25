<!--
 * @Description: vector layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:03:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-03-21 18:01:03
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
import InteractionHandler from '@/VMap/ol/lib/core/plugins/InteractionHandler'
import { uuid } from '@/VMap/public/utils/base/string'
import { OlHandler } from '@/entry/ol.entry'

let olHandler = new OlHandler()
olHandler = inject('olHandler')

const props = defineProps({
  ...useProps,
  source: {
    type: Object,
    default() {
      return {
        features: [],
      }
    },
  },
  features: {
    type: [Array, Object],
    default() {
      return []
    },
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  geometrys: {
    type: Array,
    default() {
      return []
    },
  },
  layerStyle: {
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
  clusterOptions: {
    type: [Object, null],
    default() {
      return null
    },
  },
  geomField: {
    type: String,
    default: 'wktstr',
  },
})

const emits = defineEmits([...useEmits, 'select-change', 'modify-end'])

const {
  layerId,
  features,
  layerStyle,
  visible,
  zIndex,
  selectable,
  modifiable,
  clusterOptions,
  geomField,
} = toRefs(props)

onMounted(() => {
  nextTick(() => {
    initLayer()
  })
})

let layerObject = ref(null)
useWatch(toRefs(props), layerObject)

watch(
  features,
  () => {
    initLayer()
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

const initLayer = () => {
  if (isValidLayerId()) {
    if (clusterOptions.value) {
      olHandler.removeLayerById(getLayerId.value)
      layerObject.value = olHandler
        .getLayerHandler()
        .getClusterLayer(features.value, {
          id: getLayerId.value,
          visible: visible.value,
          style: layerStyle.value,
          zIndex: zIndex.value,
          geomField: geomField.value,
          ...clusterOptions.value,
        })
      olHandler.map.addLayer(layerObject.value)
    } else {
      layerObject.value = olHandler.getLayerHandler().createCustomLayer({
        ...props,
        clear: true,
        layerId: getLayerId.value,
        style: layerStyle.value,
      })
    }
    handleSelect()
    handleModify()
    emits('ready', layerObject.value)
  }
}

const getLayerId = computed(() => {
  return layerId.value || uuid()
})

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

let interactionHandler = null
const handleSelect = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(getLayerId.value)],
    })
  }
  interactionHandler.enableSelect(selectable.value, (e) => {
    emits('select-change', e)
  })
}

const handleModify = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(getLayerId.value)],
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

<script>
export default {
  name: 'OlVector',
}
</script>
<style lang=""></style>
