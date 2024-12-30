/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-12-20 17:33:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-20 17:36:50
 */

import WKT from 'ol/format/WKT'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { uuidOnlyStr } from '@/VMap/public/utils/base/string'

export default class GeojsonHandler extends GeoJSON {
  defaultStyle = new Style({
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
  constructor() {
    super()
  }

  feature2wkt(feature) {
    if (feature.getGeometry().getType() === 'Circle') return ''
    return new WKT().writeFeature(feature)
  }

  layer2wkt(layer) {
    if (layer) {
      const features = layer.getSource().getFeatures()
      if (features.length === 1) {
        return new WKT().writeFeature(features[0])
      } else if (features.length > 1) {
        return new WKT().writeFeatures(features)
      } else {
        return 'layer is null'
      }
    } else {
      return 'layer is null'
    }
  }

  wkt2layer(
    wkt,
    { id = uuidOnlyStr(), style = this.defaultStyle } = {
      id: uuidOnlyStr(),
      style: this.defaultStyle,
    }
  ) {
    let feature = new WKT().readFeature(wkt) //通过wkt串返回geometry
    feature.setStyle(style)
    let source = new VectorSource({
      features: [feature],
    })
    let vectorLayer = new VectorLayer({
      id,
      source,
      visible: true,
    })
    return vectorLayer
  }

  /**
   *
   * @param {*} geojson
   * @returns wkt
   */
  geojson2wkt(geojson) {
    const features = new GeoJSON().readFeatures(geojson)
    const wkt = new WKT().writeFeatures(features)
    return wkt
  }
}
