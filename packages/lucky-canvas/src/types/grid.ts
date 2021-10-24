import {
  FontType,
  ImgType,
  BorderRadiusType,
  BackgroundType,
  ShadowType,
  FontExtendType
} from './index'

export type PrizeFontType = FontType & FontExtendType

export type ButtonFontType = FontType & FontExtendType

export type CellFontType = PrizeFontType | ButtonFontType

export type BlockImgType = ImgType & {}

export type PrizeImgType = ImgType & {
  activeSrc?: string
}

export type ButtonImgType = ImgType & {}

export type CellImgType = PrizeImgType | ButtonImgType

export type BlockType = {
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  padding?: string
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  imgs?: Array<BlockImgType>
}

export type CellType<T, U> = {
  x: number
  y: number
  col?: number
  row?: number
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  shadow?: ShadowType
  fonts?: Array<T>
  imgs?: Array<U>
}

export type PrizeType = CellType<PrizeFontType, PrizeImgType> & {
  range?: number
}

export type ButtonType = CellType<ButtonFontType, ButtonImgType> & {
  callback?: Function
}

export type DefaultConfigType = {
  gutter?: number
  speed?: number
  accelerationTime?: number
  decelerationTime?: number
}

export type DefaultStyleType = {
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  shadow?: ShadowType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
  wordWrap?: PrizeFontType['wordWrap']
  lengthLimit?: PrizeFontType['lengthLimit']
  lineClamp?: PrizeFontType['lineClamp']
}

export type ActiveStyleType = {
  background?: BackgroundType
  shadow?: ShadowType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
}

export type RowsType = number
export type ColsType = number
export type StartCallbackType = (e: MouseEvent, button?: ButtonType) => void
export type EndCallbackType = (prize: object) => void

export default interface LuckyGridConfig {
  rows?: RowsType
  cols?: ColsType
  blocks?: Array<BlockType>
  prizes?: Array<PrizeType>
  buttons?: Array<ButtonType>
  button?: ButtonType
  defaultConfig?: DefaultConfigType
  defaultStyle?: DefaultStyleType
  activeStyle?: ActiveStyleType
  start?: StartCallbackType
  end?: EndCallbackType
}
