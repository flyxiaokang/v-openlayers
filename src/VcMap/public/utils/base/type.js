/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-05-24 13:59:56
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-05-24 13:59:57
 */

const getType = (obj) => Object.prototype.toString.call(obj).slice(8, -1)

export function isArray(obj) {
  return getType(obj) === 'Array'
}

export function isObject(obj) {
  return getType(obj) === 'Object'
}

export function isString(obj) {
  return getType(obj) === 'String'
}

export function isNumber(obj) {
  return getType(obj) === 'Number' && obj === obj
}

export function isRegExp(obj) {
  return getType(obj) === 'RegExp'
}

export function isFile(obj) {
  return getType(obj) === 'File'
}

export function isBlob(obj) {
  return getType(obj) === 'Blob'
}

export function isUndefined(obj) {
  return obj === undefined
}

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function isEmptyObject(obj) {
  return isObject(obj) && Object.keys(obj).length === 0
}

