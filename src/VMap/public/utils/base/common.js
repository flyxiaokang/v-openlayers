/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-05-24 14:04:46
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-11 15:58:39
 */

/**
 * 加载样式文件
 * @param {*} url 样式地址
 */
export function loadStyles(url) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = url
  document.getElementsByTagName('head')[0].appendChild(link)
}

/**
 * 获取请求地址指定参数值
 * @param {*} url 地址
 * @param {*} name 查询参数
 * @returns
 */
export function getQueryValueByUrl(url, name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const result = url.split('?')[1].match(reg)
  if (result != null) {
    return decodeURI(result[2])
  } else {
    return null
  }
}

/**
 * 按指定属性分组
 * @param {*} arr 数组
 * @param {*} groupId 分组id
 * @returns 数组
 */
export function groupBy(arr = [], groupId = 'id') {
  const map = {}
  // arr = [{
  // 		id: '1001',
  // 		name: '值1',
  // 		value: '111'
  // 	}
  // 	{
  // 		id: '1001',
  // 		name: '值2',
  // 		value: '2315432'
  // 	}
  // 	{
  // 		id: null,
  // 		name: '值3',
  // 		value: '333333'
  // 	}
  // 	{
  // 		id: null,
  // 		name: '值3',
  // 		value: '333333'
  // 	}
  // ]
  for (let i = 0; i < arr.length; i++) {
    const ai = arr[i]
    if (!map[ai[groupId]]) {
      map[ai[groupId]] = [ai]
    } else {
      map[ai[groupId]].push(ai)
    }
  }
  const res = []
  Object.keys(map).forEach((key) => {
    res.push({
      id: key,
      data: map[key],
    })
  })
  return res
}

/**
 * tree 2 list
 * @param {*} treeList tree
 * @param {*} list list
 * @returns 数组
 */
export function tree2list(treeList, list) {
  if (!treeList || !treeList.length) {
    return
  }
  for (let i = 0; i < treeList.length; i++) {
    const currentRow = treeList[i]
    const newRow = JSON.parse(JSON.stringify(currentRow))
    newRow.children = undefined
    list.push(newRow)
    tree2list(currentRow.children, list)
  }
}

/**
 * 获取request地址请求参数
 * @param {*} url request地址
 * @returns 对象
 */
export function parasUrlParams2Obj(url) {
  // const array = url.split('?')
  // if (array.length > 1) {
  //     const obj = {}
  //     const paramsArray = array[1].split('&')
  //     paramsArray.forEach(element => {
  //         const paramArray = element.split('=')
  //         if (paramArray.length > 1) {
  //             obj[paramArray[0]] = paramArray[1]
  //         }
  //     })
  //     return obj
  // } else {
  //     return {}
  // }

  let array = url.split('?')
  if (array.length > 1) {
    let obj = {}
    let paramsArray = array[1].split('&')
    paramsArray.forEach((element) => {
      let paramArray = element.split('=')
      let index = element.indexOf('=')
      obj[paramArray[0]] = element.substring(index + 1)
    })
    return obj
  } else {
    return {}
  }
}

//获取两个数之间随机数
export function getRandomIntNumberByRange(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

//获取两个数之间随机数
export function getRandomFloatNumberByRange(start, end) {
  return Math.random() * (end - start) + start
}

export function csv2Array(str) {
  let csvArr = str.split(/[(\r\n)\r\n]+/)
  csvArr.forEach((item, index) => {
    if (!item) {
      snsArr.splice(index, 1) //删除空项
    }
  })
  return csvArr
}

export function object2Array(properties) {
  const attributes = []
  for (const key in properties) {
    if (Object.hasOwnProperty.call(properties, key)) {
      const element = properties[key]
      // console.log("key...", key, element);
      if (typeof element !== 'object') {
        attributes.push({
          label: key,
          value: element,
        })
      }
    }
  }
  return attributes
}

/**
 * 拷贝对象（深度）
 * @param {*} obj 拷贝的对象
 * @returns
 */
export function deepClone(obj = {}) {
  // 判断传入方法是否是对象类型的数据，如果是非对象，直接执行 for 循环的赋值操作
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let result
  // 判断需要操作数据是否为数组，然后初始化 result 类型用户承载
  if (obj instanceof Array) {
    result = []
  } else {
    result = {}
  }
  for (const key in obj) {
    // 优化处理拷贝的对象是原对象自身的属性，原型属性不进行拷贝
    if (obj.hasOwnProperty(key)) {
      // 递归调用自己，直到传给 deepClone 方法是个原始类型的值
      result[key] = deepClone(obj[key])
    }
  }
  return result
}

export function setUuidForTree(treeList, idStr = 'uid', childStr = 'children') {
  for (let i = 0; i < treeList.length; i++) {
    let currentRow = treeList[i]
    currentRow[idStr] = 'id_' + parseInt(Math.random() * 10000000000000)
    if (currentRow.children) {
      Array.loopTree(currentRow.children)
    }
  }
}

export function getRandomNum(min = 0, max = 100) {
  var Range = max - min
  var Rand = Math.random()
  var num = min + Math.round(Rand * Range) //四舍五入
  return num
}

export function isNullOrUndifiend(obj) {
  if (obj === null || typeof obj === 'undefined') {
    return true
  } else return false
}

export function pushNoReapeat(arr, item, isAdd) {
  if (item && isAdd && !arr.includes(item)) {
    arr.push(item)
  } else if (!isAdd) {
    removeArrayItem(arr, item)
  }
}

export function removeArrayItem(arr, item) {
  var i = 0
  while (i < arr.length) {
    if (arr[i] == item) {
      arr.splice(i, 1)
    } else {
      i++
    }
  }
  return arr
}

/**
 * 数组去重
 * @param {*} arr 数组
 * @returns 去重后的数组
 */
export function removeRepeat(arr) {
  let stringArray = arr.map(JSON.stringify)
  let uniqueStringArray = [...new Set(stringArray)]
  let uniqueArray = uniqueStringArray.map(JSON.parse)
  return uniqueArray
}

export function getRandomRgb() {
  return `rgba(${parseInt(Math.random() * 255)},${parseInt(
    Math.random() * 255
  )},${parseInt(Math.random() * 255)})`
}

export function getRandomRgba(a = 1) {
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  return `rgba(${r},${g},${b},${a})`
}

export function getRandomColor(bRgb) {
  let arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ]
  if (bRgb) {
    let str = '#'
    for (let i = 0; i < 6; i++) {
      let random = Math.floor(Math.random() * arr.length)
      str += arr[random]
    }
    return str
  } else {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)
    return `rgb(${r},${g},${b})`
  }
}
