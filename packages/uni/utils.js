let windowWidth = uni.getSystemInfoSync().windowWidth
// uni-app@2.9起, 屏幕最多适配到960, 超出则按375计算
if (windowWidth > 960) windowWidth = 375

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

export const resolveImage = async (img, canvas, srcName = 'src', resolveName = '$resolve') => {
  let imgObj
  // 区分 H5 和小程序
  if (window) {
    imgObj = new Image()
  } else {
    imgObj = canvas.createImage()
  }
  // 成功回调
  imgObj.onload = () => {
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

// 旧版canvas引入图片的方法
// export const resolveImage = async (res, img, imgName = 'src', resolveName = '$resolve') => {
//   const src = img[imgName]
//   const $resolve = img[resolveName]
//   // #ifdef MP
//   // 如果是base64就调用base64src()方法把图片写入本地, 然后渲染临时路径
//   if (/^data:image\/([a-z]+);base64,/.test(src)) {
//     const path = await base64src(src)
//     $resolve({ ...res.detail, path })
//     return
//   }
//   // #endif
//   // 如果是本地图片, 直接返回
//   if (src.indexOf('http') !== 0) {
//     $resolve({ ...res.detail, path:src })
//     return
//   }
//   // 如果是网络图片, 则通过getImageInfo()方法获取图片宽高
//   uni.getImageInfo({
//     src: src,
//     success: (imgObj) => $resolve(imgObj),
//     fail: () => console.error('API `uni.getImageInfo` 加载图片失败', src)
//   })
// }

export function getImage(canvasId, canvas) {
  return new Promise((resolve, reject) => {
    uni.canvasToTempFilePath({
      canvas,
      canvasId,
      success: res => resolve(res),
      fail: err => reject(err)
    }, this)
  })
}
