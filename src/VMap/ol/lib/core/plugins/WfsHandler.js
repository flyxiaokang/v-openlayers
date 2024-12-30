/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-02-13 13:56:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-25 18:05:07
 */
import { WFS, GeoJSON, GML } from 'ol/format'
import Intersects from 'ol/format/filter/Intersects.js';
import Bbox from 'ol/format/filter/Bbox.js';
import Point from 'ol/geom/Point.js'
import * as olExtent from 'ol/extent';
import {boundingExtent} from 'ol/extent';

class WfsHandler {
  constructor() {}
  queryByCondition(url, options) {
    //多边形查询
    var featureRequest = new WFS().writeGetFeature(options)
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest),
      })
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          // var features = new GeoJSON().readFeatures(json)
          // resolve(features)
          resolve(json)
        })
    })
  }

  handleGeometry(feature, geomName = 'geom') {
    let geom = feature.getGeometry()
    geom.applyTransform((flatCoordinates, flatCoordinates2, stride) => {
      for (var j = 0; j < flatCoordinates.length; j += stride) {
        var y = flatCoordinates[j]
        var x = flatCoordinates[j + 1]
        flatCoordinates[j] = x
        flatCoordinates[j + 1] = y
      }
    })
    feature.setGeometryName(geomName)
    // feature.setGeometry(geom);
  }

  transact(url, options) {
    const { featureType, srsName, featureNS, transactType, features } = options
    var formatWFS = new WFS()
    var formatGML = new GML({
      featureNS, // Your namespace
      featureType,
      gmlOptions: {
        srsName,
      },
    })
    let node = null
    let msg
    switch (transactType) {
      case 'insert':
        node = formatWFS.writeTransaction(features, null, null, formatGML)
        msg = '插入'
        break
      case 'update':
        node = formatWFS.writeTransaction(null, features, null, formatGML)
        msg = '更新'
        break
      case 'delete':
        node = formatWFS.writeTransaction(null, null, features, formatGML)
        msg = '删除'
        break
    }
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        body: new XMLSerializer().serializeToString(node),
      }).then((res) => {
        if (res.status === 200 ** res.ok) {
          return resolve({
            success: true,
            msg,
          })
        } else {
          resolve({
            success: false,
            msg,
          })
        }
      })
    })
  }

  applyTransform(geometry) {
    geometry.applyTransform((flatCoordinates, flatCoordinates2, stride) => {
      for (var j = 0; j < flatCoordinates.length; j += stride) {
        var y = flatCoordinates[j]
        var x = flatCoordinates[j + 1]
        flatCoordinates[j] = x
        flatCoordinates[j + 1] = y
      }
    })
    return geometry
  }

  /**
   * 点查询
   * @param {*} param0 {featureNS,featurePrefix,featureTypes,coordinate,projection}
   * @returns geojson
   */
  requestFeatureByPoint({
    featureNS = 'http://localhost/geoserver/',
    featurePrefix = 'pg',
    featureTypes = [],
    coordinate,
    projection = 'EPSG:4326',
  }) {
    const geo = this.applyTransform(new Point(coordinate).clone())
    // let filter = new Intersects('geom', geo, 'EPSG:4326')
    const extent = boundingExtent([coordinate])
    const filter = new Bbox('geom', extent, projection)
    // console.log('filter===',extent,filter)
    const url = `${featureNS}${featurePrefix}/wfs`
    return this.queryByCondition(url, {
      featureNS,
      featurePrefix,
      featureTypes,
      srsName: projection,
      outputFormat: 'application/json',
      filter,
    })
  }
}

export default WfsHandler

// function createUpdateFeature(feature) {
//     // 1、构造Feature
//     let ft = feature.clone();
//     // 更新操作必须要有id
//     let id = feature.getId();
//     ft.setId(id);

//     let geom = ft.getGeometry().clone();
//     geom.applyTransform(
//         (flatCoordinates, flatCoordinates2, stride) => {
//             for (
//                 var j = 0;
//                 j < flatCoordinates.length;
//                 j += stride
//             ) {
//                 var y = flatCoordinates[j];
//                 var x = flatCoordinates[j + 1];
//                 flatCoordinates[j] = x;
//                 flatCoordinates[j + 1] = y;
//             }
//         }
//     );
//     ft.setGeometry(geom);
//     ft.setGeometryName('geom')

//     delete ft.getProperties().geometry
//     return ft;
// }
