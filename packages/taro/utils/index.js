import Taro from '@tarojs/taro'

const windowWidth = Taro.getSystemInfoSync().windowWidth

export const getFlag = () => {
  let flag
  switch (process.env.TARO_ENV) {
    case 'h5':
      flag = 'WEB'
      break
    case 'weapp':
      flag = 'MP-WX'
      break
    case 'qq':
      flag = 'MP-WX'
      break
    case 'rn':
      flag = 'TARO-RN'
      break
    default:
      flag = 'MP-WX'
      break
  }
  return flag
}

export const rpx2px = (value) => {
  if (typeof value === 'string') value = Number(value.replace(/[a-z]*/g, ''))
  return windowWidth / 750 * value
}

export const changeUnits = (value) => {
  return Number(value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, (value, num, unit) => {
    switch (unit) {
      case 'px':
        num *= 1
        break
      case 'rpx':
        num = rpx2px(num)
        break
      default:
        num *= 1
        break
    }
    return num
  }))
}

export const resolveImage = async (img, canvas, srcName = 'src', resolveName = '$resolve', cb) => {
  let imgObj = canvas.createImage()
  // 成功回调
  imgObj.onload = () => {
    if (typeof cb === 'function') cb()
    img[resolveName](imgObj)
  }
  // 失败回调
  imgObj.onerror = (err) => {
    console.error(err)
    // img['$reject']()
  }
  // 设置src
  imgObj.src = img[srcName]
}

// export const resolveImage = async (res, img, imgName = 'src', resolveName = '$resolve') => {
//   const src = img[imgName]
//   // 如果是base64就调用base64src()方法把图片写入本地, 然后渲染临时路径
//   if (/^data:image\/([a-z]+);base64,/.test(src)) {
//     const path = await base64src(src)
//     img[resolveName]({ ...res.detail, path })
//     return
//   }
//   // 如果是网络图片, 则通过getImageInfo()方法获取图片宽高
//   Taro.getImageInfo({
//     src: src,
//     success: (imgObj) => img[resolveName](imgObj),
//     fail: () => console.error('API `Taro.getImageInfo` 加载图片失败', src)
//   })
// }

export function getImage (canvasId, canvas) {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      canvas: canvas,
      canvasId: canvasId,
      success: (res) => resolve(res),
      fail: (err) => reject(err),
    }, this)
  })
}
