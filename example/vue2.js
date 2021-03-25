import Vue from 'vue';
import App from './index.vue';
import LuckDraw from '../src/vue2.js';

Vue.use(LuckDraw)

new Vue({
  render: h => h(App)
}).$mount('#app');