import {
  FontItemType,
  ImgItemType,
  BackgroundType,
  FontExtendType
} from './index'

export type PrizeFontType = FontItemType & FontExtendType

export type ButtonFontType = FontItemType & {}

export type BlockImgType = ImgItemType & {
  rotate?: boolean
}

export type PrizeImgType = ImgItemType & {}

export type ButtonImgType = ImgItemType & {}

export type BlockType = {
  padding?: string
  background?: BackgroundType
  imgs?: Array<BlockImgType>
}

export type PrizeType = {
  range?: number
  background?: BackgroundType
  fonts?: Array<PrizeFontType>
  imgs?: Array<PrizeImgType>
}

export type ButtonType = {
  radius?: string
  pointer?: boolean
  background?: BackgroundType
  fonts?: Array<ButtonFontType>
  imgs?: Array<ButtonImgType>
}

export type DefaultConfigType = {
  gutter?: string | number
  offsetDegree?: number
  speed?: number
  speedFunction?: string
  accelerationTime?: number
  decelerationTime?: number
  stopRange?: number
}

export type DefaultStyleType = {
  background?: BackgroundType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
  wordWrap?: PrizeFontType['wordWrap']
  lengthLimit?: PrizeFontType['lengthLimit']
  lineClamp?: PrizeFontType['lineClamp']
}

export type StartCallbackType = (e: MouseEvent) => void
export type EndCallbackType = (prize: object) => void

export default interface LuckyWheelConfig {
  width: string | number
  height: string | number
  blocks?: Array<BlockType>
  prizes?: Array<PrizeType>
  buttons?: Array<ButtonType>
  defaultConfig?: DefaultConfigType
  defaultStyle?: DefaultStyleType
  start?: StartCallbackType
  end?: EndCallbackType
}
