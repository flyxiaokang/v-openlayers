/*
 * @Description: popup
 * @Version:
 * @Author: kangjinrui
 * @Date: 2023-09-05 23:06:34
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-09-06 17:17:40
 */
import { V_THEME } from '@/VMap/global'

export const useProps = {
  theme: {
    type: String,
    default: V_THEME.light,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '属性',
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  tableHeight: {
    type: Number,
    default: 200,
  },
  tableHeader: {
    type: Array,
    default() {
      return [
        {
          label: '属性',
          value: 'label',
        },
        {
          label: '值',
          value: 'value',
        },
      ]
    },
  },
}
