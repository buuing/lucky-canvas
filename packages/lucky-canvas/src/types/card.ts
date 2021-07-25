import {
  FontType,
  ImgType,
  BackgroundType
} from './index'

export interface MaskType {
  background?: BackgroundType
  fonts?: Array<FontType>
  imgs?: Array<ImgType>
}

export interface WatermarkType {
  margin?: string
  rotate?: number
  opacity?: number
  text?: FontType['text']
  fontColor?: FontType['fontColor']
  fontSize?: FontType['fontSize']
  fontStyle?: FontType['fontStyle']
  fontWeight?: FontType['fontWeight']
}

export interface DefaultConfigType {
  percent?: string | number
  cleanZone?: {
    x: string | number
    y: string | number
    width: string | number
    height: string | number
  }
}

export type StartCallbackType = () => void
export type EndCallbackType = () => void

export default interface LuckyCardConfig {
  mask?: MaskType
  watermark?: WatermarkType
  start?: StartCallbackType
  end?: EndCallbackType
}
