<!--
 * @Description: layer
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-06-16 20:47:11
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-19 16:41:18
-->
<template></template>

<script setup>
import { ref, watch, computed } from 'vue'
import { uuid } from '@/VMap/public/utils/base/string'
import { useProps, useEmits, useWatch } from '../baseLayer'
import { nextTick, onMounted, onUnmounted, inject, toRefs } from 'vue'
import { V_MAP_PROVIDER, getTdtUrl } from '@/VMap/global.js'
import { getConfig } from '@/VMap/ol/config'
import { isString } from '@/VMap/public/utils/base/validate'
import { OlHandler } from '@/entry/ol.entry'

let olHandler = new OlHandler()
olHandler = inject('olHandler')

const props = defineProps({
  ...useProps,
  url: {
    type: String,
    default: '',
  },
  mapProvider: {
    type: String,
    default: '',
    validator(value) {
      return (
        isString(value) &&
        [
          'tdt',
          'supermap',
          'wmts',
          'xyz',
          'wmsimagetile',
          'wmsimage',
          'arcgistile',
          'arcgisimagetile',
          'mapbox',
          'geoserver',
        ].includes(value.toLowerCase())
      )
    },
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

const emits = defineEmits(useEmits)
const { layerId, url, mapProvider, mapStyle, token, requestParams } =
  toRefs(props)

// console.log('???', toRefs(props))

let layerObject = ref(null)
useWatch(toRefs(props), layerObject)

watch(mapStyle, (nv) => {
  initLayer()
})

const getLayerId = computed(() => {
  return layerId.value || uuid()
})

const getMapProvider = computed(() => {
  return mapProvider.value.toLowerCase()
})

const isTdt = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.tdt
})

const isSupermap = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.supermap
})

const isWmts = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.wmts
})

const isXYZ = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.xyz
})

const isArcgistile = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgistile
})

const isArcgisImageTile = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgisimagetile
})

const isArcgisImage = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.arcgisimage
})

const isWmsTile = computed(() => {
  return [V_MAP_PROVIDER.wmsimagetile, V_MAP_PROVIDER.wmsimage].includes(
    getMapProvider.value
  )
})

const isWmsImage = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.wmsimage
})

const isGeoserverMvt = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.geoservermvt
})

const isMapbox = computed(() => {
  return getMapProvider.value === V_MAP_PROVIDER.mapboxmvt
})

const getUrl = computed(() => {
  if (url.value) {
    if (isSupermap.value) {
      return getSupermapUrl()
    } else if (isWmsTile.value) {
      return getWmsUrl()
    } else if (isArcgistile.value) {
      return url.value + '/tile/{z}/{y}/{x}'
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
  if (Object.keys(requestParams.value).length === 0) {
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

const getWmsUrl = () => {
  const _requestParams = {
    TILED: true,
    ...requestParams.value,
  }
  if (Object.keys(requestParams.value).length === 0) {
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
  // console.log(getUrl.value,getMapProvider.value)
  const type = V_MAP_PROVIDER[getMapProvider.value]
  if (!type) {
    console.error('未知的地图提供者')
    return
  }
  const id = getLayerId.value
  if (getUrl.value && checkUrl()) {
    olHandler.removeLayerById(id)
    if (isWmts.value) {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        type,
        url: getUrl.value,
        params: { ...requestParams.value },
      })
    } else if (isGeoserverMvt.value) {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        type,
        url: getUrl.value,
        params: {
          ...requestParams.value,
          style: props.layerStyle,
        },
      })
    } else {
      layerObject.value = olHandler.getLayerByType({
        ...props,
        id,
        type,
        url: getUrl.value,
      })
    }
    if (layerObject.value) {
      olHandler.map.addLayer(layerObject.value)
      emits('ready', layerObject.value)
    }
  }
}

const layerReset = () => {}

const checkUrl = () => {
  // if (isArcgistile.value) {
  //   return getUrl.value.split('/').at(-1) === 'MapServer'
  // }
  // return false
  return true
}

onMounted((e) => {
  nextTick((e) => {
    initLayer()
  })
})

onUnmounted(() => {
  olHandler && olHandler.removeLayerById(getLayerId.value)
})
</script>
<style lang="scss" scoped></style>
