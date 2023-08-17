/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-18 11:15:43
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-01-18 11:42:47
 */
export function mix(...mixins) {
  class Mix {
    constructor(...ags) {
      for (const mixin of mixins) {
        copyProperties(this, new mixin(...ags)) // 拷贝实例属性
      }
    }
  }

  for (const mixin of mixins) {
    copyProperties(Mix, mixin) // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
  }

  return Mix
}

function copyProperties(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' &&
        key !== 'prototype' &&
        key !== 'name'
    ) {
      const desc = Object.getOwnPropertyDescriptor(source, key)
      Object.defineProperty(target, key, desc)
    }
  }
}

