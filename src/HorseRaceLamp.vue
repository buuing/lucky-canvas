<template>
  <div class="ldq-canvas-box">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { roundRect, isExpectType } from './utils.js'
export default {
  name: 'HorseRaceLamp',
  props: {
    options: {
      type: Object,
      required: true,
      validator: function (options) {
        // 检查options是否存在
        if (!options) return console.error('缺少重要配置项: options')
        if (!isExpectType(options, 'object')) return console.error('options 必须是一个对象')
        // 检查奖品是否配置
        if (!options.prizes) return console.error('缺少奖品数组: options.prizes')
        if (!isExpectType(options.prizes, 'array')) return console.error('options.prizes 必须是一个数组')
        return true
      }
    },
    // 关于宽度
    outBoxPadding: { type: Number, default: 30 }, // 外边框宽度
    insideBoxPadding: { type: Number, default: 10 }, // 内边框宽度
    prizeGutter: { type: Number, default: 5 }, // 奖品格子之间间隔
    // 关于颜色
    outBoxColor: { type: String, default: '#1a4ebf' }, // 外边框颜色
    insideBoxColor: { type: String, default: '#399eee' }, // 内边框颜色
    prizeBgColor: { type: String, default: '#3e45ba' }, // 奖品区域背景颜色
    btnBgColor: { type: String, default: '#f2c001' }, // 抽奖按钮背景颜色
    activeColor: { type: String, default: '#ff8c3e' }, // 中奖标记颜色
    // 关于半径
    outRadius: { type: Number, default: 30 }, // 外圆角半径
    insideRadius: { type: Number, default: 20 }, // 内圆角半径
    prizeRadius: { type: Number, default: 20 }, // 奖品格子圆角半径
    btnRadius: { type: Number, default: Infinity }, // 抽奖按钮圆角半径
  },
  data () {
    return {
      ctx: null,
      canPlay: true, // 是否可以开始
      currIndex: 0, // 当前index
      prizeIndex: undefined, // 中奖索引
      timer: null, // 游走时间id
      speed: 0, // 速度
      boxWidth: 0, // canvas宽度
      prizeAxis: [ // 奖品坐标
        [0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]
      ],
      prizeImgs: [], // 奖品图片
      btnImgs: [], // 按钮图片
    }
  },
  mounted () {
    this.initCanvas()
    document.addEventListener('resize', this.initCanvas)
  },
  methods: {
    async initCanvas () {
      const options = this.options
      const box = document.querySelector('.ldq-canvas-box')
      const canvas = document.querySelector('#canvas')
      this.boxWidth = box.offsetWidth
      canvas.width = canvas.height = this.boxWidth
      this.ctx = canvas.getContext('2d')
      // 初始化图片
      let num = 0, sum = 0
      // 图片加载回调函数
      const onloadCallBack = () => {
        num++
        // 判断所有图片是否全都加载完毕
        if (num !== sum) return false
        // 开始首次渲染
        this.draw()
        // 自动游走
        this.walk()
        // 点击按钮开始
        canvas.addEventListener('mousedown', e => {
          const [x, y] = this.getCoordinate([1, 1])
          if (
            e.offsetX < x ||
            e.offsetY < y ||
            e.offsetX > x + this.prizeWidth ||
            e.offsetY > y + this.prizeWidth
          ) return false
          this.play()
        })
      }
      // 添加按钮图片
      options.button.imgs.forEach(img => {
        sum++
        const currImg = new Image()
        this.btnImgs.push(currImg)
        currImg.src = img.src
        currImg.onload = onloadCallBack
      })
      // 添加奖品图片
      options.prizes.forEach((prize, index) => {
        this.prizeImgs[index] = []
        prize.imgs.forEach(img => {
          sum++
          const currImg = new Image()
          this.prizeImgs[index].push(currImg)
          currImg.src = img.src
          currImg.onload = onloadCallBack
        })
      })
    },
    setSpeed () {
      this.speed = 0.2
    },
    play () {
      if (!this.canPlay) return false
      clearInterval(this.timer)
      this.$emit('start')
      this.prizeIndex = undefined
      this.canPlay = false
      this.setSpeed()
      this.run()
    },
    // 增加中奖标识自动游走
    walk () {
      this.timer = setInterval(() => {
        this.currIndex += 1
        this.draw()
      }, 1300)
    },
    run () {
      if (this.prizeIndex == this.currIndex % 8 >> 0) {
        return this.slowDown()
      }
      if (this.speed < 0.4 && this.prizeIndex === undefined) this.speed += 0.002
      this.currIndex += this.speed
      this.draw()
      window.requestAnimationFrame(this.run)
    },
    // 得到中奖索引之后就可以停止了
    stop (index) {
      this.prizeIndex = index
    },
    // 这里用一个很low的缓慢停止, 欢迎各位大佬帮忙优化, 让他停的更自然一些
    slowDown () {
      if (this.speed < 0.025) {
        if (this.prizeIndex === this.currIndex % 8 >> 0) {
          this.speed = 0
          this.canPlay = true
          this.$emit('end', this.currIndex % 8 >> 0)
          return false
        }
      } else {
        this.speed -= 0.0015
      }
      this.currIndex += this.speed
      this.draw()
      window.requestAnimationFrame(this.slowDown)
    },
    // 绘制九宫格抽奖
    draw () {
      const { ctx, options } = this
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, this.boxWidth, this.boxWidth)
      roundRect( // 绘制外边框
        ctx, 0, 0,
        this.boxWidth,
        this.boxWidth,
        this.outRadius,
        this.outBoxColor
      )
      roundRect( // 绘制内边框
        ctx,
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
      this.prizeAxis.forEach((axis, index) => {
        const [x, y] = this.getCoordinate(axis)
        const currPrize = options.prizes[index]
        // 先画背景
        roundRect(
          ctx, x, y,
          this.prizeWidth,
          this.prizeWidth,
          this.prizeRadius,
          index === this.currIndex % 8 >> 0 ? this.activeColor : this.prizeBgColor
        )
        // 如果奖品不存在就空着
        if (!currPrize) return false
        // 绘制奖品图片
        currPrize.imgs.forEach((imgInfo, ind) => {
          ctx.drawImage(this.prizeImgs[index][ind], x + 10, y + -15, this.prizeWidth - 20, this.prizeWidth - 20)
        })
        // 绘制奖品文字
        currPrize.name.split('\n').forEach((line, index) => {
          ctx.beginPath()
          ctx.font = options?.font?.style || '18px sans-serif'
          ctx.fillStyle = options?.font?.color || '#000'
          ctx.fillText(line, x, y + 100 + 20*index)
        })
      })
      // 绘制抽奖按钮格子
      const [btnX, btnY] = this.getCoordinate([1, 1])
      roundRect(
        ctx, btnX, btnY,
        this.prizeWidth,
        this.prizeWidth,
        options?.button?.radius || 0,
        options?.button?.bgColor || '#fff'
      )
      this.btnImgs.forEach((img, index) => {
        const info = options.button.imgs[index]
        ctx.drawImage(
          img,
          btnX + info.offsetX,
          btnY + info.offsetY,
          img.width + info.offsetWidth,
          img.height + info.offsetheight
        )
      })
    },
    // 计算格子坐标
    getCoordinate ([x, y]) {
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
  }
}
</script>

<style>
.ldq-canvas-box {
  width: 500px;
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
