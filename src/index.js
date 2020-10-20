import LuckDraw from './LuckDraw.vue'
import LuckyGrid from './LuckyGrid.vue'
import LuckyWheel from './LuckyWheel.vue'

const install = (Vue, options) => {
  Vue.component('LuckDraw', LuckDraw)
  Vue.component('LuckyGrid', LuckyGrid)
  Vue.component('LuckyWheel', LuckyWheel)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install }
export { LuckyGrid, LuckyWheel }
