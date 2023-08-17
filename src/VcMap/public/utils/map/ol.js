/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-08-09 11:02:16
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-09 11:11:38
 */
import { LineString } from 'ol/geom'

/**
 * 测试点和面是否相交
 * @param {*} line 
 * @param {*} point 
 * @returns boolean
 */
export function testIntersect(line, point) {
  const lineString = new LineString(line)
  return lineString.intersectsCoordinate(point)
}


