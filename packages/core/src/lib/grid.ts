import Lucky from './lucky'
import { UserConfigType } from '../types/index'
import LuckyGridConfig, {
  BlockType, BlockImgType,
  PrizeType, PrizeImgType,
  ButtonType, ButtonImgType,
  CellFontType, CellImgType,
  RowsType, ColsType,
  CellType,
  DefaultConfigType,
  DefaultStyleType,
  ActiveStyleType,
  StartCallbackType,
  EndCallbackType,
} from '../types/grid'
import {
  isExpectType,
  removeEnter,
  computePadding,
  hasBackground,
  computeRange,
  splitText
} from '../utils/index'
import { drawRoundRect, getLinearGradient } from '../utils/math'
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
  private blockImgs: Array<{ defaultImg: HTMLImageElement }[]> = [[]]
  private btnImgs: Array<{ defaultImg: HTMLImageElement }[]> = [[]]
  private prizeImgs: Array<{ defaultImg: HTMLImageElement, activeImg?: HTMLImageElement }[]> = []

  /**
   * 九宫格构造器
   * @param config 元素标识
   * @param data 抽奖配置项
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
    const btnImgs = this.buttons.map(btn => btn.imgs)
    if (this.button) btnImgs.push(this.button.imgs)
    this.init({
      blockImgs: this.blocks.map(block => block.imgs),
      prizeImgs: this.prizes.map(prize => prize.imgs),
      btnImgs,
    })
  }

  protected resize(): void {
    super.resize()
    this.draw()
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
    super.initLucky()
  }

  /**
   * 初始化数据
   * @param data
   */
  private initData (data: LuckyGridConfig): void {
    this.$set(this, 'width', data.width || '300px')
    this.$set(this, 'height', data.height || '300px')
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
      this.init({ blockImgs: newData.map(block => block.imgs) })
    }, { deep: true })
    // 监听 prizes 数据的变化
    this.$watch('prizes', (newData: Array<PrizeType>) => {
      this.init({ prizeImgs: newData.map(prize => prize.imgs) })
    }, { deep: true })
    // 监听 button 数据的变化
    this.$watch('buttons', (newData: Array<ButtonType>) => {
      const btnImgs = newData.map(btn => btn.imgs)
      if (this.button) btnImgs.push(this.button.imgs)
      this.init({ btnImgs })
    }, { deep: true })
    // 临时过渡代码, 升级到2.x即可删除
    this.$watch('button', () => {
      const btnImgs = this.buttons.map(btn => btn.imgs)
      if (this.button) btnImgs.push(this.button.imgs)
      this.init({ btnImgs })
    }, { deep: true })
    this.$watch('rows', () => this.init({}))
    this.$watch('cols', () => this.init({}))
    this.$watch('defaultConfig', () => this.draw(), { deep: true })
    this.$watch('defaultStyle', () => this.draw(), { deep: true })
    this.$watch('activeStyle', () => this.draw(), { deep: true })
    this.$watch('startCallback', () => this.init({}))
    this.$watch('endCallback', () => this.init({}))
  }

  /**
   * 初始化 canvas 抽奖
   * @param willUpdateImgs 需要更新的图片
   */
  public init (willUpdateImgs: {
    blockImgs?: Array<BlockImgType[] | undefined>,
    prizeImgs?: Array<PrizeImgType[] | undefined>,
    btnImgs?: Array<ButtonImgType[] | undefined>
  } = {}): void {
    this.initLucky()
    const { config } = this
    // 初始化前回调函数
    config.beforeInit?.call(this)
    // 先画一次防止闪烁
    this.draw()
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
      if (this.startTime) return
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
    imgName: 'blockImgs' | 'prizeImgs' | 'btnImgs',
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
      if (!this[imgName][cellIndex]) this[imgName][cellIndex] = []
      // 异步加载图片
      const request = [
        this.loadImg(imgInfo.src, imgInfo),
        imgInfo['activeSrc'] && this.loadImg(imgInfo['activeSrc'], imgInfo, '$activeResolve')
      ]
      Promise.all(request).then(([defaultImg, activeImg]) => {
        this[imgName][cellIndex][imgIndex] = { defaultImg, activeImg } as { defaultImg: HTMLImageElement, activeImg?: HTMLImageElement }
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
   * @param cell 格子信息
   * @return [渲染宽度, 渲染高度]
   */
  private computedWidthAndHeight (
    imgObj: HTMLImageElement,
    imgInfo: CellImgType,
    cell: CellType<CellFontType, CellImgType>
  ): [number, number] {
    // 根据配置的样式计算图片的真实宽高
    if (!imgInfo.width && !imgInfo.height) {
      // 如果没有配置宽高, 则使用图片本身的宽高
      return [imgObj.width, imgObj.height]
    } else if (imgInfo.width && !imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueWidth = this.getWidth(imgInfo.width, cell.col)
      // 那高度就随着宽度进行等比缩放
      return [trueWidth, imgObj.height * (trueWidth / imgObj.width)]
    } else if (!imgInfo.width && imgInfo.height) {
      // 如果只填写了宽度, 没填写高度
      let trueHeight = this.getHeight(imgInfo.height, cell.row)
      // 那宽度就随着高度进行等比缩放
      return [imgObj.width * (trueHeight / imgObj.height), trueHeight]
    }
    // 如果宽度和高度都填写了, 就分别计算
    return [
      this.getWidth(imgInfo.width, cell.col),
      this.getHeight(imgInfo.height, cell.row)
    ]
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
    this.prizeArea = this.blocks.reduce(({x, y, w, h}, block) => {
      const [paddingTop, paddingBottom, paddingLeft, paddingRight] = computePadding(block)
      const r = block.borderRadius ? this.getLength(block.borderRadius) : 0
      // 绘制边框
      const background = block.background || _defaultStyle.background
      if (hasBackground(background)) {
        drawRoundRect(ctx, x, y, w, h, r, this.handleBackground(x, y, w, h, background))
      }
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
        drawRoundRect(
          ctx, x, y, width, height,
          this.getLength(cell.borderRadius ? cell.borderRadius : _defaultStyle.borderRadius),
          this.handleBackground(x, y, width, height, background)
        )
        // 清空阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0)'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
      }
      // 修正图片缓存
      let cellName = 'prizeImgs'
      if (cellIndex >= this.prizes.length) {
        cellName = 'btnImgs'
        cellIndex -= this.prizes.length
      }
      // 绘制图片
      cell.imgs && cell.imgs.forEach((imgInfo, imgIndex) => {
        if (!this[cellName][cellIndex]) return
        const cellImg = this[cellName][cellIndex][imgIndex]
        if (!cellImg) return
        const renderImg = (isActive && cellImg['activeImg']) || cellImg.defaultImg
        if (!renderImg) return
        const [trueWidth, trueHeight] = this.computedWidthAndHeight(renderImg, imgInfo, cell)
        const [xAxis, yAxis] = [
          x + this.getOffsetX(trueWidth, cell.col),
          y + this.getHeight(imgInfo.top, cell.row)
        ]
        this.drawImage(renderImg, xAxis, yAxis, trueWidth, trueHeight)
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
        const wordWrap = Object.prototype.hasOwnProperty.call(font, 'wordWrap') ? font.wordWrap : _defaultStyle.wordWrap
        const lengthLimit = font.lengthLimit || _defaultStyle.lengthLimit
        const lineClamp = font.lineClamp || _defaultStyle.lineClamp
        ctx.font = `${fontWeight} ${size >> 0}px ${style}`
        ctx.fillStyle = (isActive && _activeStyle.fontColor) ? _activeStyle.fontColor : (font.fontColor || _defaultStyle.fontColor)
        let lines = [], text = String(font.text)
        // 计算文字换行
        if (wordWrap) {
          // 最大宽度
          let maxWidth = this.getWidth(lengthLimit, cell.col)
          lines = splitText(ctx, removeEnter(text), () => maxWidth, lineClamp)
        } else {
          lines = text.split('\n')
        }
        lines.forEach((line, lineIndex) => {
          ctx.fillText(
            line,
            x + this.getOffsetX(ctx.measureText(line).width, cell.col),
            y + this.getHeight(font.top, cell.row) + (lineIndex + 1) * this.getLength(lineHeight)
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
   * 对外暴露: 开始抽奖方法
   */
  public play (): void {
    const { clearInterval } = this.config
    if (this.startTime) return
    clearInterval(this.timer)
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
      this.currIndex = 0
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
    const { rAF, currIndex, prizes, prizeFlag, startTime, _defaultConfig } = this
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return (this.startTime = 0, void 0)
    let interval = Date.now() - startTime
    // 先完全旋转, 再停止
    if (interval >= _defaultConfig.accelerationTime && prizeFlag !== void 0) {
      // 记录帧率
      this.FPS = interval / num
      // 记录开始停止的时间戳
      this.endTime = Date.now()
      // 记录开始停止的索引
      this.stopIndex = currIndex
      // 测算最终停止的索引
      let i = 0
      while (++i) {
        const endIndex = prizes.length * i + prizeFlag - (currIndex >> 0)
        let currSpeed = quad.easeOut(this.FPS, this.stopIndex, endIndex, _defaultConfig.decelerationTime) - this.stopIndex
        if (currSpeed > _defaultConfig.speed) {
          this.endIndex = endIndex
          break
        }
      }
      return this.slowDown()
    }
    this.currIndex = (currIndex + quad.easeIn(interval, 0.1, _defaultConfig.speed, _defaultConfig.accelerationTime)) % prizes.length
    this.draw()
    rAF(this.run.bind(this, num + 1))
  }

  /**
   * 缓慢停止的方法
   */
  private slowDown (): void {
    const { rAF, prizes, prizeFlag, stopIndex, endIndex, _defaultConfig } = this
    // 如果等于 -1 就直接停止游戏
    if (prizeFlag === -1) return (this.startTime = 0, void 0)
    let interval = Date.now() - this.endTime
    if (interval > _defaultConfig.decelerationTime) {
      this.startTime = 0
      this.endCallback?.(prizes.find((prize, index) => index === prizeFlag) || {})
      return
    }
    this.currIndex = quad.easeOut(interval, stopIndex, endIndex, _defaultConfig.decelerationTime) % prizes.length
    this.draw()
    rAF(this.slowDown.bind(this))
  }

  /**
   * 开启中奖标识自动游走
   */
  public walk (): void {
    const { setInterval, clearInterval } = this.config
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.currIndex += 1
      this.draw()
    }, 1300)
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
   * 转换并获取宽度
   * @param width 将要转换的宽度
   * @param col 横向合并的格子
   * @return 返回相对宽度
   */
  private getWidth (
    width: string | number | undefined,
    col: number = 1
  ): number {
    if (isExpectType(width, 'number')) return (width as number)
    if (isExpectType(width, 'string')) return this.changeUnits(
      width as string,
      this.cellWidth * col + this._defaultConfig.gutter * (col - 1)
    )
    return 0
  }

  /**
   * 转换并获取高度
   * @param height 将要转换的高度
   * @param row 纵向合并的格子
   * @return 返回相对高度
   */
  private getHeight (
    height: string | number | undefined,
    row: number = 1
  ): number {
    if (isExpectType(height, 'number')) return (height as number)
    if (isExpectType(height, 'string')) return this.changeUnits(
      height as string,
      this.cellHeight * row + this._defaultConfig.gutter * (row - 1)
    )
    return 0
  }

  /**
   * 获取相对(居中)X坐标
   * @param width
   * @param col
   */
  private getOffsetX (width: number, col = 1): number {
    return (this.cellWidth * col + this._defaultConfig.gutter * (col - 1) - width) / 2
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
