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
      default: () => []
    },
    prizes: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
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
      canPlay: true, // 是否可以开始游戏
      speed: 0, // 旋转速度
      prizeFlag: undefined, // 中奖的索引
      animationId: null, // 帧动画id
      Radius: 0, // 大转盘半径
      prizeRadius: 0, // 奖品区域半径
      maxBtnRadius: 0, // 最大的按钮半径
      rotateDeg: 0, // 旋转的角度
      prizeDeg: 360 / this.prizes.length, // 单个奖品的角度 (8个奖品就是45度)
    }
  },
  computed: {
    _defaultStyle () {
      const style = {
        fontSize: '24px',
        fontColor: '#fff',
        fontStyle: 'STHeiti, SimHei',
        prizeGutter: '0px',
      }
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      style.fontSize = getLength(style.fontSize) * this.dpr + 'px'
      if (!style.lineHeight) style.lineHeight = style.fontSize
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
      const ctx = this.ctx
      canvas.width = canvas.height = box.offsetWidth * dpr
      this.Radius = canvas.width / 2
      // 根据dpr缩放canvas, 并处理位移
      const transferLength = len => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
      canvas.style = `transform: scale(${1 / dpr}) translate(
        ${-transferLength(this.Radius)}%,
        ${-transferLength(this.Radius)}%
      )`
      // 设置坐标点
      ctx.translate(this.Radius, this.Radius)
      // 开始绘制
      this.draw()
      canvas.addEventListener('click', e => {
        ctx.translate(-this.Radius, -this.Radius)
        ctx.beginPath()
        ctx.arc(0, 0, this.maxBtnRadius, 0, 7, false)
        if (!ctx.isPointInPath(e.offsetX - this.Radius, e.offsetY - this.Radius)) return false
        ctx.translate(this.Radius, this.Radius)
        this.$emit('start', e)
      })
    },
    draw () {
      const { ctx, dpr, _defaultStyle } = this
      // 清空画布
      ctx.clearRect(-this.Radius, -this.Radius, this.Radius * 2, this.Radius * 2)
      // 绘制blocks边框
      this.prizeRadius = this.blocks.reduce((radius, block) => {
        ctx.beginPath()
        ctx.fillStyle = block.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        return radius - getLength(block.padding.split(' ')[0]) * dpr
      }, this.Radius)
      // 计算奖品弧度和起始弧度
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
              this.getHeight(font.top) + (lineIndex + 1) * getLength(font.lineHeight || _defaultStyle.lineHeight)
            )
          })
        })
        // 修正旋转角度和原点坐标
        ctx.rotate(getAngle(360) - currMiddleDeg - getAngle(90))
        ctx.translate(-x, -y)
      })
      // 绘制按钮
      this.buttons.forEach((btn, btnIndex) => {
        let radius = this.getHeight(btn.radius)
        this.maxBtnRadius = Math.max(this.maxBtnRadius, radius)
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        if (!btn.pointer) return false
        // 绘制指针
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.moveTo(-radius, 0)
        ctx.lineTo(radius, 0)
        ctx.lineTo(0, -radius * 2)
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
      if (this.speed < 20) this.speed += 0.1
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
      if (isExpectType(length, 'number')) return length * this.dpr
      if (isExpectType(length, 'string')) return length.includes('%')
        ? length.slice(0, -1) / 100 * this.prizeRadius
        : length.replace(/px/g, '') * this.dpr
      return 0
    },
    // 获取相对(居中)X坐标
    getOffsetX (width) {
      return -width / 2
    },
  }
}
</script>
