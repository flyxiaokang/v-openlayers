<!--
 * @Description: tdt
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-25 17:45:50
-->
<template>
  <div></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { uuid } from '@/VMap/public/utils/base/string'
import { useProps, useWatch } from '../baseLayer'
import { nextTick, onMounted, inject, toRefs } from 'vue'
import { V_MAP_TYPE_ENUM, getTdtUrl } from '@/VMap/global.js'
import { getConfig } from '@/VMap/ol/config'

const olHandler = inject('olHandler')

const providers = ['tdt', 'supermap', 'wmts', 'xyz', 'arcgiswmts']
const validType = ['img', 'vec', 'ter']
const props = defineProps({
  ...useProps,
  layerId: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  mapProvider: {
    type: String,
    default: '',
  },
  mapStyle: {
    type: [String, Array],
    default: '',
  },
  token: {
    type: String,
    default: '',
  },
  requestParams: {
    type: Object,
    default() {
      return {}
    },
  },
})

const { layerId, url, mapProvider, mapStyle, token, requestParams } =
  toRefs(props)

let layerObject = ref(null)
useWatch(toRefs(props), layerObject)

watch(mapStyle, (nv) => {
  initLayer()
})

const getLayerId = computed(() => {
  return layerId.value || uuid()
})

const isTdt = computed(() => {
  return mapProvider.value.toLowerCase() === V_MAP_TYPE_ENUM.tdt
})

const isSupermap = computed(() => {
  return mapProvider.value.toLowerCase() === V_MAP_TYPE_ENUM.supermap
})

const isWmts = computed(() => {
  return mapProvider.value.toLowerCase() === V_MAP_TYPE_ENUM.wmts
})

const isXYZ = computed(() => {
  return mapProvider.value.toLowerCase() === V_MAP_TYPE_ENUM.xyz
})

const getUrl = computed(() => {
  if (url.value) {
    if (isSupermap.value) {
      return getSupermapUrl()
    } else {
      return url.value
    }
  } else {
    if (isTdt.value) {
      return getTdtUrl({
        mapStyle: mapProvider.value + '_' + mapStyle.value,
        prj: getConfig().prj.split(':')[1],
        token: token.value,
      })
    }
  }
})

const getSupermapUrl = () => {
  const _requestParams = {
    request: 'gettile',
    version: '1.0.0',
    service: 'wmts',
    format: 'image/png',
    style: 'default',
    ...requestParams.value,
  }
  if (Object.keys(_requestParams).length === 0) {
    return url.value
  } else {
    let p = []
    for (const key in _requestParams) {
      if (Object.hasOwnProperty.call(_requestParams, key)) {
        const element = _requestParams[key]
        p.push(`${key}=${element}`)
      }
    }
    return url.value.split('?')[0] + '?' + p.join('&')
  }
}

const initLayer = () => {
  console.log(getUrl.value)
  if (!V_MAP_TYPE_ENUM[mapProvider.value]) {
    console.error('未知的地图提供者')
    return
  }
  const id = getLayerId.value
  if (getUrl.value) {
    debugger
    olHandler.removeLayerById(id)
    if (isWmts.value) {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        url: getUrl.value,
        type: V_MAP_TYPE_ENUM[mapProvider.value],
        params: { ...requestParams.value },
      })
    } else if (isXYZ.value) {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        url: getUrl.value + '/tile/{z}/{y}/{x}',
        type: V_MAP_TYPE_ENUM[mapProvider.value],
      })
    } else {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        url: getUrl.value,
        type: V_MAP_TYPE_ENUM[mapProvider.value],
      })
    }
    olHandler.map.addLayer(layerObject.value)
  }
}

const layerReset = () => {}

onMounted((e) => {
  nextTick((e) => {
    initLayer()
  })
})
</script>
<style lang="scss" scoped></style>
