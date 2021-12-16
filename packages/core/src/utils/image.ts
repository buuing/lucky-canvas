import { ImgType } from '../types/index'
import { roundRectByArc } from './math'

/**
 * 根据路径获取图片对象
 * @param { string } src 图片路径
 * @returns { Promise<HTMLImageElement> } 图片标签
 */
export const getImage = (src: string): Promise<ImgType> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
    img.src = src
  })
}

/**
 * 切割圆角
 * @param img 将要裁剪的图片对象
 * @param radius 裁剪的圆角半径
 * @returns 返回一个离屏 canvas 用于渲染
 */
export const cutRound = (img: ImgType, radius: number): ImgType => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const { width, height } = img
  canvas.width = width
  canvas.height = height
  roundRectByArc(ctx, 0, 0, width, height, radius)
  ctx.clip()
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}

/**
 * 透明度
 * @param img 将要处理的图片对象
 * @param opacity 透明度
 * @returns 返回一个离屏 canvas 用于渲染
 */
export const opacity = (
  img: ImgType,
  opacity: number
): ImgType => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const { width, height } = img
  canvas.width = width
  canvas.height = height
  // 绘制图片, 部分浏览器不支持 filter 属性, 需要处理兼容
  if (typeof ctx.filter === 'string') {
    ctx.filter = `opacity(${opacity * 100}%)`
    ctx.drawImage(img, 0, 0, width, height)
  } else {
    ctx.drawImage(img, 0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height)
    const { data } = imageData
    const len = data.length
    for (let i = 0; i < len; i += 4) {
      const alpha = data[i + 3]
      if (alpha !== 0) data[i + 3] = alpha * opacity
    }
    ctx.putImageData(imageData, 0, 0)
  }
  return canvas
}

/**
 * 权重矩阵
 * @param radius 模糊半径
 * @param sigma 
 * @returns 返回一个权重和为1的矩阵
 */
const getMatrix = (radius: number, sigma?: number): number[] => {
  sigma = sigma || radius / 3
  const r = Math.ceil(radius)
  const sigma_2 = sigma * sigma
  const sigma2_2 = 2 * sigma_2
  const denominator = 1 / (2 * Math.PI * sigma_2)
  const matrix = []
  let total = 0
  // 计算权重矩阵
  for (let x = -r; x <= r; x++) {
    for (let y = -r; y <= r; y++) {
      // 套用二维高斯函数得到每个点的权重
      const res = denominator * Math.exp(-(x * x + y * y) / sigma2_2)
      matrix.push(res)
      total += res
    }
  }
  // 让矩阵中所有权重的和等于1
  for (let i = 0; i < matrix.length; i++) {
    matrix[i] /= total
  }
  return matrix
}

/**
 * 高斯模糊
 * @param img 将要处理的图片对象
 * @param radius 模糊半径
 * @returns 返回一个离屏 canvas 用于渲染
 */
export const blur = (
  img: ImgType,
  radius: number
): ImgType => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const { width, height } = img
  // 设置图片宽高
  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)
  const ImageData = ctx.getImageData(0, 0, width, height)
  const { data } = ImageData
  const matrix = getMatrix(radius)
  const r = Math.ceil(radius)
  const w = width * 4
  const cols = r * 2 + 1
  const len = data.length, matrixLen = matrix.length
  for (let i = 0; i < len; i += 4) {
    // 处理
  }
  console.log(ImageData)
  ctx.putImageData(ImageData, 0, 0)
  return canvas
}

export const getBase64Image = () => {

}
