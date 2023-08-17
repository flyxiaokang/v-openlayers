/*
 * @Description: 绘制工具
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-02-11 17:36:50
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-10 17:49:16
 */
import { Draw, Modify, Snap, Select } from 'ol/interaction'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { createBox } from 'ol/interaction/Draw'
import { LineString } from 'ol/geom'

import Commonutils from '@/VcMap/public/utils/base'
import LayerHandler from './LayerHandler'
import { MOUSE_STATUS_ENUM } from '@/VcMap/global'
import Base from '../Base'
import DrawConditions from './DrawConditions'
import { getStyle } from './StyleHandler'

const DRAW_TYPE_ENUM = {
  Point: 'Point',
  LineString: 'LineString',
  Polygon: 'Polygon',
  Circle: 'Circle',
  Box: 'Box',
  Ring: 'Ring',
}

import WktHandler from './WktHandler'
import { deepClone } from '@/VcMap/public/utils/base/common'
import VcMapUtils from '@/VcMap/public/utils/map/index'

class DrawHandler extends Base {
  // canFallback
  curFeature = null
  flag = false
  remenberDrawCoordinates = []
  rememberCoordsClone = []
  step = 0

  drawConditions = null

  timer = null
  constructor(map = null) {
    super()
    this.draw = null
    this.snap = null
    this.modify = null
    this.select = null
    this.bInit = false

    this.selectEnable = false

    this.map = map
    this.layerHandler = new LayerHandler(map)

    this.layerId = 'layerId_draw'
    this.imageStyle = { radius: 7 }

    this.defaultStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 208, 75, 0.5)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      image: new CircleStyle({
        fill: new Fill({
          color: '#ffcc33',
        }),
        ...this.imageStyle,
      }),
    })

    this.source = null
    this.vector = null
  }

  getDrawType() {
    return DRAW_TYPE_ENUM
  }

  getLayer() {
    return this.vector
  }

  createLayer(style) {
    const {
      radius = 5,
      strokeColor = '#ffcc33',
      color = 'rgba(255, 204, 51,0.7)',
      width = 2,
    } = style
    this.defaultStyle = new Style({
      fill: new Fill({
        color,
      }),
      stroke: new Stroke({
        color: strokeColor,
        width,
      }),
      image: new CircleStyle({
        fill: new Fill({
          color,
        }),
        radius,
      }),
    })

    this.source = new VectorSource({
      wrapX: false,
    })

    this.vector = new VectorLayer({
      id: this.layerId,
      source: this.source,
      style: this.defaultStyle,
    })

    return this.vector
  }

  initVectorLayer(map) {
    let { vector } = this
    map.addLayer(vector)
  }

  removeInteraction(map) {
    let { draw, snap, modify, select } = this
    modify && map.removeInteraction(modify)
    select && map.removeInteraction(select)
    snap && map.removeInteraction(snap)
    draw && map.removeInteraction(draw)
  }

  activeSnap() {
    let { source, snap } = this
    if (snap) {
      map.removeInteraction(snap)
    }
    this.snap = new Snap({
      source,
    })
    map.addInteraction(this.snap)
  }

  activeModify(map = this.map) {
    let { modify } = this
    modify && map.addInteraction(modify)
  }

  addModify(map, selectEnable = false, modifyEnable = false) {
    let { source } = this
    if (selectEnable) {
      this.select = new Select({
        wrapX: false,
      })
      this.modify = new Modify({
        features: this.select.getFeatures(),
      })
      map.addInteraction(this.select)
      map.addInteraction(this.modify)
    } else if (modifyEnable) {
      this.modify = new Modify({
        source,
      })
      map.addInteraction(this.modify)
    }
  }

  addSelect(map) {}

  /**
   * 绘制图形
   * type Point|LineString|Polygon|Circle|Box|ring
   * snapEnable 是否开启捕获
   * modifyEnable 是否开启编辑
   * onceOnly 是否仅执行一次
   * drawEndHandle 回调
   * @param {*}
   * @return callback
   */
  drawByType(
    {
      map = this.map,
      type = 'Point',
      snapEnable = false,
      modifyEnable = false,
      selectEnable = false,
      onceOnly = false,
      freehand = false,
      drawEndHandle = null,
      style = {},
      conditions = {},
    } = {
      type: 'Point',
      snapEnable: false,
      modifyEnable: false,
      onceOnly: false,
      drawEndHandle: null,
      conditions: {},
      style: {},
    }
  ) {
    debugger
    if (Commonutils.isNullOrUndifiend(map)) {
      console.error('map不能为空')
      return false
    }
    if (!DRAW_TYPE_ENUM[type]) {
      console.error('未知类型', type)
      return false
    }

    this.selectEnable = selectEnable
    let draw = null

    let { layerId } = this

    if (this.draw !== null) {
      this.removeInteraction(map)
    }
    if (!this.layerHandler.checkLayerIsExist(map, layerId)) {
      map.addLayer(this.createLayer(style))
    }
    let { source } = this
    const { innerR = 0, outerR = 0 } = style
    map.set('mouseStatus', MOUSE_STATUS_ENUM.draw)
    if (type === DRAW_TYPE_ENUM.Box) {
      draw = new Draw({
        source,
        type: 'Circle',
        geometryFunction: createBox(),
      })
    } else if (type === DRAW_TYPE_ENUM.Ring) {
      draw = new Draw({
        source,
        type: 'Point',
      })
    } else {
      draw = new Draw({
        source,
        type,
        freehand,
      })
    }

    this.draw = draw
    map.addInteraction(draw)

    let lastClick = ''
    draw.on('drawend', (e) => {
      e.stopPropagation()
      e['dbClick'] = false
      const feature = e.feature
      if (type === DRAW_TYPE_ENUM.Ring) {
        this.createRing(feature.getGeometry().getCoordinates(), innerR, outerR)
      }
      if (lastClick === '') {
        lastClick = new Date().getTime()
      } else {
        const diff = new Date().getTime() - lastClick
        if (diff < 500) {
          e['dbClick'] = true
        } else {
          e['dbClick'] = false
        }
        lastClick = new Date().getTime()
      }
      // 是否结束绘制
      setTimeout(() => {
        if (onceOnly) {
          this.removeInteraction(map)
          this.addModify(map, selectEnable, modifyEnable)
        } else {
          this.addModify(map, false)
        }
      }, 200)

      drawEndHandle &&
        drawEndHandle({
          e,
          feature,
          coordinates: feature.getGeometry().getCoordinates(),
          type: feature.getGeometry().getType(),
          wkt: new WktHandler().feature2wkt(feature),
        })
      // 结束
      map.set('mouseStatus', MOUSE_STATUS_ENUM.none)
      this.remenberDrawCoordinates = []
      this.step = 0
      this.curFeature = null
    })

    // 捕获
    if (snapEnable) {
      this.activeSnap()
    }
    // 修改
    // if (modifyEnable) {
    //     this.addModify(map, selectEnable)
    // }
    if (JSON.stringify(conditions) != '{}') {
      this.initConditions(conditions)
    }
  }

  createRing(center, innerR = 0, outerR = 0) {
    const layer = this.layerHandler.createRingLayer({
      map: this.map,
      center,
      outerR,
      innerR,
    })
    layer
      .getSource()
      .getFeatures()
      .forEach((f) => {
        this.vector.getSource().addFeature(f)
      })

    clearInterval(this.timer)
    let count = 0
    this.timer = setInterval(() => {
      const lastFeature = this.vector.getSource().getFeatures().at(-1)
      if (lastFeature && lastFeature.getGeometry().getType() === 'Point') {
        this.vector.getSource().removeFeature(lastFeature)
        clearInterval(this.timer)
      }
      if (count > 50) {
        for (
          let index = this.vector.getSource().getFeatures().length - 1;
          index < this.vector.getSource().getFeatures().length;
          index--
        ) {
          const lastFeature = this.vector.getSource().getFeatures()[index]
          if (lastFeature && lastFeature.getGeometry().getType() === 'Point') {
            this.vector.getSource().removeFeature(lastFeature)
            break
          }
        }
        clearInterval(this.timer)
      }
      count++
    }, 10)
  }

  initConditions(conditions) {
    const { map, draw } = this
    const drawConditions = new DrawConditions(conditions)
    this.drawConditions = drawConditions
    drawConditions.initialize({ map, draw })

    drawConditions.registerEvent('on-change', (feature, geom) => {
      this.curFeature = feature
      this.remenberDrawCoordinates = deepClone(geom.getCoordinates())
      this.step = this.remenberDrawCoordinates.length
    })
  }

  drawPoint(callback, map = this.map) {
    this.drawByType({ map, drawEndHandle: callback })
  }

  endDraw(map = this.map) {
    this.removeInteraction(map)
    this.endSpliceLine()
  }

  endInteraction(map = this.map) {
    this.selectEnable = false
    this.removeInteraction(map)
  }

  clear(map = this.map) {
    // this.vector?.getSource()?.clear()
    this.vector && map.removeLayer(this.vector)
    this.drawConditions && this.drawConditions.destroy()
  }

  backward() {
    let { draw } = this
    draw.removeLastPoint()
  }

  spliceSnaps = []
  splicePoints = []
  spliceFeature = null
  spliceLinestring = null
  splicePointsLayerId = 'splicePointsLayer-id'
  spliceLine({ source, line, style, callback }) {
    this.endSpliceLine()
    this.drawByType({
      type: DRAW_TYPE_ENUM.Point,
      onceOnly: false,
      style: {
        radius: 0,
      },
      drawEndHandle: ({ e, coordinates }) => {
        if (e.dbClick) {
          const sp = this.splicePoints[0]
          const ep = this.splicePoints.at(-1)
          const spliced = VcMapUtils.spliceLine(
            this.spliceLinestring.getCoordinates(),
            sp,
            ep
          )
          callback && callback(spliced)
          this.splicePoints = []
          this.spliceFeature = null
          this.spliceLinestring = null
          callback && callback(spliced)
        } else {
          const features = source.getFeatures()
          for (let index = 0; index < features.length; index++) {
            const feature = features[index]
            if (feature.getGeometry().intersectsCoordinate(coordinates)) {
              if (!this.spliceFeature) {
                this.spliceFeature = feature
              }
              // 获取所在线段 判断非连续线段
              if (!this.spliceLinestring) {
                this.spliceLinestring = this.getIntersectLinestring(
                  this.spliceFeature.getGeometry(),
                  coordinates
                )
              } else {
                if (
                  !VcMapUtils.testIntersect(
                    this.spliceLinestring.getCoordinates(),
                    coordinates
                  )
                ) {
                  console.warn('非连续线段')
                  return
                }
              }
              this.splicePoints.push(coordinates)
              // console.log('>>>>>>>>>', this.spliceLinestring, this.splicePoints)
              this.createSplitPointsLayer(coordinates, style)
              return
            }
          }
          console.warn('不在线上')
          // const lines = source
          //   .getFeatures()
          //   .filter((e) => e.getGeometry().getType() === 'LineString')
          // for (let index = 0; index < lines.length; index++) {
          //   const l = lines[index].getGeometry().getCoordinates()
          //   if (VcMapUtils.testIntersect(l, coordinates)) {
          //     splicePoints.push(coordinates)
          //     this.createSplitPointsLayer(coordinates)
          //     console.log('splicePoints...',splicePoints)
          //     return
          //   }
          // }
          // 不符要求
          // setTimeout(() => {
          //   this.removeLastPoint()
          // }, 500);
        }
      },
    })

    let s = new Snap({
      source,
    })
    this.map.addInteraction(s)
    this.spliceSnaps.push(s)

    const pL = this.layerHandler.getVectorLayer({
      id: this.splicePointsLayerId,
      style: getStyle(style),
    })
    pL.setZIndex(1999)
    this.map.addLayer(pL)

    s = new Snap({
      source: pL.getSource(),
    })
    this.map.addInteraction(s)
    this.spliceSnaps.push(s)
  }

  createSplitPointsLayer(point, style) {
    const p = {
      geom: `POINT(${point[0]} ${point[1]})`,
    }
    this.layerHandler.createPoints({
      layerId: this.splicePointsLayerId,
      points: [p],
      map: this.map,
      zIndex: 1001,
      style,
    })
  }

  getIntersectLinestring(geometry, coordinate) {
    const type = geometry.getType()
    if (type === 'LineString') {
      if (VcMapUtils.testIntersect(geometry.getCoordinates(), coordinate)) {
        return geometry
      } else {
        return null
      }
    } else if (type === 'MultiLineString') {
      const linestrings = geometry.getLineStrings()
      for (let index = 0; index < linestrings.length; index++) {
        const linestring = linestrings[index]
        const result = this.getIntersectLinestring(linestring, coordinate)
        if (result) {
          return result
        }
      }
      return null
    }
  }

  removeLastPoint() {
    const f = this.vector.getSource().getFeatures().at(-1)
    this.vector.getSource().removeFeature(f)
  }

  endSpliceLine() {
    if (this.spliceSnaps.length > 0) {
      this.spliceSnaps.forEach((s) => {
        this.map.removeInteraction(s)
      })
      this.spliceSnaps = []
      this.layerHandler.removeLayerById(this.splicePointsLayerId)
      this.splicePoints = []
      this.spliceFeature = null
      this.spliceLinestring = null
      this.removeInteraction(this.map)
    }
  }

  // backward() {
  //   let { step, remenberDrawCoordinates, curFeature, draw } = this
  //   if (!this.flag) {
  //     this.rememberCoordsClone = deepClone(remenberDrawCoordinates)
  //   }
  //   this.flag = true
  //   if (step > 0) {
  //     if (remenberDrawCoordinates.length > 0 && step > 1) {
  //       curFeature
  //         .getGeometry()
  //         .setCoordinates(remenberDrawCoordinates.slice(0, --step))
  //       draw.removeLastPoint()
  //     }
  //   }
  // }

  // forward() {
  //   debugger
  //   this.flag = false
  //   let { step, rememberCoordsClone, curFeature, draw } = this
  //   if (step < rememberCoordsClone.length - 1) {
  //     if (rememberCoordsClone.length > 0) {
  //       curFeature
  //         .getGeometry()
  //         .setCoordinates(rememberCoordsClone.slice(0, ++step))
  //     }
  //   }
  // }
}

export default DrawHandler
