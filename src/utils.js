/**
 * 判断是否是期望的类型
 * @param { any } param 将要判断的变量
 * @param { string } type 期望的的类型
 * @return { boolean } 返回期望是否正确
 */
export const isExpectType = (param, type) => {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type
}

/**
 * 通过padding计算
 * @return { object }
 */
export const computePadding = obj => {
  let padding = obj.padding.replace(/px/g, '').split(' ').map(n => ~~n) || [0],
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0
  switch (padding.length) {
    case 1:
      paddingTop = paddingBottom = paddingLeft = paddingRight = padding[0]
      break
    case 2:
      paddingTop = paddingBottom = padding[0]
      paddingLeft = paddingRight = padding[1]
      break
    case 3:
      paddingTop = padding[0]
      paddingLeft = paddingRight = padding[1]
      paddingBottom = padding[2]
      break
    default:
      paddingTop = padding[0]
      paddingBottom = padding[1]
      paddingLeft = padding[2]
      paddingRight = padding[3]
  }
  // 检查是否单独传入值, 并且不是0
  const isEffective = key => obj[key] || obj[key] === 0
  return {
    paddingTop: isEffective('paddingTop') ? obj.paddingTop : paddingTop,
    paddingBottom: isEffective('paddingBottom') ? obj.paddingBottom : paddingBottom,
    paddingLeft: isEffective('paddingLeft') ? obj.paddingLeft : paddingLeft,
    paddingRight: isEffective('paddingRight') ? obj.paddingRight : paddingRight
  }
}

// 绘制圆角矩形
export const roundRect = (ctx, x, y, w, h, r, color) => {
  if (r > w / 2) r = w / 2
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.moveTo(x + r, y)
  ctx.lineTo(w + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, w - r, y + h, r)
  ctx.lineTo(x + w - r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
  ctx.fill()
}