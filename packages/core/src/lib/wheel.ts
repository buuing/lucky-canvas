import Lucky from './lucky'
import { UserConfigType, FontItemType, ImgType } from '../types/index'
import LuckyWheelConfig, {
  BlockType,
  PrizeType,
  ButtonType,
  DefaultConfigType,
  DefaultStyleType,
  StartCallbackType,
  EndCallbackType
} from '../types/wheel'
import {
  removeEnter,
  hasBackground,
  computeRange,
  splitText,
  has,
} from '../utils/index'
import { getAngle, fanShapedByArc } from '../utils/math'
import { quad } from '../utils/tween'

export default class LuckyWheel extends Lucky {
  private blocks: Array<BlockType> = []
  private prizes: Array<PrizeType> = []
  private buttons: Array<ButtonType> = []
  private defaultConfig: DefaultConfigType = {}
  private defaultStyle: DefaultStyleType = {}
  private _defaultConfig: Required<DefaultConfigType> = {} as Required<DefaultConfigType>
  private _defaultStyle: Required<DefaultStyleType> = {} as Required<DefaultStyleType>
  private startCallback?: StartCallbackType
  private endCallback?: EndCallbackType
  private Radius = 0                    // 大转盘半径
  private prizeRadius = 0               // 奖品区域半径
  private prizeDeg = 0                  // 奖品数学角度
  private prizeAng = 0               // 奖品运算角度
  private rotateDeg = 0                 // 转盘旋转角度
  private maxBtnRadius = 0              // 最大按钮半径
  private startTime = 0                 // 开始时间戳
  private endTime = 0                   // 停止时间戳
  private stopDeg = 0                   // 刻舟求剑
  private endDeg = 0                    // 停止角度
  private FPS = 16.6                    // 屏幕刷新率
  /**
   * 游戏当前的阶段
   * step = 0 时, 游戏尚未开始
   * step = 1 时, 此时处于加速阶段
   * step = 2 时, 此时处于匀速阶段
   * step = 3 时, 此时处于减速阶段
   */
  private step: 0 | 1 | 2 | 3 = 0
  /**
   * 中奖索引
   * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
   * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
   * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
   */
  private prizeFlag: number | undefined
  private ImageCache = new Map()

  /**
   * 大转盘构造器
   * @param config 配置项
   * @param data 抽奖数据
   */
  constructor (config: UserConfigType, data: LuckyWheelConfig) {
    super(config, {
      width: data.width,
      height: data.height
    })
    this.initData(data)
    this.initWatch()
    this.initComputed()
    // 创建前回调函数
    config.beforeCreate?.call(this)
    // 首次初始化
    this.init()
  }

  protected resize(): void {
    super.resize()
    this.Radius = Math.min(this.boxWidth, this.boxHeight) / 2
    this.ctx.translate(this.Radius, this.Radius)
    this.draw()
    this.config.afterResize?.()
  }

  protected initLucky (): void {
    this.Radius = 0
    this.prizeRadius = 0
    this.prizeDeg = 0
    this.prizeAng = 0
    this.rotateDeg = 0
    this.maxBtnRadius = 0
    this.startTime = 0
    this.endTime = 0
    this.stopDeg = 0
    this.endDeg = 0
    this.FPS = 16.6
    this.prizeFlag = -1
    this.step = 0
    super.initLucky()
  }

  /**
   * 初始化数据
   * @param data
   */
  private initData (data: LuckyWheelConfig): void {
    this.$set(this, 'width', data.width)
    this.$set(this, 'height', data.height)
    this.$set(this, 'blocks', data.blocks || [])
    this.$set(this, 'prizes', data.prizes || [])
    this.$set(this, 'buttons', data.buttons || [])
    this.$set(this, 'defaultConfig', data.defaultConfig || {})
    this.$set(this, 'defaultStyle', data.defaultStyle || {})
    this.$set(this, 'startCallback', data.start)
    this.$set(this, 'endCallback', data.end)
  }

  /**
   * 初始化属性计算
   */
  private initComputed () {
    // 默认配置
    this.$computed(this, '_defaultConfig', () => {
      const config = {
        gutter: '0px',
        offsetDegree: 0,
        speed: 20,
        speedFunction: 'quad',
        accelerationTime: 2500,
        decelerationTime: 2500,
        stopRange: 0,
        ...this.defaultConfig
      }
      return config
    })
    // 默认样式
    this.$computed(this, '_defaultStyle', () => {
      const style = {
        fontSize: '18px',
        fontColor: '#000',
        fontStyle: 'sans-serif',
        fontWeight: '400',
        background: 'rgba(0,0,0,0)',
        wordWrap: true,
        lengthLimit: '90%',
        ...this.defaultStyle
      }
      return style
    })
  }

  /**
   * 初始化观察者
   */
  private initWatch () {
    // 重置宽度
    this.$watch('width', (newVal: string | number) => {
      this.data.width = newVal
      this.resize()
    })
    // 重置高度
    this.$watch('height', (newVal: string | number) => {
      this.data.height = newVal
      this.resize()
    })
    // 观察 blocks 变化收集图片
    this.$watch('blocks', (newData: Array<BlockType>) => {
      this.initImageCache()
    }, { deep: true })
    // 观察 prizes 变化收集图片
    this.$watch('prizes', (newData: Array<PrizeType>) => {
      this.initImageCache()
    }, { deep: true })
    // 观察 buttons 变化收集图片
    this.$watch('buttons', (newData: Array<ButtonType>) => {
      this.initImageCache()
    }, { deep: true })
    this.$watch('defaultConfig', () => this.draw(), { deep: true })
    this.$watch('defaultStyle', () => this.draw(), { deep: true })
    this.$watch('startCallback', () => this.init())
    this.$watch('endCallback', () => this.init())
  }

  /**
   * 初始化 canvas 抽奖
   */
  public async init (): Promise<void> {
    this.initLucky()
    const { config } = this
    // 初始化前回调函数
    config.beforeInit?.call(this)
    this.draw() // 先画一次, 防止闪烁
    this.draw() // 再画一次, 拿到正确的按钮轮廓
    // 异步加载图片
    await this.initImageCache()
    // 初始化后回调函数
    config.afterInit?.call(this)
  }

  private initImageCache (): Promise<void> {
    return new Promise((resolve) => {
      const willUpdateImgs = {
        blocks: this.blocks.map(block => block.imgs),
        prizes: this.prizes.map(prize => prize.imgs),
        buttons: this.buttons.map(btn => btn.imgs),
      }
      ;(<(keyof typeof willUpdateImgs)[]>Object.keys(willUpdateImgs)).forEach(imgName => {
        const willUpdate = willUpdateImgs[imgName]
        // 循环遍历所有图片
        const allPromise: Promise<void>[] = []
        willUpdate && willUpdate.forEach((imgs, cellIndex) => {
          imgs && imgs.forEach((imgInfo, imgIndex) => {
            allPromise.push(this.loadAndCacheImg(imgName, cellIndex, imgIndex))
          })
        })
        Promise.all(allPromise).then(() => {
          this.draw()
          resolve()
        })
      })
    })
  }

  /**
   * canvas点击事件
   * @param e 事件参数
   */
  protected handleClick (e: MouseEvent): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.arc(0, 0, this.maxBtnRadius, 0, Math.PI * 2, false)
    if (!ctx.isPointInPath(e.offsetX, e.offsetY)) return
    if (this.step !== 0) return
    this.startCallback?.(e)
  }

  /**
   * 根据索引单独加载指定图片并缓存
   * @param cellName 模块名称
   * @param cellIndex 模块索引
   * @param imgName 模块对应的图片缓存
   * @param imgIndex 图片索引
   */
  private async loadAndCacheImg (
    cellName: 'blocks' | 'prizes' | 'buttons',
    cellIndex: number,
    imgIndex: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // 获取图片信息
      const cell: BlockType | PrizeType | ButtonType = this[cellName][cellIndex]
      if (!cell || !cell.imgs) return
      const imgInfo = cell.imgs[imgIndex]
      if (!imgInfo) return
      // 异步加载图片
      this.loadImg(imgInfo.src, imgInfo).then(async currImg => {
        if (typeof imgInfo.formatter === 'function') {
          currImg = await Promise.resolve(imgInfo.formatter.call(this, currImg))
        }
        this.ImageCache.set(imgInfo['src'], currImg)
        resolve()
      }).catch(err => {
        console.error(`${cellName}[${cellIndex}].imgs[${imgIndex}] ${err}`)
        reject()
      })
    })
  }

  private drawBlock (radius: number, block: BlockType, blockIndex: number): void {
    const { ctx } = this
    if (hasBackground(block.background)) {
      ctx.beginPath()
      ctx.fillStyle = block.background!
      ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
      ctx.fill()
    }
    block.imgs && block.imgs.forEach((imgInfo, imgIndex) => {
      const blockImg = this.ImageCache.get(imgInfo.src)
      if (!blockImg) return
      // 绘制图片
      const [trueWidth, trueHeight] = this.computedWidthAndHeight(blockImg, imgInfo, radius * 2, radius * 2)
      const [xAxis, yAxis] = [this.getOffsetX(trueWidth) + this.getLength(imgInfo.left, radius * 2), this.getLength(imgInfo.top, radius * 2) - radius]
      ctx.save()
      imgInfo.rotate && ctx.rotate(getAngle(this.rotateDeg))
      this.drawImage(ctx, blockImg, xAxis, yAxis, trueWidth, trueHeight)
      ctx.restore()
    })
  }

  /**
   * 开始绘制
   */
  protected draw (): void {
    const { config, ctx, _defaultConfig, _defaultStyle } = this
    // 触发绘制前回调
    config.beforeDraw?.call(this, ctx)
    // 清空画布
    ctx.clearRect(-this.Radius, -this.Radius, this.Radius * 2, this.Radius * 2)
    // 计算 padding 并绘制 blocks 边框
    this.prizeRadius = this.blocks.reduce((radius, block, blockIndex) => {
      this.drawBlock(radius, block, blockIndex)
      return radius - this.getLength(block.padding && block.padding.split(' ')[0])
    }, this.Radius)
    // 计算起始弧度
    this.prizeDeg = 360 / this.prizes.length
    this.prizeAng = getAngle(this.prizeDeg)
    const shortSide = this.prizeRadius * Math.sin(this.prizeAng / 2) * 2
    // 起始角度调整到正上方, 并且减去半个扇形角度
    let start = getAngle(this.rotateDeg - 90 + this.prizeDeg / 2 + _defaultConfig.offsetDegree)
    // 计算文字横坐标
    const getFontX = (font: FontItemType, line: string) => {
      return this.getOffsetX(ctx.measureText(line).width) + this.getLength(font.left, shortSide)
    }
    // 计算文字纵坐标
    const getFontY = (font: FontItemType, height: number, lineIndex: number) => {
      // 优先使用字体行高, 要么使用默认行高, 其次使用字体大小, 否则使用默认字体大小
      const lineHeight = font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
      return this.getLength(font.top, height) + (lineIndex + 1) * this.getLength(lineHeight)
    }
    ctx.save()
    // 绘制prizes奖品区域
    this.prizes.forEach((prize, prizeIndex) => {
      // 计算当前奖品区域中间坐标点
      let currMiddleDeg = start + prizeIndex * this.prizeAng
      // 奖品区域可见高度
      let prizeHeight = this.prizeRadius - this.maxBtnRadius
      // 绘制背景
      const background = prize.background || _defaultStyle.background
      if (hasBackground(background)) {
        ctx.fillStyle = background
        fanShapedByArc(
          ctx, this.maxBtnRadius, this.prizeRadius,
          currMiddleDeg - this.prizeAng / 2,
          currMiddleDeg + this.prizeAng / 2,
          this.getLength(_defaultConfig.gutter),
        )
        ctx.fill()
      }
      // 计算临时坐标并旋转文字
      let x = Math.cos(currMiddleDeg) * this.prizeRadius
      let y = Math.sin(currMiddleDeg) * this.prizeRadius
      ctx.translate(x, y)
      ctx.rotate(currMiddleDeg + getAngle(90))
      // 绘制图片
      prize.imgs && prize.imgs.forEach((imgInfo, imgIndex) => {
        const prizeImg = this.ImageCache.get(imgInfo.src)
        if (!prizeImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(
          prizeImg,
          imgInfo,
          this.prizeAng * this.prizeRadius,
          prizeHeight
        )
        const [xAxis, yAxis] = [
          this.getOffsetX(trueWidth) + this.getLength(imgInfo.left, shortSide),
          this.getLength(imgInfo.top, prizeHeight)
        ]
        this.drawImage(ctx, prizeImg, xAxis, yAxis, trueWidth, trueHeight)
      })
      // 逐行绘制文字
      prize.fonts && prize.fonts.forEach(font => {
        const fontColor = font.fontColor || _defaultStyle.fontColor
        const fontWeight = font.fontWeight || _defaultStyle.fontWeight
        const fontSize = this.getLength(font.fontSize || _defaultStyle.fontSize)
        const fontStyle = font.fontStyle || _defaultStyle.fontStyle
        const wordWrap = has(font, 'wordWrap') ? font.wordWrap : _defaultStyle.wordWrap
        const lengthLimit = font.lengthLimit || _defaultStyle.lengthLimit
        const lineClamp = font.lineClamp || _defaultStyle.lineClamp
        ctx.fillStyle = fontColor
        ctx.font = `${fontWeight} ${fontSize >> 0}px ${fontStyle}`
        let lines = [], text = String(font.text)
        if (wordWrap) {
          lines = splitText(ctx, removeEnter(text), (lines) => {
            // 三角形临边
            const adjacentSide = this.prizeRadius - getFontY(font, prizeHeight, lines.length)
            // 三角形短边
            const shortSide = adjacentSide * Math.tan(this.prizeAng / 2)
            // 最大宽度
            let maxWidth = shortSide * 2 - this.getLength(_defaultConfig.gutter)
            return this.getLength(lengthLimit, maxWidth)
          }, lineClamp)
        } else {
          lines = text.split('\n')
        }
        lines.filter(line => !!line).forEach((line, lineIndex) => {
          ctx.fillText(line, getFontX(font, line), getFontY(font, prizeHeight, lineIndex))
        })
      })
      // 修正旋转角度和原点坐标
      ctx.rotate(getAngle(360) - currMiddleDeg - getAngle(90))
      ctx.translate(-x, -y)
    })
    ctx.restore()
    // 绘制按钮
    this.buttons.forEach((btn, btnIndex) => {
      let radius = this.getLength(btn.radius, this.prizeRadius)
      // 绘制背景颜色
      this.maxBtnRadius = Math.max(this.maxBtnRadius, radius)
      if (hasBackground(btn.background)) {
        ctx.beginPath()
        ctx.fillStyle = btn.background as string
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
      }
      // 绘制指针
      if (btn.pointer && hasBackground(btn.background)) {
        ctx.beginPath()
        ctx.fillStyle = btn.background as string
        ctx.moveTo(-radius, 0)
        ctx.lineTo(radius, 0)
        ctx.lineTo(0, -radius * 2)
        ctx.closePath()
        ctx.fill()
      }
      // 绘制按钮图片
      btn.imgs && btn.imgs.forEach((imgInfo, imgIndex) => {
        const btnImg = this.ImageCache.get(imgInfo.src)
        if (!btnImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(btnImg, imgInfo, radius * 2, radius * 2)
        const [xAxis, yAxis] = [this.getOffsetX(trueWidth) + this.getLength(imgInfo.left, radius), this.getLength(imgInfo.top, radius)]
        this.drawImage(ctx, btnImg, xAxis, yAxis, trueWidth, trueHeight)
      })
      // 绘制按钮文字
      btn.fonts && btn.fonts.forEach(font => {
        let fontColor = font.fontColor || _defaultStyle.fontColor
        let fontWeight = font.fontWeight || _defaultStyle.fontWeight
        let fontSize = this.getLength(font.fontSize || _defaultStyle.fontSize)
        let fontStyle = font.fontStyle || _defaultStyle.fontStyle
        ctx.fillStyle = fontColor
        ctx.font = `${fontWeight} ${fontSize >> 0}px ${fontStyle}`
        String(font.text).split('\n').forEach((line, lineIndex) => {
          ctx.fillText(line, getFontX(font, line), getFontY(font, radius, lineIndex))
        })
      })
    })
    // 触发绘制后回调
    config.afterDraw?.call(this, ctx)
  }

  /**
   * 刻舟求剑
   */
  private carveOnGunwaleOfAMovingBoat (): void {
    const { _defaultConfig, prizeFlag, prizeDeg, rotateDeg } = this
    this.endTime = Date.now()
    const stopDeg = this.stopDeg = rotateDeg
    const speed = _defaultConfig.speed
    const stopRange = (Math.random() * prizeDeg - prizeDeg / 2) * this.getLength(_defaultConfig.stopRange)
    let i = 0, prevSpeed = 0, prevDeg = 0
    while (++i) {
      const endDeg = 360 * i - prizeFlag! * prizeDeg - rotateDeg - _defaultConfig.offsetDegree + stopRange - prizeDeg / 2
      let currSpeed = quad.easeOut(this.FPS, stopDeg, endDeg, _defaultConfig.decelerationTime) - stopDeg
      if (currSpeed > speed) {
        this.endDeg = (speed - prevSpeed > currSpeed - speed) ? endDeg : prevDeg
        break
      }
      prevDeg = endDeg
      prevSpeed = currSpeed
    }
  }

  /**
   * 对外暴露: 开始抽奖方法
   */
  public play (): void {
    if (this.step !== 0) return
    // 记录游戏开始时间
    this.startTime = Date.now()
    // 重置中奖索引
    this.prizeFlag = void 0
    // 加速阶段
    this.step = 1
    // 触发回调
    this.config.afterStart?.()
    // 开始游戏
    this.run()
  }

  /**
   * 对外暴露: 缓慢停止方法
   * @param index 中奖索引
   */
  public stop (index?: number): void {
    if (this.step === 0 || this.step === 3) return
    // 如果没有传递中奖索引, 则通过range属性计算一个
    if (!index && index !== 0) {
      const rangeArr = this.prizes.map(item => item.range)
      index = computeRange(rangeArr)
    }
    // 如果index是负数则停止游戏, 反之则传递中奖索引
    if (index < 0) {
      this.step = 0
      this.prizeFlag = -1
    } else {
      this.step = 2
      this.prizeFlag = index % this.prizes.length
    }
  }

  /**
   * 实际开始执行方法
   * @param num 记录帧动画执行多少次
   */
  private run (num: number = 0): void {
    const { rAF, step, prizeFlag, _defaultConfig } = this
    const { accelerationTime, decelerationTime, speed } = _defaultConfig
    // 游戏结束
    if (step === 0) {
      this.endCallback?.(this.prizes.find((prize, index) => index === prizeFlag) || {})
      return
    }
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return
    // 计算结束位置
    if (step === 3 && !this.endDeg) this.carveOnGunwaleOfAMovingBoat()
    // 计算时间间隔
    const startInterval = Date.now() - this.startTime
    const endInterval = Date.now() - this.endTime
    let rotateDeg = this.rotateDeg
    // 
    if (step === 1 || startInterval < accelerationTime) { // 加速阶段
      // 记录帧率
      this.FPS = startInterval / num
      const currSpeed = quad.easeIn(startInterval, 0, speed, accelerationTime)
      // 加速到峰值后, 进入匀速阶段
      if (currSpeed === speed) {
        this.step = 2
      }
      rotateDeg = rotateDeg + currSpeed % 360
    } else if (step === 2) { // 匀速阶段
      // 速度保持不变
      rotateDeg = rotateDeg + speed % 360
      // 如果 prizeFlag 有值, 则进入减速阶段
      if (prizeFlag !== void 0 && prizeFlag >= 0) {
        this.step = 3
        // 清空上一次的位置信息
        this.stopDeg = 0
        this.endDeg = 0
      }
    } else if (step === 3) { // 减速阶段
      // 开始缓慢停止
      rotateDeg = quad.easeOut(endInterval, this.stopDeg, this.endDeg, decelerationTime)
      if (endInterval >= decelerationTime) {
        this.step = 0
      }
    } else {
      // 出现异常
      this.stop(-1)
    }
    this.rotateDeg = rotateDeg
    this.draw()
    rAF(this.run.bind(this, num + 1))
  }

  /**
   * 换算渲染坐标
   * @param x
   * @param y
   */
  protected conversionAxis (x: number, y: number): [number, number] {
    const { config } = this
    return [x / config.dpr - this.Radius, y / config.dpr - this.Radius]
  }
}
