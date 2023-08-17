import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import installElementPlus from './plugins/element'

const app = createApp(App)
installElementPlus(app)
app.mount('#app')
