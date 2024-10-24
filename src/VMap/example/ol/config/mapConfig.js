/*
 * @Description: ol-map-config
 * @Version: 1.0
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-24 15:36:05
 */
import { V_MAP_PROVIDER } from '@/VMap/global'

const mapConfig = {
  prj: 'EPSG:3857',
  defaultView: {
    projection: 'EPSG:3857',
    center: [104.53125000000001, 32.70263671875],
    zoom: 4,
    minZoom: 0,
    maxZoom: 18,
  },
  defaultBaseLayerId: 'tdt-img',
  baseLayers: [
    {
      id: 'tdt-vec',
      label: '矢量',
      type: 'tdt',
      children: [
        {
          id: 'tdt_vec',
          label: '天地图地形',
          visible: true,
          type: 'tdt',
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/vector.jpg',
            import.meta.url
          ).href,
          url: 'http://t{0-7}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
        },
      ],
    },
    {
      id: 'tdt-img',
      label: '影像',
      type: 'tdt',
      children: [
        {
          id: 'TDT_IMG',
          order: '10',
          visible: true,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
        {
          id: 'TDT_IMG_LABEL',
          order: '10',
          visible: true,
          type: V_MAP_PROVIDER.tdt,
          image: new URL(
            '@/VMap/ol/v3/assets/image/baseMap/image.jpg',
            import.meta.url
          ).href,
        },
      ],
    },
    // {
    //   id: 'tdt-ter',
    //   label: '地形',
    //   type: 'tdt',
    //   children: [
    //     {
    //       id: 'tdt_ter',
    //       label: '天地图地形',
    //       visible: true,
    //       type: 'tdt',
    //       image: new URL(
    //         '@/VMap/ol/v3/assets/image/baseMap/terrian.jpg',
    //         import.meta.url
    //       ).href,
    //       url: 'http://t{0-7}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&tk=7688a7a777410e626f6e5730f3fdf384&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&tilecol={x}&tilerow={y}&tilematrix={z}',
    //     },
    //   ],
    // },
    // {
    //   id: 'gaode',
    //   label: '高德',
    //   type: '0',
    //   children: [
    //     {
    //       id: 'amap',
    //       label: '高德',
    //       visible: true,
    //       type: 'gdmap',
    //       image: 'http://10.1.102.189:8000/dyweb/static/img/mapBar/terrian.jpg',
    //       url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    //     },
    //   ],
    // },
  ],
  businessLayers: [
  ],
  toolbar: [
    {
      label: '地图选择',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/arrow.png',
        import.meta.url
      ).href,
      key: 'pointer',
      visible: true,
    },
    {
      label: '放大',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/zoomout.png',
        import.meta.url
      ).href,
      key: 'zoomIn',
      visible: true,
    },
    {
      label: '缩小',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/zoomin.png',
        import.meta.url
      ).href,
      key: 'zoomOut',
      visible: true,
    },
    {
      label: '全图',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/home.png',
        import.meta.url
      ).href,
      key: 'fullExtent',
      visible: true,
    },
    {
      label: '行政区划',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/localed.png',
        import.meta.url
      ).href,
      key: 'xzq',
      visible: false,
    },
    {
      label: '图层',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/layerC.png',
        import.meta.url
      ).href,
      key: 'layer',
      visible: true,
    },
    {
      label: '搜索',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/search123.png',
        import.meta.url
      ).href,
      key: 'search',
      hasChild: true,
      visible: false,
    },
    {
      label: '测距',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/distance-new.png',
        import.meta.url
      ).href,
      key: 'LineString',
      visible: true,
    },
    {
      label: '测面',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/area-new.png',
        import.meta.url
      ).href,
      key: 'Polygon',
      visible: true,
    },
    {
      label: '清除',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/clear.png',
        import.meta.url
      ).href,
      key: 'clear',
      visible: true,
    },
    {
      label: '绘制',
      image: new URL(
        '@/VMap/ol/v3/assets/image/toolbar/draw.png',
        import.meta.url
      ).href,
      key: 'draw',
      visible: true,
    },
  ],
}

export default mapConfig
