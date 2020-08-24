<template>
  <div class="ldq-canvas-box">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { roundRect, isExpectType, computePadding } from './utils.js'
export default {
  name: 'HorseRaceLamp',
  props: {
    // 默认配置项
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
    // 横向等分成cols个格子
    cols: { type: Number, default: 3 },
    // 纵向等分成rows个格子
    rows: { type: Number, default: 3 },
    // 格子之间的间隔
    cellGutter: { type: Number, default: 10 },
    // 格子背景颜色
    cellBackground: { type: String, default: '#fff' },
    // 中奖标记颜色
    activeBackground: { type: String, default: '#ff8c3e' },
    // 默认字体颜色
    fontColor: { type: String, default: '#000' },
    // 默认字体样式
    fontStyle: { type: String, default: '18px sans-serif' },
    // 格子圆角半径
    cellRadius: { type: Number, default: 20 },
  },
  data () {
    return {
      ctx: null,
      canPlay: true, // 是否可以开始
      currIndex: 0, // 当前index
      prizeIndex: undefined, // 中奖索引
      timer: null, // 游走时间id
      speed: 0, // 速度
      prizeArea: {}, // 奖品区域信息
      prizeImgs: [], // 奖品图片
      btnImgs: [], // 按钮图片
    }
  },
  mounted () {
    this.init()
    document.addEventListener('resize', this.init)
  },
  methods: {
    async init () {
      const options = this.options
      const box = document.querySelector('.ldq-canvas-box')
      const canvas = document.querySelector('#canvas')
      this.boxWidth = canvas.width = box.offsetWidth
      this.boxHeight = canvas.height = box.offsetHeight
      this.ctx = canvas.getContext('2d')
      // 计算所有边框信息
      this.blockData = []
      this.prizeArea = options.block.reduce(({x, y, w, h}, block) => {
        const { paddingTop, paddingBottom, paddingLeft, paddingRight } = computePadding(block)
        this.blockData.push([x, y, w, h, block.radius, block.background])
        return {
          x: x + paddingLeft,
          y: y + paddingTop,
          w: w - paddingLeft - paddingRight,
          h: h - paddingTop - paddingBottom
        }
      }, { x: 0, y: 0, w: this.boxWidth, h: this.boxHeight })
      // 计算单一奖品格子的宽度和高度
      this.prizeWidth = (this.prizeArea.w - this.cellGutter * (this.cols - 1)) / this.cols
      this.prizeHeight = (this.prizeArea.h - this.cellGutter * (this.rows - 1)) / this.rows
      // 提前加载图片, 并处理默认赋值
      let num = 0, sum = 0
      // 图片加载回调函数
      const onloadCallBack = () => {
        num++
        // 判断所有图片是否全都加载完毕
        if (num !== sum) return false
        // 开始首次渲染
        this.draw()
        // 自动游走
        // this.walk()
        // 点击按钮开始
        // canvas.addEventListener('mousedown', e => {
        //   const [x, y] = this.getGeometricProperty([1, 1])
        //   if (
        //     e.offsetX < x ||
        //     e.offsetY < y ||
        //     e.offsetX > x + this.prizeWidth ||
        //     e.offsetY > y + this.prizeWidth
        //   ) return false
        //   this.play()
        // })
      }
      options.prizes.forEach((prize, index) => {
        prize.col = prize.col || 1
        prize.row = prize.row || 1
        // 图片预加载
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
    // 绘制九宫格抽奖
    draw () {
      const { ctx, options } = this
      // 清空画布
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, this.boxWidth, this.boxWidth)
      // 绘制所有边框
      this.blockData.forEach(info => roundRect(ctx, ...info))
      // 绘制所有格子
      options.prizes.forEach((prize, index) => {
        let [x, y, width, height] = this.getGeometricProperty([prize.x, prize.y, prize.col, prize.row])
        // 绘制阴影, 防止有人声明多个阴影, 所以截取逗号前的字符串
        const shadow = prize.shadow ? prize.shadow.replace(/px/g, '').split(',')[0].split(' ').map((n, i) => {
          // 把前三个数值转换成数字
          return i === 3 ? n : ~~n
        }) : []
        if (shadow.length === 4) {
          ctx.shadowColor = shadow[3]
          ctx.shadowOffsetX = shadow[0]
          ctx.shadowOffsetY = shadow[1]
          ctx.shadowBlur = shadow[2]
          // 修正格子的位置, 这里使用逗号运算符
          shadow[0] > 0 ? (width -= shadow[0]) : (width += shadow[0], x -= shadow[0])
          shadow[1] > 0 ? (height -= shadow[1]) : (height += shadow[1], y -= shadow[1])
        } else console.error('shadow阴影属性只允许有4个值: \n1.水平位置(允许负值)\n2.垂直位置(允许负值)\n3.模糊程度(0等于不模糊)\n4.阴影的颜色')
        // 绘制背景
        roundRect(ctx, x, y, width, height, prize.radius || this.cellRadius, prize.background || this.prizeBackground)
        // 清空阴影
        ctx.shadowColor = 'rgba(255, 255, 255, 0)'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
        // 绘制图片
        prize.imgs.forEach((imgInfo, i) => {
          ctx.drawImage(this.prizeImgs[index][i], x, y)
        })
        // 绘制文字
        prize.font.forEach(font => {
          font.text.split('\n').forEach((line, index) => {
            ctx.beginPath()
            ctx.font = font.style || this.fontStyle
            ctx.fillStyle = font.color || this.fontColor
            ctx.fillText(line, x, y + 100 + 20*index)
          })
        })
      })
      // this.prizeAxis.forEach((axis, index) => {
      //   const [x, y] = this.getGeometricProperty(axis)
      //   const currPrize = options.prizes[index]
      //   // 如果奖品不存在就空着
      //   if (!currPrize) return false
      //   // 绘制奖品图片
      //   currPrize.imgs.forEach((imgInfo, ind) => {
      //     ctx.drawImage(this.prizeImgs[index][ind], x + 10, y + -15, this.prizeWidth - 20, this.prizeWidth - 20)
      //   })
      //   // 绘制奖品文字
      //   currPrize.text.split('\n').forEach((line, index) => {
      //     ctx.beginPath()
      //     ctx.font = options?.font?.style || '18px sans-serif'
      //     ctx.fillStyle = options?.font?.color || '#000'
      //     ctx.fillText(line, x, y + 100 + 20*index)
      //   })
      // })
      // // 绘制抽奖按钮格子
      // const [btnX, btnY] = this.getGeometricProperty([1, 1])
      // roundRect(
      //   ctx, btnX, btnY,
      //   this.prizeWidth,
      //   this.prizeWidth,
      //   options?.button?.radius || 0,
      //   options?.button?.bgColor || '#fff'
      // )
      // this.btnImgs.forEach((img, index) => {
      //   const info = options.button.imgs[index]
      //   ctx.drawImage(
      //     img,
      //     btnX + info.offsetX,
      //     btnY + info.offsetY,
      //     img.width + info.offsetWidth,
      //     img.height + info.offsetheight
      //   )
      // })
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
    /**
     * 计算奖品格子的集合属性
     * @param { array } [...矩阵坐标, col, row]
     * @return { array } [...真实坐标, width, height]
     */
    getGeometricProperty ([x, y, col, row]) {
      let res = [
        this.prizeArea.x + (this.prizeWidth + this.cellGutter) * x,
        this.prizeArea.y + (this.prizeHeight + this.cellGutter) * y
      ]
      col && row && res.push(
        this.prizeWidth * col + this.cellGutter * (col - 1),
        this.prizeHeight * row + this.cellGutter * (row - 1),
      )
      return res
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
  height: 500px;
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
