<template>
  <div ref="luckyWheel" id="luckyWheel"></div>
</template>

<script>
import { LuckyWheel } from 'lucky-canvas'
import pkg from '../package.json'

const name = pkg.name
const version = pkg.version
export default {
  name:'LuckyWheel',
  props: {
    width: { type: [String, Number], default: '' },
    height: { type: [String, Number], default: '' },
    blocks: { type: Array, default: () => [] },
    prizes: { type: Array, default: () => [] },
    buttons: { type: Array, default: () => [] },
    defaultStyle: { type: Object, default: () => { return {} } },
    defaultConfig: { type: Object, default: () => { return {} } },
  },
  data () {
    return {
      $lucky: null,
    }
  },
  watch: {
    blocks (newData, oldData) {
      this.$lucky.blocks = newData
    },
    prizes (newData, oldData) {
      this.$lucky.prizes = newData
    },
    buttons (newData, oldData) {
      this.$lucky.buttons = newData
    },
  },
  mounted () {
    // 添加版本信息到标签上, 方便定位版本问题
    if (this.$refs.luckyWheel) {
      this.$refs.luckyWheel.setAttribute('package', `${name}@${version}`)
    }
    try {
      this.initLucky()
      this.$emit('success')
    } catch (err) {
      this.$emit('error', err)
    } finally {
      this.$emit('finally')
    }
  },
  methods: {
    initLucky () {
      this.$lucky = new LuckyWheel({
        flag: 'WEB',
        width: this.width,
        height: this.height,
        divElement: document.getElementById('luckyWheel'),
        rAF: window.requestAnimationFrame,
        setTimeout: window.setTimeout,
        setInterval: window.setInterval,
        clearInterval: window.clearInterval,
      }, {
        ...this.$props,
        start: (...rest) => {
          this.$emit('start', ...rest)
        },
        end: (...rest) => {
          this.$emit('end', ...rest)
        },
      })
    },
    init () {
      this.$lucky && this.$lucky.init({})
    },
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
  }
}
</script>
