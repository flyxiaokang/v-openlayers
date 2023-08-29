/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-05-19 14:37:47
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-19 14:45:10
 */

import {lngLatToMercator,mercatorToLngLat} from './bd09'
import Projection from 'ol/proj/Projection';
import TileImage from 'ol/source/TileImage';
import * as olProj from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileLayer from 'ol/layer/Tile';


export function getBaiduLayer() {
  var projBD09 = new Projection({
    code: 'BD:09',
    extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],
    units: 'm',
    axisOrientation: 'neu',
    global: false,
  })

  olProj.addProjection(projBD09)
  olProj.addCoordinateTransforms(
    'EPSG:4326',
    'BD:09',
    function (coordinate) {
      return lngLatToMercator(coordinate)
    },
    function (coordinate) {
      return mercatorToLngLat(coordinate)
    }
  )

  /*定义百度地图分辨率与瓦片网格*/
  var resolutions = []
  for (var i = 0; i <= 18; i++) {
    resolutions[i] = Math.pow(2, 18 - i)
  }

  var tilegrid = new TileGrid({
    origin: [0, 0],
    resolutions: resolutions,
  })

  /*加载百度地图离线瓦片不能用ol.source.XYZ，ol.source.XYZ针对谷歌地图（注意：是谷歌地图）而设计，
  而百度地图与谷歌地图使用了不同的投影、分辨率和瓦片网格。因此这里使用ol.source.TileImage来自行指定
  投影、分辨率、瓦片网格。*/
  var source = new TileImage({
    projection: 'BD:09',
    tileGrid: tilegrid,
    tileUrlFunction: function (tileCoord, pixelRatio, proj) {
      //openlayer5的版本
      var z = tileCoord[0]
      var x = tileCoord[1]
      var y = tileCoord[2]
      // return "http://192.168.1.13:8080/mapImg/2/V1/"+z+"/"+x+"/"+y+".png";
      //return 'tiles/' + z + '/' + x + '/' + y + '.png';
      return (
        'http://maponline0.bdimg.com/tile/?qt=vtile&x=' +
        x +
        '&y=' +
        y +
        '&z=' +
        z +
        '&styles=pl&scaler=1&udt=20210506&from=jsapi3_0'
      )

      //openlayers6的版本
      //let z = tileCoord[0];
      // let x = tileCoord[1];
      //let y = -tileCoord[2]-1;
      // if(x<0)  x = "M"+(-x);
      // if(y<0) y = "M"+(-y);
    },
  })

  var mapLayer = new TileLayer({
    source: source,
  })

  return mapLayer

  // new ol.Map({
  //   layers: [mapLayer],
  //   view: new ol.View({
  //     center: olProj.transform([113.03914, 28.20354], 'EPSG:4326', 'BD:09'),
  //     projection: 'BD:09',
  //     zoom: 14,
  //   }),
  //   target: 'map',
  // })
}
