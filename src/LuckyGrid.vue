<template>
  <div ref="luckyGrid"></div>
</template>

<script>
import { name, version } from '../package.json'
import { LuckyGrid } from 'lucky-canvas'
export default {
  props: {
    width: { type: [String, Number], default: '' },
    height: { type: [String, Number], default: '' },
    cols: { type: [String, Number], default: 3 },
    rows: { type: [String, Number], default: 3 },
    prizes: { type: Array, default: () => [] },
    button: { type: Object },
    blocks: { type: Array, default: () => [] },
    defaultStyle: { type: Object, default () { return {} } },
    activeStyle: { type: Object, default () { return {} } },
    defaultConfig: { type: Object, default: () => { return {} } },
    demo: { type: Boolean, default: false },
  },
  data () {
    return {
      $lucky: null,
    }
  },
  watch: {
    cols (newData, oldData) {
      this.$lucky.cols = newData
    },
    rows (newData, oldData) {
      this.$lucky.rows = newData
    },
    blocks (newData, oldData) {
      this.$lucky.blocks = newData
    },
    prizes (newData, oldData) {
      this.$lucky.prizes = newData
    },
    button (newData, oldData) {
      this.$lucky.button = newData
    },
  },
  mounted () {
    // 添加版本信息到标签上, 方便定位版本问题
    this.$refs.luckyGrid.setAttribute('package', `${name}@${version}`)
    try {
      this.init()
      this.$emit('success')
    } catch (err) {
      this.$emit('error', err)
    } finally {
      this.$emit('finally')
    }
  },
  methods: {
    init () {
      this.$lucky = new LuckyGrid({
        flag: 'WEB',
        width: this.width,
        height: this.height,
        divElement: this.$refs.luckyGrid,
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
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
  }
}
</script>
