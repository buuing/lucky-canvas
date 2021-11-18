/**
 * 转换为运算角度
 * @param { number } deg 数学角度
 * @return { number } 运算角度
 */
export const getAngle = (deg: number): number => {
  return Math.PI / 180 * deg
}

/**
 * 根据角度计算圆上的点
 * @param { number } deg 运算角度
 * @param { number } r 半径
 * @return { Array<number> } 坐标[x, y]
 */
export const getArcPointerByDeg = (deg: number, r: number): [number, number] => {
  return [+(Math.cos(deg) * r).toFixed(8), +(Math.sin(deg) * r).toFixed(8)]
}

/**
 * 根据点计算切线方程
 * @param { number } x 横坐标
 * @param { number } y 纵坐标
 * @return { Array<number> } [斜率, 常数]
 */
export const getTangentByPointer = (x: number, y: number): Array<number> => {
  let k = - x / y
  let b = -k * x + y
  return [k, b]
}

// 使用 arc 绘制扇形
export const fanShapedByArc = (
  ctx: CanvasRenderingContext2D,
  minRadius: number,
  maxRadius: number,
  start: number,
  end: number,
  gutter: number,
): void => {
  ctx.beginPath()
  let maxGutter = getAngle(90 / Math.PI / maxRadius * gutter)
  let minGutter = getAngle(90 / Math.PI / minRadius * gutter)
  let maxStart = start + maxGutter
  let maxEnd = end - maxGutter
  let minStart = start + minGutter
  let minEnd = end - minGutter
  ctx.arc(0, 0, maxRadius, maxStart, maxEnd, false)
  // 如果 getter 比按钮短就绘制圆弧, 反之计算新的坐标点
  // if (minEnd > minStart) {
  //   ctx.arc(0, 0, minRadius, minEnd, minStart, true)
  // } else {
    ctx.lineTo(
      ...getArcPointerByDeg(
        (start + end) / 2,
        gutter / 2 / Math.abs(Math.sin((start - end) / 2))
      )
    )
  // }
  ctx.closePath()
}

// 使用 arc 绘制圆角矩形
export const roundRectByArc = (
  ctx: CanvasRenderingContext2D,
  ...[x, y, w, h, r]: number[]
) => {
  const min = Math.min(w, h), PI = Math.PI
  if (r > min / 2) r = min / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w - r, y + r, r, -PI / 2, 0)
  ctx.lineTo(x + w, y + h - r)
  ctx.arc(x + w - r, y + h - r, r, 0, PI / 2)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x + r, y + h - r, r, PI / 2, PI)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, PI, -PI / 2)
  ctx.closePath()
}

/**
 * 创建线性渐变色
 */
export const getLinearGradient = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  background: string
) => {
  const context = (/linear-gradient\((.+)\)/.exec(background) as Array<any>)[1]
    .split(',') // 根据逗号分割
    .map((text: string) => text.trim()) // 去除两边空格
  let deg = context.shift(), direction: [number, number, number, number] = [0, 0, 0, 0]
  // 通过起始点和角度计算渐变终点的坐标点, 这里感谢泽宇大神提醒我使用勾股定理....
  if (deg.includes('deg')) {
    deg = deg.slice(0, -3) % 360
    // 根据4个象限定义起点坐标, 根据45度划分8个区域计算终点坐标
    const getLenOfTanDeg = (deg: number) => Math.tan(deg / 180 * Math.PI)
    if (deg >= 0 && deg < 45) direction = [x, y + h, x + w, y + h - w * getLenOfTanDeg(deg - 0)]
    else if (deg >= 45 && deg < 90) direction = [x, y + h, (x + w) - h * getLenOfTanDeg(deg - 45), y]
    else if (deg >= 90 && deg < 135) direction = [x + w, y + h, (x + w) - h * getLenOfTanDeg(deg - 90), y]
    else if (deg >= 135 && deg < 180) direction = [x + w, y + h, x, y + w * getLenOfTanDeg(deg - 135)]
    else if (deg >= 180 && deg < 225) direction = [x + w, y, x, y + w * getLenOfTanDeg(deg - 180)]
    else if (deg >= 225 && deg < 270) direction = [x + w, y, x + h * getLenOfTanDeg(deg - 225), y + h]
    else if (deg >= 270 && deg < 315) direction = [x, y, x + h * getLenOfTanDeg(deg - 270), y + h]
    else if (deg >= 315 && deg < 360) direction = [x, y, x + w, y + h - w * getLenOfTanDeg(deg - 315)]
  }
  // 创建四个简单的方向坐标
  else if (deg.includes('top')) direction = [x, y + h, x, y]
  else if (deg.includes('bottom')) direction = [x, y, x, y + h]
  else if (deg.includes('left')) direction = [x + w, y, x, y]
  else if (deg.includes('right')) direction = [x, y, x + w, y]
  // 创建线性渐变必须使用整数坐标
  const gradient = ctx.createLinearGradient(...(direction.map(n => n >> 0) as typeof direction))
  // 这里后期重构, 先用any代替
  return context.reduce((gradient: any, item: any, index: any) => {
    const info = item.split(' ')
    if (info.length === 1) gradient.addColorStop(index, info[0])
    else if (info.length === 2) gradient.addColorStop(...info)
    return gradient
  }, gradient)
}

// // 根据三点画圆弧
// export const drawRadian = (
//   ctx: CanvasRenderingContext2D,
//   r: number,
//   start: number,
//   end: number,
//   direction: boolean = true
// ) => {
//   // 如果角度大于等于180度, 则分两次绘制, 因为 arcTo 无法绘制180度的圆弧
//   if (Math.abs(end - start).toFixed(8) >= getAngle(180).toFixed(8)) {
//     let middle = (end + start) / 2
//     if (direction) {
//       drawRadian(ctx, r, start, middle, direction)
//       drawRadian(ctx, r, middle, end, direction)
//     } else {
//       drawRadian(ctx, r, middle, end, direction)
//       drawRadian(ctx, r, start, middle, direction)
//     }
//     return false
//   }
//   // 如果方法相反, 则交换起点和终点
//   if (!direction) [start, end] = [end, start]
//   const [x1, y1] = getArcPointerByDeg(start, r)
//   const [x2, y2] = getArcPointerByDeg(end, r)
//   const [k1, b1] = getTangentByPointer(x1, y1)
//   const [k2, b2] = getTangentByPointer(x2, y2)
//   // 计算两条切线的交点
//   let x0 = (b2 - b1) / (k1 - k2)
//   let y0 = (k2 * b1 - k1 * b2) / (k2 - k1)
//   // 如果有任何一条切线垂直于x轴, 则斜率不存在
//   if (isNaN(x0)) {
//     Math.abs(x1) === +r.toFixed(8) && (x0 = x1)
//     Math.abs(x2) === +r.toFixed(8) && (x0 = x2)
//   }
//   if (k1 === Infinity || k1 === -Infinity) {
//     y0 = k2 * x0 + b2
//   }
//   else if (k2 === Infinity || k2 === -Infinity) {
//     y0 = k1 * x0 + b1
//   }
//   ctx.lineTo(x1, y1)
//   // 微信小程序下 arcTo 在安卓真机下绘制有 bug
//   ctx.arcTo(x0, y0, x2, y2, r)
// }

// // 使用 arcTo 绘制扇形 (弃用)
// export const drawSectorByArcTo = (
//   ctx: CanvasRenderingContext2D,
//   minRadius: number,
//   maxRadius: number,
//   start: number,
//   end: number,
//   gutter: number,
// ) => {
//   if (!minRadius) minRadius = gutter
//   // 内外圆弧分别进行等边缩放
//   let maxGutter = getAngle(90 / Math.PI / maxRadius * gutter)
//   let minGutter = getAngle(90 / Math.PI / minRadius * gutter)
//   let maxStart = start + maxGutter
//   let maxEnd = end - maxGutter
//   let minStart = start + minGutter
//   let minEnd = end - minGutter
//   ctx.beginPath()
//   ctx.moveTo(...getArcPointerByDeg(maxStart, maxRadius))
//   drawRadian(ctx, maxRadius, maxStart, maxEnd, true)
//   // 如果 getter 比按钮短就绘制圆弧, 反之计算新的坐标点
//   if (minEnd > minStart) {
//     drawRadian(ctx, minRadius, minStart, minEnd, false)
//   } else {
//     ctx.lineTo(
//       ...getArcPointerByDeg(
//         (start + end) / 2,
//         gutter / 2 / Math.abs(Math.sin((start - end) / 2))
//       )
//     )
//   }
//   ctx.closePath()
// }

// // 使用 arcTo 绘制圆角矩形 (弃用)
// export const roundRectByArcTo = (
//   ctx: CanvasRenderingContext2D,
//   ...[x, y, w, h, r]: number[]
// ) => {
//   let min = Math.min(w, h)
//   if (r > min / 2) r = min / 2
//   ctx.beginPath()
//   ctx.moveTo(x + r, y)
//   ctx.lineTo(x + r, y)
//   ctx.lineTo(x + w - r, y)
//   ctx.arcTo(x + w, y, x + w, y + r, r)
//   ctx.lineTo(x + w, y + h - r)
//   ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
//   ctx.lineTo(x + r, y + h)
//   ctx.arcTo(x, y + h, x, y + h - r, r)
//   ctx.lineTo(x, y + r)
//   ctx.arcTo(x, y, x + r, y, r)
// }
