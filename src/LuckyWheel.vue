<template>
  <div ref="luckyWheel"></div>
</template>

<script>
import { LuckyWheel } from 'lucky-canvas'
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
    blocks: {
      type: Array,
      validator (data) {
        return paramsValidator({ blocks: data }, {
          blocks: { padding: 1, background: 1 }
        })
      },
      default: () => []
    },
    prizes: {
      type: Array,
      validator (data) {
        return paramsValidator({ prizes: data }, {
          prizes: { fonts: { text: 1 }, imgs: { src: 1 } }
        })
      },
      default: () => []
    },
    buttons: {
      type: Array,
      validator (data) {
        return paramsValidator({ buttons: data }, {
          buttons: { fonts: { text: 1 }, imgs: { src: 1 } }
        })
      },
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultConfig: {
      type: Object,
      default: () => {
        return {}
      }
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
        this.$lucky.prizes = []
        this.$lucky.prizes = newData
      },
      deep: true
    },
    buttons: {
      handler (newData, oldData) {
        this.$lucky.buttons = []
        this.$lucky.buttons = newData
      },
      deep: true
    },
  },
  mounted () {
    this.$lucky = new LuckyWheel({
      flag: 'WEB',
      width: this.width,
      height: this.height,
      divElement: this.$refs.luckyWheel,
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
