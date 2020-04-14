import LuckDraw from './LuckDraw'

const install = (Vue, options) => {
  Vue.component('LuckDraw', LuckDraw)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install }
