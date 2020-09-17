<template>
  <div ref="luckDraw" style="overflow: hidden">
    <canvas></canvas>
  </div>
</template>

<script>
import { isExpectType, getAngle, getLength } from './utils.js'
export default {
  props: {
    blocks: {
      type: Array,
      default: () => [
        { padding: '4px', background: '#ede7c9' },
        { padding: '20px', background: '#b01c2c' },
        { padding: '4px', background: '#ede7c9' },
      ]
    },
    prizes: {
      type: Array,
      default: () => [
        { fonts: [{ text: '10元\n红包' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '88元\n红包' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '100元\n红包' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '188元\n红包' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '233元\n红包' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '666元\n红包' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '999元\n红包' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '0.88元\n红包' }], background: '#b01c2c', top: '10%', lineHeight: '35px' }
      ]
    },
    buttons: {
      type: Array,
      default: () => [
        { radius: '44px', background: '#ede7c9' },
        { radius: '40px', background: '#b21d30' },
      ]
    },
    defaultStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      ctx: null
    }
  },
  computed: {
    _defaultStyle () {
      const style = {
        fontSize: '30px',
        fontColor: '#fff',
        fontStyle: 'STHeiti, SimHei',
        prizeGutter: '0px',
      }
      style.lineHeight = style.fontSize
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      return style
    }
  },
  mounted () {
    this.dpr = window.devicePixelRatio || 2
    this.init()
    window.addEventListener('resize', this.init.bind(this))
  },
  methods: {
    init () {
      const { dpr } = this
      const box = this.$refs.luckDraw
      if (!box) return false
      const canvas = this.$refs.luckDraw.childNodes[0]
      this.ctx = canvas.getContext('2d')
      canvas.width = canvas.height = box.offsetWidth * dpr
      this.Radius = canvas.width / 2
      // 根据dpr缩放canvas, 并处理位移
      const transferLength = len => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
      canvas.style = `transform: scale(${1 / dpr}) translate(
        ${-transferLength(this.Radius)}%,
        ${-transferLength(this.Radius)}%
      )`
      // 
      this.ctx.translate(this.Radius, this.Radius)
      this.draw()
    },
    draw () {
      const { ctx, dpr, _defaultStyle } = this
      this.prizeRadius = this.blocks.reduce((radius, block) => {
        ctx.beginPath()
        ctx.fillStyle = block.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        return radius - getLength(block.padding)
      }, this.Radius)

      let prizeDegrees = 360 / this.prizes.length

      this.prizes.forEach((prize, index) => {
        // 绘制背景
        ctx.beginPath()
        ctx.fillStyle = prize.background
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, this.prizeRadius, getAngle(270 - prizeDegrees / 2), getAngle(270 + prizeDegrees / 2), false)
        ctx.fill()
        // 逐行绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.fillStyle = _defaultStyle.fontColor
            ctx.font = _defaultStyle.fontSize + ' ' + _defaultStyle.fontStyle
            ctx.fillText(
              line,
              this.getOffsetX(ctx.measureText(line).width),
              -this.prizeRadius + this.getHeight(prize.top) + (lineIndex + 1) * getLength(prize.lineHeight || _defaultStyle.lineHeight)
            )
          })
        })
        // 旋转prize奖品
        ctx.rotate(getAngle(prizeDegrees))
      })
      // 绘制按钮
      this.buttons.forEach((btn, btnIndex) => {
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.arc(0, 0, this.getHeight(btn.radius), 0, Math.PI * 2, false)
        ctx.fill()
      })
      // this.buttons
    },
    getHeight (length) {
      if (isExpectType(length, 'number')) return length
      if (isExpectType(length, 'string')) return length.includes('%')
        ? length.slice(0, -1) / 100 * this.prizeRadius
        : ~~length.replace(/px/g, '')
      return 0
    },
    // 获取相对(居中)X坐标
    getOffsetX (width) {
      return -width / 2
    },
  }
}
</script>
