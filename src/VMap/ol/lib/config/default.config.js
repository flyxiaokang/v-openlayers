/*
 * @Description: 配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-06-28 10:56:22
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
  defaultBaseLayerId: 'amap',
  baseLayers: [
    {
      id: '1',
      label: '高德',
      type: V_MAP_PROVIDER.gdmap,
      children: [
        {
          id: 'amap',
          label: '高德',
          visible: true,
          type: V_MAP_PROVIDER.gdmap,
          image: new URL(
            '../../v3/assets/image/baseMap/vector.jpg',
            import.meta.url
          ).href,
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        },
      ],
    },
  ],
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
