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
      canPlay: true,             // 是否可以开始游戏
      speed: 0,                  // 旋转速度
      prizeFlag: undefined,      // 中奖的索引
      animationId: null,         // 帧动画id
      Radius: 0,                 // 大转盘半径
      prizeDeg: 360,             // 奖品区域的角度
      prizeRadian: 0,            // 奖品区域的弧度
      prizeRadius: 0,            // 奖品区域的半径
      maxBtnRadius: 0,           // 最大的按钮半径
      rotateDeg: 0,              // 旋转的角度
      prizeImgs: [],             // 奖品图片缓存
      btnImgs: [],               // 按钮图片缓存
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
    },
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
            else if (!this.prizeImgs[prizeIndex][imgIndex]) prizeImgs[imgIndex] = newImg
            // 如果新值和旧值的src不相等
            else if (newImg.src !== oldImg.src) prizeImgs[imgIndex] = newImg
          })
          willUpdate[prizeIndex] = prizeImgs
        })
        return this.init(willUpdate)
      },
      deep: true
    },
    buttons: {
      handler (newData, oldData) {
        let willUpdate = []
        // 首次渲染时oldData为undefined
        if (!oldData) willUpdate = newData.map(btn => btn.imgs)
        // 此时新值一定存在
        else if (newData) newData.forEach((newBtn, btnIndex) => {
          let btnImgs = []
          const oldBtn = oldData[btnIndex]
          // 如果旧奖品不存在
          if (!oldBtn) btnImgs = newBtn.imgs
          // 新奖品有图片才能进行对比
          else if (newBtn.imgs) newBtn.imgs.forEach((newImg, imgIndex) => {
            const oldImg = oldBtn.imgs[imgIndex]
            // 如果旧值不存在
            if (!oldImg) btnImgs[imgIndex] = newImg
            // 如果缓存中没有图片
            else if (!this.btnImgs[btnIndex][imgIndex]) btnImgs[imgIndex] = newImg
            // 如果新值和旧值的src不相等
            else if (newImg.src !== oldImg.src) btnImgs[imgIndex] = newImg
          })
          willUpdate[btnIndex] = btnImgs
        })
        return this.init([...new Array(this.prizes.length).fill(), ...willUpdate])
      },
      deep: true
    }
  },
  mounted () {
    this.dpr = window.devicePixelRatio || 2
    // 收集首次渲染的图片
    let willUpdate = []
    this.prizes && (willUpdate = this.prizes.map(prize => prize.imgs))
    this.buttons && (willUpdate.push(...this.buttons.map(btn => btn.imgs)))
    this.init(willUpdate)
    window.addEventListener('resize', this.init.bind(this))
  },
  methods: {
    /**
     * 初始化canvas抽奖
     * @param { Array<Array<img>> } willUpdateImgs 需要更新的图片
     */
    init (willUpdateImgs) {
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
      const endCallBack = () => {
        // 开始绘制
        this.draw()
        canvas.addEventListener('click', e => {
          ctx.beginPath()
          ctx.arc(0, 0, this.maxBtnRadius, 0, Math.PI * 2, false)
          if (!ctx.isPointInPath(e.offsetX, e.offsetY)) return false
          this.$emit('start', e)
        })
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
     * @param { number } cellIndex 奖品索引
     * @param { number } imgIndex 奖品图片索引
     * @param { Function } callBack 图片加载完毕回调
     */
    loadAndCacheImg (cellIndex, imgIndex, callBack) {
      // 先判断index是奖品图片还是按钮图片, 并修正index的值
      const isPrize = cellIndex < this.prizes.length
      const cellName = isPrize ? 'prizes' : 'buttons'
      const imgName = isPrize ? 'prizeImgs' : 'btnImgs'
      cellIndex = isPrize ? cellIndex : cellIndex - this.prizes.length
      // 获取图片信息
      const cell = this[cellName][cellIndex]
      if (!cell) return false
      const imgInfo = cell.imgs[imgIndex]
      if (!imgInfo) return false
      // 创建图片
      let imgObj = new Image()
      if (!this[imgName][cellIndex]) this[imgName][cellIndex] = []
      // 创建缓存
      this[imgName][cellIndex][imgIndex] = { img: imgObj }
      imgObj.src = imgInfo.src
      imgObj.onload = () => {
        const currImg = this[imgName][cellIndex][imgIndex]
        if (!currImg) return false
        // 根据配置的样式计算图片的真实宽高
        if (imgInfo.width && imgInfo.height) {
          // 如果宽度和高度都填写了, 就如实计算
          currImg.trueWidth = this.getWidth(imgInfo.width)
          currImg.trueHeight = this.getHeight(imgInfo.height)
        } else if (imgInfo.width && !imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          currImg.trueWidth = this.getWidth(imgInfo.width)
          // 那高度就随着宽度进行等比缩放
          currImg.trueHeight = imgObj.height * (currImg.trueWidth / imgObj.width)
        } else if (!imgInfo.width && imgInfo.height) {
          // 如果只填写了宽度, 没填写高度
          currImg.trueHeight = this.getHeight(imgInfo.height)
          // 那宽度就随着高度进行等比缩放
          currImg.trueWidth = imgObj.width * (currImg.trueHeight / imgObj.height)
        } else {
          // 如果没有配置宽高, 则使用图片本身的宽高
          currImg.trueWidth = imgObj.width
          currImg.trueHeight = imgObj.height
        }
        // 最后触发回调
        callBack.call(this)
      }
    },
    draw () {
      const { ctx, dpr, _defaultStyle } = this
      // 清空画布
      ctx.clearRect(-this.Radius * 2, -this.Radius * 2, this.Radius * 2, this.Radius * 2)
      // 绘制blocks边框
      this.prizeRadius = this.blocks.reduce((radius, block) => {
        ctx.beginPath()
        ctx.fillStyle = block.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        return radius - getLength(block.padding.split(' ')[0]) * dpr
      }, this.Radius)
      // 计算起始弧度
      this.prizeDeg = 360 / this.prizes.length
      this.prizeRadian = getAngle(this.prizeDeg)
      let start = getAngle(-90 + this.rotateDeg)
      // 绘制prizes奖品区域
      this.prizes.forEach((prize, prizeIndex) => {
        // 计算当前奖品区域中间坐标点
        let currMiddleDeg = start + prizeIndex * this.prizeRadian
        // 绘制背景
        ctx.beginPath()
        ctx.fillStyle = prize.background
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, this.prizeRadius, currMiddleDeg - this.prizeRadian / 2, currMiddleDeg + this.prizeRadian / 2, false)
        ctx.fill()
        // 计算临时坐标并旋转文字
        let x = Math.cos(currMiddleDeg) * this.prizeRadius
        let y = Math.sin(currMiddleDeg) * this.prizeRadius
        ctx.translate(x, y)
        ctx.rotate(currMiddleDeg + getAngle(90))
        // 绘制图片
        prize.imgs && prize.imgs.forEach((imgInfo, imgIndex) => {
          if (!this.prizeImgs[prizeIndex]) return false
          const prizeImg = this.prizeImgs[prizeIndex][imgIndex]
          prizeImg && ctx.drawImage(
            prizeImg.img,
            this.getOffsetX(prizeImg.trueWidth),
            this.getHeight(imgInfo.top),
            prizeImg.trueWidth,
            prizeImg.trueHeight
          )
        })
        // 逐行绘制文字
        this.drawFont(prize.fonts)
        // 修正旋转角度和原点坐标
        ctx.rotate(getAngle(360) - currMiddleDeg - getAngle(90))
        ctx.translate(-x, -y)
      })
      // 绘制按钮
      this.buttons.forEach((btn, btnIndex) => {
        let radius = this.getHeight(btn.radius)
        // 绘制背景颜色
        this.maxBtnRadius = Math.max(this.maxBtnRadius, radius)
        ctx.beginPath()
        ctx.fillStyle = btn.background
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
        // 绘制指针
        if (btn.pointer) {
          ctx.beginPath()
          ctx.fillStyle = btn.background
          ctx.moveTo(-radius, 0)
          ctx.lineTo(radius, 0)
          ctx.lineTo(0, -radius * 2)
          ctx.closePath()
          ctx.fill()
        }
          // 绘制图片
        btn.imgs && btn.imgs.forEach((imgInfo, imgIndex) => {
          if (!this.btnImgs[btnIndex]) return false
          const btnImg = this.btnImgs[btnIndex][imgIndex]
          btnImg && ctx.drawImage(
            btnImg.img,
            this.getOffsetX(btnImg.trueWidth),
            this.getHeight(imgInfo.top),
            btnImg.trueWidth,
            btnImg.trueHeight
          )
        })
        // 绘制文字
        this.drawFont(btn.fonts)
      })
    },
    // 绘制文字
    drawFont (fonts) {
      if (!fonts) return false
      const { ctx, _defaultStyle } = this
      fonts.forEach(font => {
        String(font.text).split('\n').forEach((line, lineIndex) => {
          ctx.fillStyle = font.fontColor || _defaultStyle.fontColor
          ctx.font = `${font.fontSize || _defaultStyle.fontSize} ${font.fontStyle || _defaultStyle.fontStyle}`
          ctx.fillText(
            line,
            this.getOffsetX(ctx.measureText(line).width),
            this.getHeight(font.top) + (lineIndex + 1) * getLength(font.lineHeight || _defaultStyle.lineHeight)
          )
        })
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
    // 获取相对宽度
    getWidth (width) {
      if (isExpectType(width, 'number')) return width * this.dpr
      if (isExpectType(width, 'string')) return width.includes('%')
        ? width.slice(0, -1) / 100 * this.prizeRadian * this.prizeRadius
        : width.replace(/px/g, '') * this.dpr
      return 0
    },
    // 获取相对高度
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
