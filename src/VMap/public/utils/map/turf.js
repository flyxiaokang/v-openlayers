/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-07-05 09:53:26
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-07-23 17:33:12
 */
import VcUtils from '../base'
import * as turf from '@turf/turf'

/**
 * 获取面的最小外包矩形
 * @param {*} ring 面坐标
 * @returns
 */
export function getEnvelop(ring) {
  const points = []
  ring.forEach((element) => {
    points.push(point(element))
  })
  const features = turf.featureCollection(points)
  var enveloped = turf.envelope(features)
  const [xmin, ymin, xmax, ymax] = enveloped.bbox
  return {
    xmin,
    ymin,
    xmax,
    ymax,
  }
}

/**
 * 缓冲区分析
 * @param {*} geojson geojson
 * @param {*} distance 距离
 * @param {*} units 单位
 * @returns
 */
export function createBuffer(geojson, distance, units = 'miles') {
  const bufferResult = turf.buffer(geojson, distance, {
    units: units,
  })
  return bufferResult
}

/**
 * 指定范围内生成指定数目随机点
 * @param {*} total 总点数
 * @param {*} bbox 范围
 * @returns geojson
 */
export function createPointsFromBox(
  total = 50,
  bbox = [
    117.57071648609964, 29.612017196294367, 118.56681691790034, 30.1558200567,
  ]
) {
  return turf.random.randomPoint(total, {
    bbox,
  })
}

/**
 * 指定范围内生成指定数目带有指定属性的点集
 * @param {*} total 总点数
 * @param {*} bbox 范围
 * @param {*} field 字段名
 * @param {*} options 可选
 * @returns
 */
export function createPointsFromBoxWithProperty(
  total,
  bbox,
  field = 'solRad',
  options = {
    start: 0,
    end: 255,
  }
) {
  let { start, end } = options
  const points = turf.random.randomPoint(total, {
    bbox,
  })
  turf.featureEach(points, (point, index) => {
    point.properties[field] = VcUtils.getRandomFloatNumberByRange(
      start || 0,
      end || 255
    )
  })
  return points
}

/**
 * 插值
 * @param {*} points 散点集
 * @param {*} cellSize 网格大小
 * @param {*} options
 * @returns
 */
export function interpolateFromPoints(
  points,
  cellSize = 1,
  options = {
    gridType: 'points',
    property: 'solRad',
    units: 'miles',
  }
) {
  return turf.interpolate(points, cellSize, options)
}

/**
 * 点分割线
 * @param {*} line 线
 * @param {*} coordinate 分割点
 * @returns
 */
export function lineSplit(line, coordinate) {
  let splitLine = turf.lineString(line)
  let splitter = turf.point(coordinate)
  let split = turf.lineSplit(splitLine, splitter)

  const { features } = split
  if (features.length === 2) {
    const first = features[0].geometry.coordinates
    const second = features[1].geometry.coordinates
    first.pop()
    return {
      success: true,
      coordinates: first.concat(second),
      result: features,
    }
  } else
    return {
      success: false,
      result: features,
    }
}

export function spliceLine(line, startPt, endPt) {
  console.log(line,startPt,endPt)
  var spliceLine = turf.lineString(line)
  var start = turf.point(startPt)
  var stop = turf.point(endPt)
  var sliced = turf.lineSlice(start, stop, spliceLine)
  return sliced
}

export function spliceMultiLine(multiLine, startPt, endPt) {
  for (let index = 0; index < multiLine.length; index++) {
    const line = multiLine[index];
    const sliced = spliceLine(line,startPt,endPt)
    console.log(sliced)
  }
  return sliced
}

export function lineIntersect(line) {
  var line1 = lineString([
    [126, -11],
    [129, -21],
  ])
  var line2 = lineString([
    [123, -18],
    [131, -14],
  ])
  var intersects = lineIntersect(line1, line2)
}

export function booleanContains(line, point) {
  var testLine = lineString(line)
  var testPoint = point(point)
  const a = booleanWithin(testPoint, testLine)
  const b = booleanContains(testLine, testPoint)
  const c = booleanPointOnLine(testPoint, testLine)
  const d = booleanIntersects(testLine, testPoint)
  console.log('within....................................', a, b, c, d)
  return a
}
