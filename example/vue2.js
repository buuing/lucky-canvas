import Vue from 'vue';
import App from './index.vue';
import LuckDraw from '../src/index.js';

console.log('vue2')

Vue.use(LuckDraw)

new Vue({
  render: h => h(App)
}).$mount('#app');