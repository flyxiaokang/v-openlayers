/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 11:35:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-29 13:50:09
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import installElementPlus from './plugins/element'

// import 'v-openlayers/package/style.css'
// import installVc  from 'v-openlayers'

const app = createApp(App)
installElementPlus(app)
// installVc(app)
app.mount('#app')
