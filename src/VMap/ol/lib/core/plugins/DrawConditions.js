/*
 * @Description: draw conditions
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-06-02 11:10:28
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-24 11:35:15
 */

import Overlay from 'ol/Overlay'
import { getLength, getArea, getDistance } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import { getConfig } from '@/VMap/ol/config'

export default class DrawConditions {
  listener = null
  conditions = {}
  projection = getConfig().prj

  geometryChangeEvent = null

  measureTooltip = null

  drawHandler = null

  map = null
  constructor(options = { showTip: false, maxDistance: 1000000 }) {
    this.conditions = options
  }

  initialize({ map, draw }, drawHandler) {
    this.map = map
    this.draw = draw
    this.drawHandler = drawHandler
    this.projection = map.getView().getProjection().getCode()
    // this.drawListener(options)
  }

  registerEvent(eventName, callback) {
    if (eventName === 'on-change') {
      this.geometryChangeEvent = callback
    }
  }

  drawListener({ sketch, tooltipCoord }) {
    const _this = this
    const { map, draw ,projection} = this
    // console.log('conditions=====', this.conditions)
    const { showTip, maxDistance, excludeGeometries = [] } = this.conditions
    let measureTooltipElement

    if (showTip) {
      createMeasureTooltip()
    }

    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement)
      }
      measureTooltipElement = document.createElement('div')
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
      _this.measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
      })
      map.addOverlay(_this.measureTooltip)
    }
    // console.log('epsg===',projection)
    const formatLength = function (line) {
      const length = getLength(line, {
        projection,
      })
      let output
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
      // if(length > maxDistance){
      //   return maxDistance
      // }
      return output
    }

    const formatDistance = function (sp, ep) {
      if (sp && ep) {
        const distance = getDistance(sp, ep)
        return distance
      } else {
        return 0
      }
    }

    let lastCoord = []
    let flag = false

    this.listener = sketch.getGeometry().on('change', function (evt) {
      // console.log('change=======', evt)
      const geom = evt.target
      let output
      let distance = 0

      if (geom.getType() === '') {
        output = formatArea(geom)
        tooltipCoord = geom.getInteriorPoint().getCoordinates()
      } else if (geom.getType() === 'LineString') {
        output = formatLength(geom)
        tooltipCoord = geom.getLastCoordinate()
        const coords = geom.getCoordinates()
        const sp = coords[coords.length - 2]
        distance = parseInt(formatDistance(sp, tooltipCoord))
        if (distance === 0 && flag) {
          flag = false
          draw.removeLastPoint()
        } else if (distance > 0 && distance <= maxDistance) {
          lastCoord = [...tooltipCoord]
          flag = false
          _this.geometryChangeEvent && _this.geometryChangeEvent(sketch, geom)
        } else if (distance > maxDistance) {
          coords.pop()
          coords.push(lastCoord)
          geom.setCoordinates(coords)
          flag = true
        }
      }
      // console.log('change...', output, tooltipCoord, distance, flag);
      if (showTip) {
        measureTooltipElement.innerHTML = output
        _this.measureTooltip.setPosition(tooltipCoord)
      }
    })
  }

  destroy() {
    unByKey(this.listener)
    this.map.removeOverlay(this.measureTooltip)
  }
}
