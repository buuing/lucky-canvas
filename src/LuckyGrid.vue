<template>
  <div ref="luckyGrid"></div>
</template>

<script>
import { LuckyGrid } from 'lucky-canvas'
import { paramsValidator } from '../utils/index.js'
export default {
  props: {
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    cols: {
      type: [String, Number],
      default: 3
    },
    rows: {
      type: [String, Number],
      default: 3
    },
    prizes: {
      type: Array,
      validator (data) {
        return paramsValidator({ prizes: data }, {
          prizes: { x: 1, y: 1, imgs: { src: 1 }, fonts: { text: 1 } }
        })
      },
      default: () => []
    },
    button: {
      type: Object,
      validator (data) {
        return paramsValidator({ button: [data] }, {
          button: { x: 1, y: 1, imgs: { src: 1 }, fonts: { text: 1 } }
        })
      },
    },
    blocks: {
      type: Array,
      validator (data) {
        return paramsValidator({ blocks: data }, {
          blocks: { padding: 1, background: 1 }
        })
      },
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    activeStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    defaultConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    demo: { // demo演示开启中奖标识自动游走
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      $lucky: null,
    }
  },
  watch: {
    prizes: {
      handler (newData, oldData) {
        this.$lucky.prizes = newData
      },
      deep: true,
    },
    button: {
      handler (newData, oldData) {
        this.$lucky.button = newData
      },
      deep: true,
    },
  },
  mounted () {
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
  methods: {
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
  }
}
</script>
