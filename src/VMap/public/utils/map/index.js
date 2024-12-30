/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-07 17:10:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-28 14:49:25
 */
import * as turfJs from './turf.js'
import * as ol from './ol.js'
import * as trans from './transform.js'

const VcMapUtils = {
  ...turfJs,
  ...ol,
  ...trans
}

export default VcMapUtils