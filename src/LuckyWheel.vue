<template>
  <div ref="luckDraw" style="overflow: hidden">
    <canvas></canvas>
  </div>
</template>

<script>
import {
  isExpectType,
  removeEnter,
  paramsValidator,
} from '../utils/index.js'

import {
  getAngle,
  drawSector,
} from '../utils/math.js'

const easeIn = (t, b, c, d) => {
  if (t >= d) t = d
  return c * (t /= d) * t + b
}
const easeOut = (t, b, c, d) => {
  if (t >= d) t = d
  return -c * (t /= d) * (t - 2) + b
}

export default {
  props: {
    blocks: {
      type: Array,
      validator (data) {
        return paramsValidator({ blocks: data }, {
          blocks: { padding: 1, background: 1 }
        })
      },
      default: () => []
    },
    prizes: {
      type: Array,
      validator (data) {
        return paramsValidator({ prizes: data }, {
          prizes: { fonts: { text: 1 }, imgs: { src: 1 } }
        })
      },
      default: () => []
    },
    buttons: {
      type: Array,
      validator (data) {
        return paramsValidator({ buttons: data }, {
          buttons: { fonts: { text: 1 }, imgs: { src: 1 } }
        })
      },
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
      ctx: null,
      startTime: 0,              // 游戏开始的时间戳
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
      htmlFontSize: 16,          // 根元素的字体大小 (适配rem)
    }
  },
  computed: {
    _defaultStyle () {
      const style = {
        fontSize: '18px',
        fontColor: '#000',
        fontStyle: 'microsoft yahei ui,microsoft yahei,simsun,sans-serif',
        fontWeight: '400',
        background: '#fff',
        wordWrap: true,
        lengthLimit: '90%',
        gutter: '0px',
      }
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      return style
    },
    _defaultConfig () {
      const config = {
        speed: 20,
        rotateTime: 2500,
        stopTime: 2500,
      }
      for (let key in this.defaultConfig) {
        config[key] = this.defaultConfig[key] >> 0
      }
      return config
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
            // 如果缓存中没有奖品或图片
            else if (!this.prizeImgs[prizeIndex] || !this.prizeImgs[prizeIndex][imgIndex]) {
              prizeImgs[imgIndex] = newImg
            }
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
          // 如果旧奖品不存在或旧奖品的图片不存在
          if (!oldBtn || !oldBtn.imgs) btnImgs = newBtn.imgs
          // 新奖品有图片才能进行对比
          else if (newBtn.imgs) newBtn.imgs.forEach((newImg, imgIndex) => {
            const oldImg = oldBtn.imgs[imgIndex]
            // 如果旧值不存在
            if (!oldImg) btnImgs[imgIndex] = newImg
            // 如果缓存中没有按钮或图片
            else if (!this.btnImgs[btnIndex] || !this.btnImgs[btnIndex][imgIndex]) {
              btnImgs[imgIndex] = newImg
            }
            // 如果新值和旧值的src不相等
            else if (newImg.src !== oldImg.src) btnImgs[imgIndex] = newImg
          })
          willUpdate[btnIndex] = btnImgs
        })
        return this.init([...new Array(this.prizes.length).fill(), ...willUpdate])
      },
      deep: true
    },
    blocks: {
      handler () {
        this.init()
      },
      deep: true,
    },
  },
  mounted () {
    this.dpr = window.devicePixelRatio
    this.dpr = ((!this.dpr || this.dpr < 2) ? 2 : this.dpr) * 1.3
    window.dpr = this.dpr
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
      this.htmlFontSize = getComputedStyle(window.document.documentElement).fontSize.slice(0, -2)
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
        // 防止多次绑定点击事件
        canvas.onclick = e => {
          ctx.beginPath()
          ctx.arc(0, 0, this.maxBtnRadius, 0, Math.PI * 2, false)
          if (!ctx.isPointInPath(e.offsetX, e.offsetY)) return false
          if (this.startTime) return false
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
      this[imgName][cellIndex][imgIndex] = imgObj
      imgObj.src = imgInfo.src
      imgObj.onload = () => callBack.call(this)
    },
    computedWidthAndHeight (imgObj, imgInfo, computedWidth, computedHeight) {
      // 根据配置的样式计算图片的真实宽高
      if (!imgInfo.width && !imgInfo.height) {
        // 如果没有配置宽高, 则使用图片本身的宽高
        return [imgObj.width, imgObj.height]
      } else if (imgInfo.width && !imgInfo.height) {
        // 如果只填写了宽度, 没填写高度
        let trueWidth = this.getWidth(imgInfo.width, computedWidth)
        // 那高度就随着宽度进行等比缩放
        return [trueWidth, imgObj.height * (trueWidth / imgObj.width)]
      } else if (!imgInfo.width && imgInfo.height) {
        // 如果只填写了宽度, 没填写高度
        let trueHeight = this.getHeight(imgInfo.height, computedHeight)
        // 那宽度就随着高度进行等比缩放
        return [imgObj.width * (trueHeight / imgObj.height), trueHeight]
      }
      // 如果宽度和高度都填写了, 就如实计算
      return [
        this.getWidth(imgInfo.width, computedWidth),
        this.getHeight(imgInfo.height, computedHeight)
      ]
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
        return radius - this.getLength(block.padding.split(' ')[0]) * dpr
      }, this.Radius)
      // 计算起始弧度
      this.prizeDeg = 360 / this.prizes.length
      this.prizeRadian = getAngle(this.prizeDeg)
      let start = getAngle(-90 + this.rotateDeg)
      // 计算文字横坐标
      const getFontX = (line) => {
        return this.getOffsetX(ctx.measureText(line).width)
      }
      // 计算文字纵坐标
      const getFontY = (font, height, lineIndex) => {
        // 优先使用字体行高, 要么使用默认行高, 其次使用字体大小, 否则使用默认字体大小
        const lineHeight = font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
        return this.getHeight(font.top, height) + (lineIndex + 1) * this.getLength(lineHeight) * dpr
      }
      ctx.save()
      // 绘制prizes奖品区域
      this.prizes.forEach((prize, prizeIndex) => {
        // 计算当前奖品区域中间坐标点
        let currMiddleDeg = start + prizeIndex * this.prizeRadian
        // 奖品区域可见高度
        let prizeHeight = this.prizeRadius - this.maxBtnRadius
        // 绘制背景
        drawSector(
          ctx, this.maxBtnRadius, this.prizeRadius,
          currMiddleDeg - this.prizeRadian / 2,
          currMiddleDeg + this.prizeRadian / 2,
          this.getLength(_defaultStyle.gutter) * dpr,
          prize.background || _defaultStyle.background
        )
        // 计算临时坐标并旋转文字
        let x = Math.cos(currMiddleDeg) * this.prizeRadius
        let y = Math.sin(currMiddleDeg) * this.prizeRadius
        ctx.translate(x, y)
        ctx.rotate(currMiddleDeg + getAngle(90))
        // 绘制图片
        prize.imgs && prize.imgs.forEach((imgInfo, imgIndex) => {
          if (!this.prizeImgs[prizeIndex]) return false
          const prizeImg = this.prizeImgs[prizeIndex][imgIndex]
          if (!prizeImg) return console.error(`错误273: prizes[${prizeIndex}]没有奖品图片`)
          const [trueWidth, trueHeight] = this.computedWidthAndHeight(
            prizeImg, imgInfo, this.prizeRadian * this.prizeRadius, prizeHeight
          )
          ctx.drawImage(
            prizeImg,
            this.getOffsetX(trueWidth),
            this.getHeight(imgInfo.top, prizeHeight),
            trueWidth,
            trueHeight
          )
        })
        // 逐行绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          let fontColor = font.fontColor || _defaultStyle.fontColor
          let fontWeight = font.fontWeight || _defaultStyle.fontWeight
          let fontSize = this.getLength(font.fontSize || _defaultStyle.fontSize)
          let fontStyle = font.fontStyle || _defaultStyle.fontStyle
          ctx.fillStyle = fontColor
          ctx.font = `${fontWeight} ${fontSize * dpr}px ${fontStyle}`
          let lines = [], text = String(font.text)
          if (font.hasOwnProperty('wordWrap') ? font.wordWrap : _defaultStyle.wordWrap) {
            text = removeEnter(text)
            let str = ''
            for (let i = 0; i < text.length; i++) {
              str += text[i]
              let currWidth = ctx.measureText(str).width
              let maxWidth = (this.prizeRadius - getFontY(font, prizeHeight, lines.length))
                * Math.tan(this.prizeRadian / 2) * 2 - this.getLength(_defaultStyle.gutter) * dpr
              if (currWidth > this.getWidth(font.lengthLimit || _defaultStyle.lengthLimit, maxWidth)) {
                lines.push(str.slice(0, -1))
                str = text[i]
              }
            }
            if (str) lines.push(str)
            if (!lines.length) lines.push(text)
          } else {
            lines = text.split('\n')
          }
          lines.filter(line => !!line).forEach((line, lineIndex) => {
            ctx.fillText(line, getFontX(line), getFontY(font, prizeHeight, lineIndex))
          })
        })
        // 修正旋转角度和原点坐标
        ctx.rotate(getAngle(360) - currMiddleDeg - getAngle(90))
        ctx.translate(-x, -y)
      })
      ctx.restore()
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
        // 绘制按钮图片
        btn.imgs && btn.imgs.forEach((imgInfo, imgIndex) => {
          if (!this.btnImgs[btnIndex]) return false
          const btnImg = this.btnImgs[btnIndex][imgIndex]
          if (!btnImg) return console.error('错误339: 没有按钮图片')
          // 计算图片真实宽高
          const [trueWidth, trueHeight] = this.computedWidthAndHeight(
            btnImg, imgInfo, this.getHeight(btn.radius) * 2, this.getHeight(btn.radius) * 2
          )
          // 绘制图片
          ctx.drawImage(btnImg, this.getOffsetX(trueWidth), this.getHeight(imgInfo.top, radius), trueWidth, trueHeight)
        })
        // 绘制按钮文字
        btn.fonts && btn.fonts.forEach(font => {
          let fontColor = font.fontColor || _defaultStyle.fontColor
          let fontWeight = font.fontWeight || _defaultStyle.fontWeight
          let fontSize = this.getLength(font.fontSize || _defaultStyle.fontSize)
          let fontStyle = font.fontStyle || _defaultStyle.fontStyle
          ctx.fillStyle = fontColor
          ctx.font = `${fontWeight} ${fontSize * dpr}px ${fontStyle}`
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.fillText(line, getFontX(line), getFontY(font, radius, lineIndex))
          })
        })
      })
    },
    // 对外暴露: 开始抽奖方法
    play () {
      // 再次拦截, 因为play是可以异步调用的
      if (this.startTime) return false
      cancelAnimationFrame(this.animationId)
      this.startTime = Date.now()
      this.prizeFlag = undefined
      this.run()
    },
    // 对外暴露: 缓慢停止方法
    stop (index) {
      this.prizeFlag = index % this.prizes.length
    },
    // 实际开始执行方法
    run () {
      const { prizeFlag, prizeDeg, rotateDeg, _defaultConfig } = this
      let interval = Date.now() - this.startTime
      // 先完全旋转, 再停止
      if (interval >= _defaultConfig.rotateTime && prizeFlag !== undefined) {
        // 记录开始停止的时间戳
        this.endTime = Date.now()
        // 记录开始停止的位置
        this.stopDeg = rotateDeg
        // 最终停止的角度
        this.endDeg = 360 * 5 - prizeFlag * prizeDeg - rotateDeg
        cancelAnimationFrame(this.animationId)
        return this.slowDown()
      }
      this.rotateDeg = (rotateDeg + easeIn(interval, 0, _defaultConfig.speed, _defaultConfig.rotateTime)) % 360
      this.draw()
      this.animationId = window.requestAnimationFrame(this.run)
    },
    // 缓慢停止的方法
    slowDown () {
      const { prizes, prizeFlag, stopDeg, endDeg, _defaultConfig } = this
      let interval = Date.now() - this.endTime
      if (interval >= _defaultConfig.stopTime) {
        this.startTime = 0
        this.$emit('end', {...prizes.find((prize, index) => index === prizeFlag)})
        return cancelAnimationFrame(this.animationId)
      }
      this.rotateDeg = easeOut(interval, stopDeg, endDeg, _defaultConfig.stopTime) % 360
      this.draw()
      this.animationId = window.requestAnimationFrame(this.slowDown)
    },
    // 获取长度
    getLength (length) {
      if (isExpectType(length, 'number')) return length
      if (isExpectType(length, 'string')) return this.changeUnits(length, {
        clean: true
      })
      return 0
    },
    // 获取相对宽度
    getWidth (length, width = this.prizeRadian * this.prizeRadius) {
      if (isExpectType(length, 'number')) return length * this.dpr
      if (isExpectType(length, 'string')) return this.changeUnits(length, {
        denominator: width
      })
      return 0
    },
    // 获取相对高度
    getHeight (length, height = this.prizeRadius) {
      if (isExpectType(length, 'number')) return length * this.dpr
      if (isExpectType(length, 'string')) return this.changeUnits(length, {
        denominator: height
      })
      return 0
    },
    // 转换单位
    changeUnits (value, { denominator = 1, clean = false }) {
      return Number(value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, (value, num, unit) => {
        switch (unit) {
          case '%':
            num *= (denominator / 100)
            break
          case 'px':
            num *= 1
            break
          case 'rem':
            num *= this.htmlFontSize
            break
          default:
            num *= 1
            break
        }
        return clean || unit === '%' ? num : num * this.dpr
      }))
    },
    // 获取相对(居中)X坐标
    getOffsetX (width) {
      return -width / 2
    },
  }
}
</script>
