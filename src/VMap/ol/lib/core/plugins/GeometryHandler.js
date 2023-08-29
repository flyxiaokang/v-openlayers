/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-26 15:50:54
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-07-20 10:47:51
 */
import { Circle, Polygon ,Point} from 'ol/geom'
import {
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  Text,
  Icon,
} from 'ol/style'
import Feature from 'ol/Feature'
import LayerHandler from './LayerHandler'


const defaultStyle = new Style({
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
})

/*
 * @description: 绘制圆形
 * @param(object] origin 圆形中心点
 * @param(number] radius 圆的半径 单位pixel
 * @param(object] config 配置数据
 * @param(boolean] addoperatePoint 是否给图形添加操作点
 * @param(boolean] isRotate 是否旋转图形
 * @return (object] 生成图形要素的feature
 */
// export function createCircle(
//   map,
//   origin,
//   radius
//   // config,
//   // addoperatePoint = false,
//   // isRotate = true
// ) {
//   // const {
//   //   lensColor,
//   //   horizontalRotationAngle,
//   //   deviceId,
//   //   lensIndex,
//   //   camera,
//   //   lensNum,
//   //   installationDistance,
//   //   param,
//   // } = config
//   const points = []
//   //圆环边数，默认100， 越多显示的越平滑
//   const sides = 100
//   //弧度，图形要显示的角度，默认360*，即圆环
//   const rotation = 360
//   //获取圆心的pixel 坐标
//   const originPixel = map.getPixelFromCoordinate(origin)
//   // 计算初始角度
//   const angle = ((180 - rotation) / 360) * Math.PI
//   var rotatedAngle, x, y
//   //循环sides + 1次才是完整图形， 要不然图形会缺少一点，对不齐
//   for (let i = 0; i < sides + 1; ++i) {
//     //让点分布在120°的范围里
//     const an = i * (rotation / 360)
//     rotatedAngle = angle + (an * 2 * Math.PI) / sides
//     let coordinate = []
//     // 偏移后的x，y坐标，为pixel
//     x = originPixel[0] + radius * Math.cos(rotatedAngle)
//     y = originPixel[1] + radius * Math.sin(rotatedAngle)
//     const pixelCoordinate = [x, y]
//     // 把pixel坐标转换为3857坐标系
//     coordinate = map.getCoordinateFromPixel(pixelCoordinate)
//     points.push(coordinate)
//   }
//   // 添加点位给polygon
//   const poy = new Polygon([points])

//   return poy
//   //根据后台返回的角度旋转图形
//   if (isRotate)
//     poy.rotate(transformAngle(Number(horizontalRotationAngle)), origin)
//   // 创建feature要素
//   const feature = new Feature({
//     geometry: poy,
//     // geometry 必填，下方这些都是自己添加的属性
//     // radius: map.pixelToMeter(radius),
//     // figureShape: 'fishEyeCircle',
//     // addoperatePoint: addoperatePoint,
//     // deviceId: deviceId,
//     // lensIndex: lensIndex,
//     // camera: config,
//     // cameraNum: camera.cameraNum,
//     // lensNum: lensNum,
//     // lenscolor,
//   })
//   //设置要素样式
//   const style = new style({
//     fill: new Fill({
//       color: colorToRGB(lensColor, this.fillopacity),
//     }),
//     stroke: new Stroke({
//       color: colorToRGB(lensColor, this.strokeopacity),
//       width: 2,
//     }),
//   })
//   // 设置要素层级为负值， 且图形越大层级越低， 这样小的图形被覆盖可以点击
//   const index = param.config.installationDistance
//   style.setZIndex(-index)
//   // 设置要素样式
//   feature.setstyle(style)
//   return feature
// }

function createCirclePoints(map, origin, radius) {
  const points = []
  //圆环边数，默认100， 越多显示的越平滑
  const sides = 100
  //弧度，图形要显示的角度，默认360*，即圆环
  const rotation = 360
  //获取圆心的pixel 坐标
  const originPixel = origin // map.getPixelFromCoordinate(origin)
  // 计算初始角度
  const angle = ((180 - rotation) / 360) * Math.PI
  var rotatedAngle, x, y
  //循环sides + 1次才是完整图形， 要不然图形会缺少一点，对不齐
  for (let i = 0; i < sides + 1; ++i) {
    //让点分布在120°的范围里
    const an = i * (rotation / 360)
    rotatedAngle = angle + (an * 2 * Math.PI) / sides
    let coordinate = []
    // 偏移后的x，y坐标，为pixel
    x = originPixel[0] + radius * Math.cos(rotatedAngle)
    y = originPixel[1] + radius * Math.sin(rotatedAngle)
    const pixelCoordinate = [x, y]
    // 把pixel坐标转换为3857坐标系
    coordinate = pixelCoordinate // map.getCoordinateFromPixel(pixelCoordinate)
    points.push(coordinate)
  }

  return points
}

export function createCircle(map, center, r) {
  return new Polygon(createCirclePoints(map, center, r))
}

export function createRing(map, center, outerR, innerR) {
  return new Polygon([
    createCirclePoints(map, center, outerR),
    createCirclePoints(map, center, innerR),
  ])
}

export function createPoint(map, points, style = defaultStyle) {
  const layer = new LayerHandler().getVectorLayer()
}

export function createPoints({
  map,
  points,
  style = defaultStyle,
  layerId = 'layerId_vectorLayer',
  featureId = 'vectorLayerPoint_',
  zIndex = 100,
}) {
  const iconFeatures = []
  points.forEach((point, index) => {
    if (point.lgtd && point.lttd) {
      const iconFeature = new Feature({
        geometry: new Point([point.lgtd, point.lttd]),
        layerId: `${featureId}_${point.code}`,
        properties: point,
      })
      iconFeature.setStyle(style)
      iconFeatures.push(iconFeature)
    }
  })

  let vectorSource = new ol.source.Vector({
    features: iconFeatures,
  })
  let vectorLayer = new ol.layer.Vector({
    id: layerId,
    source: vectorSource,
    visible: true,
    // style:getIconStyle
  })

  this.layerCollection[layerId] = vectorLayer
  map.addLayer(vectorLayer)

  vectorLayer.setZIndex(zIndex)
}
