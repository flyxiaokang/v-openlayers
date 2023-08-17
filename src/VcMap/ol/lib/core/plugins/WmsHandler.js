/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-07 15:51:23
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-23 15:28:58
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
    const url = source.getGetFeatureInfoUrl(
      coordinate,
      viewResolution,
      projection,
      params
    )
    return fetch(url).then((res) => res.json())
  }
}

export default WmsHandler
