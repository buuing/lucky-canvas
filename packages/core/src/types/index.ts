// 字体类型
export type FontItemType = {
  text: string
  top?: string | number
  left?: string | number
  fontColor?: string
  fontSize?: string
  fontStyle?: string
  fontWeight?: string
  lineHeight?: string
}

export type FontExtendType = {
  wordWrap?: boolean
  lengthLimit?: string | number
  lineClamp?: number
}

export type ImgType = HTMLImageElement | HTMLCanvasElement

// 图片类型
export type ImgItemType = {
  src: string
  top?: string | number
  left?: string | number
  width?: string
  height?: string
  formatter?: (img: ImgType) => ImgType
  $resolve?: Function
  $reject?: Function
}

export type BorderRadiusType = string | number
export type BackgroundType = string
export type ShadowType = string

export type ConfigType = {
  // 临时处理元素类型, 当版本升到4.x之后就可以删掉了
  nodeType?: number
  // 配置
  flag: 'WEB' | 'MP-WX' | 'UNI-H5' | 'UNI-MP' | 'TARO-H5' | 'TARO-MP'
  el?: string
  divElement?: HTMLDivElement
  canvasElement?: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr: number
  handleCssUnit?: (num: number, unit: string) => number
  // 覆盖方法
  rAF?: Function
  setTimeout: Function
  setInterval: Function
  clearTimeout: Function
  clearInterval: Function
  // 组件生命周期
  beforeCreate?: Function
  beforeResize?: Function
  afterResize?: Function
  beforeInit?: Function
  afterInit?: Function
  beforeDraw?: Function
  afterDraw?: Function
  afterStart?: Function
}

type RequireKey = 'width' | 'height'
export type UserConfigType = Partial<Omit<ConfigType, RequireKey>> & Required<Pick<ConfigType, RequireKey>>

export type UniImageType = {
  path: string
  width: number
  height: number
}

export type Tuple<T, Len extends number, Res extends T[] = []> = Res['length'] extends Len ? Res : Tuple<T, Len, [...Res, T]>
