/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-08-10 15:42:18
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 10:02:54
 */
import {
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  Text,
  Icon,
} from 'ol/style'

const svgMap = {}

export function getSvg(url, iconOriginColor, color) {
  if (iconOriginColor === color) {
    return url
  }
  const uid = url + color
  if (svgMap.hasOwnProperty(uid)) {
    return svgMap.uid
  }
  let oReq = new XMLHttpRequest()
  oReq.open('GET', url, false)
  oReq.setRequestHeader('Content-type', 'application/ison;charset=utf-8;')
  // oReq.setRequestHeader('access_token',this.sstore.state.user.token)；
  oReq.send(JSON.stringify()) //发送数据需要自定义，这里发送的是JSON结构
  let xml = oReq.responseText //啊应结果
  xml = xml.replaceAll(iconOriginColor, color)
  const _xml = 'data:image/svg+xml,' + escape(xml)
  svgMap[uid] = _xml
  return _xml
}

export function getStyle(options = {}) {
  let { image = {}, stroke = {}, fill = {}, text } = options
  let { src, iconColor, iconOriginColor, scale = 1, radius = 7 } = image
  let pointStyle, lineStyle, polygonStyle
  if (src) {
    if (iconColor) {
      src = getSvg(src, iconOriginColor, iconColor)
    }
    pointStyle = new Style({
      image: new Icon({
        src,
        scale,
      }),
    })
  } else {
    pointStyle = new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({
          color: image.color || '#ff0000',
        }),
      }),
    })
  }

  function getText(properties, resolution) {
    let t = properties[text.field] || ''
    return t
  }

  function getIconStyle(feature, resolution) {
    const { color, backgroundColor, padding } = text
    try {
      const properties = feature.getProperties()
      const text = new Text({
        font: '14px Microsoft YaHei',
        text: getText(properties, resolution),
        offsetX: 30,
        offsetY: -30,
        fill: new Fill({
          color: color || 'white',
        }),
        backgroundFill: new Fill({
          color: backgroundColor || 'green',
        }),
        padding: padding || [5, 5, 5, 5],
      })
      pointStyle.setText(text)
      return pointStyle
    } catch (error) {
      console.error(error)
      return null
    }
  }

  if (text && text.hasOwnProperty('field')) {
    return getIconStyle
  }

  const { color = 'red', width = 1 } = stroke
  lineStyle = new Stroke({
    color,
    width,
  })

  polygonStyle = new Fill({
    color: fill.color || 'rgba(255, 208, 75, 0.7)',
  })

  return new Style({
    fill: polygonStyle,
    stroke: lineStyle,
    image: pointStyle.getImage(),
    text: pointStyle.getText(),
  })
}
