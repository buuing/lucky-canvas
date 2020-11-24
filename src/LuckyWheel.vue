<template>
  <div ref="luckDraw" style="overflow: hidden"></div>
</template>

<script>
import { LuckyWheel } from 'lucky-canvas'
import { paramsValidator } from '../utils/index.js'
export default {
  props: {
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
      lucky: null,
    }
  },
  watch: {
    prizes: {
      handler (newData, oldData) {
        this.lucky.prizes = newData
      },
      deep: true
    },
    buttons: {
      handler (newData, oldData) {
        this.lucky.buttons = newData
      },
      deep: true
    },
  },
  mounted () {
    this.lucky = new LuckyWheel(this.$refs.luckDraw, {
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
      this.lucky.play(...rest)
    },
    stop (...rest) {
      this.lucky.stop(...rest)
    },
  }
}
</script>
