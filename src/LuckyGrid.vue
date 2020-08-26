<template>
  <div class="ldq-luck">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { roundRect, isExpectType, computePadding, getLinearGradient } from './utils.js'
export default {
  name: 'HorseRaceLamp',
  props: {
    // 边框
    blocks: {
      type: Array,
      validator: function (blocks) {
        return blocks.every((item, index) => {
          if (!item.padding) return console.error(`blocks[${index}]缺少 padding 属性`)
          if (!item.background) console.error(`blocks[${index}]缺少 background 属性`)
          return true
        })
      }
    },
    // 奖品
    prizes: {
      type: Array,
      validator: function (prizes) {
        return prizes.every((item, index) => {
          if (!item.hasOwnProperty('index')) return console.error(`prizes[${index}]缺少 index 属性`)
          if (!item.hasOwnProperty('x')) return console.error(`prizes[${index}]缺少 x 属性`)
          if (!item.hasOwnProperty('y')) return console.error(`prizes[${index}]缺少 y 属性`)
          return true
        })
      }
    },
    // 按钮
    button: {
      type: Object,
      validator: function (button) {
        if (!button.hasOwnProperty('x')) return console.error(`button对象缺少 x 属性`)
        if (!button.hasOwnProperty('y')) return console.error(`button对象缺少 y 属性`)
        return true
      }
    },
    // 横向等分成 cols 个格子
    cols: { type: Number, default: 3 },
    // 纵向等分成 rows 个格子
    rows: { type: Number, default: 3 },
    // 格子的默认样式
    defaultStyle: {
      type: Object,
      default () { // 默认配置在computed里面: _defaultStyle
        return {}
      }
    },
    // 中奖标记样式
    activeStyle: {
      type: Object,
      default () { // 默认配置在computed里面: _activeStyle
        return {}
      }
    }
  },
  data () {
    return {
      ctx: null,
      canPlay: true, // 是否可以开始
      currIndex: 0, // 当前index累加
      prizeIndex: undefined, // 中奖索引
      timer: null, // 游走时间id
      speed: 0, // 速度
      prizeArea: {}, // 奖品区域几何信息
      cells: [],
      cellImgs: [], // 奖品图片
    }
  },
  watch: {
    'blocks': {
      handler () { this.init() },
      deep: true,
    },
    'prizes': {
      handler () { this.init() },
      deep: true,
    },
    'button': {
      handler () { this.init() },
      deep: true,
    },
  },
  computed: {
    _defaultStyle () {
      // 默认样式
      let style = {
        gutter: 5,
        radius: 20,
        fontColor: '#DF424B',
        fontStyle: '18px sans-serif',
        textAlign: 'center',
        background: '#fff',
        shadow: '0 8 1 #ebf1f4'
      }
      // 传入的样式进行覆盖
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      return style
    },
    _activeStyle () {
      // 默认样式
      let style = {
        background: '#ffce98',
        shadow: ''
      }
      // 传入的样式进行覆盖
      for (let key in this.activeStyle) {
        style[key] = this.activeStyle[key]
      }
      return style
    }
  },
  mounted () {
    clearInterval(this.timer)
    this.init(9)
    window.addEventListener('resize', this.init)
  },
  methods: {
    async init (aaa) {
      const { _defaultStyle } = this
      const box = document.querySelector('.ldq-luck')
      const canvas = document.querySelector('#canvas')
      this.boxWidth = canvas.width = box.offsetWidth
      this.boxHeight = canvas.height = box.offsetHeight
      this.ctx = canvas.getContext('2d')
      // 把按钮放到奖品里面
      this.cells = [...this.prizes, { ...this.button, index: null }]
      // 计算所有边框信息
      this.blockData = []
      this.prizeArea = this.blocks.reduce(({x, y, w, h}, block) => {
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
      this.cellWidth = (this.prizeArea.w - _defaultStyle.gutter * (this.cols - 1)) / this.cols
      this.cellHeight = (this.prizeArea.h - _defaultStyle.gutter * (this.rows - 1)) / this.rows
      // 提前加载图片, 并处理默认赋值
      let num = 0, sum = 0
      // 图片加载回调函数
      let btnInfo = {}
      const onloadCallBack = callback => {
        callback()
        num++
        // 判断所有图片是否全都加载完毕
        if (num !== sum) return false
        // 开始首次渲染
        this.draw()
        // 点击按钮开始, 这里不能使用 addEventListener
        canvas.onmousedown = e => {
          const [x, y] = this.getGeometricProperty([this.button.x, this.button.y])
          if (e.offsetX < x || e.offsetY < y || e.offsetX > x + this.cellWidth || e.offsetY > y + this.cellWidth) return false
          this.$emit('start', e)
        }
      }
      this.cells.forEach((prize, index) => {
        prize.col = prize.col || 1
        prize.row = prize.row || 1
        // 图片预加载
        this.cellImgs[index] = []
        prize.imgs && prize.imgs.forEach(imgInfo => {
          sum++
          const imgObj = new Image()
          this.cellImgs[index].push(imgObj)
          imgObj.src = imgInfo.src
          imgObj.onload = onloadCallBack.bind(this, () => {
            // 根据配置的样式计算图片的真实宽高
            if (imgInfo.width && imgInfo.height) {
              // 如果宽度和高度都填写了, 就如实计算
              imgInfo.trueWidth = this.getWidth(imgInfo.width)
              imgInfo.trueHeight = this.getHeight(imgInfo.height)
            } else if (imgInfo.width && !imgInfo.height) {
              // 如果只填写了宽度, 没填写高度
              imgInfo.trueWidth = this.getWidth(imgInfo.width)
              // 那高度就随着宽度进行等比缩放
              imgInfo.trueHeight = imgObj.height * (imgInfo.trueWidth / imgObj.width)
            } else if (!imgInfo.width && imgInfo.height) {
              // 如果只填写了宽度, 没填写高度
              imgInfo.trueHeight = this.getHeight(imgInfo.height)
              // 那宽度就随着高度进行等比缩放
              imgInfo.trueWidth = imgObj.width * (imgInfo.trueHeight / imgObj.height)
            } else {
              // 如果没有配置宽高, 则使用图片本身的宽高
              imgInfo.trueWidth = imgObj.width
              imgInfo.trueHeight = imgObj.height
            }
          })
        })
      })
    },
    // 绘制九宫格抽奖
    draw () {
      const { ctx, _defaultStyle, _activeStyle } = this
      // 清空画布
      ctx.fillStyle = 'rgba(255, 255, 255, 0)'
      ctx.fillRect(0, 0, this.boxWidth, this.boxWidth)
      // 绘制所有边框
      this.blockData.forEach(([x, y, w, h, r, color]) => {
        roundRect(ctx, x, y, w, h, r, this.handleBackground(x, y, w, h, color))
      })
      // 绘制所有格子
      this.cells.forEach((prize, index) => {
        let [x, y, width, height] = this.getGeometricProperty([prize.x, prize.y, prize.col, prize.row])
        const isActive = index === this.currIndex % 8 >> 0
        // 处理阴影
        const shadow = (isActive ? _activeStyle.shadow : (prize.shadow || _defaultStyle.shadow))
          .replace(/px/g, '') // 清空px字符串
          .split(',')[0].split(' ') // 防止有人声明多个阴影, 截取第一个阴影
          .map((n, i) => i === 3 ? n : ~~n) // 把数组的前三个转化成数字
        // 绘制阴影
        if (shadow.length === 4) {
          ctx.shadowColor = shadow[3]
          ctx.shadowOffsetX = shadow[0]
          ctx.shadowOffsetY = shadow[1]
          ctx.shadowBlur = shadow[2]
          // 修正(格子+阴影)的位置, 这里使用逗号运算符
          shadow[0] > 0 ? (width -= shadow[0]) : (width += shadow[0], x -= shadow[0])
          shadow[1] > 0 ? (height -= shadow[1]) : (height += shadow[1], y -= shadow[1])
        }
        roundRect(
          ctx, x, y, width, height,
          prize.radius || this._defaultStyle.radius,
          this.handleBackground(x, y, width, height, prize.background, isActive)
        )
        // 清空阴影
        ctx.shadowColor = 'rgba(255, 255, 255, 0)'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
        // 绘制图片
        prize.imgs.forEach((imgInfo, i) => {
          const imgObj = this.cellImgs[index][i]
          ctx.drawImage(
            imgObj,
            x + this.getOffsetX(imgInfo.trueWidth),
            y + this.getHeight(imgInfo.top),
            imgInfo.trueWidth,
            imgInfo.trueHeight
          )
        })
        // 绘制文字
        prize.font.forEach(font => {
          String(font.text).split('\n').forEach((line, index) => {
            ctx.beginPath()
            ctx.font = (isActive && _activeStyle.fontStyle) ? _activeStyle.fontStyle : (font.style || _defaultStyle.fontStyle)
            ctx.fillStyle = (isActive && _activeStyle.fontColor) ? _activeStyle.fontColor : (font.color || _defaultStyle.fontColor)
            const width = ctx.measureText(line).width
            ctx.fillText(line, x + this.getOffsetX(width), y + this.getHeight(font.top) + index * (font.lineHeight || 0))
          })
        })
      })
    },
    handleBackground (x, y, width, height, background, isActive = false) {
      const { ctx, _defaultStyle, _activeStyle } = this
      background = isActive ? _activeStyle.background : (background || _defaultStyle.background)
      // 处理线性渐变
      if (background.includes('linear-gradient')) {
        background = getLinearGradient(ctx, x, y, width, height, background)
      }
      return background
    },
    getWidth (width) {
      if (isExpectType(width, 'number')) return width
      if (isExpectType(width, 'string')) {
        return width.includes('%') ? this.cellWidth * width.slice(0, -1) / 100 : ~~width.replace(/px/g, '')
      }
      return 0
    },
    getHeight (height) {
      if (isExpectType(height, 'number')) return height
      if (isExpectType(height, 'string')) {
        return height.includes('%') ? this.cellHeight * height.slice(0, -1) / 100 : ~~height.replace(/px/g, '')
      }
      return 0
    },
    getLength (length) {
      if (isExpectType(length, 'number')) return length
      if (isExpectType(length, 'string')) {
        return length.includes('%') ? length.slice(0, -1) / 100 : ~~length.replace(/px/g, '')
      }
      return 0
    },
    getOffsetX (width) {
      return (this.cellWidth - width) / 2
    },
    setSpeed () {
      this.speed = 0.2
    },
    play () {
      if (!this.canPlay) return false
      clearInterval(this.timer)
      this.prizeIndex = undefined
      this.canPlay = false
      this.setSpeed()
      this.run()
    },
    // 增加中奖标识自动游走
    walk () {
      clearInterval(this.timer)
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
          this.$emit('end', {...this.prizes.find(prize => prize.index === this.currIndex % 8 >> 0)})
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
        this.prizeArea.x + (this.cellWidth + this._defaultStyle.gutter) * x,
        this.prizeArea.y + (this.cellHeight + this._defaultStyle.gutter) * y
      ]
      col && row && res.push(
        this.cellWidth * col + this._defaultStyle.gutter * (col - 1),
        this.cellHeight * row + this._defaultStyle.gutter * (row - 1),
      )
      return res
    },
    // 绘制灯带
    // drawLamp () {
    //   this.ctx.beginPath()
    //   this.ctx.fillStyle = '#fff'
    //   const middleLine = this.outBoxPadding / 2
    //   const lampRadius = middleLine - 6
    //   const interval = (this.outRadius + this.insideRadius) / 2
    //   let start = interval + lampRadius
    //   this.ctx.arc(start, middleLine, lampRadius, 0, Math.PI * 2, true)
    //   this.ctx.closePath()
    //   this.ctx.fill()
    // },
  }
}
</script>

<style scoped>
.ldq-luck {
  position: relative;
}
</style>
