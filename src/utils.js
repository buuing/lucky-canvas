
// 绘制圆角矩形
export const roundRect = (ctx, x, y, w, h, r, color) => {
  if (r > w / 2) r = w
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