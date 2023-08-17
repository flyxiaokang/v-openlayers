/*
 * @Description:全局变量
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 14:30:59
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-27 16:17:33
 */
const TDT_KEY = '718469ef14a862124f30427a38edaec4'
export const TDT_SUBDOMAINS = [0, 1, 2, 3, 4, 5, 6, 7]

// 服务类型
export const MAP_TYPE_ENUM = {
  superMap: 'superMap',
  superMapWmts: 'superMapWmts',
  tdt: 'tdt',
  geoserverWmts: 'geoserverWmts',
  wms: 'wms',
  wmsImage: 'wmsImage',
  wmts: 'wmts',
  tms: 'tms',
  xyz:'xyz',
  wfs: 'wfs',
  arcgis_dynamic: 'arcgis_dynamic',
  arcgis_featureLayer: 'arcgis_featureLayer',
  arcgis_groupLayer: 'arcgis_groupLayer',
  arcgis_mapImage: 'arcgis_mapImage',
  arcgis_mapTile: 'arcgis_mapTile',
  arcgis_wmts: 'arcgis_wmts',
  vectorTiles: 'vectorTiles',
  '3DTileset': '3DTileset',
  bdMap: 'bdMap',
  gdMap: 'gdMap',
  geojson: 'geojson',
  heatMap: 'heatMap',
  clusterMap: 'clusterMap',
}
// 几何类型
export const GEOMETRY_TYPE_ENUM = {
  point: 'Point',
  polyline: 'Polyline',
  polygon: 'Polygon',
  rectangle: 'rectangle',
  circle: 'circle',
}

export const MOUSE_STATUS_ENUM = {
  none: 'none',
  draw: 'draw',
  mesure: 'measure',
  identify: 'identify',
}
// 底图
export const BASE_MAP_ENUM = {
  TDT_IMG_3857:
    'http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4490:
    'http://t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4326:
    'http://t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  TDT_VEC_3857:
    'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4490:
    'http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4326:
    'http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  TDT_TER_3857:
    'http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4490:
    'http://t{s}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4326:
    'http://t{s}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    TDT_KEY +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  OSM_VEC: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  MAPBOX_VEC:
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',

  GD_VEC: 'http://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',

  BD_VEC:
    'http://online1.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
}

export const WGS84 = {
  prj: 'EPSG:4326',
  resolutions: [
    0.7031249999891485, 0.35156250000645817, 0.17578124999134512,
    0.08789062499567256, 0.04394531250972024, 0.02197265625486012,
    0.01098632812743006, 0.00549316406371503, 0.002746582031857515,
    0.0013732910159287575, 6.866454960804162e-4, 3.4332275992417075e-4,
    1.7166136807812276e-4, 8.583068403906138e-5, 4.291534201953069e-5,
    2.1457682893727956e-5, 1.0728841446863978e-5, 5.364420723431989e-6,
    2.6822103617159945e-6, 1.3411051808579973e-6,
  ],
  matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  tileGrid: {
    extent: [-180.0, -90.0, 180.0, 90.0], // 范围
    tileSize: [256, 256],
    origin: [-180.0, 90.0],
  },
}

export const WEB_MERCATOR = {
  prj: 'EPSG:3857',
  resolutions: [
    156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512,
    9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282,
    611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625,
    38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516,
    2.388657133911758, 1.194328566955879, 0.5971642834779395,
  ],
  matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
}

const K_GLOBAL_CONFIG = {
  'EPSG:4326': WGS84,
  'EPSG:3857': WEB_MERCATOR,
  // 地图服务类型
  MAP_TYPE_ENUM,
  // 几何类型
  GEOMETRY_TYPE_ENUM,
  // 常用底图
  BASE_MAP_ENUM,
  TDT_SUBDOMAINS,
  // 超图相关配置
  // SUPER_MAP
}

export default K_GLOBAL_CONFIG
