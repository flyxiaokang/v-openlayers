/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2019-10-08 17:56:55
 * @LastEditTime: 2020-07-16 11:52:29
 */
import {
  Message
} from 'element-ui'
import * as esriLoader from 'esri-loader'
import axios from 'axios'

export function fullExtentByFeatureLayer(view, url) {
  let _wkid = view.spatialReference.wkid
  axios.get(
    url + '?f=json'
  ).then(res => {
    if (res.status === 200 && res.data.error === undefined) {
      var fullExtent = res.data.extent || res.data.fullExtent
      var wkid = fullExtent.spatialReference.wkid || ''
      var wkt = fullExtent.spatialReference.wkt
      if (wkt) {
        Message({
          type: 'warning',
          message: "该图层为自定义坐标系，无法定位"
        })
      }
      if (wkid == _wkid) {
        view.extent = fullExtent
        return
      }
      esriLoader
        .loadModules(
          [
            "esri/tasks/GeometryService",
            "esri/tasks/support/ProjectParameters",
            "esri/geometry/SpatialReference",
            "esri/geometry/Point"
          ], ESRI_JS_API
        )
        .then(
          ([
            GeometryService,
            ProjectParameters,
            SpatialReference,
            Point
          ]) => {
            var spatialReference_in = new SpatialReference({
              wkid: wkid
            })
         
            var geomSer = new GeometryService({
              url: ESRI_GEO_SERVICE_URL || 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
            })
            var params = new ProjectParameters({
              geometries: [new Point({
                longitude: fullExtent.xmin,
                latitude: fullExtent.ymin,
                spatialReference: spatialReference_in
              }), new Point({
                longitude: fullExtent.xmax,
                latitude: fullExtent.ymax,
                spatialReference: spatialReference_in
              })],
              outSpatialReference: new SpatialReference({
                wkid: _wkid
              })
            });
            geomSer.project(params).then(res => {
              var extent_ = {
                spatialReference: {
                  wkid: _wkid,
                },
                xmax: res[1].x,
                xmin: res[0].x,
                ymax: res[1].y,
                ymin: res[0].y
              }
              view.extent = extent_
            })
          })
    } else {
      Message({
        type: 'warning',
        message: `服务异常【${url}】`
      })
    }
  })
}