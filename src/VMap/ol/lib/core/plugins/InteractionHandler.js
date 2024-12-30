/*
 * @Description: InteractionHandler
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-04-19 13:54:02
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-20 09:34:15
 */

import { Draw, Modify, Snap, Select } from 'ol/interaction'

export default class InteractionHandler {
  step = 0
  historyModifyedGeometry = []
  selectedFeature = null

  snapList = []
  constructor(map, options = {}) {
    this.map = map
    this.layers = options.layers
    this.selectable = false
    this.modifyable = false
    this.select = new Select({
      wrapX: false,
      ...options,
    })
    this.modify = new Modify({
      features: this.select.getFeatures(),
    })
  }

  enableSelect(b = true, callback) {
    const selectChange = (e) => {
      const features = e.selected
      let featureLayer = null
      this.step = 0
      this.selectedFeature = null
      this.historyModifyedGeometry = []
      if (features.length > 0) {
        featureLayer = this.select.getLayer(features[0])
        this.selectedFeature = features[0]
        this.historyModifyedGeometry = [features[0].getGeometry().clone()]
      }
      callback &&
        callback({
          e,
          layer: featureLayer,
          selected: features,
          selectedAllFeatures: this.select.getFeatures().getArray(),
        })
    }
    if (!this.selectable && b) {
      this.select && this.map.addInteraction(this.select)
      this.select.on('select', selectChange)
    } else if (this.selectable && !b) {
      this.select.un('select', selectChange)
      this.select && this.map.removeInteraction(this.select)
    }
    this.selectable = b
  }

  enableModify(b = true, callback) {
    const selectChange = (e) => {
      const { type } = e
      const features = e.selected
      let featureLayer = null
      this.step = 0
      this.selectedFeature = null
      this.historyModifyedGeometry = []
      if (features?.length > 0) {
        featureLayer = this.select.getLayer(features[0])
        this.selectedFeature = features[0]
        this.historyModifyedGeometry = [features[0].getGeometry().clone()]
      } else {
        // callback && callback({ feature: null, type }, e)
      }
      callback &&
        callback({
          e,
          feature: features[0],
          selected: features,
          selectedAllFeatures: this.select.getFeatures().getArray(),
          layer: featureLayer,
          type,
        })
    }

    const modifyChange = (e) => {
      const { type } = e
      const features = e.features.getArray()
      let featureLayer = null
      if (features.length > 0) {
        featureLayer = this.select.getLayer(features[0])
        this.step++
        this.historyModifyedGeometry.push(features[0].getGeometry().clone())
      }

      callback &&
        callback({
          e,
          feature: features[0],
          selected: features,
          selectedAllFeatures: this.select.getFeatures().getArray(),
          layer: featureLayer,
          type,
        })
    }
    if (!this.modifyable && b) {
      this.select && this.map.addInteraction(this.select)
      this.modify && this.map.addInteraction(this.modify)

      this.layers.forEach((layer) => {
        this.addSnap({
          source: layer.getSource(),
        })
      })

      this.select.on('select', selectChange)
      this.select.on('change', selectChange)
      this.modify.on('modifyend', modifyChange)
    } else if (this.modifyable && !b) {
      this.select.un('select', selectChange)
      this.select.un('change', selectChange)
      this.select.un('modifyend', modifyChange)
      this.select && this.map.removeInteraction(this.select)
      this.modify && this.map.removeInteraction(this.modify)

      this.removeAllSnap()
    }
    this.modifyable = b
  }

  enableSnap(b = true) {
    console.log('snap===', b)
    if (b) {
      this.removeAllSnap()
      this.layers.forEach((layer) => {
        this.addSnap({
          source: layer.getSource(),
        })
      })
    } else {
      this.removeAllSnap()
    }
  }

  destorySelect() {
    this.enableSelect(false)
  }

  destoryModify() {
    this.enableModify(false)
  }

  release() {
    this.enableSelect(false)
    this.enableModify(false)
    this.removeAllSnap()
  }

  backward() {
    if (this.step > 0) {
      this.selectedFeature &&
        this.selectedFeature.setGeometry(
          this.historyModifyedGeometry[--this.step]
        )
    }
  }

  forward() {
    if (this.step < this.historyModifyedGeometry.length - 1) {
      this.selectedFeature &&
        this.selectedFeature.setGeometry(
          this.historyModifyedGeometry[++this.step]
        )
    }
  }

  canBackward() {
    if (this.historyModifyedGeometry.length > 1 && this.step > 0) {
      return true
    } else {
      return false
    }
  }

  canForward() {
    if (
      this.historyModifyedGeometry.length > 1 &&
      this.step < this.historyModifyedGeometry.length - 1
    ) {
      return true
    } else {
      return false
    }
  }

  addSnap({ source, features, map = this.map }) {
    const snap = new Snap({
      source,
    })
    map.addInteraction(snap)
    this.snapList.push(snap)
    return snap
  }

  removeSnap(snap, map = this.map) {
    map.removeInteraction(snap)
  }

  removeAllSnap(map = this.map) {
    this.snapList.forEach((snap) => {
      map.removeInteraction(snap)
    })
    this.snapList = []
  }
}
