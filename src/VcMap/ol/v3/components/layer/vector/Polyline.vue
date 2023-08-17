<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-16 11:03:20
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-16 17:48:29
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

const olHandler = inject('olHandler')

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

const emits = defineEmits([...useEmits, 'select-change','modify-end'])

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
watch(features, () => {
  init()
})

watch(selectable, () => {
  handleSelect()
})

watch(modifiable, () => {
  handleModify()
})

const init = () => {
  console.log('init...')
  if (isValidFeatures.value) {
    vectorLayer.value = olHandler.getLayerHandler().createLines({
      layerId: layerId.value,
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
      layers: [olHandler.getLayerById(layerId.value)],
    })
  }
  interactionHandler.enableSelect(selectable.value, (e) => {
    console.log(e)
    emits('select-change', e)
  })
}

const handleModify = () => {
  debugger
  if (interactionHandler === null) {
    interactionHandler = new InteractionHandler(olHandler.map, {
      layers: [olHandler.getLayerById(layerId.value)],
    })
  }

  interactionHandler.enableModify(modifiable.value, (e) => {
    console.log(e)
    emits('modify-end', e)
  })
}

onUnmounted(() => {
  if (interactionHandler) {
    interactionHandler.release()
  }
})
</script>
<style lang=""></style>
