/*
 * @Description:测量工具
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-10-20 10:04:21
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-23 21:01:02
 */

import Draw from 'ol/interaction/Draw'
import Overlay from 'ol/Overlay'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { LineString, Polygon } from 'ol/geom'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import MultiPoint from 'ol/geom/MultiPoint'
import Feature from 'ol/Feature'

// global so we can remove it later
let pointerMoveHandler
let draw

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
let helpTooltip

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
let measureTooltip

let measureTooltipArray = []

let curMeasureType = ''

let lastGeometry

let polygonLayerArray = []
let polylineLayerArray = []

function finish(map) {
  pointerMoveHandler && map.un('pointermove', pointerMoveHandler)
  map && map.removeOverlay(helpTooltip)
  map && map.removeInteraction(draw)
  map && map.set('mouseStatus',V_MOUSE_STATUS.none)
}

function clear(map) {
  if (measureTooltipArray.length > 0) {
    for (let index = measureTooltipArray.length - 1; index >= 0; index--) {
      const element = measureTooltipArray[index]
      map.removeOverlay(element)
    }
  }

  polygonLayerArray.forEach(element => {
    map.removeLayer(element)
  })

  polylineLayerArray.forEach(element => {
    map.removeLayer(element)
  })

  polygonLayerArray = []
  polylineLayerArray = []
  measureTooltipArray = []
}

function init(map, measureType) {
  curMeasureType = measureType

  const source = new VectorSource()

  /**
       * Currently drawn feature.
       * @type {import("../src/ol/Feature.js.js.js.js.js.js.js.js").default}
       */
  let sketch

  /**
       * The help tooltip element.
       * @type {HTMLElement}
       */
  let helpTooltipElement

  /**
       * The measure tooltip element.
       * @type {HTMLElement}
       */
  let measureTooltipElement

  /**
       * Message to show when the user is drawing a polygon.
       * @type {string}
       */
  const continuePolygonMsg = '双击结束测量'

  /**
       * Message to show when the user is drawing a line.
       * @type {string}
       */
  const continueLineMsg = '双击结束测量'

  /**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
  pointerMoveHandler = function(evt) {
    if (evt.dragging) {
      return
    }
    /** @type {string} */
    let helpMsg = '单击开始测量'

    if (sketch) {
      const geom = sketch.getGeometry()
      if (geom instanceof Polygon) {
        helpMsg = continuePolygonMsg
      } else if (geom instanceof LineString) {
        helpMsg = continueLineMsg
      }
    }

    helpTooltipElement.innerHTML = helpMsg
    helpTooltip.setPosition(evt.coordinate)

    helpTooltipElement.classList.remove('hidden')
  }

  map.on('pointermove', pointerMoveHandler)

  map.getViewport().addEventListener('mouseout', () => {
    helpTooltipElement.classList.add('hidden')
  })

  //   const typeSelect = document.getElementById('type');

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  const formatLength = function(line) {
    const length = getLength(line, {
      projection: map.getView().getProjection().getCode()
    })
    let output
    if (length > 100) {
      output = `${Math.round((length / 1000) * 100) / 100} ` + `km`
    } else {
      output = `${Math.round(length * 100) / 100} ` + `m`
    }
    return output
  }

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  const formatArea = function(polygon) {
    const area = getArea(polygon, {
      projection: map.getView().getProjection().getCode()
    })
    let output
    if (area > 10000) {
      output = `${Math.round((area / 1000000) * 100) / 100} ` + `km<sup>2</sup>`
    } else {
      output = `${Math.round(area * 100) / 100} ` + `m<sup>2</sup>`
    }
    return output
  }

  function addInteraction(measureType_) {
    const type = measureType_ === 'area' ? 'Polygon' : 'LineString'
    draw = new Draw({
      source: source,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        }),
        stroke: new Stroke({
          color: 'rgba(255,204, 0, 1)',
          lineDash: [10, 10],
          width: 3
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    })
    map.removeInteraction(draw)
    map.addInteraction(draw)

    createMeasureTooltip()
    createHelpTooltip()

    let listener
    draw.on('drawstart', (evt) => {
      // set sketch
      sketch = evt.feature

      /** @type {import("../src/ol/coordinate.js.js.js.js.js.js.js.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate

      listener = sketch.getGeometry().on('change', (evt) => {
        const geom = evt.target
        let output
        lastGeometry = geom
        if (geom instanceof Polygon) {
          output = formatArea(geom)
          tooltipCoord = geom.getInteriorPoint().getCoordinates()
        } else if (geom instanceof LineString) {
          output = formatLength(geom)
          tooltipCoord = geom.getLastCoordinate()
        }
        measureTooltipElement.innerHTML = output
        measureTooltip.setPosition(tooltipCoord)
      })
    })

    draw.on('drawend', () => {
      finish(map)
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      measureTooltip.setOffset([0, -7])
      // unset sketch
      // sketch = null;
      // console.log("end>>>",lastGeometry);
      curMeasureType === 'area' ? createPolygon(lastGeometry) : createPolyline(lastGeometry)
      // unset tooltip so that a new one can be created
      measureTooltipElement = null
      createMeasureTooltip()
      unByKey(listener)
    })
  }

  /**
   * Creates a new help tooltip
   */
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement)
    }
    helpTooltipElement = document.createElement('div')
    helpTooltipElement.className = 'ol-tooltip hidden'
    helpTooltip = new Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    })
    map.addOverlay(helpTooltip)
    // map.addOverlay([121,31]);
  }

  /**
   * Creates a new measure tooltip
   */
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement)
    }
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    })
    measureTooltipArray.push(measureTooltip)
    map.addOverlay(measureTooltip)

    // let menu_overlay = new ol.Overlay({
    //     id: 'ls_menuOverlayId',
    //     element: document.getElementById("rightMenuContainer"),
    //     positioning: 'center-center'
    // });

    // map.addOverlay([120,30]);
  }

  /**
     * 创建面
     */
  function createPolygon(geometry) {
    const polygonFeature = new Feature({
      geometry
    })
    const styles = [
      /* We are using two different styles for the polygons:
             *  - The first style is for the polygons themselves.
             *  - The second style is to draw the vertices of the polygons.
             *    In a custom `geometry` function the vertices of a polygon are
             *    returned as `MultiPoint` geometry, which will be used to render
             *    the style.
             */
      new Style({
        stroke: new Stroke({
          color: 'orange',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'orange'
          })
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()[0]
          // console.log("point>>",coordinates);
          return new MultiPoint(coordinates)
        }
      })
    ]
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'orange',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255,217,102, 0.2)'
      })
    })
    polygonFeature.setStyle(styles)
    const vectorSource = new VectorSource({
      features: [polygonFeature]
    })
    const polygonLayer = new VectorLayer({
      source: vectorSource
      // id: layerId
    })
    polygonLayerArray.push(polygonLayer)

    map.addLayer(polygonLayer)
  }

  /**
     * 创建线
     */
  function createPolyline(geometry) {
    const polygonFeature = new Feature({
      geometry
    })
    const styles = [
      /* We are using two different styles for the polygons:
             *  - The first style is for the polygons themselves.
             *  - The second style is to draw the vertices of the polygons.
             *    In a custom `geometry` function the vertices of a polygon are
             *    returned as `MultiPoint` geometry, which will be used to render
             *    the style.
             */
      new Style({
        stroke: new Stroke({
          color: 'orange',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'orange'
          })
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()
          // console.log("point>>",coordinates);
          return new MultiPoint(coordinates)
        }
      })
    ]
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'orange',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255,217,102, 0.2)'
      })
    })
    polygonFeature.setStyle(styles)
    const vectorSource = new VectorSource({
      features: [polygonFeature]
    })
    const polygonLayer = new VectorLayer({
      source: vectorSource
      // id: layerId
    })

    polylineLayerArray.push(polygonLayer)
    map.addLayer(polygonLayer)
  }

  function createPoints() {

  }

  /**
   * Let user change the geometry type.
   */
  //   typeSelect.onchange = function () {
  //     map.removeInteraction(draw);
  //     addInteraction();
  //   };

  addInteraction(measureType)
}


import { V_MOUSE_STATUS } from '@/VMap/global.js'
import Base from '../Base.js'

export default class MeasureHandler extends Base{
  constructor(map){
    super()
    this.map = map
  }

  measureLength(map = this.map, clearLast = false) {
    map.set('mouseStatus',V_MOUSE_STATUS.mesure)
    clearLast && clear(map)
    init(map, 'length')
  }

  measureArea(map = this.map, clearLast = false) {
    map.set('mouseStatus',V_MOUSE_STATUS.mesure)
    clearLast && clear(map)
    init(map, 'area')
  }

  clearResult(map = this.map) {
    finish(map)
    clear(map)
  }
}

let _map = null
let _cmap = null

export function setMap(map,cmap){
  _map = map
  _cmap = cmap
}

/**
 * 测量线
 * @param {*} map
 * @param {*} clearLast 是否立即清除结果
 */
export function measureLength(map = _map, clearLast = false) {
  clearLast && clear(map)
  init(map, 'length')
}

/**
 * 测量面
 * @param {*} map
 * @param {*} clearLast
 */
export function measureArea(map = _map, clearLast = false) {
  clearLast && clear(map)
  init(map, 'area')
}

/**
 * 清除结果
 * @param {*} map
 */
export function clearResult(map = _map) {
  finish(map)
  clear(map)
}
