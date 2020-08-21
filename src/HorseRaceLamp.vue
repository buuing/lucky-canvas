<template>
  <div class="ldq-canvas-box">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { roundRect } from './utils.js'
export default {
  name: 'HorseRaceLamp',
  props: {
    outBoxPadding: { // 外边框宽度
      type: Number,
      default: 28
    },
    insideBoxPadding: { // 内边框宽度
      type: Number,
      default: 8
    },
    outBoxColor: { // 外边框颜色
      type: String,
      default: '#fd376c'
    },
    insideBoxColor: { // 内边框颜色
      type: String,
      default: '#ea0042'
    },
    outRadius: { // 外圆角半径
      type: Number,
      default: 50
    },
    insideRadius: { // 内圆角半径
      type: Number,
      default: 40
    },
    prizeRadius: {
      type: Number,
      default: 30
    },
    prizeGutter: {
      type: Number,
      default: 5
    },
    prizeBgColor: { // 奖品区域背景颜色
      type: String,
      default: '#fff3f3'
    },
    btnBgColor: {
      type: String,
      default: '#f9df4c'
    }
  },
  data () {
    return {
      ctx: null,
      boxWidth: 0
    }
  },
  mounted () {
    this.init()
    this.draw()
    window.onresize = () => {
      this.init()
      this.draw()
    }
  },
  methods: {
    init () {
      const box = document.querySelector('.ldq-canvas-box')
      const canvas = document.querySelector('#canvas')
      this.boxWidth = box.offsetWidth
      canvas.width = this.boxWidth
      canvas.height = this.boxWidth
      this.ctx = canvas.getContext('2d')
    },
    draw () {
      // 绘制外边框
      roundRect(this.ctx, 0, 0, this.boxWidth, this.boxWidth, this.outRadius, this.outBoxColor)
      // 绘制内边框
      roundRect(
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
      // 奖品坐标
      let prize = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
      // 绘制8个奖品
      prize.forEach(axis => {
        roundRect(
          this.ctx,
          ...this.getCoordinate(axis[0], axis[1]),
          this.prizeWidth,
          this.prizeWidth,
          this.prizeRadius,
          this.prizeBgColor
        )
      })
      // 绘制抽奖按钮格子
      roundRect(
        this.ctx,
        ...this.getCoordinate(1, 1),
        this.prizeWidth,
        this.prizeWidth,
        this.prizeRadius,
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
  /* position: relative; */
  /* transform: scale(0.5); */
}
#canvas {
  /* position: absolute; */
  /* left: 0; */
  /* top: 0; */
}
</style>
