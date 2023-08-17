/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-05-19 15:51:09
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-29 11:25:03
 */
/*
 * @Description: 图层操作类
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:23:02
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-19 15:49:54
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

import TileImage from 'ol/source/TileImage'

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

import TileGrid from 'ol/tilegrid/TileGrid'

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

import * as KFeatureLoader from '../FeatureHandler'
import Feature from 'ol/Feature'
import { createRing } from '../GeometryHandler'

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
    // return new TileLayer({
    //   id: options.id === undefined ? 'id_' + Math.random() : options.id,
    //   opacity: options.opacity === undefined ? 1 : options.opacity,
    //   visible: options.visible === undefined ? true : options.visible,
    //   source: new WMTS({
    //     ...options,
    //     projection: projection,
    //     tileGrid: new WMTSTileGrid({
    //       origin: getTopLeft(projectionExtent),
    //       resolutions: resolutions,
    //       matrixIds: matrixIds,
    //     }),
    //     wrapX: true,
    //   }),
    // })

    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new WMTS({
        url: options.url,
        // url: "https://gatewayproxy-jcpt.mwr.cn/m_onemap_v/wmts100?k=HzxwyaaeOc7z1KRENNqH0A==&layer=m_onemap_v&tilematrixset=GoogleMapsCompatible_m_onemap_v",
        format: 'image/png',
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
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
    const projection = getProjection(K_GLOBAL_CONFIG[prj].prj)
    const projectionExtent = projection.getExtent()
    const { resolutions, matrixIds } = K_GLOBAL_CONFIG[prj]
    const { url, params = {} } = options
    // const baseUrl = url.split('?')[0]
    // const params =
    //   options.url.split('?').length > 1
    //     ? CustomUtils.parasUrlParams2Obj(options.url)
    //     : options
    return new TileLayer({
      id: options.id === undefined ? 'id_' + Math.random() : options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new WMTS({
        url,
        format: 'image/png',
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
    return this.getXYZByPrj({
      prj,
      options,
    })
  }

  getTmsLayer(options) {
    return new TileLayer({
      id: options.id,
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source: new XYZ({
        tileUrlFunction: function (tileCoord) {
          let z = tileCoord[0]
          let x = tileCoord[1]
          let y = -tileCoord[2] - 1
          return `${options.url}/${z}/${y}/${x}.png`
        },
      }),
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
          return `${options.url}&request=gettile&tilecol=${x}&tilerow=${y}&tilematrix=${z}`
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

  getGaodeLayer(options) {
    return this.getXYZ({
      id: 'layerId_gaode',
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
      ...options,
    })
  }

  // type 0 行政图 1 影像图 2 标注图
  getUrl(type = 0, x, y, z) {
    let url = ''
    switch (type) {
      case 0:
        url =
          'http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=' +
          x +
          '&y=' +
          y +
          '&z=' +
          z +
          '&styles=pl&udt=20200519&scaler=1&p=1'
        break
      case 1:
        url =
          'http://shangetu' +
          parseInt(Math.random() * 10) +
          '.http://map.bdimg.com/it/u=x=' +
          x +
          ';y=' +
          y +
          ';z=' +
          z +
          ';v=009;type=sate&fm=46&udt=20170606'
        url =
          'https://maponline2.bdimg.com/starpic/?qt=satepc&u=x=' +
          x +
          ';y=' +
          y +
          ';z=' +
          z +
          ';v=009;type=sate&fm=46&app=webearth2&v=009&udt=20200519'
        break
      case 2:
        url =
          'http://online' +
          parseInt(Math.random() * 10) +
          '.http://map.bdimg.com/onlinelabel/?qt=tile&x=' +
          x +
          '&y=' +
          y +
          '&z=' +
          z +
          '&styles=sl&udt=20200519&scaler=1&p=1'
        break
      default:
        break
    }
    return url
  }

  getBaiduLayer(options) {
    let resolutions = []
    let baiduX, baiduY

    for (let i = 0; i < 19; i++) {
      resolutions[i] = Math.pow(2, 18 - i)
    }
    let tilegrid = new TileGrid({
      origin: [0, 0],
      resolutions: resolutions,
    })

    let source = new TileImage({
      projection: 'EPSG:3857',
      tileGrid: tilegrid,
      tileUrlFunction: (tileCoord) => {
        if (!tileCoord) {
          return ''
        }
        var z = tileCoord[0]
        var x = tileCoord[1]
        let y = -(tileCoord[2] + 1)
        if (x < 0) {
          x = 'M' + -x
        }
        if (y < 0) {
          y = 'M' + -y
        }
        return this.getUrl(0, x, y, z)
      },
    })

    return new TileLayer({
      id: options.id || uuidOnlyStr(),
      opacity: options.opacity === undefined ? 1 : options.opacity,
      visible: options.visible === undefined ? true : options.visible,
      source,
    })
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
    const layer = this.getVectorLayer()
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
