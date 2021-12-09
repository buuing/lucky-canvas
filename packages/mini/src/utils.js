const windowWidth = wx.getSystemInfoSync().windowWidth

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

export const resolveImage = (e, img, canvas, srcName = 'src', resolveName = '$resolve') => {
  const imgObj = canvas.createImage()
  imgObj.onload = () => {
    img[resolveName](imgObj)
  }
  imgObj.src = img[srcName]
}

export function getImage() {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
