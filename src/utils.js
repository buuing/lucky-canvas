/**
 * 判断是否是期望的类型
 * @param { any } param 将要判断的变量
 * @param { string } type 期望的的类型
 * @return { boolean } 返回期望是否正确
 */
export const isExpectType = (param, type) => {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type
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