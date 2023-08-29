/*
 * @Description: draw conditions
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-06-02 11:10:28
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-09 17:11:32
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

  map = null
  constructor(options = { showTip: false, maxLength: 100000 }) {
    this.conditions = options
  }

  initialize(options) {
    this.drawListener(options)
  }

  registerEvent(eventName, callback) {
    if (eventName === 'on-change') {
      this.geometryChangeEvent = callback
    }
  }

  drawListener({ map, draw }) {
    this.map = map
    const _this = this
    const { projection } = this
    const { showTip, maxLength } = this.conditions

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

    const formatLength = function (line) {
      const length = getLength(line, {
        projection,
      })
      let output
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
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

    draw.on('drawstart', (evt) => {
      // set sketch
      const sketch = evt.feature

      let tooltipCoord = []
      if (sketch.getGeometry().getType() === 'LineString') {
        tooltipCoord = evt.coordinate || sketch.getGeometry().getCoordinateAt(1)
      } else {
      }

      let lastCoord = []
      let flag = false
      this.listener = sketch.getGeometry().on('change', function (evt) {
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
          } else if (distance > 0 && distance <= maxLength) {
            lastCoord = [...tooltipCoord]
            flag = false
            _this.geometryChangeEvent && _this.geometryChangeEvent(sketch, geom)
          } else if (distance > maxLength) {
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
    })
  }

  destroy() {
    unByKey(this.listener)
    this.map.removeOverlay(this.measureTooltip)
  }
}
