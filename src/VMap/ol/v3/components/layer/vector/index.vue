<!--
 * @Description: vector layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:03:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-23 15:36:17
-->
<template></template>
<script setup>
import {
  onBeforeMount,
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
// import { OlHandler} from '@/VMap/ol/init'

let olHandler = null
// olHandler = new OlHandler()
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
  snapable: {
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
  snapable,
  clusterOptions,
  geomField,
} = toRefs(props)

onBeforeMount(() => {
  setLayerId()
})

onMounted(() => {
  nextTick(() => {
    initLayer()
    initEvent()
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
  layerObject.value && handleSelect()
})

watch(modifiable, () => {
  layerObject.value && handleModify()
})

watch(snapable, () => {
  layerObject.value && handleSnap()
})

const initLayer = () => {
  const layerId = getLayerId()
  // console.log('layerid==========', layerId)
  if (isValidLayerId()) {
    if (clusterOptions.value) {
      olHandler.removeLayerById(layerId)
      layerObject.value = olHandler
        .getLayerHandler()
        .getClusterLayer(features.value, {
          id: layerId,
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
        layerId: layerId,
        style: layerStyle.value,
      })
    }
    emits('ready', layerObject.value)
  }
}

const initEvent = () => {
  handleSelect()
  handleModify()
}

const _layerId = ref('')
const setLayerId = () => {
  if (layerId.value) {
    _layerId.value = layerId.value
  } else {
    _layerId.value = uuid()
  }
}

const getLayerId = () => {
  return _layerId.value
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

const handleSnap = () => {
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(getLayerId())],
    })
  }
  interactionHandler.enableSnap(snapable.value, (e) => {
    // emits('modify-end', e)
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
