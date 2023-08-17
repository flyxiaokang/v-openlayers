/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-05-18 16:19:31
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-18 16:19:32
 */
/*
 * @Description: 图层操作类
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:23:02
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-18 15:45:42
 */

// import 'ol/ol.css'
// import Map from 'ol/Map'
// import OSM from 'ol/source/OSM'
import Layer from 'ol/layer/Layer'

import TileLayer from 'ol/layer/Tile'
// import View from 'ol/View'
import WMTS from 'ol/source/WMTS'
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'

import { Heatmap as HeatmapLayer } from 'ol/layer'

// import VectorLayer from 'ol/layer/Vector'
// import VectorSource from 'ol/source/Vector'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'

import { Cluster } from 'ol/source'

import { Image as ImageLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { ImageArcGISRest, TileArcGISRest } from 'ol/source'

import Overlay from 'ol/Overlay'

import { WKT } from 'ol/format'

import {
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  Text,
  Icon,
} from 'ol/style'
import { Circle } from 'ol/geom'

import { get as getProjection } from 'ol/proj'
import { getTopLeft, getWidth } from 'ol/extent'

import GeoJSON from 'ol/format/GeoJSON'

import K_GLOBAL_CONFIG from '@/VcMap/global'

import CustomUtils from '@/VcMap/public/utils/base'

import { uuidOnlyStr } from '@/VcMap/public/utils/base/string'

import * as KFeatureLoader from './FeatureHandler'
import Feature from 'ol/Feature'
import { createRing } from './GeometryHandler'

const projection = getProjection('EPSG:3857')
const projectionExtent = projection.getExtent()
const size = getWidth(projectionExtent) / 256
const resolutions = new Array(19)
const matrixIds = new Array(19)

for (let z = 0; z < 19; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z)
  matrixIds[z] = z
}

// const url = new URL(
//   '../../../../public/static/images/dike3.png',
//   import.meta.url
// ).href

export default class LayerHandler {
  defaultStyle = new Style({
    fill: new Fill({
      color: 'rgba(255, 208, 75, 0.5)',
    }),
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#ffcc33',
      }),
    }),
    // image: new Icon({
    //   src: url,
    //   scale: 1,
    // }),
  })
  defaultVectorLayerId = 'vector_layer_temp_id_'

  constructor(options = {}) {
    // super(options)
  }

  getWmts(options) {
    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new WMTS({
        ...options,
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        wrapX: true,
      }),
    })
  }

  getWmtsWgs84(options) {
    const projection = getProjection(K_GLOBAL_CONFIG['EPSG:4326'].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG['EPSG:4326']
    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new WMTS({
        ...options,
        wrapX: true,
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions,
          matrixIds,
        }),
      }),
    })
  }

  getWmtsByPrj({ prj, options }) {
    //
    const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]
    const params =
      options.url.split('?').length > 1
        ? CustomUtils.parasUrlParams2Obj(options.url)
        : options
    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new WMTS({
        ...params,
        wrapX: true,
        projection: projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions,
          matrixIds,
        }),
      }),
    })
  }

  getWmtsGeoserver({ prj = 'EPSG:4326', options }) {
    const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]

    const matrixIdsWMTS = []
    matrixIds.forEach((element) => {
      matrixIdsWMTS.push(`${prj}:${element}`)
    })
    // 切片策略
    const tilegrid = new WMTSTileGrid({
      extent: [-180.0, -90.0, 180.0, 90.0], // 范围
      tileSize: [256, 256],
      origin: [-180.0, 90.0], // 切片原点
      resolutions: resolutions, // 分辨率
      matrixIds: matrixIdsWMTS, // 层级标识列表，与地图级数保持一致
    })
    const tileSource = new WMTS({
      url: options.url.split('?')[0],
      projection: projection,
      tileGrid: tilegrid,
      ...CustomUtils.parasUrlParams2Obj(options.url),
      format: 'image/png',
    })
    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: tileSource,
      wrapX: false,
    })
  }

  getXYZ(options) {
    return new TileLayer({
      id: options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        ...options,
      }),
    })
  }

  getXYZByPrj({ prj, options }) {
    return new TileLayer({
      id: options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        ...options,
        projection: prj,
      }),
    })
  }

  getTdtByPrj({ prj, options }) {
    return getXYZByPrj({
      prj,
      options,
    })
  }

  getSuperMapWmts({ prj, options }) {
    const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]

    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions,
      matrixIds,
    })

    const layer = new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        tileGrid,
        // maxZoom: options.maxZoom,
        projection: prj,
        tileUrlFunction: function (tileCoord) {
          const z = tileCoord[0]
          const x = tileCoord[1]
          const y = tileCoord[2]

          // let z = tileCoord[0]
          // let x = tileCoord[1]
          // let y = -tileCoord[2] - 1

          // return options.url + `&layer=w&request=gettile&tilesize=512&tilematrixset=w&tilematrix=${z}&tilerow=${y}&tilecol=${x}`

          // if (false && options.url.includes('?')) {
          //   console.log(
          //     `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
          //   )
          //   return `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
          // } else {
          //   let url___ = `${
          //     options.url
          //   }/${z}/${-y}/${x}.png?k=HzxwyaaeOc7z1KRENNqH0A==`
          //   console.log(url___)
          //   return url___
          // }
          return `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
        },
      }),
    })
    return layer
  }

  getSuperMapXYZ({ prj, options }) {
    const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]

    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions,
      matrixIds,
    })

    const { url } = options
    const layer = new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        tileGrid,
        projection: prj,
        tileUrlFunction: function (tileCoord) {
          // const z = tileCoord[0]
          // const x = tileCoord[1]
          // const y = tileCoord[2]

          let z = tileCoord[0]
          let x = tileCoord[1]
          let y = -tileCoord[2] - 1

          return `${url}/${z}/${y}/${x}.png?k=HzxwyaaeOc7z1KRENNqH0A==`
        },
      }),
    })
    return layer
  }

  getWmsTile(options) {
    return new TileLayer({
      id: options.id,
      visible: options.visible,
      source: new TileWMS({
        url: options.url.split('?')[0],
        params: CustomUtils.parasUrlParams2Obj(options.url),
      }),
    })
  }

  getWmsImage(options) {
    return new ImageLayer({
      id: options.id,
      visible: options.visible,
      source: new ImageWMS({
        url: options.url.split('?')[0],
        params: CustomUtils.parasUrlParams2Obj(options.url),
      }),
    })
  }

  getArcgisImage(options) {
    return new ImageLayer({
      id: options.id,
      visible: options.visible,
      source: new ImageArcGISRest({
        url: options.url,
      }),
    })
  }

  getArcgisImageTile(options) {
    return new TileLayer({
      id: options.id,
      visible: options.visible,
      source: new TileArcGISRest({
        url: options.url,
      }),
    })
  }

  getUserDefinedXYZ(options) {
    const lyr = new TileLayer({
      id: options.id || uuidOnlyStr(),
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        url: options.url,
        projection: options.prj === undefined ? 'EPSG:3857' : options.prj,
        // tileGrid: new WMTSTileGrid({
        //     origin: getTopLeft(projectionExtent),
        //     resolutions: resolutions,
        //     matrixIds: matrixIds
        // }),
        // maxZoom: options.maxZoom,
        // projection: 'EPSG:3857',
        // tileUrlFunction: function(tileCoord) {
        //     const z = tileCoord[0]
        //     const x = tileCoord[1]
        //     const y = -tileCoord[2] - 1
        //     return `${options.urlTemplate}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
        // }
      }),
    })

    return lyr
  }

  getGeojsonLayer({ id, visible, geojson }) {
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    })

    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
    })

    return vectorLayer
  }

  getGeojsonLayerWithRender(options) {
    let { id, visible, geojson, field, labelField } = options
    //
    const source = new VectorSource({
      features: KFeatureLoader.getFeaturesFromGeojson(geojson, {
        field,
        labelField,
      }),
    })

    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
      style: function (feature) {
        console.log(feature)
      },
    })

    return vectorLayer
  }

  getHeatMapLayer(geojson, options) {
    let { field, blur, radius } = options
    var source = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    })
    const vector = new HeatmapLayer({
      source,
      blur: blur || 10,
      radius: radius || 10,
      weight: function (feature) {
        //
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        const value = feature.get(field)
        return value
      },
    })
    return vector
  }

  getClusterLayerFromGeojson(geojson, options = {}) {
    let { id, visible, distance, minDistance } = options

    const source = new VectorSource({
      features: KFeatureLoader.getFeaturesFromGeojson(geojson),
    })

    const clusterSource = new Cluster({
      distance: distance || 20,
      minDistance: minDistance || 0,
      source: source,
    })

    const styleCache = {}
    const clusters = new VectorLayer({
      id,
      visible,
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length
        let style = styleCache[size]
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#3399CC',
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff',
              }),
            }),
          })
          styleCache[size] = style
        }
        return style
      },
    })
    return clusters
  }

  getClusterLayerFromWktArray(list, options = {}) {
    let { id, visible, distance, minDistance } = options

    const features = []
    list.forEach((element) => {
      const feature = new WKT().readFeature(element.geom)
      if (element.id) {
        feature.setId(element.id)
      }
      features.push(feature)
    })

    const source = new VectorSource({
      features,
    })

    const clusterSource = new Cluster({
      distance: distance || 20,
      minDistance: minDistance || 0,
      source: source,
    })

    const styleCache = {}
    const clusters = new VectorLayer({
      id,
      visible,
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length
        let style = styleCache[size]
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#3399CC',
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff',
              }),
            }),
          })
          styleCache[size] = style
        }
        return style
      },
    })
    return clusters
  }

  getOverlayLayer(container, options) {
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    })

    return overlay
  }

  getVectorLayer(
    {
      id = this.defaultVectorLayerId + uuidOnlyStr(),
      style = this.defaultStyle,
    } = {
      id: this.defaultVectorLayerId + uuidOnlyStr(),
      style: this.defaultStyle,
    }
  ) {
    const source = new VectorSource({
      wrapX: false,
    })
    return new VectorLayer({
      id,
      source,
      style,
    })
  }

  createRingLayer({ map, center, outerR, innerR }) {
    const feature = new Feature({
      geometry: createRing(map, center, outerR, innerR),
    })
    const layer = getVectorLayer()
    layer.getSource().addFeature(feature)
    return layer
  }

  removeLayerById(map, id, strict = true) {
    if (map && id) {
      let layers = map.getLayers().getArray()
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index]
        const layerId = layer.getProperties().id
        if (!strict && layerId && layerId.indexOf(id) !== -1) {
          map.removeLayer(layer)
        } else if (layerId === id) {
          map.removeLayer(layer)
        }
      }
    }
  }

  getLayerById(map, id) {
    if (map) {
      let layers = map.getLayers().getArray()
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index]
        if (layer) {
          const layerId = layer.getProperties().id
          if (layerId && layerId === id) {
            return layer
          }
        }
      }
    }
    return null
  }

  setLayerVisibleById(map, id, visible) {
    if (map && id) {
      let layers = map.getLayers().getArray()
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index]
        const layerId = layer.getProperties().id
        if (layerId && layerId === id) {
          layer.setVisible(visible)
          // layer.setOpacity(opacity)
        }
      }
    }
  }

  checkLayerIsExist(map, id) {
    if (map && id) {
      const layers = map.getLayers().getArray()
      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index]
        const layerId = layer.getProperties().id
        if (layerId && layerId === id) {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  removeAllLayer(map) {
    if (map) {
      let layers = map.getLayers().getArray()
      for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index]
        if (layer) {
          const layerId = layer.getProperties().id
          if (layerId) {
            map.removeLayer(layer)
          }
        }
      }
    }
  }
}

/**
 * wmts 默认切片规则3857  kvp方式
 * @param {*} options
 * options = {
      id:'layerId',
      opacity:1,
      url: 'https://mrdata.usgs.gov/mapcache/wmts',
      layer: 'sgmc2',
      matrixSet: 'GoogleMapsCompatible',
      format: 'image/png',
      style: 'default'
    }
 * @returns layer
 */
export function getWmts(options) {
  return new TileLayer({
    id: options.id === undefined ? 'id_' + Math.random() : options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new WMTS({
      ...options,
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds,
      }),
      wrapX: true,
    }),
  })
}

/**
 * wmts epsq:4326  kvp方式
 * @param {*} options 
 * {
            id: 'wmts_test',
            url: 'http://10.1.3.199:8090/iserver/services/dem30m/wmts100',
            layer: 'dem30m',
            matrixSet: 'Custom_dem30m',
            format: 'image/png',
            style: 'default'
        }
 * @returns layer
 */
export function getWmtsWgs84(options) {
  const projection = getProjection(K_GLOBAL_CONFIG['EPSG:4326'].prj)
  const projectionExtent = projection.getExtent()
  const { resolutions, matrixIds } = K_GLOBAL_CONFIG['EPSG:4326']
  return new TileLayer({
    id: options.id === undefined ? 'id_' + Math.random() : options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new WMTS({
      ...options,
      wrapX: true,
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions,
        matrixIds,
      }),
    }),
  })
}

/**
 * wmts自定义规则，指定坐标系，URLtemplate或者参数对象  kvp方式
 * @param {*}
 * prj
 * options = {
      id:?,
      opacity:?,
      url: ?,
      layer: '',
      matrixSet: '',
      format: 'image/png',
      style: 'default'
  }
 * @returns
 */
export function getWmtsByPrj({ prj, options }) {
  //
  const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
  const projectionExtent = projection.getExtent()
  const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]
  const params =
    options.url.split('?').length > 1
      ? CustomUtils.parasUrlParams2Obj(options.url)
      : options
  return new TileLayer({
    id: options.id === undefined ? 'id_' + Math.random() : options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new WMTS({
      ...params,
      wrapX: true,
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions,
        matrixIds,
      }),
    }),
  })
}

/**
 * 加载geoserver发布的wmts
 * geoserver wmts 不需要指定坐标系，可动态投影，默认用4326
 * @param {*} param0
 * @returns
 */
export function getWmtsGeoserver({ prj = 'EPSG:4326', options }) {
  const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
  const projectionExtent = projection.getExtent()
  const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]

  const matrixIdsWMTS = []
  matrixIds.forEach((element) => {
    matrixIdsWMTS.push(`${prj}:${element}`)
  })
  // 切片策略
  const tilegrid = new WMTSTileGrid({
    extent: [-180.0, -90.0, 180.0, 90.0], // 范围
    tileSize: [256, 256],
    origin: [-180.0, 90.0], // 切片原点
    resolutions: resolutions, // 分辨率
    matrixIds: matrixIdsWMTS, // 层级标识列表，与地图级数保持一致
  })
  const tileSource = new WMTS({
    url: options.url.split('?')[0],
    projection: projection,
    tileGrid: tilegrid,
    ...CustomUtils.parasUrlParams2Obj(options.url),
    format: 'image/png',
  })
  return new TileLayer({
    id: options.id === undefined ? 'id_' + Math.random() : options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: tileSource,
    wrapX: false,
  })
}

/**
 * XYZ 默认切片规则3857 restfull方式
 * @param {*} { options = {url:'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'} }
 *
 * eg: 
 * 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
'?apikey=Your API key from https://www.thunderforest.com/docs/apikeys/ here'
 * @returns layer
 */
export function getXYZ(options) {
  return new TileLayer({
    id: options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new XYZ({
      ...options,
    }),
  })
}

/**
 * XYZ 带坐标系
 * @param {*} param0 { prj = 'EPSG:3857', options = {url:'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'} }
 * @returns
 */
export function getXYZByPrj({ prj, options }) {
  return new TileLayer({
    id: options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new XYZ({
      ...options,
      projection: prj,
    }),
  })
}

/**
 * 加载天地图  URLteamplate
 * @param {*} { prj = 'EPSG:3857', options }
 * @returns
 */
export function getTdtByPrj({ prj, options }) {
  return getXYZByPrj({
    prj,
    options,
  })
}

/**
 * 超图  urlteamplate  restfull
 * @param {*} param0  { prj = 'EPSG:4326', options = {url:'http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m'} }
 * @returns
 */
export function getSuperMapWmts({ prj, options }) {
  const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
  const projectionExtent = projection.getExtent()
  const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]

  const tileGrid = new WMTSTileGrid({
    origin: getTopLeft(projectionExtent),
    resolutions,
    matrixIds,
  })

  const layer = new TileLayer({
    id: options.id === undefined ? 'id_' + Math.random() : options.id,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new XYZ({
      tileGrid,
      // maxZoom: options.maxZoom,
      projection: prj,
      tileUrlFunction: function (tileCoord) {
        const z = tileCoord[0]
        const x = tileCoord[1]
        const y = tileCoord[2]
        return `${options.url}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
      },
    }),
  })
  return layer
}

/**
 * wms tile
 * @param {*} options  {id:'',visible:true, url:'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI'}
 * @returns
 */
export function getWmsTile(options) {
  return new TileLayer({
    id: options.id,
    visible: options.visible,
    source: new TileWMS({
      url: options.url.split('?')[0],
      params: CustomUtils.parasUrlParams2Obj(options.url),
    }),
  })
}

/**
 * wms image
 * @param {*} options  {id:'',visible:true, url:'http://10.1.102.189:8877/geoserver/NODE_LINK_SUBC/wms?layers=NODE_LINK_SUBC:B000000.POI'}
 * @returns
 */
export function getWmsImage(options) {
  return new ImageLayer({
    id: options.id,
    visible: options.visible,
    source: new ImageWMS({
      url: options.url.split('?')[0],
      params: CustomUtils.parasUrlParams2Obj(options.url),
    }),
  })
}

/**
 * arcgis image
 * @param {*} options  {url:'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer'}
 * @returns
 */
export function getArcgisImage(options) {
  return new ImageLayer({
    id: options.id,
    visible: options.visible,
    source: new ImageArcGISRest({
      url: options.url,
    }),
  })
}

/**
 * arcgis image tile
 * @param {*} options {url:'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer'}
 * @returns
 */
export function getArcgisImageTile(options) {
  return new TileLayer({
    id: options.id,
    visible: options.visible,
    source: new TileArcGISRest({
      url: options.url,
    }),
  })
}

export function getUserDefinedXYZ(options) {
  const lyr = new TileLayer({
    id: options.id || uuidOnlyStr(),
    opacity: options.opacity === undefined ? 1 : options.opacity,
    visible: options.visible === undefined ? true : options.visible,
    source: new XYZ({
      url: options.url,
      projection: options.prj === undefined ? 'EPSG:3857' : options.prj,
      // tileGrid: new WMTSTileGrid({
      //     origin: getTopLeft(projectionExtent),
      //     resolutions: resolutions,
      //     matrixIds: matrixIds
      // }),
      // maxZoom: options.maxZoom,
      // projection: 'EPSG:3857',
      // tileUrlFunction: function(tileCoord) {
      //     const z = tileCoord[0]
      //     const x = tileCoord[1]
      //     const y = -tileCoord[2] - 1
      //     return `${options.urlTemplate}&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
      // }
    }),
  })

  return lyr
}

export function getGeojsonLayer({ id, visible, geojson }) {
  const source = new VectorSource({
    features: new GeoJSON().readFeatures(geojson),
  })

  const vectorLayer = new VectorLayer({
    id,
    visible,
    source,
  })

  return vectorLayer
}

export function getGeojsonLayerWithRender(options) {
  let { id, visible, geojson, field, labelField } = options
  //
  const source = new VectorSource({
    features: KFeatureLoader.getFeaturesFromGeojson(geojson, {
      field,
      labelField,
    }),
  })

  const vectorLayer = new VectorLayer({
    id,
    visible,
    source,
    style: function (feature) {
      console.log(feature)
    },
  })

  return vectorLayer
}

// export function getHeatMapLayer(geojson, options) {
//     //
//     const {
//         id,
//         visible,
//         field
//     } = options
//     var source = new VectorSource({
//         features: (new GeoJSON()).readFeatures(geojson)
//     });

//     // source: new VectorSource({
//     //     url: 'data/kml/2012_Earthquakes_Mag5.kml',
//     //     format: new GeoJSON(),
//     // })

//     const vectorLayer = new HeatmapLayer({
//         id,
//         visible,
//         source,
//         blur: 10,
//         radius: 10,
//         weight: function(feature) {
//             // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
//             // standards-violating <magnitude> tag in each Placemark.  We extract it from
//             // the Placemark's name instead.
//             const name = feature.get(field);
//             const magnitude = parseFloat(name);
//             return magnitude - 5;
//         },
//     });

//     return vectorLayer
// }

export function getHeatMapLayer(geojson, options) {
  //
  let { field, blur, radius } = options

  var source = new VectorSource({
    features: new GeoJSON().readFeatures(geojson),
  })

  const vector = new HeatmapLayer({
    source,
    blur: blur || 10,
    radius: radius || 10,
    weight: function (feature) {
      //
      // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      // standards-violating <magnitude> tag in each Placemark.  We extract it from
      // the Placemark's name instead.
      const value = feature.get(field)
      return value
    },
  })
  return vector
}

export function getClusterLayerFromGeojson(geojson, options = {}) {
  let { id, visible, distance, minDistance } = options

  const source = new VectorSource({
    features: KFeatureLoader.getFeaturesFromGeojson(geojson),
  })

  const clusterSource = new Cluster({
    distance: distance || 20,
    minDistance: minDistance || 0,
    source: source,
  })

  const styleCache = {}
  const clusters = new VectorLayer({
    id,
    visible,
    source: clusterSource,
    style: function (feature) {
      const size = feature.get('features').length
      let style = styleCache[size]
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: '#fff',
            }),
            fill: new Fill({
              color: '#3399CC',
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#fff',
            }),
          }),
        })
        styleCache[size] = style
      }
      return style
    },
  })
  return clusters
}

export function getOverlayLayer(container, options) {
  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  })

  return overlay
}

const defaultStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 208, 75, 0.5)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: '#ffcc33',
    }),
  }),
})
const defaultVectorLayerId = 'vector_layer_temp_id_'

export function getVectorLayer(
  { id = defaultVectorLayerId + uuidOnlyStr(), style = defaultStyle } = {
    id: defaultVectorLayerId + uuidOnlyStr(),
    style: defaultStyle,
  }
) {
  const source = new VectorSource({
    wrapX: false,
  })

  return new VectorLayer({
    id,
    source,
    style,
  })
}

export function createRingLayer({ map, center, outerR, innerR }) {
  const feature = new Feature({
    geometry: createRing(map, center, outerR, innerR),
  })
  const layer = getVectorLayer()
  layer.getSource().addFeature(feature)
  return layer
}

/**
 * 通过图层id获取图层对象
 * @param {*} map
 * @param {*} id 图层id
 * @returns layer
 */
export function getLayerById(map, id) {
  if (map) {
    let layers = map.getLayers().getArray()
    for (let index = layers.length - 1; index >= 0; index--) {
      const layer = layers[index]
      if (layer) {
        const layerId = layer.getProperties().id
        if (layerId && layerId === id) {
          return layer
        }
      }
    }
  }
  return null
}

// 检查图层是否存在
export function checkLayerIsExist(map, id) {
  if (map && id) {
    const layers = map.getLayers().getArray()
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index]
      const layerId = layer.getProperties().id
      if (layerId && layerId === id) {
        return true
      }
    }
    return false
  } else {
    return false
  }
}

// 删除图层
export function removeLayerById(map, id, strict = false) {
  if (map && id) {
    let layers = map.getLayers().getArray()
    for (let index = layers.length - 1; index >= 0; index--) {
      const layer = layers[index]
      const layerId = layer.getProperties().id
      if (!strict && layerId && layerId.indexOf(id) !== -1) {
        map.removeLayer(layer)
      } else if (layerId === id) {
        map.removeLayer(layer)
      }
    }
  }
}

/**
 * 删除所有图层
 * @param {*} map
 */
export function removeAllLayer(map) {
  if (map) {
    let layers = map.getLayers().getArray()
    for (let index = layers.length - 1; index >= 0; index--) {
      const layer = layers[index]
      if (layer) {
        const layerId = layer.getProperties().id
        if (layerId) {
          map.removeLayer(layer)
        }
      }
    }
  }
}

/**
 * 设置图层是否可见
 * @param {*} map
 * @param {*} id
 * @param {*} visible
 * @param {*} opacity
 */
export function setLayerVisibleById(map, id, visible, opacity = 1) {
  if (map && id) {
    let layers = map.getLayers().getArray()
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index]
      const layerId = layer.getProperties().id
      if (layerId && layerId === id) {
        layer.setVisible(visible)
        layer.setOpacity(opacity)
      }
    }
  }
}

export function fly2layer(map, layer) {
  if (map && layer) {
    const vectorSource = layer.getSource()
    map.getView().fit(vectorSource.getExtent(), {
      duration: 1000,
      minResolution: 0.005274727,
    })
  }
}

export function fly2extent(
  map,
  extent,
  { duration = 1000 } = {
    duration: 1000,
  }
) {
  if (map) {
    map.getView().fit(extent, {
      duration,
    })
  }
}
