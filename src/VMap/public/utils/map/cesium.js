/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2024-02-01 16:42:54
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-02-01 17:14:37
 */

/**
 * WGS84坐标系转笛卡尔坐标系
 */
export function WGS84_to_Cartesian3(point) {
  let car33 = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
  let x = car33.x
  let y = car33.y
  let z = car33.z
  return { x: x, y: y, z: z }
}

// export function Cartesian3_to_WGS84(position) {
//   const { x, y } = position
//   let lon = '',
//     lat = ''
//   let result = this.viewer.camera.pickEllipsoid(new Cesium.Cartesian2(x, y))
//   if (result) {
//     let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
//     lon = (curPosition.longitude * 180) / Math.PI
//     lat = (curPosition.latitude * 180) / Math.PI
//   }
//   return {
//     lon,
//     lat,
//   }
// }

export function Cartesian3_to_WGS84(point) {
  let cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z)
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33)
  let lat = Cesium.Math.toDegrees(cartographic.latitude)
  let lon = Cesium.Math.toDegrees(cartographic.longitude)
  let alt = cartographic.height
  return { lon: lon, lat: lat, alt: alt }
}
