import { createApp } from 'vue';
import App from './index.vue';
import LuckDraw from '../src/vue3.js';

const app = createApp(App);

app.use(LuckDraw).mount('#app');