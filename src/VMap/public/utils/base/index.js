/*
 * @Description:常用方法集
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-21 13:54:52
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-17 15:45:51
 */
import Utils from './utils'
import * as TypeCheckUtils from './type'
import * as Validate from './validate'
import * as Common from './common'
import * as DateFormat from './date'
import * as StringUtils from './string'

const VcUtils = {
  ...Utils,
  ...TypeCheckUtils,
  ...Validate,
  ...Common,
  ...StringUtils,
  Date: {
    ...DateFormat,
  },
}

export default VcUtils
