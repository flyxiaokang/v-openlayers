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
