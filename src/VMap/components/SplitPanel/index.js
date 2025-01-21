/*
 * @Description: 分割面板组件
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-11-18 11:05:38
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-11-18 11:11:13
 */

import component from './index.vue'

component.install = (Vue,name = component.name) => {
    Vue.component(name, component)
}

export default component