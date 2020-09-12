<template>
  <div ref="luckDraw" style="overflow: hidden">
    <canvas></canvas>
  </div>
</template>

<script>
import { roundRect, isExpectType, computePadding, getLinearGradient } from './utils.js'
export default {
  props: {
    // 奖品 (该属性被watch监听)
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
    // 按钮 (该属性被watch监听)
    button: {
      type: Object,
      validator: function (button) {
        if (!button.hasOwnProperty('x')) return console.error(`button对象缺少 x 属性`)
        if (!button.hasOwnProperty('y')) return console.error(`button对象缺少 y 属性`)
        return true
      }
    },
    // 边框 (该属性会在computed里面进行修正)
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
    // 横向等分成 cols 个格子
    cols: { type: Number | String, default: 3 },
    // 纵向等分成 rows 个格子
    rows: { type: Number | String, default: 3 },
    // demo演示开启中奖标识自动游走
    demo: { type: Boolean, default: false },
  },
  data () {
    return {
      dpr: window.devicePixelRatio || 2, // 设备像素比
      ctx: null, // 画布
      canPlay: true, // 是否可以开始
      currIndex: 0, // 当前index累加
      prizeFlag: undefined, // 中奖索引标识
      prizeArea: {}, // 奖品区域几何信息
      cells: [],
      cellImgs: new Array(this.cols * this.rows).fill().map(_ => []),
      animationId: 0,
      timer: 0, // 游走定时器
      speed: 0, // 速度
    }
  },
  watch: {
    prizes: {
      handler (newData, oldData) {
        let willUpdate = []
        // 首次渲染时oldData为undefined
        if (!oldData) willUpdate = newData.map(prize => prize.imgs)
        // 此时新值一定存在
        else if (newData) newData.forEach((newPrize, prizeIndex) => {
          let prizeImgs = []
          const oldPrize = oldData[prizeIndex]
          // 如果旧奖品不存在
          if (!oldPrize) prizeImgs = newPrize.imgs
          // 新奖品有图片才能进行对比
          else if (newPrize.imgs) newPrize.imgs.forEach((newImg, imgIndex) => {
            const oldImg = oldPrize.imgs[imgIndex]
            // 如果旧值不存在
            if (!oldImg) prizeImgs[imgIndex] = newImg
            // 如果缓存中没有图片
            else if (!this.cellImgs[prizeIndex][imgIndex]) prizeImgs[imgIndex] = newImg
            // 如果新值和旧值的src不相等
            else if (newImg.src !== oldImg.src) prizeImgs[imgIndex] = newImg
          })
          willUpdate[prizeIndex] = prizeImgs
        })
        return this.init(willUpdate)
      },
      deep: true,
    },
    button: {
      handler (newData, oldData) {
        let willUpdate = [], btnIndex = this.cols * this.rows - 1
        // 首次渲染时, oldData不存在
        if (!oldData || !oldData.imgs) willUpdate[btnIndex] = newData.imgs
        // 如果新值存在img, 才能进行对比
        else if (newData.imgs) {
          const btnImg = []
          newData.imgs.forEach((newImg, imgIndex) => {
            const oldImg = oldData.imgs[imgIndex]
            // 如果旧值不存在
            if (!oldImg) btnImg[imgIndex] = newImg
            // 如果缓存中没有图片
            else if (!this.cellImgs[btnIndex][imgIndex]) btnImg[imgIndex] = newImg
            // 如果新值和旧值的src不相等
            else if (newImg.src !== oldImg.src) btnImg[imgIndex] = newImg
          })
          willUpdate[btnIndex] = btnImg
        }
        return this.init(willUpdate)
      },
      deep: true,
    },
  },
  computed: {
    prizeIndex () {
      return this.currIndex % this.prizes.length >> 0
    },
    _defaultStyle () {
      // 默认样式
      let style = {
        gutter: 5,
        radius: 20,
        fontColor: '#000',
        fontStyle: '16px sans-serif',
        textAlign: 'center',
        background: '#fff',
        shadow: ''
      }
      // 传入的样式进行覆盖
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      // 根据dpr计算实际显示效果
      style.radius *= this.dpr
      style.gutter *= this.dpr
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
    },
  },
  mounted () {
    // 收集首次渲染的图片
    let willUpdate = []
    this.prizes && (willUpdate = this.prizes.map(prize => prize.imgs))
    this.button && (willUpdate[this.cols * this.rows - 1] = this.button.imgs)
    this.init(willUpdate)
    window.addEventListener('resize', this.init.bind(this))
  },
  methods: {
    /**
     * 初始化canvas抽奖
     * @param { Array<Array<img>> } willUpdateImgs 需要更新的图片
     */
    async init (willUpdateImgs) {
      const { dpr, _defaultStyle } = this
      const box = this.$refs.luckDraw
      if (!box) return false
      const canvas = this.$refs.luckDraw.childNodes[0]
      this.ctx = canvas.getContext('2d')
      this.boxWidth = canvas.width = box.offsetWidth * dpr
      this.boxHeight = canvas.height = box.offsetHeight * dpr
      // 根据dpr缩放canvas, 并处理位移
      const transferLength = len => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
      canvas.style = `transform: scale(${1 / dpr}) translate(
        ${-transferLength(this.boxWidth)}%,
        ${-transferLength(this.boxHeight)}%
      )`
      // 初始化状态
      this.canPlay = true
      this.currIndex = this.prizeIndex
      this.prizeFlag = undefined
      clearInterval(this.timer)
      cancelAnimationFrame(this.animationId)
      // 把按钮放到奖品里面
      this.cells = [...this.prizes]
      if (this.button) this.cells[this.cols * this.rows - 1] = { ...this.button, index: null }
      this.cells.forEach(cell => {
        cell.col = cell.col || 1
        cell.row = cell.row || 1
      })
      // 计算所有边框信息, 并获取奖品区域
      this.blockData = []
      this.prizeArea = this.blocks.reduce(({x, y, w, h}, block) => {
        const { paddingTop, paddingBottom, paddingLeft, paddingRight } = computePadding(block)
        this.blockData.push([x, y, w, h, block.radius ? block.radius * dpr : 0, block.background])
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
        // 中奖标识开始游走
        this.demo && this.walk()
        // 点击按钮开始, 这里不能使用 addEventListener
        if (this.button) canvas.onmousedown = e => {
          const [x, y] = this.getGeometricProperty([this.button.x, this.button.y])
          if (e.offsetX < x || e.offsetY < y || e.offsetX > x + this.cellWidth || e.offsetY > y + this.cellWidth) return false
          this.$emit('start', e)
        }
      }
      // 同步加载图片
      let num = 0, sum = 0
      if (isExpectType(willUpdateImgs, 'array')) {
        this.draw() // 先画一次防止闪烁, 因为加载图片是异步的
        willUpdateImgs.forEach((imgs, cellIndex) => {
          if (!imgs) return false
          imgs.forEach((imgInfo, imgIndex) => {
            sum++
            this.loadAndCacheImg(cellIndex, imgIndex, () => {
              num++
              if (sum === num) endCallBack.call(this)
            })
          })
        })
      }
      if (!sum) endCallBack.call(this)
    },
    /**
     * 单独加载某一张图片并计算其实际渲染宽高
     * @param { number } prizeIndex 奖品索引
     * @param { number } imgIndex 奖品图片索引
     * @param { Function } callBack 图片加载完毕回调
     */
    loadAndCacheImg (prizeIndex, imgIndex, callBack) {
      const prize = this.cells[prizeIndex]
      if (!prize) return false
      const imgInfo = prize.imgs[imgIndex]
      let imgObj = new Image()
      if (!this.cellImgs[prizeIndex]) this.cellImgs[prizeIndex] = []
      this.cellImgs[prizeIndex][imgIndex] = { img: imgObj }
      imgObj.src = imgInfo.src
      imgObj.onload = () => {
        const cellImg = this.cellImgs[prizeIndex][imgIndex]
        if (!cellImg) return false
        // 根据配置的样式计算图片的真实宽高
        if (imgInfo.width && imgInfo.height) {
          // 如果宽度和高度都填写了, 就如实计算
          cellImg.trueWidth = this.getWidth(imgInfo.width, prize.col)
          cellImg.trueHeight = this.getHeight(imgInfo.height, prize.row)
        } else if (imgInfo.width && !imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          cellImg.trueWidth = this.getWidth(imgInfo.width, prize.col)
          // 那高度就随着宽度进行等比缩放
          cellImg.trueHeight = imgObj.height * (cellImg.trueWidth / imgObj.width)
        } else if (!imgInfo.width && imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          cellImg.trueHeight = this.getHeight(imgInfo.height, prize.row)
          // 那宽度就随着高度进行等比缩放
          cellImg.trueWidth = imgObj.width * (cellImg.trueHeight / imgObj.height)
        } else {
          // 如果没有配置宽高, 则使用图片本身的宽高
          cellImg.trueWidth = imgObj.width
          cellImg.trueHeight = imgObj.height
        }
        // 最后触发回调
        callBack.call(this)
      }
    },
    // 绘制九宫格抽奖
    draw () {
      const { ctx, dpr, _defaultStyle, _activeStyle } = this
      // 清空画布
      ctx.fillStyle = 'rgba(255, 255, 255, 0)'
      ctx.fillRect(0, 0, this.boxWidth, this.boxWidth)
      // 绘制所有边框
      this.blockData.forEach(([x, y, w, h, r, color]) => {
        roundRect(ctx, x, y, w, h, r, this.handleBackground(x, y, w, h, color))
      })
      // 绘制所有格子
      this.cells.forEach((prize, cellIndex) => {
        let [x, y, width, height] = this.getGeometricProperty([prize.x, prize.y, prize.col, prize.row])
        const isActive = prize.index === this.prizeIndex
        // 处理阴影
        const shadow = (isActive ? _activeStyle.shadow : (prize.shadow || _defaultStyle.shadow))
          .replace(/px/g, '') // 清空px字符串
          .split(',')[0].split(' ') // 防止有人声明多个阴影, 截取第一个阴影
          .map((n, i) => i < 3 ? n * dpr : n) // 把数组的前三个值*像素比
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
          isExpectType(prize.radius, 'number') ? prize.radius * dpr : _defaultStyle.radius,
          this.handleBackground(x, y, width, height, prize.background, isActive)
        )
        // 清空阴影
        ctx.shadowColor = 'rgba(255, 255, 255, 0)'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
        // 绘制图片
        prize.imgs && prize.imgs.forEach((imgInfo, imgIndex) => {
          if (!this.cellImgs[cellIndex]) return false
          const cellImg = this.cellImgs[cellIndex][imgIndex]
          cellImg && ctx.drawImage(
            cellImg.img,
            x + this.getOffsetX(cellImg.trueWidth, prize.col),
            y + this.getHeight(imgInfo.top, prize.row),
            cellImg.trueWidth,
            cellImg.trueHeight
          )
        })
        // 绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.beginPath()
            let style = (isActive && _activeStyle.fontStyle) ? _activeStyle.fontStyle : (font.style || _defaultStyle.fontStyle)
            ctx.font = style = style.replace(/^(\d+)/, res => res * dpr)
            ctx.fillStyle = (isActive && _activeStyle.fontColor) ? _activeStyle.fontColor : (font.color || _defaultStyle.fontColor)
            const width = ctx.measureText(line).width
            const lineHeight = this.getLength(font.lineHeight) * dpr || style.split(' ')[0]
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
      clearInterval(this.timer)
      if (!this.canPlay) return false
      this.prizeFlag = undefined
      this.canPlay = false
      this.setSpeed()
      this.run()
    },
    // 实际开始执行方法
    run () {
      if (this.prizeFlag == this.prizeIndex) {
        return this.slowDown()
      }
      if (this.speed < 0.4 && this.prizeFlag === undefined) this.speed += 0.002
      this.currIndex += this.speed
      this.draw()
      this.animationId = window.requestAnimationFrame(this.run)
    },
    // 对外暴露: 缓慢停止方法
    stop (index) {
      this.prizeFlag = index
    },
    // 这里用一个很low的缓慢停止, 欢迎各位大佬帮忙优化, 让他停的更自然一些
    slowDown () {
      if (this.speed < 0.025) {
        if (this.prizeFlag == this.prizeIndex) {
          this.speed = 0
          this.canPlay = true
          this.$emit('end', {...this.prizes.find(prize => prize.index === this.prizeIndex)})
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
      if (isExpectType(width, 'number')) return width * this.dpr
      if (isExpectType(width, 'string')) {
        return width.includes('%')
          ? (this.cellWidth * col + this._defaultStyle.gutter * (col - 1)) * width.slice(0, -1) / 100
          : width.replace(/px/g, '') * this.dpr
      }
      return 0
    },
    // 转换并获取高度
    getHeight (height, row = 1) {
      if (isExpectType(height, 'number')) return height * this.dpr
      if (isExpectType(height, 'string')) {
        return height.includes('%')
          ? (this.cellHeight * row + this._defaultStyle.gutter * (row - 1)) * height.slice(0, -1) / 100
          : height.replace(/px/g, '') * this.dpr
      }
      return 0
    },
    // 转换并获取长度
    getLength (length) {
      if (isExpectType(length, 'number')) return length
      if (isExpectType(length, 'string')) {
        return length.includes('%') ? length.slice(0, -1) / 100 : length.replace(/px/g, '')
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
    walk () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currIndex += 1
        this.draw()
      }, 1300)
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
