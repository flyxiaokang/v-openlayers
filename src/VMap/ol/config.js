/*
 * @Description: 地图初始化配置文件
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-19 09:44:36
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-28 15:50:40
 */
import config from './lib/config/wgs84.config'
// import config from './lib/config/webMecator.config'

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
