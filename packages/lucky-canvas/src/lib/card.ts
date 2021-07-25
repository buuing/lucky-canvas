import Lucky from './lucky'
import { ConfigType, UniImageType } from '../types/index'
import LuckyCardConfig, {
  MaskType,
  DefaultConfigType,
  StartCallbackType,
  EndCallbackType
} from '../types/card'
import { isExpectType, computePadding, hasBackground } from '../utils/index'
import { drawRoundRect } from '../utils/math'

export default class LuckyCard extends Lucky {
  private mask: MaskType = {}
  private defaultConfig: DefaultConfigType = {}
  private _defaultConfig = {
    percent: 0.5,
    cleanZone: { x: 0, y: 0, width: 0, height: 0 }
  }
  private startCallback?: StartCallbackType
  private endCallback?: EndCallbackType
  // 是否可以开始游戏
  private canPlay: boolean = false
  // 鼠标是否按下
  private isMouseDown: boolean = false

  /**
   * 刮刮乐构造器
   * @param config 
   * @param data 
   */
  constructor (config: ConfigType, data: LuckyCardConfig = {}) {
    super(config)
    this.initData(data)
    this.init()
  }

  initData (data: LuckyCardConfig) {
    this.$set(this, 'mask', data.mask || [])
    this.$set(this, 'startCallback', data.start)
    this.$set(this, 'endCallback', data.end)
  }

  init () {
    super.init()
    const { config, ctx } = this
    this.canPlay = false
    this.draw()
  }

  draw () {
    const { config, ctx, mask } = this
    ctx.globalCompositeOperation = 'source-over'
    const background = mask.background
    if (hasBackground(background)) {
      ctx.fillStyle = background!
      ctx.beginPath()
      ctx.rect(0, 0, this.boxWidth, this.boxHeight)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'destination-out'
  }

  /**
   * 鼠标移动事件
   * @param e 事件参数
   */
  protected handleMouseMove (e: MouseEvent): void {
    if (!this.canPlay || !this.isMouseDown) return
    const { config, ctx, _defaultConfig } = this
    ctx.beginPath()
    const radius = 20
    const [x, y] = this.conversionAxis(e.offsetX, e.offsetY)
    // ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2)
    drawRoundRect(ctx, x - radius, y - radius, radius * 2, radius * 2, 15, '#ccc')
    ctx.fill()
    const ImageData = ctx.getImageData(0, 0, this.boxWidth * config.dpr, this.boxHeight * config.dpr)?.data
    let count = 0, len = ImageData.length / 4
    for (let i = 1; i <= len; i++) {
      if (ImageData[(i - 1) * 4] < 128) count++
    }
    const percent = +(count / len).toFixed(2)
    if (percent > this.getLength(_defaultConfig.percent)) {
      this.clean()
      this.endCallback?.()
    }
  }

  /**
   * 开始游戏 (调用该方法才可以擦除)
   */
  public play () {
    this.canPlay = true
    this.startCallback?.()
  }

  /**
   * 擦除所有区域
   */
  public clean () {
    const { config, ctx } = this
    ctx.clearRect(0, 0, this.boxWidth, this.boxHeight)
  }

  /**
   * 鼠标按下事件
   * @param e 事件参数
   */
  protected handleMouseDown (e: MouseEvent): void {
    this.isMouseDown = true
  }

  /**
   * 鼠标抬起事件
   * @param e 事件参数
   */
  protected handleMouseUp (e: MouseEvent): void {
    this.isMouseDown = false
  }

  /**
   * 获取相对宽度
   */
  private getWidth (
    width: string | number | undefined,
    maxWidth: number = this.boxWidth
  ): number {
    if (isExpectType(width, 'number')) return (width as number)
    if (isExpectType(width, 'string')) return this.changeUnits(width as string, maxWidth)
    return 0
  }

  /**
   * 获取相对高度
   */
  private getHeight (
    height: string | number | undefined,
    maxHeight: number = this.boxHeight
  ): number {
    if (isExpectType(height, 'number')) return (height as number)
    if (isExpectType(height, 'string')) return this.changeUnits(height as string, maxHeight)
    return 0
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
