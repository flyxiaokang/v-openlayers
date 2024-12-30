/*
 * @Description: wms
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-07 15:51:23
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-25 18:07:00
 */

class WmsHandler {
  constructor(map) {
    this.map = map
  }

  requestWmsFeature(
    map = this.map,
    wmsLayer,
    coordinate,
    projection = 'EPSG:4326',
    options = { INFO_FORMAT: 'application/json' }
  ) {
    const source = wmsLayer.getSource()
    const { layers } = source.getParams()
    const viewResolution = map.getView().getResolution()

    const params = {
      ...options,
      QUERY_LAYERS: layers,
    }
    const url = source.getFeatureInfoUrl(
      coordinate,
      viewResolution,
      projection,
      params
    )
    return fetch(url).then((res) => res.json())
  }

  /**
   * 点查询
   * @param {*} param0 {wmslayer,coordinate,projection,options}
   * @returns geojson
   */
  requestFeatureByPoint({
    layer,
    coordinate,
    projection = 'EPSG:4326',
    options = { INFO_FORMAT: 'application/json' },
  }) {
    const source = layer.getSource()
    const { layers } = source.getParams()
    const viewResolution = this.map.getView().getResolution()
    const params = {
      ...options,
      QUERY_LAYERS: layers,
    }
    const url = source.getFeatureInfoUrl(
      coordinate,
      viewResolution,
      projection,
      params
    )
    return fetch(url).then((res) => res.json())
  }
}

export default WmsHandler
