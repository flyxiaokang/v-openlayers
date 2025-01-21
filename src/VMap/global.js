/*
 * @Description: 全局变量
 * @Version: 1.0.0
 * @Author: kangjinrui
 * @Date: 2022-01-19 14:30:59
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-01 14:16:37
 */
export const V_THEME = {
  light: 'light',
  dark: 'dark',
  custom: 'custom',
}
// 服务类型
export const V_MAP_PROVIDER = {
  supermap: 'supermap',
  supermapwmts: 'supermapwmts',
  tdt: 'tdt',
  geoserverwmts: 'geoserverwmts',
  wmts: 'wmts',
  tms: 'tms',
  xyz: 'xyz',
  wfs: 'wfs',
  wmsimage: 'wmsimage',
  wmsimagetile: 'wmsimagetile',
  arcgisdynamic: 'arcgisdynamic',
  arcgisfeature: 'arcgisfeature',
  arcgisgroup: 'arcgisgroup',
  arcgisimage: 'arcgisimage',
  arcgisimagetile: 'arcgisimagetile',
  arcgistile: 'arcgistile',
  mvt: 'mvt',
  geoservermvt: 'geoservermvt',
  mapboxmvt:'mapboxmvt',
  '3d-tileset': '3d-tileset',
  bdmap: 'bdmap',
  gdmap: 'gdmap',
  geojson: 'geojson',
  heatmap: 'heatmap',
  clustermap: 'clustermap',
}
// 几何类型
export const V_GEO_TYPE = {
  point: 'Point',
  polyline: 'Polyline',
  polygon: 'Polygon',
  rectangle: 'rectangle',
  circle: 'circle',
  billboard: 'billboard',
}
// 鼠标状态
export const V_MOUSE_STATUS = {
  none: 'none',
  draw: 'draw',
  mesure: 'measure',
  identify: 'identify',
}

export const V_TDT = {
  token: '718469ef14a862124f30427a38edaec4',
  subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
}
// 底图
export const V_BASE_MAP = {
  TDT_IMG_3857:
    'http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4490:
    'http://t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4326:
    'http://t{s}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_IMG_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  TDT_VEC_3857:
    'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4490:
    'http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4326:
    'http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_VEC_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  TDT_TER_3857:
    'http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_3857_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4490:
    'http://t{s}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4490_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4326:
    'http://t{s}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',
  TDT_TER_4326_LABEL:
    'http://t{s}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&tk=' +
    V_TDT.token +
    '&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}',

  OSM_VEC: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  MAPBOX_VEC:
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',

  GD_VEC: 'http://webst01.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',

  BD_VEC:
    'http://online1.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
}

export const V_WGS84 = {
  prj: 'EPSG:4326',
  resolutions: [
    0.7031249999891485, 0.35156250000645817, 0.17578124999134512,
    0.08789062499567256, 0.04394531250972024, 0.02197265625486012,
    0.01098632812743006, 0.00549316406371503, 0.002746582031857515,
    0.0013732910159287575, 6.866454960804162e-4, 3.4332275992417075e-4,
    1.7166136807812276e-4, 8.583068403906138e-5, 4.291534201953069e-5,
    2.1457682893727956e-5, 1.0728841446863978e-5, 5.364420723431989e-6,
    2.6822103617159945e-6, 1.3411051808579973e-6, 6.705522537231445e-7,
    3.3527612686157227e-7,
  ],
  matrixIds: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21,
  ],
  // origin: [113.45458390127169, 42.616298557469264],
  tileGrid: {
    extent: [-180.0, -90.0, 180.0, 90.0], // 范围
    tileSize: [256, 256],
    origin: [-180.0, 90.0],
  },
}

export const V_WEB_MECATOR = {
  prj: 'EPSG:3857',
  resolutions: [
    156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512,
    9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282,
    611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625,
    38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516,
    2.388657133911758, 1.194328566955879, 0.5971642834779395,
  ],
  matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  tileGrid: {
    tileSize: [256, 256],
    origin: [-2.003750834e7, 2.003750834e7],
  },
}

export function getTdtUrl({
  mapStyle = 'TDT_IMG',
  prj = '4326',
  token = V_TDT.token,
  isCesium = false,
}) {
  if (isCesium) {
    return getTdtUrlForCesium({ mapStyle, prj, token })
  }
  if (token === '') {
    token = V_TDT.token
  }
  prj = prj.replace('EPSG:', '').replace('epsg:', '').trim()
  mapStyle = mapStyle.toUpperCase()
  let url =
    V_BASE_MAP[`${mapStyle.toUpperCase()}_${prj}`] ||
    V_BASE_MAP[`${mapStyle.toUpperCase().replace('_LABEL', '')}_${prj}_LABEL`]
  if (url) {
    return url
      .replace(V_TDT.token, token)
      .replace('{level}', '{z}')
      .replace('{row}', '{y}')
      .replace('{col}', '{x}')
      .replace('{s}', '{0-7}')
  } else {
    return ''
  }
}

export function getTdtUrlForCesium({
  mapStyle = 'TDT_IMG',
  prj = '4326',
  token = V_TDT.token,
}) {
  if (token === '') {
    token = V_TDT.token
  }
  prj = prj.replace('EPSG:', '').replace('epsg:', '').trim()
  let url =
    V_BASE_MAP[`${mapStyle.toUpperCase()}_${prj}`] ||
    V_BASE_MAP[`${mapStyle.toUpperCase().replace('_LABEL', '')}_${prj}_LABEL`]
  if (url) {
    return url
      .replace(V_TDT.token, token)
      .replace('{level}', '{TileMatrix}')
      .replace('{row}', '{TileRow}')
      .replace('{col}', '{TileCol}')
  } else {
    return ''
  }
}

const V_MAP_GLOBAL = {
  'EPSG:4326': V_WGS84,
  'EPSG:3857': V_WEB_MECATOR,
  V_MAP_PROVIDER,
  V_GEO_TYPE,
  V_BASE_MAP,
}

export default V_MAP_GLOBAL

