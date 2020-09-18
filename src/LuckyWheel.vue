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
        { fonts: [{ text: '0' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '1' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '2' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '3' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '4' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '5' }], background: '#b01c2c', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '6' }], background: '#135458', top: '10%', lineHeight: '35px' },
        { fonts: [{ text: '7' }], background: '#b01c2c', top: '10%', lineHeight: '35px' }
      ]
    },
    buttons: {
      type: Array,
      default: () => [
        { radius: '50px', background: '#ede7c9' },
        { radius: '45px', background: '#b21d30' },
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
      ctx: null,
      canPlay: true,
      rotateDeg: 0,
      prizesMiddleDeg: []
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
      // 设置坐标点
      this.ctx.translate(this.Radius, this.Radius)
      // 给buttons进行排序
      
      // 开始绘制
      this.draw()
      canvas.addEventListener('click', e => {
        this.$emit('start', e)
      })
    },
    draw () {
      const { ctx, dpr, _defaultStyle } = this
      // 清空画布
      this.ctx.clearRect(-this.Radius, -this.Radius, this.Radius * 2, this.Radius * 2)
      // 绘制blocks边框
      this.prizeRadius = this.blocks.reduce((radius, block) => {
        ctx.beginPath()
        ctx.fillStyle = block.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        return radius - getLength(block.padding)
      }, this.Radius)
      // 计算奖品的角度
      this.prizeDeg = 360 / this.prizes.length
      let prizeRadian = getAngle(this.prizeDeg)
      let start = getAngle(-90 + this.rotateDeg)
      // 绘制prizes奖品区域
      this.prizes.forEach((prize, index) => {
        // 计算当前奖品区域中间坐标点
        let currMiddleDeg = start + index * prizeRadian
        // 绘制背景
        ctx.beginPath()
        ctx.fillStyle = prize.background
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, this.prizeRadius, currMiddleDeg - prizeRadian / 2, currMiddleDeg + prizeRadian / 2, false)
        ctx.fill()
        // 计算临时坐标并旋转文字
        let x = Math.cos(currMiddleDeg) * this.prizeRadius
        let y = Math.sin(currMiddleDeg) * this.prizeRadius
        ctx.translate(x, y)
        ctx.rotate(currMiddleDeg + getAngle(90))
        // 逐行绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.fillStyle = _defaultStyle.fontColor
            ctx.font = _defaultStyle.fontSize + ' ' + _defaultStyle.fontStyle
            ctx.fillText(
              line,
              this.getOffsetX(ctx.measureText(line).width),
              this.getHeight(prize.top) + (lineIndex + 1) * getLength(font.lineHeight || _defaultStyle.lineHeight)
            )
          })
        })
        // 修正旋转角度和原点坐标
        ctx.rotate(getAngle(360) - currMiddleDeg - getAngle(90))
        ctx.translate(-x, -y)
      })
      // 绘制按钮
      this.buttons.forEach((btn, btnIndex) => {
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.arc(0, 0, this.getHeight(btn.radius), 0, Math.PI * 2, false)
        ctx.fill()
        // 绘制指针
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.moveTo(-this.getHeight(btn.radius) / 2, 0)
        ctx.lineTo(this.getHeight(btn.radius) / 2, 0)
        ctx.lineTo(0, -this.getHeight(btn.radius) * 2)
        ctx.closePath()
        ctx.fill()
      })
    },
    play () {
      if (!this.canPlay) return false
      cancelAnimationFrame(this.animationId)
      this.prizeFlag = undefined
      this.canPlay = false
      this.speed = 0
      this.run()
    },
    run () {
      if (this.prizeFlag !== undefined) {
        if (
          this.rotateDeg % 360 > this.prizeFlag * this.prizeDeg
          && this.rotateDeg % 360 < this.prizeFlag * this.prizeDeg + this.prizeDeg
        ) return this.slowDown()
      }
      if (this.speed < 15) this.speed += 0.1
      this.rotateDeg += this.speed
      this.draw()
      this.animationId = window.requestAnimationFrame(this.run)
    },
    stop (index) {
      this.prizeFlag = index
    },
    slowDown () {
      if (this.speed < 1) {
        let endDeg = 360 - this.prizeFlag * this.prizeDeg
        if (Math.abs(this.rotateDeg % 360 - endDeg) <= 1) {
          cancelAnimationFrame(this.animationId)
          this.speed = 0
          this.canPlay = true
          console.log(this.prizes)
          console.log(this.prizes.find((prize, index) => index === this.prizeFlag))
          this.$emit('end', {...this.prizes.find((prize, index) => index === this.prizeFlag)})
          return false
        }
      } else if (this.speed < 2) {
        this.speed -= 0.02
      } else {
        this.speed -= 0.05
      }
      this.rotateDeg += this.speed
      this.draw()
      this.animationId = window.requestAnimationFrame(this.slowDown)
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
