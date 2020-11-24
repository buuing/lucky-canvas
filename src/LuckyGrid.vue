<template>
  <div ref="luckDraw" style="overflow: hidden"></div>
</template>

<script>
import { LuckyGrid } from 'lucky-canvas'
import { paramsValidator } from '../utils/index.js'
export default {
  props: {
    // 奖品 (该属性被watch监听)
    prizes: {
      type: Array,
      validator (data) {
        return paramsValidator({ prizes: data }, {
          prizes: { x: 1, y: 1, imgs: { src: 1 }, fonts: { text: 1 } }
        })
      },
      default: () => []
    },
    // 按钮 (该属性被watch监听)
    button: {
      type: Object,
      validator (data) {
        return paramsValidator({ button: [data] }, {
          button: { x: 1, y: 1, imgs: { src: 1 }, fonts: { text: 1 } }
        })
      },
    },
    // 边框 (该属性被watch监听)
    blocks: {
      type: Array,
      validator (data) {
        return paramsValidator({ blocks: data }, {
          blocks: { padding: 1, background: 1 }
        })
      },
      default: () => []
    },
    // 格子的默认样式 (该属性会在computed里面进行修正)
    defaultStyle: {
      type: Object,
      default () { // 默认配置在computed里面: _defaultStyle
        return {}
      }
    },
    // 中奖标记样式 (该属性会在computed里面进行修正)
    activeStyle: {
      type: Object,
      default () { // 默认配置在computed里面: _activeStyle
        return {}
      }
    },
    // 默认配置 (该属性会在computed里面进行修正)
    defaultConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 横向等分成 cols 个格子
    cols: { type: [String, Number], default: 3 },
    // 纵向等分成 rows 个格子
    rows: { type: [String, Number], default: 3 },
    // demo演示开启中奖标识自动游走
    demo: { type: Boolean, default: false },
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
      deep: true,
    },
    button: {
      handler (newData, oldData) {
        this.lucky.button = newData
      },
      deep: true,
    },
  },
  mounted () {
    this.lucky = new LuckyGrid(this.$refs.luckDraw, {
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
