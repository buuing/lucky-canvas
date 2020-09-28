<template>
  <div ref="luckDraw" style="overflow: hidden">
    <canvas></canvas>
  </div>
</template>

<script>
import {
  isExpectType,
  getAngle,
  getLength,
  removeEnter,
} from '@/utils.js'

export default {
  props: {
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
    prizes: {
      type: Array,
      validator: function (prizes) {
        return prizes.every((item, index) => {
          if (item.fonts) {
            if (!item.fonts.every((font, fontIndex) => {
              if (!font.hasOwnProperty('text')) return console.error(`prizes[${index}].fonts[${fontIndex}]缺少 text 属性`)
              return true
            })) return false
          }
          if (item.imgs) {
            if (!item.imgs.every((img, imgIndex) => {
              if (!img.hasOwnProperty('src')) return console.error(`prizes[${index}].imgs[${imgIndex}]缺少 src 属性`)
              return true
            })) return false
          }
          return true
        })
      },
      default: () => []
    },
    buttons: {
      type: Array,
      validator: function (button) {
        if (button.fonts) {
          if (!button.fonts.every((font, fontIndex) => {
            if (!font.hasOwnProperty('text')) return console.error(`button.fonts[${fontIndex}]缺少 text 属性`)
            return true
          })) return false
        }
        if (button.imgs) {
          if (!button.imgs.every((img, imgIndex) => {
            if (!img.hasOwnProperty('src')) return console.error(`button.imgs[${imgIndex}]缺少 src 属性`)
            return true
          })) return false
        }
        return true
      },
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
        fontSize: '18px',
        fontColor: '#000',
        fontStyle: 'sans-serif, STHeiti, SimHei',
        background: '#fff',
        prizeGutter: '0px',
        wordWrap: true,
        lengthLimit: '90%',
        speed: 20,
      }
      for (let key in this.defaultStyle) {
        style[key] = this.defaultStyle[key]
      }
      style.speed = style.speed >> 0
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
        // 防止多次绑定点击事件
        canvas.onmousedown = e => {
          ctx.beginPath()
          ctx.arc(0, 0, this.maxBtnRadius, 0, Math.PI * 2, false)
          if (!ctx.isPointInPath(e.offsetX, e.offsetY)) return false
          if (!this.canPlay) return false
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
      // 计算文字横坐标
      const getFontX = (line) => {
        return this.getOffsetX(ctx.measureText(line).width)
      }
      // 计算文字纵坐标
      const getFontY = (font, lineIndex) => {
        // 优先使用字体行高, 要么使用默认行高, 其次使用字体大小, 否则使用默认字体大小
        const lineHeight = font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
        return this.getHeight(font.top) + (lineIndex + 1) * getLength(lineHeight) * dpr
      }
      ctx.save()
      // 绘制prizes奖品区域
      this.prizes.forEach((prize, prizeIndex) => {
        // 计算当前奖品区域中间坐标点
        let currMiddleDeg = start + prizeIndex * this.prizeRadian
        // 绘制背景
        ctx.beginPath()
        ctx.fillStyle = prize.background || _defaultStyle.background
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
          if (!prizeImg) return console.error('错误273: 没有奖品图片')
          const [trueWidth, trueHeight] = this.computedWidthAndHeight(
            prizeImg, imgInfo, this.prizeRadian * this.prizeRadius, this.prizeRadius - this.maxBtnRadius
          )
          ctx.drawImage(prizeImg, this.getOffsetX(trueWidth), this.getHeight(imgInfo.top), trueWidth, trueHeight)
        })
        // 逐行绘制文字
        prize.fonts && prize.fonts.forEach(font => {
          ctx.fillStyle = font.fontColor || _defaultStyle.fontColor
          ctx.font = `${getLength(font.fontSize || _defaultStyle.fontSize) * dpr}px ${font.fontStyle || _defaultStyle.fontStyle}`
          let lines = [], text = String(font.text)
          if (font.hasOwnProperty('wordWrap') ? font.wordWrap : _defaultStyle.wordWrap) {
            text = removeEnter(text)
            let str = ''
            for (let i = 0; i < text.length; i++) {
              str += text[i]
              let currWidth = ctx.measureText(str).width
              let maxWidth = (this.prizeRadius - getFontY(font, lines.length)) * Math.tan(this.prizeRadian / 2) * 2
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
            ctx.fillText(line, getFontX(line), getFontY(font, lineIndex))
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
          ctx.drawImage(btnImg, this.getOffsetX(trueWidth), this.getHeight(imgInfo.top), trueWidth, trueHeight)
        })
        // 绘制按钮文字
        btn.fonts && btn.fonts.forEach(font => {
          ctx.fillStyle = font.fontColor || _defaultStyle.fontColor
          ctx.font = `${getLength(font.fontSize || _defaultStyle.fontSize) * dpr}px ${font.fontStyle || _defaultStyle.fontStyle}`
          String(font.text).split('\n').forEach((line, lineIndex) => {
            ctx.fillText(line, getFontX(line), getFontY(font, lineIndex))
          })
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
      let { speed, prizeFlag, prizeDeg, rotateDeg, _defaultStyle } = this
      // 让转盘先完全转起来再停止
      if (speed >= _defaultStyle.speed && prizeFlag !== undefined) {
        if (
          rotateDeg % 360 > prizeFlag * prizeDeg && rotateDeg % 360 < prizeFlag * prizeDeg + prizeDeg
        ) return this.slowDown()
      }
      if (speed < _defaultStyle.speed) this.speed += 0.1
      this.rotateDeg += speed
      this.draw()
      this.animationId = window.requestAnimationFrame(this.run)
    },
    stop (index) {
      this.prizeFlag = index % this.prizes.length
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
    getWidth (length, width = this.prizeRadian * this.prizeRadius) {
      if (isExpectType(length, 'number')) return length * this.dpr
      if (isExpectType(length, 'string')) return length.includes('%')
        ? length.slice(0, -1) / 100 * width
        : length.replace(/px/g, '') * this.dpr
      return 0
    },
    // 获取相对高度
    getHeight (length, height = this.prizeRadius) {
      if (isExpectType(length, 'number')) return length * this.dpr
      if (isExpectType(length, 'string')) return length.includes('%')
        ? length.slice(0, -1) / 100 * height
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
