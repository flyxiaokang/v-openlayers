/*
 * @Description: 地图初始化配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-29 11:08:29
 */
import config from './lib/config/wgs84.config'
// import config from './lib/config/myConfig-ol-3857'

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
