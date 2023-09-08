/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-09-04 11:04:45
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-04 13:39:19
 */
import { computed } from 'vue'

export const useProps = {
  position: {
    type: String,
    default: 'top-right',
  },
  offset: {
    type: Array,
    default() {
      return [0, 0]
    },
  },
}

export const useEmits = ['change']

export const usePosition = ({position,offset}) => {
  return computed(() => {
    const a = {}
    const [p1, p2] = position.value.split('-')
    a[p1] = 20 + offset.value[1] + 'px'
    a[p2] = 20 + offset.value[0] + 'px'
    return {
      ...a,
      position: 'absolute',
    }
  })
}
