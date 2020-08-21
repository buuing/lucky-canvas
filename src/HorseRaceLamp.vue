<template>
  <div class="ldq-canvas-box">
    <canvas id="canvas"></canvas>
    <button @click="stop">a</button>
  </div>
</template>

<script>
import { roundRect } from './utils.js'
export default {
  name: 'HorseRaceLamp',
  props: {
    outBoxPadding: { // 外边框宽度
      type: Number,
      default: 30
    },
    insideBoxPadding: { // 内边框宽度
      type: Number,
      default: 10
    },
    outBoxColor: { // 外边框颜色
      type: String,
      default: '#fd376c'
    },
    insideBoxColor: { // 内边框颜色
      type: String,
      default: '#ea0042'
    },
    prizeRadius: { // 奖品格子圆角半径
      type: Number,
      default: 30
    },
    btnRadius: { // 抽奖按钮圆角半径
      type: Number,
      default: Infinity
    },
    prizeGutter: { // 奖品格子之间间隔
      type: Number,
      default: 5
    },
    prizeBgColor: { // 奖品区域背景颜色
      type: String,
      default: '#ffebec'
    },
    btnBgColor: { // 抽奖按钮背景颜色
      type: String,
      default: '#f9df4c'
    },
    activeColor: { // 中奖标记颜色
      type: String,
      default: 'pink'
    },
  },
  data () {
    return {
      ctx: null,
      timer: null,
      boxWidth: 0, // canvas宽度
      outRadius: 50, // 外圆角半径
      insideRadius: 40, // 内圆角半径
      prizeAxis: [ // 奖品坐标
        [0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]
      ],
      currIndex: 0
    }
  },
  mounted () {
    this.init()
    document.addEventListener('resize', this.init)
  },
  methods: {
    init () {
      const box = document.querySelector('.ldq-canvas-box')
      const canvas = document.querySelector('#canvas')
      this.boxWidth = box.offsetWidth
      canvas.width = this.boxWidth
      canvas.height = this.boxWidth
      this.ctx = canvas.getContext('2d')
      // 开始渲染
      this.draw()
      // 增加中奖标识自动游走
      this.timer = setInterval(() => {
        this.currIndex += 1
        this.draw()
      }, 1300)
      // 点击按钮开始
      canvas.addEventListener('mousedown', e => {
        const [x, y] = this.getCoordinate(1, 1)
        if (e.offsetX < x || e.offsetY < y || e.offsetX > x + 100 || e.offsetY > y + 100) return false
        // 开始play
        clearInterval(this.timer)
        this.v = 0.01
        this.a = 1
        this.play()
      })
    },
    stop () {
      this.a = 0
    },
    play () {
        if (this.a === 1) {
          if (this.v < 0.3) this.v += 0.001
        } else {
          if (this.v >= 0) this.v -= 0.001
          console.log(this.v)
        }
        this.currIndex += this.v
        // console.log(this.currIndex)
        this.draw()
        requestAnimationFrame(this.play)
    },
    draw () {
      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect(0, 0, this.boxWidth, this.boxWidth)
      roundRect( // 绘制外边框
        this.ctx, 0, 0,
        this.boxWidth,
        this.boxWidth,
        this.outRadius,
        this.outBoxColor
      )
      roundRect( // 绘制内边框
        this.ctx,
        this.outBoxPadding,
        this.outBoxPadding,
        this.boxWidth - this.outBoxPadding * 2,
        this.boxWidth - this.outBoxPadding * 2,
        this.insideRadius,
        this.insideBoxColor
      )
      // 奖品总区域宽度
      const areaWidth = this.boxWidth - (this.outBoxPadding + this.insideBoxPadding) * 2
      // 奖品格子的宽度
      this.prizeWidth = (areaWidth - this.prizeGutter * 2) / 3
      // 绘制8个奖品
      this.prizeAxis.forEach((axis, index) => roundRect(
        this.ctx,
        ...this.getCoordinate(axis[0], axis[1]),
        this.prizeWidth,
        this.prizeWidth,
        this.prizeRadius,
        index === this.currIndex % 8 >> 0 ? this.activeColor : this.prizeBgColor
      ))
      // 绘制抽奖按钮格子
      roundRect(
        this.ctx,
        ...this.getCoordinate(1, 1),
        this.prizeWidth,
        this.prizeWidth,
        this.btnRadius,
        this.btnBgColor
      )
      // this.drawImg(require('./222.png'), ...this.getCoordinate(1, 1))
    },
    // 计算格子坐标
    getCoordinate (x, y) {
      return [
        this.outBoxPadding + this.insideBoxPadding + (this.prizeWidth + this.prizeGutter) * x,
        this.outBoxPadding + this.insideBoxPadding + (this.prizeWidth + this.prizeGutter) * y
      ]
    },
    // 绘制灯带
    drawLamp () {
      this.ctx.beginPath()
      this.ctx.fillStyle = '#fff'
      const middleLine = this.outBoxPadding / 2
      const lampRadius = middleLine - 6
      const interval = (this.outRadius + this.insideRadius) / 2
      let start = interval + lampRadius
      this.ctx.arc(start, middleLine, lampRadius, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
    },
    drawImg (imgSrc, x, y) {
      const img = new Image()
      img.onload = () => {
        this.ctx.drawImage(img, x + 25, y + 10, this.prizeWidth - 50, this.prizeWidth - 50)
      }
      img.src = imgSrc
    }
  }
}
</script>

<style>
.ldq-canvas-box {
  width: 500px;
  border: 1px solid red;
  position: relative;
  /* position: relative; */
  /* transform: scale(0.5); */
}
#canvas {
  position: relative;
  /* position: absolute; */
  /* left: 0; */
  /* top: 0; */
}
</style>
