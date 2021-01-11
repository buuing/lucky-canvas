<template>
  <div ref="luckyWheel"></div>
</template>

<script>
import { name, version } from '../package.json'
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
    this.$refs.luckyWheel.setAttribute('package', `${name}@${version}`)
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
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
  }
}
</script>
