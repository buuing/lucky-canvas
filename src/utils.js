/**
 * 判断是否是期望的类型
 * @param { any } param 将要判断的变量
 * @param { ...string } types 期望的类型
 * @return { boolean } 返回期望是否正确
 */
export const isExpectType = (param, ...types) => {
  return types.some(type => Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type)
}

// 转换并获取长度
export const getLength = length => {
  if (isExpectType(length, 'number')) return length
  if (isExpectType(length, 'string')) {
    return length.includes('%') ? length.slice(0, -1) / 100 : ~~length.replace(/px/g, '')
  }
  return 0
}

// 获取角度
export const getAngle = deg => {
  return Math.PI / 180 * deg
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
  const res = { paddingTop, paddingBottom, paddingLeft, paddingRight }
  for (let key in res) {
    // 是否含有这个属性, 并且是数字或字符串
    res[key] = obj.hasOwnProperty(key) && isExpectType(obj[key], 'string', 'number')
      ? ~~String(obj[key]).replace(/px/g, '')
      : res[key]
  }
  return [paddingTop, paddingBottom, paddingLeft, paddingRight]
}

// 绘制圆角矩形
export const roundRect = (ctx, x, y, w, h, r, color) => {
  let min = Math.min(w, h)
  if (r > min / 2) r = min / 2
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
  ctx.fill()
}
/**
 * 创建线性渐变色
 */
export const getLinearGradient = (ctx, x, y, w, h, background) => {
  const context = /linear-gradient\((.+)\)/.exec(background)[1]
    .split(',') // 根据逗号分割
    .map(text => text.trim()) // 去除两边空格
  let deg = context.shift(), direction
  // 通过起始点和角度计算渐变终点的坐标点, 这里感谢泽宇大神提醒我使用勾股定理....
  if (deg.includes('deg')) {
    deg = deg.slice(0, -3) % 360
    // 根据4个象限定义起点坐标, 根据45度划分8个区域计算终点坐标
    const getLenOfTanDeg = deg => Math.tan(deg / 180 * Math.PI)
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
  const gradient = ctx.createLinearGradient(...direction.map(n => n >> 0))
  return context.reduce((gradient, item, index) => {
    const info = item.split(' ')
    if (info.length === 1) gradient.addColorStop(index, info[0])
    else if (info.length === 2) gradient.addColorStop(...info)
    return gradient
  }, gradient)
}