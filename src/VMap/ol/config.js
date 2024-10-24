/*
 * @Description: 地图初始化配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-24 14:56:59
 */
// import config from './lib/config/wgs84.config'
// import config from './lib/config/webMecator.config'
import config from './lib/config/default.config'

let mapConfig = config

export function getConfig() {
  return mapConfig
}

export function setConfig(config = null) {
  mapConfig = {
    ...mapConfig,
    ...config,
  }
}

export let isWebmocat = mapConfig.prj === 'EPSG:3857'
export let isWgs84 = mapConfig.prj === 'EPSG:4326'
