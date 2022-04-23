import Lucky from './lucky'
import { UserConfigType, ImgType } from '../types/index'
import LuckyGridConfig, {
  BlockType,
  PrizeType,
  ButtonType,
  CellFontType,
  CellImgType,
  RowsType,
  ColsType,
  CellType,
  DefaultConfigType,
  DefaultStyleType,
  ActiveStyleType,
  StartCallbackType,
  EndCallbackType,
} from '../types/grid'
import {
  has,
  isExpectType,
  removeEnter,
  computePadding,
  hasBackground,
  computeRange,
  splitText
} from '../utils/index'
import { roundRectByArc, getLinearGradient } from '../utils/math'
import { quad } from '../utils/tween'

export default class LuckyGrid extends Lucky {
  private rows: RowsType = 3
  private cols: ColsType = 3
  private blocks: Array<BlockType> = []
  private prizes: Array<PrizeType> = []
  private buttons: Array<ButtonType> = []
  private button?: ButtonType
  private defaultConfig: DefaultConfigType = {}
  private defaultStyle: DefaultStyleType = {}
  private activeStyle: ActiveStyleType = {}
  private _defaultConfig: Required<DefaultConfigType> = {} as Required<DefaultConfigType>
  private _defaultStyle: Required<DefaultStyleType> = {} as Required<DefaultStyleType>
  private _activeStyle: Required<ActiveStyleType> = {} as Required<ActiveStyleType>
  private startCallback?: StartCallbackType
  private endCallback?: EndCallbackType
  private cellWidth = 0                 // 格子宽度
  private cellHeight = 0                // 格子高度
  private startTime = 0                 // 开始时间戳
  private endTime = 0                   // 结束时间戳
  private currIndex = 0                 // 当前index累加
  private stopIndex = 0                 // 刻舟求剑
  private endIndex = 0                  // 停止索引
  private demo = false                  // 是否自动游走
  private timer = 0                     // 游走定时器
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
  private prizeFlag: number | undefined = -1
  // 所有格子
  private cells: CellType<CellFontType, CellImgType>[] = []
  // 奖品区域几何信息
  private prizeArea: { x: number, y: number, w: number, h: number } | undefined
  // 图片缓存
  private ImageCache = new Map()

  /**
   * 九宫格构造器
   * @param config 配置项
   * @param data 抽奖数据
   */
  constructor (config: UserConfigType, data: LuckyGridConfig) {
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
    this.startTime = 0
    this.endTime = 0
    this.currIndex = 0
    this.stopIndex = 0
    this.endIndex = 0
    this.demo = false
    this.timer = 0
    this.FPS = 16.6
    this.prizeFlag = -1
    this.step = 0
    super.initLucky()
  }

  /**
   * 初始化数据
   * @param data
   */
  private initData (data: LuckyGridConfig): void {
    this.$set(this, 'width', data.width)
    this.$set(this, 'height', data.height)
    this.$set(this, 'rows', Number(data.rows) || 3)
    this.$set(this, 'cols', Number(data.cols) || 3)
    this.$set(this, 'blocks', data.blocks || [])
    this.$set(this, 'prizes', data.prizes || [])
    this.$set(this, 'buttons', data.buttons || [])
    // 临时过渡代码, 升级到2.x即可删除
    this.$set(this, 'button', data.button)
    this.$set(this, 'defaultConfig', data.defaultConfig || {})
    this.$set(this, 'defaultStyle', data.defaultStyle || {})
    this.$set(this, 'activeStyle', data.activeStyle || {})
    this.$set(this, 'startCallback', data.start)
    this.$set(this, 'endCallback', data.end)
  }

  /**
   * 初始化属性计算
   */
  private initComputed (): void {
    // 默认配置
    this.$computed(this, '_defaultConfig', () => {
      const config = {
        gutter: 5,
        speed: 20,
        accelerationTime: 2500,
        decelerationTime: 2500,
        ...this.defaultConfig
      }
      config.gutter = this.getLength(config.gutter)
      config.speed = config.speed / 40
      return config
    })
    // 默认样式
    this.$computed(this, '_defaultStyle', () => {
      return {
        borderRadius: 20,
        fontColor: '#000',
        fontSize: '18px',
        fontStyle: 'sans-serif',
        fontWeight: '400',
        background: 'rgba(0,0,0,0)',
        shadow: '',
        wordWrap: true,
        lengthLimit: '90%',
        ...this.defaultStyle
      }
    })
    // 中奖样式
    this.$computed(this, '_activeStyle', () => {
      return {
        background: '#ffce98',
        shadow: '',
        ...this.activeStyle
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
    // 监听 button 数据的变化
    this.$watch('buttons', (newData: Array<ButtonType>) => {
      this.initImageCache()
    }, { deep: true })
    this.$watch('rows', () => this.init())
    this.$watch('cols', () => this.init())
    this.$watch('defaultConfig', () => this.draw(), { deep: true })
    this.$watch('defaultStyle', () => this.draw(), { deep: true })
    this.$watch('activeStyle', () => this.draw(), { deep: true })
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
    // 先画一次防止闪烁
    this.draw()
    // 异步加载图片
    await this.initImageCache()
    // 初始化后回调函数
    config.afterInit?.call(this)
  }

  private initImageCache (): Promise<void> {
    return new Promise((resolve) => {
      const btnImgs = this.buttons.map(btn => btn.imgs)
      if (this.button) btnImgs.push(this.button.imgs)
      const willUpdateImgs = {
        blocks: this.blocks.map(block => block.imgs),
        prizes: this.prizes.map(prize => prize.imgs),
        buttons: btnImgs,
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
    ;[
      ...this.buttons,
      this.button
    ].forEach(btn => {
      if (!btn) return
      const [x, y, width, height] = this.getGeometricProperty([
        btn.x, btn.y, btn.col || 1, btn.row || 1
      ])
      ctx.beginPath()
      ctx.rect(x, y, width, height)
      if (!ctx.isPointInPath(e.offsetX, e.offsetY)) return
      if (this.step !== 0) return
      // 如果btn里有单独的回调方法, 优先触发
      if (typeof btn.callback === 'function') btn.callback.call(this, btn)
      // 最后触发公共回调
      this.startCallback?.(e, btn)
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
    cellName: 'blocks' | 'prizes' | 'buttons',
    cellIndex: number,
    imgIndex: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let cell: BlockType | PrizeType | ButtonType = this[cellName][cellIndex]
      // 临时过渡代码, 升级到2.x即可删除
      if (cellName === 'buttons' && !this.buttons.length && this.button) {
        cell = this.button
      }
      if (!cell || !cell.imgs) return
      const imgInfo = cell.imgs[imgIndex]
      if (!imgInfo) return
      // 异步加载图片
      const request = [
        this.loadImg(imgInfo.src, imgInfo),
        imgInfo['activeSrc'] && this.loadImg(imgInfo['activeSrc'], imgInfo, '$activeResolve')
      ]
      Promise.all(request).then(async ([defaultImg, activeImg]) => {
        const formatter = imgInfo.formatter
        // 对图片进行处理
        if (typeof formatter === 'function') {
          defaultImg = await Promise.resolve(formatter.call(this, defaultImg))
          if (activeImg) {
            activeImg = await Promise.resolve(formatter.call(this, activeImg))
          }
        }
        this.ImageCache.set(imgInfo['src'], defaultImg)
        activeImg && this.ImageCache.set(imgInfo['activeSrc'], activeImg)
        resolve()
      }).catch(err => {
        console.error(`${cellName}[${cellIndex}].imgs[${imgIndex}] ${err}`)
        reject()
      })
    })
  }

  /**
   * 绘制九宫格抽奖
   */
  protected draw (): void {
    const { config, ctx, _defaultConfig, _defaultStyle, _activeStyle } = this
    // 触发绘制前回调
    config.beforeDraw?.call(this, ctx)
    // 清空画布
    ctx.clearRect(0, 0, this.boxWidth, this.boxHeight)
    // 合并奖品和按钮
    this.cells = [
      ...this.prizes,
      ...this.buttons
    ]
    if (this.button) this.cells.push(this.button)
    this.cells.forEach(cell => {
      cell.col = cell.col || 1
      cell.row = cell.row || 1
    })
    // 计算获取奖品区域的几何信息
    this.prizeArea = this.blocks.reduce(({x, y, w, h}, block, blockIndex) => {
      const [paddingTop, paddingBottom, paddingLeft, paddingRight] = computePadding(block, this.getLength.bind(this))
      const r = block.borderRadius ? this.getLength(block.borderRadius) : 0
      // 绘制边框
      const background = block.background
      if (hasBackground(background)) {
        ctx.fillStyle = this.handleBackground(x, y, w, h, background!)
        roundRectByArc(ctx, x, y, w, h, r)
        ctx.fill()
      }
      // 绘制图片
      block.imgs && block.imgs.forEach((imgInfo, imgIndex) => {
        const blockImg = this.ImageCache.get(imgInfo.src)
        if (!blockImg) return
        // 绘制图片
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(blockImg, imgInfo, w, h)
        const [xAxis, yAxis] = [
          this.getOffsetX(trueWidth, w) + this.getLength(imgInfo.left, w),
          this.getLength(imgInfo.top, h)
        ]
        this.drawImage(ctx, blockImg, x + xAxis, y + yAxis, trueWidth, trueHeight)
      })
      return {
        x: x + paddingLeft,
        y: y + paddingTop,
        w: w - paddingLeft - paddingRight,
        h: h - paddingTop - paddingBottom
      }
    }, { x: 0, y: 0, w: this.boxWidth, h: this.boxHeight })
    // 计算单一奖品格子的宽度和高度
    this.cellWidth = (this.prizeArea.w - _defaultConfig.gutter * (this.cols - 1)) / this.cols
    this.cellHeight = (this.prizeArea.h - _defaultConfig.gutter * (this.rows - 1)) / this.rows
    // 绘制所有格子
    this.cells.forEach((cell, cellIndex) => {
      let [x, y, width, height] = this.getGeometricProperty([cell.x, cell.y, cell.col!, cell.row!])
      // 默认不显示中奖标识
      let isActive = false
      // 只要 prizeFlag 不是负数, 就显示中奖标识
      if (this.prizeFlag === void 0 || this.prizeFlag > -1) {
        isActive = cellIndex === this.currIndex % this.prizes.length >> 0
      }
      // 绘制背景色
      const background = isActive ? _activeStyle.background : (cell.background || _defaultStyle.background)
      if (hasBackground(background)) {
        // 处理阴影 (暂时先用any, 这里后续要优化)
        const shadow: any = (
          isActive ? _activeStyle.shadow : (cell.shadow || _defaultStyle.shadow)
        )
          .replace(/px/g, '') // 清空px字符串
          .split(',')[0].split(' ') // 防止有人声明多个阴影, 截取第一个阴影
          .map((n, i) => i < 3 ? Number(n) : n) // 把数组的前三个值*像素比
        // 绘制阴影
        if (shadow.length === 4) {
          ctx.shadowColor = shadow[3]
          ctx.shadowOffsetX = shadow[0] * config.dpr
          ctx.shadowOffsetY = shadow[1] * config.dpr
          ctx.shadowBlur = shadow[2]
          // 修正(格子+阴影)的位置, 这里使用逗号运算符
          shadow[0] > 0 ? (width -= shadow[0]) : (width += shadow[0], x -= shadow[0])
          shadow[1] > 0 ? (height -= shadow[1]) : (height += shadow[1], y -= shadow[1])
        }
        // 绘制背景
        ctx.fillStyle = this.handleBackground(x, y, width, height, background)
        const borderRadius = this.getLength(cell.borderRadius ? cell.borderRadius : _defaultStyle.borderRadius)
        roundRectByArc(ctx, x, y, width, height, borderRadius)
        ctx.fill()
        // 清空阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0)'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
      }
      // 修正图片缓存
      let cellName = 'prizes'
      if (cellIndex >= this.prizes.length) {
        cellName = 'buttons'
        cellIndex -= this.prizes.length
      }
      // 绘制图片
      cell.imgs && cell.imgs.forEach((imgInfo, imgIndex) => {
        const cellImg = this.ImageCache.get(imgInfo.src)
        const activeImg = this.ImageCache.get(imgInfo['activeSrc'])
        if (!cellImg) return
        const renderImg = (isActive && activeImg) || cellImg
        if (!renderImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(renderImg, imgInfo, width, height)
        const [xAxis, yAxis] = [
          x + this.getOffsetX(trueWidth, width) + this.getLength(imgInfo.left, width),
          y + this.getLength(imgInfo.top, height)
        ]
        this.drawImage(ctx, renderImg, xAxis, yAxis, trueWidth, trueHeight)
      })
      // 绘制文字
      cell.fonts && cell.fonts.forEach(font => {
        // 字体样式
        const style = isActive && _activeStyle.fontStyle
          ? _activeStyle.fontStyle
          : (font.fontStyle || _defaultStyle.fontStyle)
        // 字体加粗
        const fontWeight = isActive && _activeStyle.fontWeight
          ? _activeStyle.fontWeight
          : (font.fontWeight || _defaultStyle.fontWeight)
        // 字体大小
        const size = isActive && _activeStyle.fontSize
          ? this.getLength(_activeStyle.fontSize)
          : this.getLength(font.fontSize || _defaultStyle.fontSize)
        // 字体行高
        const lineHeight = isActive && _activeStyle.lineHeight
          ? _activeStyle.lineHeight
          : font.lineHeight || _defaultStyle.lineHeight || font.fontSize || _defaultStyle.fontSize
        const wordWrap = has(font, 'wordWrap') ? font.wordWrap : _defaultStyle.wordWrap
        const lengthLimit = font.lengthLimit || _defaultStyle.lengthLimit
        const lineClamp = font.lineClamp || _defaultStyle.lineClamp
        ctx.font = `${fontWeight} ${size >> 0}px ${style}`
        ctx.fillStyle = (isActive && _activeStyle.fontColor) ? _activeStyle.fontColor : (font.fontColor || _defaultStyle.fontColor)
        let lines = [], text = String(font.text)
        // 计算文字换行
        if (wordWrap) {
          // 最大宽度
          let maxWidth = this.getLength(lengthLimit, width)
          lines = splitText(ctx, removeEnter(text), () => maxWidth, lineClamp)
        } else {
          lines = text.split('\n')
        }
        lines.forEach((line, lineIndex) => {
          ctx.fillText(
            line,
            x + this.getOffsetX(ctx.measureText(line).width, width) + this.getLength(font.left, width),
            y + this.getLength(font.top, height) + (lineIndex + 1) * this.getLength(lineHeight)
          )
        })
      })
    })
    // 触发绘制后回调
    config.afterDraw?.call(this, ctx)
  }

  /**
   * 处理背景色
   * @param x
   * @param y
   * @param width
   * @param height
   * @param background
   * @param isActive
   */
  private handleBackground (
    x: number,
    y: number,
    width: number,
    height: number,
    background: string,
  ) {
    const { ctx } = this
    // 处理线性渐变
    if (background.includes('linear-gradient')) {
      background = getLinearGradient(ctx, x, y, width, height, background)
    }
    return background
  }

  /**
   * 刻舟求剑
   */
  private carveOnGunwaleOfAMovingBoat (): void {
    const { _defaultConfig, prizeFlag, currIndex } = this
    this.endTime = Date.now()
    const stopIndex = this.stopIndex = currIndex
    const speed = _defaultConfig.speed
    let i = 0, prevSpeed = 0, prevIndex = 0
    while (++i) {
      const endIndex = this.prizes.length * i + prizeFlag! - (stopIndex)
      const currSpeed = quad.easeOut(this.FPS, stopIndex, endIndex, _defaultConfig.decelerationTime) - stopIndex
      if (currSpeed > speed) {
        this.endIndex = (speed - prevSpeed > currSpeed - speed) ? endIndex : prevIndex
        break
      }
      prevIndex = endIndex
      prevSpeed = currSpeed
    }
  }

  /**
   * 对外暴露: 开始抽奖方法
   */
  public play (): void {
    if (this.step !== 0) return
    // 记录游戏开始的时间
    this.startTime = Date.now()
    // 重置中奖索引
    this.prizeFlag = void 0
    // 开始加速
    this.step = 1
    // 触发回调
    this.config.afterStart?.()
    // 开始运行
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
    const { rAF, step, prizes, prizeFlag, _defaultConfig } = this
    const { accelerationTime, decelerationTime, speed } = _defaultConfig
    // 结束游戏
    if (step === 0) {
      this.endCallback?.(this.prizes.find((prize, index) => index === prizeFlag) || {})
      return
    }
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return
    // 计算结束位置
    if (step === 3 && !this.endIndex) this.carveOnGunwaleOfAMovingBoat()
    // 计算时间间隔
    const startInterval = Date.now() - this.startTime
    const endInterval = Date.now() - this.endTime
    let currIndex = this.currIndex
    // 
    if (step === 1 || startInterval < accelerationTime) { // 加速阶段
      // 记录帧率
      this.FPS = startInterval / num
      const currSpeed = quad.easeIn(startInterval, 0.1, speed - 0.1, accelerationTime)
      // 加速到峰值后, 进入匀速阶段
      if (currSpeed === speed) {
        this.step = 2
      }
      currIndex = currIndex + currSpeed % prizes.length
    } else if (step === 2) { // 匀速阶段
      // 速度保持不变
      currIndex = currIndex + speed % prizes.length
      // 如果 prizeFlag 有值, 则进入减速阶段
      if (prizeFlag !== void 0 && prizeFlag >= 0) {
        this.step = 3
        // 清空上一次的位置信息
        this.stopIndex = 0
        this.endIndex = 0
      }
    } else if (step === 3) { // 减速阶段
      // 开始缓慢停止
      currIndex = quad.easeOut(endInterval, this.stopIndex, this.endIndex, decelerationTime)
      if (endInterval >= decelerationTime) {
        this.step = 0
      }
    } else {
      // 出现异常
      this.stop(-1)
    }
    this.currIndex = currIndex
    this.draw()
    rAF(this.run.bind(this, num + 1))
  }

  /**
   * 计算奖品格子的几何属性
   * @param { array } [...矩阵坐标, col, row]
   * @return { array } [...真实坐标, width, height]
   */
  private getGeometricProperty ([x, y, col = 1, row = 1]: number[]) {
    const { cellWidth, cellHeight } = this
    const gutter = this._defaultConfig.gutter
    let res = [
      this.prizeArea!.x + (cellWidth + gutter) * x,
      this.prizeArea!.y + (cellHeight + gutter) * y
    ]
    col && row && res.push(
      cellWidth * col + gutter * (col - 1),
      cellHeight * row + gutter * (row - 1),
    )
    return res
  }

  /**
   * 换算渲染坐标
   * @param x
   * @param y
   */
  protected conversionAxis (x: number, y: number): [number, number] {
    const { config } = this
    return [x / config.dpr, y / config.dpr]
  }
}
