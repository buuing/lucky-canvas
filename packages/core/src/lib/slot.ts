import Lucky from './lucky'
import { UserConfigType, ImgType, ImgItemType, Tuple } from '../types/index'
import SlotMachineConfig, {
  BlockType,
  PrizeType,
  SlotType,
  DefaultConfigType,
  DefaultStyleType,
  EndCallbackType,
} from '../types/slot'
import {
  get, has,
  isExpectType,
  removeEnter,
  computePadding,
  hasBackground,
  computeRange,
  splitText,
  getSortedArrayByIndex
} from '../utils/index'
import { roundRectByArc } from '../utils/math'
import { quad } from '../utils/tween'

export default class SlotMachine extends Lucky {
  // 背景
  private blocks: Array<BlockType> = []
  // 奖品列表
  private prizes: Array<PrizeType> = []
  // 插槽列表
  private slots: Array<SlotType> = []
  // 默认配置
  private defaultConfig: DefaultConfigType = {}
  private _defaultConfig: Required<DefaultConfigType> = {} as Required<DefaultConfigType>
  // 默认样式
  private defaultStyle: DefaultStyleType = {}
  private _defaultStyle: Required<DefaultStyleType> = {} as Required<DefaultStyleType>
  private endCallback: EndCallbackType = () => {}
  // 离屏canvas
  private _offscreenCanvas?: HTMLCanvasElement
  private cellWidth = 0             // 格子宽度
  private cellHeight = 0            // 格子高度
  private cellAndSpacing = 0        // 格子+间距
  private widthAndSpacing = 0       // 格子宽度+列间距
  private heightAndSpacing = 0      // 格子高度+行间距
  private FPS = 16.6                // 屏幕刷新率
  private scroll: number[] = []     // 滚动的长度
  private stopScroll: number[] = [] // 刻舟求剑
  private endScroll: number[] = []  // 最终停止的长度
  private startTime = 0             // 开始游戏的时间
  private endTime = 0               // 开始停止的时间
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
  private prizeFlag: number[] | undefined = void 0
  // 奖品区域几何信息
  private prizeArea?: { x: number, y: number, w: number, h: number }
  // 图片缓存
  private ImageCache = new Map()

  /**
   * 老虎机构造器
   * @param config 配置项
   * @param data 抽奖数据
   */
   constructor (config: UserConfigType, data: SlotMachineConfig) {
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
    this.draw()
    this.config.afterResize?.()
  }

  protected initLucky (): void {
    this.cellWidth = 0
    this.cellHeight = 0
    this.cellAndSpacing = 0
    this.widthAndSpacing = 0
    this.heightAndSpacing = 0
    this.FPS = 16.6
    this.scroll = []
    this.stopScroll = []
    this.endScroll = []
    this.startTime = 0
    this.endTime = 0
    this.prizeFlag = void 0
    this.step = 0
    super.initLucky()
  }

  /**
   * 初始化数据
   * @param data
   */
  private initData (data: SlotMachineConfig): void {
    this.$set(this, 'width', data.width)
    this.$set(this, 'height', data.height)
    this.$set(this, 'blocks', data.blocks || [])
    this.$set(this, 'prizes', data.prizes || [])
    this.$set(this, 'slots', data.slots || [])
    this.$set(this, 'defaultConfig', data.defaultConfig || {})
    this.$set(this, 'defaultStyle', data.defaultStyle || {})
    this.$set(this, 'endCallback', data.end)
  }

  /**
   * 初始化属性计算
   */
  private initComputed (): void {
    // 默认配置
    this.$computed(this, '_defaultConfig', () => {
      const config = {
        mode: 'vertical',
        rowSpacing: 0,
        colSpacing: 5,
        speed: 20,
        direction: 1,
        accelerationTime: 2500,
        decelerationTime: 2500,
        ...this.defaultConfig
      }
      config.rowSpacing = this.getLength(config.rowSpacing)
      config.colSpacing = this.getLength(config.colSpacing)
      return config
    })
    // 默认样式
    this.$computed(this, '_defaultStyle', () => {
      return {
        borderRadius: 0,
        fontColor: '#000',
        fontSize: '18px',
        fontStyle: 'sans-serif',
        fontWeight: '400',
        background: 'rgba(0,0,0,0)',
        wordWrap: true,
        lengthLimit: '90%',
        ...this.defaultStyle
      }
    })
  }

  /**
   * 初始化观察者
   */
  private initWatch (): void {
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
    // 监听 blocks 数据的变化
    this.$watch('blocks', (newData: Array<BlockType>) => {
      this.initImageCache()
    }, { deep: true })
    // 监听 prizes 数据的变化
    this.$watch('prizes', (newData: Array<PrizeType>) => {
      this.initImageCache()
    }, { deep: true })
    // 监听 prizes 数据的变化
    this.$watch('slots', (newData: Array<PrizeType>) => {
      this.drawOffscreenCanvas()
      this.draw()
    }, { deep: true })
    this.$watch('defaultConfig', () => this.draw(), { deep: true })
    this.$watch('defaultStyle', () => this.draw(), { deep: true })
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
    // 先绘制一次
    this.drawOffscreenCanvas()
    this.draw()
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
          this.drawOffscreenCanvas()
          this.draw()
          resolve()
        })
      })
    })
  }

  /**
   * 根据索引单独加载指定图片并缓存
   * @param cellName 模块名称
   * @param cellIndex 模块索引
   * @param imgName 模块对应的图片缓存
   * @param imgIndex 图片索引
   */
  private async loadAndCacheImg (
    cellName: 'blocks' | 'prizes',
    cellIndex: number,
    imgIndex: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let cell: BlockType | PrizeType = this[cellName][cellIndex]
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

  /**
   * 绘制离屏canvas
   */
  protected drawOffscreenCanvas (): void {
    const { _defaultConfig, _defaultStyle } = this
    const { w, h } = this.drawBlocks()!
    // 计算单一奖品格子的宽度和高度
    const prizesLen = this.prizes.length
    const { cellWidth, cellHeight, widthAndSpacing, heightAndSpacing } = this.displacementWidthOrHeight()
    const defaultOrder = new Array(prizesLen).fill(void 0).map((v, i) => i)
    let maxOrderLen = 0, maxOffWidth = 0, maxOffHeight = 0
    this.slots.forEach((slot, slotIndex) => {
      // 初始化 scroll 的值
      if (this.scroll[slotIndex] === void 0) this.scroll[slotIndex] = 0
      // 如果没有order属性, 就填充prizes
      slot.order = slot.order || defaultOrder
      // 计算最大值
      const currLen = slot.order.length
      maxOrderLen = Math.max(maxOrderLen, currLen)
      maxOffWidth = Math.max(maxOffWidth, w + widthAndSpacing * currLen)
      maxOffHeight = Math.max(maxOffHeight, h + heightAndSpacing * currLen)
    })
    // 创建一个离屏Canvas来存储画布的内容
    const { _offscreenCanvas, _ctx } = this.getOffscreenCanvas(maxOffWidth, maxOffHeight)!
    this._offscreenCanvas = _offscreenCanvas
    // 绘制插槽
    this.slots.forEach((slot, slotIndex) => {
      const cellX = cellWidth * slotIndex
      const cellY = cellHeight * slotIndex
      let lengthOfCopy = 0
      // 绘制奖品
      const newPrizes = getSortedArrayByIndex(this.prizes, slot.order!)
      // 如果没有奖品则打断逻辑
      if (!newPrizes.length) return
      newPrizes.forEach((cell, cellIndex) => {
        if (!cell) return
        const orderIndex = slot.order![cellIndex]
        const prizesX = widthAndSpacing * cellIndex + _defaultConfig.colSpacing / 2
        const prizesY = heightAndSpacing * cellIndex + _defaultConfig.rowSpacing / 2
        const [_x, _y, spacing] = this.displacement(
          [cellX, prizesY, heightAndSpacing],
          [prizesX, cellY, widthAndSpacing]
        )
        lengthOfCopy += spacing
        // 绘制背景
        const background = cell.background || _defaultStyle.background
        if (hasBackground(background)) {
          const borderRadius = this.getLength(has(cell, 'borderRadius') ? cell.borderRadius : _defaultStyle.borderRadius)
          roundRectByArc(_ctx, _x, _y, cellWidth, cellWidth, borderRadius)
          _ctx.fillStyle = background
          _ctx.fill()
        }
        // 绘制图片
        cell.imgs && cell.imgs.forEach((imgInfo, imgIndex) => {
          const cellImg = this.ImageCache.get(imgInfo.src)
          if (!cellImg) return
          const [trueWidth, trueHeight] = this.computedWidthAndHeight(cellImg, imgInfo, cellWidth, cellHeight)
          const [xAxis, yAxis] = [
            _x + this.getOffsetX(trueWidth, cellWidth) + this.getLength(imgInfo.left, cellWidth),
            _y + this.getLength(imgInfo.top, cellHeight)
          ]
          this.drawImage(_ctx, cellImg, xAxis, yAxis, trueWidth, trueHeight)
        })
        // 绘制文字
        cell.fonts && cell.fonts.forEach(font => {
          // 字体样式
          const style = font.fontStyle || _defaultStyle.fontStyle
          // 字体加粗
          const fontWeight = font.fontWeight || _defaultStyle.fontWeight
          // 字体大小
          const size = this.getLength(font.fontSize || _defaultStyle.fontSize)
          // 字体行高
          const lineHeight = font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
          const wordWrap = has(font, 'wordWrap') ? font.wordWrap : _defaultStyle.wordWrap
          const lengthLimit = font.lengthLimit || _defaultStyle.lengthLimit
          const lineClamp = font.lineClamp || _defaultStyle.lineClamp
          _ctx.font = `${fontWeight} ${size >> 0}px ${style}`
          _ctx.fillStyle = font.fontColor || _defaultStyle.fontColor
          let lines = [], text = String(font.text)
          // 计算文字换行
          if (wordWrap) {
            // 最大宽度
            let maxWidth = this.getLength(lengthLimit, cellWidth)
            lines = splitText(_ctx, removeEnter(text), () => maxWidth, lineClamp)
          } else {
            lines = text.split('\n')
          }
          lines.forEach((line, lineIndex) => {
            _ctx.fillText(
              line,
              _x + this.getOffsetX(_ctx.measureText(line).width, cellWidth) + this.getLength(font.left, cellWidth),
              _y + this.getLength(font.top, cellHeight) + (lineIndex + 1) * this.getLength(lineHeight)
            )
          })
        })
      })
      const [_x, _y, _w, _h] = this.displacement(
        [cellX, 0, cellWidth, lengthOfCopy],
        [0, cellY, lengthOfCopy, cellHeight]
      )
      let drawLen = lengthOfCopy
      while (drawLen < maxOffHeight + lengthOfCopy) {
        const [drawX, drawY] = this.displacement([_x, drawLen], [drawLen, _y])
        this.drawImage(
          _ctx, _offscreenCanvas,
          _x, _y, _w, _h,
          drawX, drawY, _w, _h
        )
        drawLen += lengthOfCopy
      }
    })
  }

  /**
   * 绘制背景区域
   */
  protected drawBlocks (): SlotMachine['prizeArea'] {
    const { config, ctx, _defaultConfig, _defaultStyle } = this
    // 绘制背景区域, 并计算奖品区域
    return this.prizeArea = this.blocks.reduce(({x, y, w, h}, block, blockIndex) => {
      const [paddingTop, paddingBottom, paddingLeft, paddingRight] = computePadding(block, this.getLength.bind(this))
      const r = block.borderRadius ? this.getLength(block.borderRadius) : 0
      // 绘制边框
      const background = block.background || _defaultStyle.background
      if (hasBackground(background)) {
        roundRectByArc(ctx, x, y, w, h, r)
        ctx.fillStyle = background
        ctx.fill()
      }
      // 绘制图片
      block.imgs && block.imgs.forEach((imgInfo, imgIndex) => {
        const blockImg = this.ImageCache.get(imgInfo.src)
        if (!blockImg) return
        // 绘制图片
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(blockImg, imgInfo, w, h)
        const [xAxis, yAxis] = [this.getOffsetX(trueWidth, w) + this.getLength(imgInfo.left, w), this.getLength(imgInfo.top, h)]
        this.drawImage(ctx, blockImg, x + xAxis, y + yAxis, trueWidth, trueHeight)
      })
      return {
        x: x + paddingLeft,
        y: y + paddingTop,
        w: w - paddingLeft - paddingRight,
        h: h - paddingTop - paddingBottom
      }
    }, { x: 0, y: 0, w: this.boxWidth, h: this.boxHeight })
  }

  /**
   * 绘制老虎机抽奖
   */
  protected draw (): void {
    const { config, ctx, _defaultConfig, _defaultStyle } = this
    // 触发绘制前回调
    config.beforeDraw?.call(this, ctx)
    // 清空画布
    ctx.clearRect(0, 0, this.boxWidth, this.boxHeight)
    // 绘制背景
    const { x, y, w, h } = this.drawBlocks()!
    // 绘制插槽
    if (!this._offscreenCanvas) return
    const { cellWidth, cellHeight, cellAndSpacing, widthAndSpacing, heightAndSpacing } = this
    this.slots.forEach((slot, slotIndex) => {
      // 绘制临界点
      const _p = cellAndSpacing * slot.order!.length
      // 调整奖品垂直居中
      const start = this.displacement(-(h - heightAndSpacing) / 2, -(w - widthAndSpacing) / 2)
      let scroll = this.scroll[slotIndex] + start
      // scroll 会无限累加 1 / -1
      if (scroll < 0) {
        scroll = scroll % _p + _p
      }
      if (scroll > _p) {
        scroll = scroll % _p
      }
      const [sx, sy, sw, sh] = this.displacement(
        [cellWidth * slotIndex, scroll, cellWidth, h],
        [scroll, cellHeight * slotIndex, w, cellHeight]
      )
      const [dx, dy, dw, dh] = this.displacement(
        [x + widthAndSpacing * slotIndex, y, cellWidth, h],
        [x, y + heightAndSpacing * slotIndex, w, cellHeight]
      )
      this.drawImage(ctx, this._offscreenCanvas!, sx, sy, sw, sh, dx, dy, dw, dh)
    })
  }

  /**
   * 刻舟求剑
   */
  private carveOnGunwaleOfAMovingBoat (): void {
    const { _defaultConfig, prizeFlag, cellAndSpacing } = this
    // 记录开始停止的时间戳
    this.endTime = Date.now()
    this.slots.forEach((slot, slotIndex) => {
      const order = slot.order!
      if (!order.length) return
      const speed = slot.speed || _defaultConfig.speed
      const direction = slot.direction || _defaultConfig.direction
      const orderIndex = order.findIndex(prizeIndex => prizeIndex === prizeFlag![slotIndex])
      const _p = cellAndSpacing * order.length
      const stopScroll = this.stopScroll[slotIndex] = this.scroll[slotIndex]
      let i = 0
      while (++i) {
        const endScroll = cellAndSpacing * orderIndex + (_p * i * direction) - stopScroll
        const currSpeed = quad.easeOut(this.FPS, stopScroll, endScroll, _defaultConfig.decelerationTime) - stopScroll
        if (Math.abs(currSpeed) > speed) {
          this.endScroll[slotIndex] = endScroll
          break
        }
      }
    })
  }

  /**
   * 对外暴露: 开始抽奖方法
   */
   public play (): void {
    if (this.step !== 0) return
    // 记录开始游戏的时间
    this.startTime = Date.now()
    // 清空中奖索引
    this.prizeFlag = void 0
    // 开始加速
    this.step = 1
    // 触发回调
    this.config.afterStart?.()
    // 开始渲染
    this.run()
  }

  public stop (index: number | number[]): void {
    if (this.step === 0 || this.step === 3) return
    // 设置中奖索引
    if (typeof index === 'number') {
      this.prizeFlag = new Array(this.slots.length).fill(index)
    } else if (isExpectType(index, 'array')) {
      if (index.length === this.slots.length) {
        this.prizeFlag = index
      } else {
        this.stop(-1)
        return console.error(`stop([${index}]) 参数长度的不正确`)
      }
    } else {
      this.stop(-1)
      return console.error(`stop() 无法识别的参数类型 ${typeof index}`)
    }
    // 如果包含负数则停止游戏, 反之则继续游戏
    if (this.prizeFlag?.includes(-1)) {
      this.prizeFlag = []
      // 停止游戏
      this.step = 0
    } else {
      // 进入匀速
      this.step = 2
    }
  }

  /**
   * 让游戏动起来
   * @param num 记录帧动画执行多少次
   */
  private run (num: number = 0): void {
    const { rAF, step, prizeFlag, _defaultConfig, cellAndSpacing, slots } = this
    const { accelerationTime, decelerationTime } = _defaultConfig
    // 游戏结束
    if (this.step === 0 && prizeFlag?.length === slots.length) {
      let flag = prizeFlag[0]
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i], currFlag = prizeFlag[i]
        if (!slot.order?.includes(currFlag) || flag !== currFlag) {
          flag = -1
          break
        }
      }
      this.endCallback?.(this.prizes.find((prize, index) => index === flag) || void 0)
      return
    }
    // 如果长度为 0 就直接停止游戏
    if (prizeFlag !== void 0 && !prizeFlag.length) return
    // 计算最终停止的位置
    if (this.step === 3 && !this.endScroll.length) this.carveOnGunwaleOfAMovingBoat()
    // 计算时间间隔
    const startInterval = Date.now() - this.startTime
    const endInterval = Date.now() - this.endTime
    // 分别计算对应插槽的加速度
    slots.forEach((slot, slotIndex) => {
      const order = slot.order
      if (!order || !order.length) return
      const _p = cellAndSpacing * order.length
      const speed = Math.abs(slot.speed || _defaultConfig.speed)
      const direction = slot.direction || _defaultConfig.direction
      let scroll = 0, prevScroll = this.scroll[slotIndex]
      if (step === 1 || startInterval < accelerationTime) { // 加速阶段
        // 记录帧率
        this.FPS = startInterval / num
        const currSpeed = quad.easeIn(startInterval, 0, speed, accelerationTime)
        // 加速到最大速度后, 即可进入匀速阶段
        if (currSpeed === speed) {
          this.step = 2
        }
        scroll = (prevScroll + (currSpeed * direction)) % _p
      } else if (step === 2) { // 匀速阶段
        // 速度保持不变
        scroll = (prevScroll + (speed * direction)) % _p
        // 如果有 prizeFlag 有值, 则进入减速阶段
        if (prizeFlag?.length === slots.length) {
          this.step = 3
          // 清空上一轮的位置信息
          this.stopScroll = []
          this.endScroll = []
        }
      } else if (step === 3 && endInterval) { // 减速阶段
        // 开始缓慢停止
        const stopScroll = this.stopScroll[slotIndex]
        const endScroll = this.endScroll[slotIndex]
        scroll = quad.easeOut(endInterval, stopScroll, endScroll, decelerationTime)
        if (endInterval >= decelerationTime) {
          this.step = 0
        }
      }
      this.scroll[slotIndex] = scroll
    })
    this.draw()
    rAF(this.run.bind(this, num + 1))
  }

  // 根据mode置换数值
  private displacement<T> (a: T, b: T): T {
    return this._defaultConfig.mode === 'horizontal' ? b : a
  }

  // 根据mode计算宽高
  private displacementWidthOrHeight () {
    const mode = this._defaultConfig.mode
    const slotsLen = this.slots.length
    const { colSpacing, rowSpacing } = this._defaultConfig
    const { x, y, w, h } = this.prizeArea || this.drawBlocks()!
    let cellWidth = 0, cellHeight = 0, widthAndSpacing = 0, heightAndSpacing = 0
    if (mode === 'horizontal') {
      cellHeight = this.cellHeight = (h - rowSpacing * (slotsLen - 1)) / slotsLen
      cellWidth = this.cellWidth = cellHeight
    } else {
      cellWidth = this.cellWidth = (w - colSpacing * (slotsLen - 1)) / slotsLen
      cellHeight = this.cellHeight = cellWidth
    }
    widthAndSpacing = this.widthAndSpacing = this.cellWidth + colSpacing
    heightAndSpacing = this.heightAndSpacing = this.cellHeight + rowSpacing
    if (mode === 'horizontal') {
      this.cellAndSpacing = widthAndSpacing
    } else {
      this.cellAndSpacing = heightAndSpacing
    }
    return {
      cellWidth,
      cellHeight,
      widthAndSpacing,
      heightAndSpacing,
    }
  }
}
