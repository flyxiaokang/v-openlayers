/*
 * @Description:业务类
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-12-27 15:13:32
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-28 14:21:13
 */

import ImageLayer from 'ol/layer/Image'
import ImageCanvasSource from 'ol/source/ImageCanvas'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import {
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  Text,
  Icon,
} from 'ol/style'

import Feature from 'ol/Feature'
import VcUtils from '@/VMap/public/utils/base'
import { getStyle } from '../core/plugins/StyleHandler'
import VMap from '../core/VMap'

export default class OlHandler extends VMap {
  name = 'OlHandler class'
  // 地图容器
  target = ''
  // defaultPolygonStyle = new Style({
  //   fill: new Fill({
  //     color: 'rgba(255, 208, 75, 0.5)',
  //   }),
  // })

  // defaultLineStyle = new Style({
  //   stroke: new Stroke({
  //     color: 'red',
  //     width: 2,
  //   }),
  // })

  // defaultPointStyle = new Style({
  //   image: new CircleStyle({
  //     radius: 7,
  //     fill: new Fill({
  //       color: '#ffcc33',
  //     }),
  //   }),
  // })
  constructor(target = 'ol-map-container') {
    super(target)
    // 图层集合
    this.layerCollection = {}
    // 地图范围
    // this.mapViewExtent = [-180, -90, 180, 90]
    // 业务 图层id
    this.layerIdForBasinBound = 'vectorLayerPoint_wrzoneLayer'
    this.layerIdForHighlight = 'layerId_highlight'
    this.layerIdForAllStations = 'allStationsPointFromSQHS'

    // svg map
    this.svgMap = {}
  }
  getMap() {
    return this.map
  }
  setMap(map) {
    this.map = map
  }

  /**
   * 底图切换切换
   * @param {*} layerIds 图层ids
   */
  toggleBaseLayer(layerIds) {
    this.map
      .getLayers()
      .getArray()
      .forEach((val) => {
        if (val && val.getProperties().id) {
          if (val.getProperties().id.indexOf('baseMap') !== -1) {
            val.setVisible(false)
          }
        }
      })

    this.map
      .getLayers()
      .getArray()
      .forEach((val) => {
        if (val && val.getProperties().id) {
          for (let index = 0; index < layerIds.length; index++) {
            const element = layerIds[index]
            if (val.getProperties().id.indexOf(element) !== -1) {
              val.setVisible(true)
              break
            }
          }
        }
      })
  }

  getGeojsonLayerWithRender() {
    const source = new VectorSource({
      features: getFeaturesFromGeojson(geojson),
    })
    const vectorLayer = new VectorLayer({
      id,
      visible,
      source,
    })
    let layer = this.layerHandler.getUserDefinedXYZ(options)
    this.map.addLayer(layer)
  }

  interpolation(options) {
    let boxExtent = [
      117.57071648609964, 29.612017196294367, 118.56681691790034, 30.1558200567,
    ]
    let { map } = this
    let { id } = options
    this.removeLayerById(id)
    this.removeLayerById(id + '_kri')

    let values = [],
      lngs = [],
      lats = [],
      calcCoords = [],
      interpolationPolygons = []
    const layer = this.layerHandler.getGeojsonLayerWithRender(options)
    layer.getSource().forEachFeature((feature) => {
      values.push(feature.getProperties().testField)
      lngs.push(feature.getGeometry().getCoordinates()[0])
      lats.push(feature.getGeometry().getCoordinates()[1])
      calcCoords.push(feature.getGeometry().getCoordinates())
    })
    interpolationPolygons = [
      [
        [boxExtent[0], boxExtent[1]],
        [boxExtent[0], boxExtent[3]],
        [boxExtent[2], boxExtent[3]],
        [boxExtent[2], boxExtent[1]],
        [boxExtent[0], boxExtent[1]],
      ],
    ]

    map.addLayer(layer)
    // console.log(values, lngs, lats)
    this.drawKriging({
      id,
      values,
      lngs,
      lats,
      interpolationPolygons,
      boxExtent,
    })
  }

  drawKriging({ id, values, lngs, lats, interpolationPolygons, boxExtent }) {
    let { map, kriging } = this
    const params = {
      krigingModel: 'exponential', //model还可选'gaussian','spherical'
      krigingSigma2: 0,
      krigingAlpha: 226,
      canvasAlpha: 0.75, //canvas图层透明度
      colors: [
        '#00A600',
        '#01A600',
        '#03A700',
        '#04A700',
        '#05A800',
        '#07A800',
        '#08A900',
        '#09A900',
        '#0BAA00',
        '#0CAA00',
        '#0DAB00',
        '#0FAB00',
        '#10AC00',
        '#12AC00',
        '#13AD00',
        '#14AD00',
        '#16AE00',
        '#17AE00',
        '#19AF00',
        '#1AAF00',
        '#1CB000',
        '#1DB000',
        '#1FB100',
        '#20B100',
        '#22B200',
        '#23B200',
        '#25B300',
        '#26B300',
        '#28B400',
        '#29B400',
        '#2BB500',
        '#2CB500',
        '#2EB600',
        '#2FB600',
        '#31B700',
        '#33B700',
        '#34B800',
        '#36B800',
        '#37B900',
        '#39B900',
        '#3BBA00',
        '#3CBA00',
        '#3EBB00',
        '#3FBB00',
        '#41BC00',
        '#43BC00',
        '#44BD00',
        '#46BD00',
        '#48BE00',
        '#49BE00',
        '#4BBF00',
        '#4DBF00',
        '#4FC000',
        '#50C000',
        '#52C100',
        '#54C100',
        '#55C200',
        '#57C200',
        '#59C300',
        '#5BC300',
        '#5DC400',
        '#5EC400',
        '#60C500',
        '#62C500',
        '#64C600',
        '#66C600',
        '#67C700',
        '#69C700',
        '#6BC800',
        '#6DC800',
        '#6FC900',
        '#71C900',
        '#72CA00',
        '#74CA00',
        '#76CB00',
        '#78CB00',
        '#7ACC00',
        '#7CCC00',
        '#7ECD00',
        '#80CD00',
        '#82CE00',
        '#84CE00',
        '#86CF00',
        '#88CF00',
        '#8AD000',
        '#8BD000',
        '#8DD100',
        '#8FD100',
        '#91D200',
        '#93D200',
        '#95D300',
        '#97D300',
        '#9AD400',
        '#9CD400',
        '#9ED500',
        '#A0D500',
        '#A2D600',
        '#A4D600',
        '#A6D700',
        '#A8D700',
        '#AAD800',
        '#ACD800',
        '#AED900',
        '#B0D900',
        '#B2DA00',
        '#B5DA00',
        '#B7DB00',
        '#B9DB00',
        '#BBDC00',
        '#BDDC00',
        '#BFDD00',
        '#C2DD00',
        '#C4DE00',
        '#C6DE00',
        '#C8DF00',
        '#CADF00',
        '#CDE000',
        '#CFE000',
        '#D1E100',
        '#D3E100',
        '#D6E200',
        '#D8E200',
        '#DAE300',
        '#DCE300',
        '#DFE400',
        '#E1E400',
        '#E3E500',
        '#E6E600',
        '#E6E402',
        '#E6E204',
        '#E6E105',
        '#E6DF07',
        '#E6DD09',
        '#E6DC0B',
        '#E6DA0D',
        '#E6D90E',
        '#E6D710',
        '#E6D612',
        '#E7D414',
        '#E7D316',
        '#E7D217',
        '#E7D019',
        '#E7CF1B',
        '#E7CE1D',
        '#E7CD1F',
        '#E7CB21',
        '#E7CA22',
        '#E7C924',
        '#E8C826',
        '#E8C728',
        '#E8C62A',
        '#E8C52B',
        '#E8C42D',
        '#E8C32F',
        '#E8C231',
        '#E8C133',
        '#E8C035',
        '#E8BF36',
        '#E9BE38',
        '#E9BD3A',
        '#E9BC3C',
        '#E9BB3E',
        '#E9BB40',
        '#E9BA42',
        '#E9B943',
        '#E9B945',
        '#E9B847',
        '#E9B749',
        '#EAB74B',
        '#EAB64D',
        '#EAB64F',
        '#EAB550',
        '#EAB552',
        '#EAB454',
        '#EAB456',
        '#EAB358',
        '#EAB35A',
        '#EAB35C',
        '#EBB25D',
        '#EBB25F',
        '#EBB261',
        '#EBB263',
        '#EBB165',
        '#EBB167',
        '#EBB169',
        '#EBB16B',
        '#EBB16C',
        '#EBB16E',
        '#ECB170',
        '#ECB172',
        '#ECB174',
        '#ECB176',
        '#ECB178',
        '#ECB17A',
        '#ECB17C',
        '#ECB17E',
        '#ECB27F',
        '#ECB281',
        '#EDB283',
        '#EDB285',
        '#EDB387',
        '#EDB389',
        '#EDB38B',
        '#EDB48D',
        '#EDB48F',
        '#EDB591',
        '#EDB593',
        '#EDB694',
        '#EEB696',
        '#EEB798',
        '#EEB89A',
        '#EEB89C',
        '#EEB99E',
        '#EEBAA0',
        '#EEBAA2',
        '#EEBBA4',
        '#EEBCA6',
        '#EEBDA8',
        '#EFBEAA',
        '#EFBEAC',
        '#EFBFAD',
        '#EFC0AF',
        '#EFC1B1',
        '#EFC2B3',
        '#EFC3B5',
        '#EFC4B7',
        '#EFC5B9',
        '#EFC7BB',
        '#F0C8BD',
        '#F0C9BF',
        '#F0CAC1',
        '#F0CBC3',
        '#F0CDC5',
        '#F0CEC7',
        '#F0CFC9',
        '#F0D1CB',
        '#F0D2CD',
        '#F0D3CF',
        '#F1D5D1',
        '#F1D6D3',
        '#F1D8D5',
        '#F1D9D7',
        '#F1DBD8',
        '#F1DDDA',
        '#F1DEDC',
        '#F1E0DE',
        '#F1E2E0',
        '#F1E3E2',
        '#F2E5E4',
        '#F2E7E6',
        '#F2E9E8',
        '#F2EBEA',
        '#F2ECEC',
        '#F2EEEE',
        '#F2F0F0',
        '#F2F2F2',
      ],
    }
    // let ex = clipgeom.getExtent();
    let ex = boxExtent
    let canvasLayer = null
    if (values.length > 3) {
      let letiogram = kriging.train(
        values,
        lngs,
        lats,
        params.krigingModel,
        params.krigingSigma2,
        params.krigingAlpha
      )

      let grid = kriging.grid(
        interpolationPolygons,
        letiogram,
        (ex[2] - ex[0]) / 200
      )
      //移除已有图层
      if (canvasLayer !== null) {
        map.removeLayer(canvasLayer)
      }
      //创建新图层
      canvasLayer = new ImageLayer({
        id: id + '_kri',
        source: new ImageCanvasSource({
          canvasFunction: (
            extent,
            resolution,
            pixelRatio,
            size,
            projection
          ) => {
            // console.log(extent);
            let canvas = document.createElement('canvas')
            canvas.width = size[0]
            canvas.height = size[1]
            canvas.style.display = 'block'
            //设置canvas透明度
            canvas.getContext('2d').globalAlpha = params.canvasAlpha
            //使用分层设色渲染
            kriging.plot(
              canvas,
              grid,
              [extent[0], extent[2]],
              [extent[1], extent[3]],
              params.colors
            )
            return canvas
          },
          projection: 'EPSG:4326',
        }),
      })
      //向map添加图层
      map.addLayer(canvasLayer)
    } else {
      alert('有效样点个数不足，无法插值')
    }
  }

  getSvg(url, iconOriginColor, color) {
    if (iconOriginColor === color) {
      return url
    }
    const uid = url + color
    if (this.svgMap.hasOwnProperty(uid)) {
      return this.svgMap.uid
    }
    let oReq = new XMLHttpRequest()
    oReq.open('GET', url, false)
    oReq.setRequestHeader('Content-type', 'application/ison;charset=utf-8;')
    // oReq.setRequestHeader('access_token',this.sstore.state.user.token)；
    oReq.send(JSON.stringify()) //发送数据需要自定义，这里发送的是JSON结构
    let xml = oReq.responseText //啊应结果
    xml = xml.replaceAll(iconOriginColor, color)
    const _xml = 'data:image/svg+xml,' + escape(xml)
    this.svgMap[uid] = _xml
    return _xml
  }
  /**
   * 添加图层
   * @param {*} param0
   * @returns layer
   */
  addVectorLayer({
    id = VcUtils.UUIDGenerator(),
    features = [],
    geometries,
    zIndex = 1000,
    visible = true,
    style = {
      image: {},
      stroke: {},
      fill: {},
    },
    map = this.map,
  }) {
    if (geometries) {
      geometries.forEach((geometry) => {
        const feature = new Feature({
          geometry,
        })
        features.push(feature)
      })
    }
    const source = new VectorSource({
      features,
    })
    const vector = new VectorLayer({
      id,
      visible,
      source,
      style: getStyle(style),
    })

    map.addLayer(vector)
    vector.setZIndex(zIndex)
    return vector
  }
}
