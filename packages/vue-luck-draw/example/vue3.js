import { createApp } from 'vue'
import App from './index.vue'
import LuckDraw from '../src/index.js'

console.log('vue3')

const app = createApp(App)

app.use(LuckDraw).mount('#app')
