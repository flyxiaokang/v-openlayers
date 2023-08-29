/*
 * @Description: 配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-29 14:28:23
 */
import { V_MAP_TYPE_ENUM } from '@/VMap/global'

const mapConfig = {
  prj: 'EPSG:3857',
  defaultView: {
    projection: 'EPSG:3857',
    center: [11625334.503535366, 4481638.598281061],
    zoom: 4,
    minZoom: 0,
    maxZoom: 18,
    // extent: [6641067.700434342, 1578660.3800583663, 16784746.0169865, 7331575.082445804]
  },
  // mapExtent: [6641067.700434342, 1578660.3800583663, 16784746.0169865, 7331575.082445804],
  xzqdm: '000000', // 用于判断不同省份，地图添加遮罩层
  defaultBaseMapId: 'tdt_vec',
  baseLayers: [
    {
      id: '1',
      label: '矢量',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_vec',
          label: '天地图矢量',
          children: [
            {
              id: 'tdt_vec_w',
              visible: true,
              image: new URL(
                '../../v3/assets/image/baseMap/vector.jpg',
                import.meta.url
              ).href,
              url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
              type: V_MAP_TYPE_ENUM.tdt,
            },
          ],
        },
        {
          id: 'tdt_vec2',
          label: '天地图矢量',
          children: [
            {
              id: 'tdt_vec_w2',
              visible: true,
              image: new URL(
                '../../v3/assets/image/baseMap/vector.jpg',
                import.meta.url
              ).href,
              url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
              type: V_MAP_TYPE_ENUM.tdt,
            },
          ],
        },
      ],
    },
    {
      id: '2',
      label: '影像',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_img',
          label: '天地图影像',
          children: [
            {
              id: 'tdt_img_w',
              visible: false,
              image: new URL(
                '../../v3/assets/image/baseMap/vector.jpg',
                import.meta.url
              ).href,
              url: 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
              type: V_MAP_TYPE_ENUM.tdt,
            },
          ],
        },
      ],
    },
    {
      id: '3',
      label: '影像',
      type: 'layerGroup',
      children: [
        {
          id: 'tdt_ter',
          label: '天地图地形',
          children: [
            {
              id: 'tdt_ter_w',
              visible: false,
              image: new URL(
                '../../v3/assets/image/baseMap/terrain.jpg',
                import.meta.url
              ).href,
              url: 'http://t{0-7}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
              type: V_MAP_TYPE_ENUM.tdt,
            },
          ],
        },
      ],
    },
  ],

  businessLayers: [],

  toolbar: [
    {
      label: '地图选择',
      image: new URL('../../v3/assets/image/toolbar/arrow.png', import.meta.url)
        .href,
      key: 'pointer',
      visible: true,
    },
    {
      label: '放大',
      image: new URL(
        '../../v3/assets/image/toolbar/zoomin.png',
        import.meta.url
      ).href,
      key: 'zoomIn',
      visible: true,
    },
    {
      label: '缩小',
      image: new URL(
        '../../v3/assets/image/toolbar/zoomout.png',
        import.meta.url
      ).href,
      key: 'zoomOut',
      visible: true,
    },
    {
      label: '全图',
      image: new URL('../../v3/assets/image/toolbar/home.png', import.meta.url)
        .href,
      key: 'fullExtent',
      visible: true,
    },
    {
      label: '行政区划',
      image: new URL(
        '../../v3/assets/image/toolbar/localed.png',
        import.meta.url
      ).href,
      key: 'xzq',
      visible: false,
    },
    // {
    //   label: '图层',
    //   image: new URL(
    //     '../../v3/assets/image/toolbar/layerC.png',
    //     import.meta.url
    //   ).href,
    //   key: 'layer',
    //   visible: true,
    // },
    {
      label: '搜索',
      image: new URL(
        '../../v3/assets/image/toolbar/search123.png',
        import.meta.url
      ).href,
      key: 'search',
      hasChild: true,
      visible: false,
      handler: 'handleSearch',
    },
    {
      label: '测距',
      image: new URL(
        '../../v3/assets/image/toolbar/distance-new.png',
        import.meta.url
      ).href,
      key: 'LineString',
      visible: true,
    },
    {
      label: '测面',
      image: new URL(
        '../../v3/assets/image/toolbar/area-new.png',
        import.meta.url
      ).href,
      key: 'Polygon',
      visible: true,
    },
    // {
    //   label: '绘制',
    //   image: new URL('../../v3/assets/image/toolbar/draw.png', import.meta.url)
    //     .href,
    //   key: 'draw',
    //   visible: true,
    // },
    {
      label: '清除',
      image: new URL('../../v3/assets/image/toolbar/clear.png', import.meta.url)
        .href,
      key: 'clear',
      visible: true,
    },
  ],
}

export default mapConfig
