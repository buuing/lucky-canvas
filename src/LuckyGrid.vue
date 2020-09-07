<template>
  <div ref="luckDraw">
    <canvas></canvas>
  </div>
</template>

<script>
import { roundRect, isExpectType, computePadding, getLinearGradient } from './utils.js'
export default {
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
      },
      default: () => []
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
      },
      default: () => []
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
      speed: 0, // 速度
      prizeArea: {}, // 奖品区域几何信息
      cells: [],
      cellImgs: [],
      animationId: 0,
    }
  },
  watch: {
    prizes: {
      handler () { this.init('prizes') },
      deep: true,
    },
    button: {
      handler () { this.init('button') },
      deep: true,
    },
    blocks: {
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
        fontStyle: '16px sans-serif',
        textAlign: 'center',
        background: '#fff',
        shadow: ''
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
    this.init('mounted')
    window.addEventListener('resize', this.init.bind(this))
  },
  methods: {
    /**
     * 初始化canvas抽奖
     * @param { boolean } isUpdateImg 是否需要重新加载图片
     */
    async init (isUpdateImg) {
      const { _defaultStyle } = this
      const box = this.$refs.luckDraw
      const canvas = this.$refs.luckDraw.childNodes[0]
      this.boxWidth = canvas.width = box.offsetWidth
      this.boxHeight = canvas.height = box.offsetHeight
      this.ctx = canvas.getContext('2d')
      // 初始化状态
      this.canPlay = true
      this.currIndex = this.currIndex % 8 >> 0
      this.prizeIndex = undefined
      cancelAnimationFrame(this.animationId)
      // 把按钮放到奖品里面
      this.cells = [...this.prizes, { ...this.button, index: null }]
      // 计算所有边框信息, 并获取奖品区域
      this.blockData = []
      this.prizeArea = this.blocks.reduce(({x, y, w, h}, block) => {
        const { paddingTop, paddingBottom, paddingLeft, paddingRight } = computePadding(block)
        this.blockData.push([x, y, w, h, block.radius || 0, block.background])
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
      const endCallBack = () => {
        // 开始首次渲染
        this.draw()
        // 点击按钮开始, 这里不能使用 addEventListener
        if (this.button) canvas.onmousedown = e => {
          const [x, y] = this.getGeometricProperty([this.button.x, this.button.y])
          if (e.offsetX < x || e.offsetY < y || e.offsetX > x + this.cellWidth || e.offsetY > y + this.cellWidth) return false
          this.$emit('start', e)
        }
      }
      const imgOnLoad = (imgInfo, imgObj, prize) => {
        // 根据配置的样式计算图片的真实宽高
        if (imgInfo.width && imgInfo.height) {
          // 如果宽度和高度都填写了, 就如实计算
          imgInfo.trueWidth = this.getWidth(imgInfo.width, prize.col)
          imgInfo.trueHeight = this.getHeight(imgInfo.height, prize.row)
        } else if (imgInfo.width && !imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          imgInfo.trueWidth = this.getWidth(imgInfo.width, prize.col)
          // 那高度就随着宽度进行等比缩放
          imgInfo.trueHeight = imgObj.height * (imgInfo.trueWidth / imgObj.width)
        } else if (!imgInfo.width && imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          imgInfo.trueHeight = this.getHeight(imgInfo.height, prize.row)
          // 那宽度就随着高度进行等比缩放
          imgInfo.trueWidth = imgObj.width * (imgInfo.trueHeight / imgObj.height)
        } else {
          // 如果没有配置宽高, 则使用图片本身的宽高
          imgInfo.trueWidth = imgObj.width
          imgInfo.trueHeight = imgObj.height
        }
      }
      this.syncLoadImg(isUpdateImg, imgOnLoad, endCallBack)
    },
    /**
     * 同步加载图片函数
     * @param { boolean } isUpdateImg 是否需要重新加载图片
     * @param { Function } imgOnLoad 单个图片加载完毕回调
     * @param { Function } endCallBack 所有图片全部加载完毕回调
     */
    syncLoadImg (isUpdateImg, imgOnLoad, endCallBack) {
      let num = 0, sum = 0
      // if (isUpdateImg) this.cellImgs = new Array(this.cells.length).fill().map(cell => [])
      this.cells.forEach((prize, index) => {
        // 初始化
        prize.col = prize.col || 1
        prize.row = prize.row || 1
        if (isUpdateImg) this.cellImgs[index] = []
        prize.imgs.length && prize.imgs.forEach((imgInfo, i) => {
          sum++
          if (isUpdateImg) {
            const imgObj = new Image()
            this.cellImgs[index][i] = imgObj
            imgObj.src = imgInfo.src
            imgObj.onload = () => {
              num++
              imgOnLoad.call(this, imgInfo, imgObj, prize)
              if (sum === num) endCallBack.call(this)
            }
          } else {
            num++
            imgOnLoad.call(this, imgInfo, this.cellImgs[index][i], prize)
            if (sum === num) endCallBack.call(this)
          }
        })
      })
      if (!sum) endCallBack.call(this)
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
          .map((n, i) => i < 3 ? ~~n : n) // 把数组的前三个转化成数字
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
        prize.imgs && prize.imgs.forEach((imgInfo, i) => {
          ctx.drawImage(
            this.cellImgs[index][i],
            x + this.getOffsetX(imgInfo.trueWidth, prize.col),
            y + this.getHeight(imgInfo.top, prize.row),
            imgInfo.trueWidth,
            imgInfo.trueHeight
          )
        })
        // 绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.beginPath()
            const style = (isActive && _activeStyle.fontStyle) ? _activeStyle.fontStyle : (font.style || _defaultStyle.fontStyle)
            ctx.font = style
            ctx.fillStyle = (isActive && _activeStyle.fontColor) ? _activeStyle.fontColor : (font.color || _defaultStyle.fontColor)
            const width = ctx.measureText(line).width
            const lineHeight = font.lineHeight || style.split(' ')[0]
            ctx.fillText(
              line,
              x + this.getOffsetX(width, prize.col),
              y + this.getHeight(font.top, prize.row) + (lineIndex + 1) * this.getLength(lineHeight)
            )
          })
        })
      })
    },
    // 处理背景色
    handleBackground (x, y, width, height, background, isActive = false) {
      const { ctx, _defaultStyle, _activeStyle } = this
      background = isActive ? _activeStyle.background : (background || _defaultStyle.background)
      // 处理线性渐变
      if (background.includes('linear-gradient')) {
        background = getLinearGradient(ctx, x, y, width, height, background)
      }
      return background
    },
    // 对外暴露: 开始抽奖方法
    play () {
      if (!this.canPlay) return false
      this.prizeIndex = undefined
      this.canPlay = false
      this.setSpeed()
      this.run()
    },
    // 实际开始执行方法
    run () {
      if (this.prizeIndex == this.currIndex % 8 >> 0) {
        return this.slowDown()
      }
      if (this.speed < 0.4 && this.prizeIndex === undefined) this.speed += 0.002
      this.currIndex += this.speed
      this.draw()
      this.animationId = window.requestAnimationFrame(this.run)
    },
    // 对外暴露: 缓慢停止方法
    stop (index) {
      this.prizeIndex = index
    },
    // 这里用一个很low的缓慢停止, 欢迎各位大佬帮忙优化, 让他停的更自然一些
    slowDown () {
      if (this.speed < 0.025) {
        if (this.prizeIndex == this.currIndex % 8 >> 0) {
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
     * 计算奖品格子的几何属性
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
    // 转换并获取宽度
    getWidth (width, col = 1) {
      if (isExpectType(width, 'number')) return width
      if (isExpectType(width, 'string')) {
        return width.includes('%')
          ? (this.cellWidth * col + this._defaultStyle.gutter * (col - 1)) * width.slice(0, -1) / 100
          : ~~width.replace(/px/g, '')
      }
      return 0
    },
    // 转换并获取高度
    getHeight (height, row = 1) {
      if (isExpectType(height, 'number')) return height
      if (isExpectType(height, 'string')) {
        return height.includes('%')
          ? (this.cellHeight * row + this._defaultStyle.gutter * (row - 1)) * height.slice(0, -1) / 100
          : ~~height.replace(/px/g, '')
      }
      return 0
    },
    // 转换并获取长度
    getLength (length) {
      if (isExpectType(length, 'number')) return length
      if (isExpectType(length, 'string')) {
        return length.includes('%') ? length.slice(0, -1) / 100 : ~~length.replace(/px/g, '')
      }
      return 0
    },
    // 获取相对(居中)X坐标
    getOffsetX (width, col = 1) {
      return (this.cellWidth * col + this._defaultStyle.gutter * (col - 1) - width) / 2
    },
    // 设置速度
    setSpeed () {
      this.speed = 0.2
    },
    // 增加中奖标识自动游走
    // walk () {
    //   clearInterval(this.timer)
    //   this.timer = setInterval(() => {
    //     this.currIndex += 1
    //     this.draw()
    //   }, 1300)
    // },
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
