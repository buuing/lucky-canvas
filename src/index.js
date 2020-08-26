import LuckDraw from './LuckDraw.vue'
import LuckyGrid from './LuckyGrid.vue'

const install = (Vue, options) => {
  Vue.component('LuckDraw', LuckDraw)
  Vue.component('LuckyGrid', LuckyGrid)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install }
