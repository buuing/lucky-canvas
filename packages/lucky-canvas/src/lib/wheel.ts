import Lucky from './lucky'
import { UserConfigType } from '../types/index'
import LuckyWheelConfig, {
  BlockType, BlockImgType,
  PrizeType, PrizeImgType,
  ButtonType, ButtonImgType,
  DefaultConfigType,
  DefaultStyleType,
  StartCallbackType,
  EndCallbackType
} from '../types/wheel'
import { FontType, ImgType } from '../types/index'
import {
  isExpectType,
  removeEnter,
  hasBackground,
  computeRange
} from '../utils/index'
import { getAngle, drawSector } from '../utils/math'
import * as Tween from '../utils/tween'

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
  private prizeRadian = 0               // 奖品运算角度
  private rotateDeg = 0                 // 转盘旋转角度
  private maxBtnRadius = 0              // 最大按钮半径
  private startTime = 0                 // 开始时间戳
  private endTime = 0                   // 停止时间戳
  private stopDeg = 0                   // 刻舟求剑
  private endDeg = 0                    // 停止角度
  private FPS = 16.6                    // 屏幕刷新率
  /**
   * 中奖索引
   * prizeFlag = undefined 时, 处于开始抽奖阶段, 正常旋转
   * prizeFlag >= 0 时, 说明stop方法被调用, 并且传入了中奖索引
   * prizeFlag === -1 时, 说明stop方法被调用, 并且传入了负值, 本次抽奖无效
   */
  private prizeFlag: number | undefined
  private blockImgs: Array<HTMLImageElement[]> = [[]]
  private prizeImgs: Array<HTMLImageElement[]> = [[]]
  private btnImgs: Array<HTMLImageElement[]> = [[]]

  /**
   * 大转盘构造器
   * @param config 元素标识
   * @param data 抽奖配置项
   */
  constructor (config: UserConfigType, data: LuckyWheelConfig = {}) {
    super(config)
    this.initData(data)
    this.initWatch()
    this.initComputed()
    // 创建前回调函数
    config.beforeCreate?.call(this)
    // 收集首次渲染的图片
    this.init({
      blockImgs: this.blocks.map(block => block.imgs),
      prizeImgs: this.prizes.map(prize => prize.imgs),
      btnImgs: this.buttons.map(btn => btn.imgs),
    })
  }

  protected initLucky (): void {
    super.initLucky()
    this.Radius = 0
    this.prizeRadius = 0
    this.prizeDeg = 0
    this.prizeRadian = 0
    this.rotateDeg = 0
    this.maxBtnRadius = 0
    this.startTime = 0
    this.endTime = 0
    this.stopDeg = 0
    this.endDeg = 0
    this.FPS = 16.6
    this.prizeFlag = -1
  }

  /**
   * 初始化数据
   * @param data
   */
  private initData (data: LuckyWheelConfig): void {
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
    // 观察 blocks 变化收集图片
    this.$watch('blocks', (newData: Array<BlockType>) => {
      return this.init({ blockImgs: newData.map(cell => cell.imgs) })
    }, { deep: true })
    // 观察 prizes 变化收集图片
    this.$watch('prizes', (newData: Array<PrizeType>) => {
      return this.init({ prizeImgs: newData.map(cell => cell.imgs) })
    }, { deep: true })
    // 观察 buttons 变化收集图片
    this.$watch('buttons', (newData: Array<ButtonType>) => {
      return this.init({ btnImgs: newData.map(cell => cell.imgs) })
    }, { deep: true })
    this.$watch('defaultConfig', () => this.draw(), { deep: true })
    this.$watch('defaultStyle', () => this.draw(), { deep: true })
    this.$watch('startCallback', () => this.init({}))
    this.$watch('endCallback', () => this.init({}))
  }

  /**
   * 初始化 canvas 抽奖
   * @param { willUpdateImgs } willUpdateImgs 需要更新的图片
   */
  public init (willUpdateImgs: {
    blockImgs?: Array<BlockImgType[] | undefined>
    prizeImgs?: Array<PrizeImgType[] | undefined>
    btnImgs?: Array<ButtonImgType[] | undefined>
  } = {}): void {
    this.initLucky()
    const { config, ctx } = this
    this.Radius = Math.min(this.boxWidth, this.boxHeight) / 2
    // 初始化前回调函数
    config.beforeInit?.call(this)
    ctx.translate(this.Radius, this.Radius)
    this.draw() // 先画一次, 防止闪烁
    this.draw() // 再画一次, 拿到正确的按钮轮廓
    // 异步加载图片
    ;(<(keyof typeof willUpdateImgs)[]>Object.keys(willUpdateImgs)).forEach(imgName => {
      enum CellNameKey {
        blockImgs = 'blocks',
        prizeImgs = 'prizes',
        btnImgs = 'buttons',
      }
      const cellName = CellNameKey[imgName]
      const willUpdate = willUpdateImgs[imgName]
      // 循环遍历所有图片
      const allPromise: Promise<void>[] = []
      willUpdate && willUpdate.forEach((imgs, cellIndex) => {
        imgs && imgs.forEach((imgInfo, imgIndex) => {
          allPromise.push(this.loadAndCacheImg(cellName, cellIndex, imgName, imgIndex))
        })
      })
      Promise.all(allPromise).then(() => {
        this.draw()
      })
    })
    // 初始化后回调函数
    config.afterInit?.call(this)
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
    if (this.startTime) return
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
    imgName: 'blockImgs' | 'prizeImgs' | 'btnImgs',
    imgIndex: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // 获取图片信息
      const cell: BlockType | PrizeType | ButtonType = this[cellName][cellIndex]
      if (!cell || !cell.imgs) return
      const imgInfo = cell.imgs[imgIndex]
      if (!imgInfo) return
      if (!this[imgName][cellIndex]) this[imgName][cellIndex] = []
      // 异步加载图片
      this.loadImg(imgInfo.src, imgInfo).then(res => {
        this[imgName][cellIndex][imgIndex] = res
        resolve()
      }).catch(err => {
        console.error(`${cellName}[${cellIndex}].imgs[${imgIndex}] ${err}`)
        reject()
      })
    })
  }

  /**
   * 计算图片的渲染宽高
   * @param imgObj 图片标签元素
   * @param imgInfo 图片信息
   * @param maxWidth 最大宽度
   * @param maxHeight 最大高度
   * @return [渲染宽度, 渲染高度]
   */
  private computedWidthAndHeight (
    imgObj: HTMLImageElement,
    imgInfo: ImgType,
    maxWidth: number,
    maxHeight: number
  ): [number, number] {
    // 根据配置的样式计算图片的真实宽高
    if (!imgInfo.width && !imgInfo.height) {
      // 如果没有配置宽高, 则使用图片本身的宽高
      return [imgObj.width, imgObj.height]
    } else if (imgInfo.width && !imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueWidth = this.getWidth(imgInfo.width, maxWidth)
      // 那高度就随着宽度进行等比缩放
      return [trueWidth, imgObj.height * (trueWidth / imgObj.width)]
    } else if (!imgInfo.width && imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueHeight = this.getHeight(imgInfo.height, maxHeight)
      // 那宽度就随着高度进行等比缩放
      return [imgObj.width * (trueHeight / imgObj.height), trueHeight]
    }
    // 如果宽度和高度都填写了, 就如实计算
    return [
      this.getWidth(imgInfo.width, maxWidth),
      this.getHeight(imgInfo.height, maxHeight)
    ]
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
    // 绘制blocks边框
    this.prizeRadius = this.blocks.reduce((radius, block, blockIndex) => {
      if (hasBackground(block.background)) {
        ctx.beginPath()
        ctx.fillStyle = block.background!
        ctx.arc(0, 0, radius, 0, Math.PI * 2, false)
        ctx.fill()
      }
      block.imgs && block.imgs.forEach((imgInfo, imgIndex) => {
        if (!this.blockImgs[blockIndex]) return
        const blockImg = this.blockImgs[blockIndex][imgIndex]
        if (!blockImg) return
        // 绘制图片
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(blockImg, imgInfo, radius * 2, radius * 2)
        const [xAxis, yAxis] = [this.getOffsetX(trueWidth), this.getHeight(imgInfo.top, radius * 2) - radius]
        ctx.save()
        imgInfo.rotate && ctx.rotate(getAngle(this.rotateDeg))
        this.drawImage(blockImg, xAxis, yAxis, trueWidth, trueHeight)
        ctx.restore()
      })
      return radius - this.getLength(block.padding && block.padding.split(' ')[0])
    }, this.Radius)
    // 计算起始弧度
    this.prizeDeg = 360 / this.prizes.length
    this.prizeRadian = getAngle(this.prizeDeg)
    // 起始角度调整到正上方, 并且减去半个扇形角度
    let start = getAngle(this.rotateDeg - 90 + this.prizeDeg / 2 + _defaultConfig.offsetDegree)
    // 计算文字横坐标
    const getFontX = (line: string) => {
      return this.getOffsetX(ctx.measureText(line).width)
    }
    // 计算文字纵坐标
    const getFontY = (font: FontType, height: number, lineIndex: number) => {
      // 优先使用字体行高, 要么使用默认行高, 其次使用字体大小, 否则使用默认字体大小
      const lineHeight = font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
      return this.getHeight(font.top, height) + (lineIndex + 1) * this.getLength(lineHeight)
    }
    ctx.save()
    // 绘制prizes奖品区域
    this.prizes.forEach((prize, prizeIndex) => {
      // 计算当前奖品区域中间坐标点
      let currMiddleDeg = start + prizeIndex * this.prizeRadian
      // 奖品区域可见高度
      let prizeHeight = this.prizeRadius - this.maxBtnRadius
      // 绘制背景
      const background = prize.background || _defaultStyle.background
      hasBackground(background) && drawSector(
        config.flag, ctx,
        this.maxBtnRadius, this.prizeRadius,
        currMiddleDeg - this.prizeRadian / 2,
        currMiddleDeg + this.prizeRadian / 2,
        this.getLength(_defaultConfig.gutter),
        background
      )
      // 计算临时坐标并旋转文字
      let x = Math.cos(currMiddleDeg) * this.prizeRadius
      let y = Math.sin(currMiddleDeg) * this.prizeRadius
      ctx.translate(x, y)
      ctx.rotate(currMiddleDeg + getAngle(90))
      // 绘制图片
      prize.imgs && prize.imgs.forEach((imgInfo, imgIndex) => {
        if (!this.prizeImgs[prizeIndex]) return
        const prizeImg = this.prizeImgs[prizeIndex][imgIndex]
        if (!prizeImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(
          prizeImg,
          imgInfo,
          this.prizeRadian * this.prizeRadius,
          prizeHeight
        )
        const [xAxis, yAxis] = [this.getOffsetX(trueWidth), this.getHeight(imgInfo.top, prizeHeight)]
        this.drawImage(prizeImg, xAxis, yAxis, trueWidth, trueHeight)
      })
      // 逐行绘制文字
      prize.fonts && prize.fonts.forEach(font => {
        let fontColor = font.fontColor || _defaultStyle.fontColor
        let fontWeight = font.fontWeight || _defaultStyle.fontWeight
        let fontSize = this.getLength(font.fontSize || _defaultStyle.fontSize)
        let fontStyle = font.fontStyle || _defaultStyle.fontStyle
        ctx.fillStyle = fontColor
        ctx.font = `${fontWeight} ${fontSize >> 0}px ${fontStyle}`
        let lines = [], text = String(font.text)
        if (Object.prototype.hasOwnProperty.call(font, 'wordWrap') ? font.wordWrap : _defaultStyle.wordWrap) {
          text = removeEnter(text)
          let str = ''
          for (let i = 0; i < text.length; i++) {
            str += text[i]
            let currWidth = ctx.measureText(str).width
            let maxWidth = (this.prizeRadius - getFontY(font, prizeHeight, lines.length))
              * Math.tan(this.prizeRadian / 2) * 2 - this.getLength(_defaultConfig.gutter)
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
        if (!this.btnImgs[btnIndex]) return
        const btnImg = this.btnImgs[btnIndex][imgIndex]
        if (!btnImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(btnImg, imgInfo, radius * 2, radius * 2)
        const [xAxis, yAxis] = [this.getOffsetX(trueWidth), this.getHeight(imgInfo.top, radius)]
        this.drawImage(btnImg, xAxis, yAxis, trueWidth, trueHeight)
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
          ctx.fillText(line, getFontX(line), getFontY(font, radius, lineIndex))
        })
      })
    })
    // 触发绘制后回调
    config.afterDraw?.call(this, ctx)
  }

  /**
   * 对外暴露: 开始抽奖方法
   */
  public play (): void {
    // 再次拦截, 因为play是可以异步调用的
    if (this.startTime) return
    this.startTime = Date.now()
    this.prizeFlag = void 0
    this.run()
  }

  /**
   * 对外暴露: 缓慢停止方法
   * @param index 中奖索引
   */
  public stop (index?: number): void {
    // 如果没有传递中奖索引, 则通过range属性计算一个
    if (!index && index !== 0) {
      const rangeArr = this.prizes.map(item => item.range)
      index = computeRange(rangeArr)
    }
    // 如果index是负数则停止游戏, 反之则传递中奖索引
    if (index < 0) {
      this.prizeFlag = -1
      this.rotateDeg = this.prizeDeg / 2 - this._defaultConfig.offsetDegree
      this.draw()
    } else {
      this.prizeFlag = index % this.prizes.length
    }
  }

  /**
   * 实际开始执行方法
   * @param num 记录帧动画执行多少次
   */
  private run (num: number = 0): void {
    const { rAF, prizeFlag, prizeDeg, rotateDeg, _defaultConfig } = this
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return (this.startTime = 0, void 0)
    let interval = Date.now() - this.startTime
    // 先完全旋转, 再停止
    if (interval >= _defaultConfig.accelerationTime && prizeFlag !== void 0) {
      // 记录帧率
      this.FPS = interval / num
      // 记录开始停止的时间戳
      this.endTime = Date.now()
      // 记录开始停止的位置
      this.stopDeg = rotateDeg
      // 停止范围
      const stopRange = (Math.random() * prizeDeg - prizeDeg / 2) * this.getLength(_defaultConfig.stopRange)
      // 测算最终停止的角度
      let i = 0
      while (++i) {
        const endDeg = 360 * i - prizeFlag * prizeDeg - rotateDeg - _defaultConfig.offsetDegree + stopRange - prizeDeg / 2
        let currSpeed = Tween[_defaultConfig.speedFunction].easeOut(this.FPS, this.stopDeg, endDeg, _defaultConfig.decelerationTime) - this.stopDeg
        if (currSpeed > _defaultConfig.speed) {
          this.endDeg = endDeg
          break
        }
      }
      return this.slowDown()
    }
    this.rotateDeg = (rotateDeg + Tween[_defaultConfig.speedFunction].easeIn(interval, 0, _defaultConfig.speed, _defaultConfig.accelerationTime)) % 360
    this.draw()
    rAF(this.run.bind(this, num + 1))
  }

  /**
   * 缓慢停止的方法
   */
  private slowDown (): void {
    const { rAF, prizes, prizeFlag, stopDeg, endDeg, _defaultConfig } = this
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return (this.startTime = 0, void 0)
    let interval = Date.now() - this.endTime
    if (interval >= _defaultConfig.decelerationTime) {
      this.startTime = 0
      this.endCallback?.(prizes.find((prize, index) => index === prizeFlag) || {})
      return
    }
    this.rotateDeg = Tween[_defaultConfig.speedFunction].easeOut(interval, stopDeg, endDeg, _defaultConfig.decelerationTime) % 360
    this.draw()
    rAF(this.slowDown.bind(this))
  }

  /**
   * 获取相对宽度
   * @param length 将要转换的宽度
   * @param width 宽度计算百分比
   * @return 返回相对宽度
   */
  private getWidth (
    length: string | number | undefined,
    width = this.prizeRadian * this.prizeRadius
  ): number {
    if (isExpectType(length, 'number')) return (length as number)
    if (isExpectType(length, 'string')) return this.changeUnits(length as string, width)
    return 0
  }

  /**
   * 获取相对高度
   * @param length 将要转换的高度
   * @param height 高度计算百分比
   * @return 返回相对高度
   */
  private getHeight (
    length: string | number | undefined,
    height: number = this.prizeRadius
  ): number {
    if (isExpectType(length, 'number')) return (length as number)
    if (isExpectType(length, 'string')) return this.changeUnits(length as string, height)
    return 0
  }

  /**
   * 获取相对(居中)X坐标
   * @param width
   * @return 返回x坐标
   */
  private getOffsetX (width: number): number {
    return -width / 2
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
