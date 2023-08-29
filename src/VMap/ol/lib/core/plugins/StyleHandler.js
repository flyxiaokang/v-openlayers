/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-08-10 15:42:18
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-23 16:31:05
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

export function getSvg(url, fromColor, color) {
  if (fromColor === color) {
    return url
  }
  const uid = `${url}-${color}-${fromColor}`
  if (svgMap.hasOwnProperty(uid)) {
    return svgMap.uid
  }
  let oReq = new XMLHttpRequest()
  oReq.open('GET', url, false)
  oReq.setRequestHeader('Content-type', 'application/ison;charset=utf-8;')
  // oReq.setRequestHeader('access_token',this.sstore.state.user.token)；
  oReq.send(JSON.stringify()) //发送数据需要自定义，这里发送的是JSON结构
  let xml = oReq.responseText //啊应结果
  xml = xml.replaceAll(fromColor, color)
  xml = 'data:image/svg+xml,' + escape(xml)
  svgMap[uid] = xml
  return xml
}

// function
function getImage({ circle = {}, icon = {} }) {
  let image = null
  if (icon.src) {
    let { src, fromColor, toColor, scale = 1, color } = icon
    if (fromColor && toColor) {
      src = getSvg(src, fromColor, toColor)
    }
    image = new Icon({
      src,
      scale,
      color,
      crossOrigin: 'anonymous',
    })
  } else {
    const { color = '#ff0000', radius = 7 } = circle
    image = new CircleStyle({
      radius,
      fill: new Fill({
        color,
      }),
    })
  }
  return image
}

function getStorke({
  color = 'red',
  width = 0,
  lineCap = 'butt',
  lineDash = [0, 0],
  zIndex,
} = {}) {
  console.log('????????',width)
  return new Stroke({
    color,
    width: width,
    lineCap,
    lineDash,
  })
}

function getFill({ color = 'rgba(255, 208, 75, 0.7)' } = {}) {
  return new Fill({
    color,
  })
}

export function getStyle(options = {}) {
  let { circle = {}, icon = {}, text, stroke = {}, fill = {} } = options
  const { zIndex } = stroke
  let pointStyle = new Style({
    image: getImage({ circle, icon }),
  })

  function getText(feature, resolution) {
    const properties = feature.getProperties()
    let t = properties[text.field] || ''
    return t
  }

  function getIconStyleFunction(feature, resolution) {
    const {
      color = 'white',
      backgroundColor,
      fontSize = '14px',
      padding = [5, 5, 5, 5],
      offsetX = 20,
      offsetY = -20,
      textFormatter = getText,
    } = text
    try {
      const text = new Text({
        font: `${fontSize} Microsoft YaHei`,
        text: textFormatter(feature, resolution),
        offsetX,
        offsetY,
        fill: new Fill({
          color,
        }),
        backgroundFill: backgroundColor
          ? new Fill({
              color: backgroundColor,
            })
          : null,
        padding,
      })
      pointStyle.setText(text)
      return pointStyle
    } catch (error) {
      console.error(error)
      return null
    }
  }

  if (text) {
    return getIconStyleFunction
  }

  let styleArray = []
  if (stroke instanceof Array) {
    stroke.forEach((element) => {
      styleArray.push(getStyle({ stroke: element }))
    })
    return styleArray
  }

  return new Style({
    fill: getFill(fill),
    stroke: getStorke(stroke),
    image: pointStyle.getImage(),
    text: pointStyle.getText(),
    zIndex,
  }).clone()
}

export function getIconStyle() {
  console.log(
    'aaa',
    new URL('../../../../public/static/svg/map/close.svg', import.meta.url).href
  )
  const aaa = new URL(
    '../../../../public/static/svg/map/split-point.svg',
    import.meta.url
  ).href

  const darkIcon = new Icon({
    src: 'https://openlayers.org/en/latest/examples/data/icons/emoticon-cool.svg',
    src: aaa,
    scale: 1,
    color: '#BADA55',
    crossOrigin: 'anonymous',
    // For Internet Explorer 11
    // imgSize: [20, 20],
  })

  return new Style({
    image: darkIcon,
  })
}
