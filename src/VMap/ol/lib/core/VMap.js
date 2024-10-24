/*
 * @Description: 地图操作类
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-12-27 14:28:14
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-24 15:38:56
 */
import Base from './Base'
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import { defaults } from 'ol/control'
import ScaleLine from 'ol/control/ScaleLine'
import DragZoom from 'ol/interaction/DragZoom'
import { always } from 'ol/events/condition'
import Feature from 'ol/Feature'
import Geometry from 'ol/geom/Geometry'
import { getArea, getDistance, getLength } from 'ol/sphere'
import { defaults as defaultInteraction } from 'ol/interaction/defaults'
import { fromLonLat } from 'ol/proj'

import VcUtils from '@/VMap/public/utils/base/index'
import LayerHandler from './plugins/LayerHandler'
import DrawHandler from './plugins/DrawHandler'
import DrawConditions from './plugins/DrawConditions'
import WktHandler from './plugins/WktHandler'
import MeasureHandler from './plugins/MeasureHandler'
import WfsHandler from './plugins/WfsHandler'
import InteractionHandler from './plugins/InteractionHandler'
import * as GeometryHandler from './plugins/GeometryHandler'
import * as TransHandler from './plugins/TransformHandler'
import kriging from './plugins/KrigingHandler'

import { V_MAP_PROVIDER, V_MOUSE_STATUS, getTdtUrl } from '@/VMap/global'
// 自定义配置文件
import { getConfig } from '@/VMap/ol/config'
import { Point } from 'ol/geom'
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style'

import * as StyleHandler from './plugins/StyleHandler'
import { deepClone } from '@/VMap/public/utils/base/common'

class VMap extends Base {
  // map 对象
  map = null
  // map 容器
  target = ''

  defaultStyle = new Style({
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
      radius: 7,
    }),
  })

  constructor(target = 'map-view') {
    super()
    this.target = target
    this.mapConfig = getConfig()
    // 地图事件
    this.mouseMoveHandle = null
    this.mouseClickHandle = null
    this.mouseDbClickHandle = null
    this.mouseMoveEndHandle = null
    // 坐标系
    this.prj = this.mapConfig.prj
    // 地图范围
    this.mapInitExtent = this.mapConfig.defaultView
    this.mouseStatusKey = 'mouseStatus'
    // 默认符号
    this.overlay = null
    // overlay集合
    this.popupOverlayCollection = []
    // 绘制工具
    this.drawHandler = null
    this.drawConditions = null
    this.measureHandler = null
    this.wktHandler = null
    this.wfsHandler = null
    this.interactionHandler = null

    this.GeoHandler = GeometryHandler
    this.TransHandler = TransHandler
    this.StyleHandler = StyleHandler
    this.kriging = kriging

    this.baseLayerCollection = {}
  }

  static whoami() {
    return this.name
  }

  /**
   * 静态方法 类名.function
   * @param {*} param0
   */
  static initMapOSM({ target = 'map-view' }) {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })
    this.map = map
  }

  /**
   * 安装插件
   * @param {*} plugin 插件
   */
  installPlugin(plugin) {
    plugin.initialize(this)
  }

  /**
   * 实例方法 实例.function
   */
  initMapOSM() {
    const map = new Map({
      logo: false,
      controls: defaults({
        attribution: false,
        zoom: true,
        rotate: false,
        scaleLine: true,
      }).extend([]), // 隐藏放大缩小按钮
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.target,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })
    this.map = map
    this.map.addControl(
      new ScaleLine({
        units: 'metric',
      })
    )
    // map event
    this.initEvent()
  }

  /**
   * 通过配置文件【mapConfig】，创建地图
   */
  initMap(
    mapConfig,
    options = {
      controls: {},
      showBasemap: true,
      dragging: true,
    }
  ) {
    if (!this.target) {
      return
    }
    this.mapConfig = deepClone(mapConfig)
    this.getLayerHandler()
    const { controls, showBasemap, dragPan } = options
    const {
      baseLayers,
      prj,
      defaultBaseLayerId,
      defaultView: view,
    } = this.mapConfig
    if (view.projection === 'EPSG:3857') {
      view.center = fromLonLat(view.center)
    }
    // console.log('view......', view)
    this.prj = prj
    const layers = []
    // 底图集合
    const baseLayersList = []
    VcUtils.tree2list(baseLayers, baseLayersList)
    // baseLayersList.forEach((options) => {
    //   // baseMap  标识底图图层
    //   if (options.url) {
    //     options.id = `baseMap_${options.id}`
    //     layers.push(this.getLayerByType(options))
    //   }
    // })

    const defaultBaseLayer = baseLayers.filter(
      (e) => e.id === defaultBaseLayerId
    )
    if (defaultBaseLayer.length > 0) {
      this.getBaseLayer(defaultBaseLayer[0]).forEach((element) => {
        layers.push(element)
      })
    }

    const map = new Map({
      logo: false,
      controls: defaults({
        attribution: false,
        zoom: false,
        rotate: false,
        scaleLine: true,
        ...controls,
      }).extend([]), // 隐藏放大缩小按钮
      interactions: new defaultInteraction({
        dragPan,
      }),
      layers: showBasemap ? layers : [],
      target: this.target,
      view: new View(view),
    })
    this.map = map
    if (controls.scaleLine) {
      this.map.addControl(
        new ScaleLine({
          units: 'metric',
          bar: false,
          steps: 2,
          text: true,
          minWidth: 100,
          maxWidth: 100,
          target: 'vmap-status-bar',
        })
      )
    }
    this.layerHandler.setMap(this.map)
    this.initEvent()
    return new Promise((resolve, reject) => {
      this.mapInitExtent = this.map
        .getView()
        .calculateExtent(this.map.getSize())
      resolve({ map })
    })
  }

  /**
   * 自定义创建地图
   * @param {*} {容器id，底图集合，view}
   */
  initCustomMap({
    target = this.target,
    view = {
      projection: 'EPSG:4326',
      center: [104.53125000000001, 32.70263671875],
      zoom: 5,
      minZoom: 0,
      maxZoom: 20,
    },
    baseLayers = [],
    controls = {},
    callback,
  }) {
    if (!this.target) {
      console.warn('地图容器不存在')
      return
    }
    const layers = []
    baseLayers.forEach((options, index) => {
      const layer = this.getLayerByType(options)
      if (layer) {
        layer.setZIndex(index)
        layers.push(layer)
      }
    })
    const map = new Map({
      logo: false,
      controls: defaults({
        attribution: false,
        zoom: true,
        rotate: false,
        scaleLine: true,
        ...controls,
      }).extend([]), // 隐藏放大缩小按钮
      layers: layers,
      target: target,
      view: new View(view),
    })
    map.addControl(
      new ScaleLine({
        units: 'metric',
      })
    )
    setTimeout(() => {
      this.mapInitExtent = this.map
        .getView()
        .calculateExtent(this.map.getSize())
      callback && callback(map)
    }, 500)
    // map event
    this.map = map
    this.layerHandler.setMap(this.map)
    this.initEvent()
  }

  /**
   * 初始化事件
   */
  initEvent() {
    const { map } = this
    map.on('singleclick', (e) => {
      this.mouseClickHandle && this.mouseClickHandle(e)
    }) // 鼠标单击事件
    map.on('doubleClick', (e) => {
      this.mouseDbClickHandle && this.mouseDbClickHandle(e)
    }) // 鼠标双击事件
    map.on('pointermove', (e) => {
      this.mouseMoveHandle && this.mouseMoveHandle(e)
    }) // 鼠标移动事件
    map.on('moveend', (e) => {
      this.mouseMoveEndHandle && this.mouseMoveEndHandle(e)
    }) // 鼠标移动事件
  }

  registerMouseClick(callback) {
    this.mouseClickHandle = callback
  }

  releaseMouseClick() {
    this.mouseClickHandle = null
  }

  registerMouseDbClick(callback) {
    this.mouseDbClickHandle = callback
  }

  releaseMouseDbClick() {
    this.mouseDbClickHandle = null
  }

  registerMouseMove(callback) {
    this.mouseMoveHandle = callback
  }

  relaeseMouseMove() {
    this.mouseMoveHandle = null
  }

  registerMouseMoveEnd(callback) {
    this.mouseMoveEndHandle = callback
  }

  relaeseMouseMoveEnd() {
    this.mouseMoveEndHandle = null
  }

  /***
   * 图层操作模块.start *** */
  /**
   * 自定义add overlay
   * @param {*} container 容器id
   * @param {*} options 可选参数
   * @returns overlay
   */
  addOverlay(container, options) {
    const overlay = this.layerHandler.getOverlayLayer(container, options)
    this.overlay = overlay
    this.map.addOverlay(overlay)
    return overlay
  }

  /**
   * 自定义创建overlay
   * @param {*} param0
   * @returns overlay
   */
  createOverlay({
    popupId,
    center,
    html = '',
    offset = [0, -15],
    collection = true,
    options,
  } = {}) {
    let { map } = this
    if (document.getElementById(popupId)) {
      document.getElementById(popupId).style.display = 'block'
    }
    let container = document.getElementById(popupId)
    if (!container) {
      return
    }
    let content = document.getElementById(popupId + '_content')
    if (html !== '') {
      content.innerHTML = html
    }
    const overlay = this.layerHandler.getOverlayLayer(container, options)
    overlay.setPosition(center)
    overlay.setOffset(offset)
    map.addOverlay(overlay)
    collection && this.popupOverlayCollection.push(overlay)
    return overlay
  }

  /**
   * 删除所有overlay
   */
  removeAllOverlay() {
    this.popupOverlayCollection.forEach((overlay) => {
      this.map.removeOverlay(overlay)
    })

    this.popupOverlayCollection = []
  }

  /**
   * 加载图层
   * @param {*} options 图层信息 {id,visible,type = V_MAP_PROVIDER}
   * @param {*} prj 坐标系
   */
  addLayerByType(options, prj = this.mapConfig.prj) {
    let { id, visible, once, type } = options
    if (!type) {
      return
    }
    if (!id) {
      id = VcUtils.uuid() // uuid()
      options['id'] = id
    }
    if (once) {
      this.removeLayerById(id)
    }
    if (this.checkLayerIsExist(id)) {
      this.setLayerVisibleById(id, visible)
    } else {
      let layer = this.getLayerByType(options, prj)
      if (layer) {
        this.map.addLayer(layer)
        return layer
      }
    }
  }

  getBaseLayer(group) {
    const { prj } = this.mapConfig
    let layers = []
    let imageLayer = null
    this.resetBaseLayer()
    group.children.forEach((l) => {
      const { id, visible, opacity, type } = l
      if (this.checkLayer(l)) {
        let layerInfo = l
        if (type === V_MAP_PROVIDER.tdt) {
          layerInfo = {
            type,
            url: getTdtUrl({ mapStyle: id, prj }),
            visible,
            opacity,
          }
        }
        imageLayer = this.getLayerByType(layerInfo)
        if (imageLayer) {
          this.baseLayerCollection[id] = imageLayer
          layers.push(imageLayer)
        }
      }
    })

    return layers
  }

  resetBaseLayer() {
    for (const key in this.baseLayerCollection) {
      if (Object.hasOwnProperty.call(this.baseLayerCollection, key)) {
        const element = this.baseLayerCollection[key]
        this.map.removeLayer(element)
        delete this.baseLayerCollection[key]
      }
    }
  }

  checkLayer() {
    return true
  }

  /**
   * 根据服务类型加加载
   * @param {*} options layer
   * @param {*} prj EPSG:4326 | EPSG:3857
   * @returns
   */
  getLayerByType(options, prj = this.mapConfig.prj) {
    this.parseLayerOptions(options)
    // console.log('layeroptions...........', options)
    switch (options.type) {
      case V_MAP_PROVIDER.wmts:
        return this.layerHandler.getWmtsByPrj({
          prj,
          options,
        })
      case V_MAP_PROVIDER.tdt:
        return this.layerHandler.getTdtByPrj({
          prj,
          options,
        })
      case V_MAP_PROVIDER.supermap:
        return this.layerHandler.getSuperMapWmts({
          prj,
          options,
        })
      case V_MAP_PROVIDER.geoserverwmts:
        return this.layerHandler.getWmtsGeoserver({
          options,
        })
      case V_MAP_PROVIDER.wmsimagetile:
        return this.layerHandler.getWmsTile(options)
      case V_MAP_PROVIDER.wmsimage:
        return this.layerHandler.getWmsImage(options)
      case V_MAP_PROVIDER.arcgisimage:
        return this.layerHandler.getArcgisImage(options)
      case V_MAP_PROVIDER.arcgisimagetile:
        return this.layerHandler.getArcgisImageTile(options)
      case V_MAP_PROVIDER.arcgistile:
        return this.layerHandler.getXYZ(options)
      case V_MAP_PROVIDER.geojson:
        return this.layerHandler.getGeojsonLayerWithRender(options)
      case V_MAP_PROVIDER.heatmap:
        return this.layerHandler.getHeatMapLayer(options.geojson, options)
      case V_MAP_PROVIDER.clustermap:
        return this.layerHandler.getClusterLayerFromGeojson(
          options.geojson,
          options
        )
      case V_MAP_PROVIDER.xyz:
        return this.layerHandler.getXYZ(options)
      case V_MAP_PROVIDER.tms:
        return this.layerHandler.getTmsLayer(options)
      case V_MAP_PROVIDER.gdmap:
        return this.layerHandler.getGaodeLayer(options)
      case V_MAP_PROVIDER.bdmap:
        return this.layerHandler.getBaiduLayer(options)
      case V_MAP_PROVIDER.geoservermvt:
        // debugger
        // return this.layerHandler.getWmtsGeoserver({
        //   // prj,
        //   options,
        // })
        return this.layerHandler.getMvt({ prj, options })
      case V_MAP_PROVIDER.mapboxmvt:
        return this.layerHandler.getMapboxVt(options)
      default:
        return null
    }
  }

  parseLayerOptions(o) {
    if (o.hasOwnProperty('opacity')) {
      o.opacity = Number(o.opacity)
    }
    if (o.hasOwnProperty('zIndex')) {
      o.zIndex = Number(o.zIndex)
    }
    if (o.hasOwnProperty('opacity')) {
      o.opacity = Number(o.opacity)
    }
  }

  addSuperMapLayer(options) {
    this.map.addLayer(
      this.layerHandler.getSuperMapWmts({ options, prj: this.mapConfig.prj })
    )
  }

  addSuperMapXYZ(options) {
    this.map.addLayer(
      this.layerHandler.getSuperMapXYZ({ options, prj: this.mapConfig.prj })
    )
  }

  addTdtLayer(options) {
    this.map.addLayer(
      this.layerHandler.getTdtByPrj({ options, prj: this.mapConfig.prj })
    )
  }

  addWmtsLayer(options) {
    this.map.addLayer(this.layerHandler.getWmts(options))
  }

  /**
   * 加载geoserver wmts
   * @param {*} options {id,type,visible}
   */
  addGeoserverWmts(options) {
    this.map.addLayer(
      this.layerHandler.getWmtsGeoserver({ options, prj: this.mapConfig.prj })
    )
  }

  addWmsLayer(options) {
    this.map.addLayer(this.layerHandler.getWmsTile(options))
  }

  addWmsImageLayer(options) {
    this.map.addLayer(this.layerHandler.getWmsImage(options))
  }

  addArcgisTileLayer(options) {
    this.map.addLayer(this.layerHandler.getArcgisImageTile(options))
  }

  addArcgisImageLayer(options) {
    this.map.addLayer(this.layerHandler.getArcgisImage(options))
  }

  addArcgisWmtsLayer(options) {
    this.map.addLayer(this.layerHandler.getXYZ(options))
  }

  addHeatMapLayer(geojson, options) {
    this.map.addLayer(this.layerHandler.getHeatMapLayer(geojson, options))
  }

  addClusterLayer(geojson, options) {
    this.map.addLayer(
      this.layerHandler.getClusterLayerFromGeojson(geojson, options)
    )
  }

  /**
   * XYZ类型切片服务
   * @param {*} layerOption
   */
  addXYZLayer(options) {
    this.map.addLayer(this.layerHandler.getXYZ(options))
  }

  /**
   * geojson layer
   * @param {*} options
   */
  addGeojsonLayer(options) {
    this.map.addLayer(this.layerHandler.getGeojsonLayer(options))
  }

  /**
   * 检查图层是否存在
   * @param {*} id 图层id
   * @returns 是否存在
   */
  checkLayerIsExist(id) {
    return this.layerHandler.checkLayerIsExist(this.map, id)
  }

  /**
   * 获取图层
   * @param {*} id id
   * @returns
   */
  getLayerById(id, map = this.map) {
    return this.layerHandler.getLayerById(id, map)
  }

  /**
   * 通过id删除图层
   * @param {*} id 图层id
   */
  removeLayerById(id, strict = true) {
    const { map } = this
    this.layerHandler.removeLayerById(id, map, strict)
  }

  /**
   * 删除所有图层
   */
  removeAllLayer() {
    this.layerHandler.removeAllLayer(this.map)
  }

  /**
   * 设置图层显隐
   * @param {*} param0
   */
  setLayerVisibleById(id, visible) {
    const { map } = this
    this.layerHandler.setLayerVisibleById(id, visible, map)
  }

  /***
   * 图层操作模块.end *** */
  /**
   * 拉框缩放
   * @param {Boolean}
   */
  dragZoom(out) {
    let { map, dragZoomIns } = this
    if (dragZoomIns) {
      this.map.removeInteraction(dragZoomIns)
      dragZoomIns = null
    }
    // 初始化一个拉框控件
    dragZoomIns = new DragZoom({
      condition: always,
      out,
    })
    this.dragZoomIns = dragZoomIns
    dragZoomIns.setActive(true)
    map.addInteraction(dragZoomIns)
    document.querySelector(`#${this.target}`).style.cursor = 'crosshair'
  }

  /**
   * 结束缩放
   */
  endDragZoom() {
    let { map, dragZoomIns } = this
    if (dragZoomIns) {
      dragZoomIns.setActive(false)
      map.removeInteraction(dragZoomIns)
      document.querySelector(`#${this.target}`).style.cursor = 'default'
      dragZoomIns = null
    }
  }

  getLayerHandler(map = this.map) {
    if (this.layerHandler == null) {
      this.layerHandler = new LayerHandler(map)
      this.layerHandler.prj = this.mapConfig.prj
    }
    return this.layerHandler
  }

  //测量
  newMeasureHandler(map = this.map) {
    return new MeasureHandler(map)
  }

  /**
   * 获取测量工具
   * @returns MeasureHandler
   */
  getMeasureHandler(map = this.map) {
    if (this.measureHandler == null) {
      this.measureHandler = new MeasureHandler(map)
    }
    return this.measureHandler
  }

  // 绘制
  newDrawHandler(map = this.map) {
    return new DrawHandler(map)
  }

  /**
   * 获取绘制工具
   * @param {*} map
   * @returns drawHandler
   */
  getDrawHandler(map = this.map) {
    if (this.drawHandler == null) {
      this.drawHandler = new DrawHandler(map)
    }
    return this.drawHandler
  }

  destoryDrawHandler() {
    if (this.drawHandler) {
      this.drawHandler.endDraw()
      this.drawHandler = null
    }
  }

  newDrawConditions() {
    const d = new DrawConditions()
    d.projection = this.mapConfig.prj
    return d
  }

  /**
   * 绘制条件
   * @returns
   */
  getDrawCondtions() {
    if (this.drawConditions == null) {
      this.drawConditions = new DrawConditions()
      this.drawConditions.projection = this.mapConfig.prj
    }
    return this.drawConditions
  }

  // wfs
  newWfsHandler(map = this.map) {
    return new WfsHandler(map)
  }

  /**
   * wfs handler
   * @param {*} map 地图对象
   * @returns wfs handler
   */
  getWfsHandler(map = this.map) {
    if (this.wfsHandler == null) {
      this.wfsHandler = new WfsHandler(map)
    }
    return this.wfsHandler
  }

  // 交互
  newInteraction(options, map = this.map) {
    return new InteractionHandler(map, options)
  }

  getInteraction(map = this.map, options) {
    if (this.interactionHandler == null) {
      this.interactionHandler = new InteractionHandler(map, options)
    }
    return this.interactionHandler
  }

  destoryInteraction() {
    if (this.interactionHandler) {
      this.interactionHandler.enableSelect(false)
      this.interactionHandler = false
    }
  }

  /**
   * wkt handler
   * @returns wkt handler
   */
  getWktHandler() {
    if (this.wktHandler == null) {
      this.wktHandler = new WktHandler()
    }
    return this.wktHandler
  }

  /**
   * 获取当前范围、中心点
   * @returns
   */
  getExtent(map = this.map) {
    return {
      center: map.getView().getCenter(),
      extent: map.getView().calculateExtent(map.getSize()),
    }
  }

  /**
   * 视图范围初始化
   */
  fullExtent(options = {}) {
    this.map.getView().fit(this.mapInitExtent, options)
  }

  /**
   * 缩放到指定范围
   * @param {*} extent 范围 [minX,minY,maxX,maxY]
   * @param {*} options 可选参数
   */
  zoomToExtent(
    extent,
    options = {
      duration: 1000,
    }
  ) {
    this.map.getView().fit(extent, options)
  }

  zoomToPoint(coordinate, minResolution = 0.000674727) {
    const point = new Point(coordinate)
    this.zoomToGeometry(point, minResolution)
  }

  /**
   * 缩放到几何对象
   * @param {*} geometry 几何对象
   * @param {*} minResolution
   */
  zoomToGeometry(geometry, minResolution = 0.000674727) {
    let view = this.map.getView()
    view.fit(geometry, {
      duration: 1000,
      minResolution: minResolution,
    })
  }

  /**
   * 缩放到图层
   * @param {*} id 图层id
   */
  zoomToLayerById(id, map = this.map) {
    const layer = this.getLayerById(id, map)
    this.zoomToLayer(layer)
  }

  /**
   * 缩放到图层
   * @param {*} layer 图层
   */
  zoomToLayer(layer) {
    if (layer) {
      this.zoomToExtent(layer.getSource().getExtent())
    }
  }

  /**
   * 飞行到图层
   * @param {*} layer 图层
   * @param {*} options 可选参数
   */
  fly2layer(
    layer,
    options = {
      duration: 1000,
      minResolution: 0.005274727,
    }
  ) {
    const { map } = this
    if (map && layer) {
      const vectorSource = layer.getSource()
      map.getView().fit(vectorSource.getExtent(), options)
    }
  }

  /**
   * 飞行到范围
   * @param {*} extent 范围
   * @param {*} options 可选参数
   */
  fly2extent(
    extent,
    options = {
      duration: 1000,
    }
  ) {
    const { map } = this
    if (map) {
      map.getView().fit(extent, options)
    }
  }

  /**
   * 获取feature范围
   * @param {*} feature Feature|Geometry
   * @returns extent
   */
  getCenterByFeature(feature) {
    let extent = []
    if (feature instanceof Feature) {
      extent = feature.getGeometry().getExtent()
    } else if (feature instanceof Geometry) {
      extent = feature.getExtent()
    }
    return [(extent[2] + extent[0]) / 2, (extent[3] + extent[1]) / 2]
  }

  getLengthByLayer(layer) {
    let length = 0
    for (
      let index = 0;
      index < layer.getSource().getFeatures().length;
      index++
    ) {
      const feature = layer.getSource().getFeatures()[index]
      length += getLength(feature.getGeometry(), {
        projection: 'EPSG:4326',
      })
    }
    return length
  }
}

export default VMap
