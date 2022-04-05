/**
 * 判断是否是期望的类型
 * @param { unknown } param 将要判断的变量
 * @param { ...string } types 期望的类型
 * @return { boolean } 返回期望是否正确
 */
export const isExpectType = (param: unknown, ...types: string[]): boolean => {
  return types.some(type => Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type)
}

export const get = (data: object, strKeys: string) => {
  const keys = strKeys.split('.')
  for (let key of keys) {
    const res = data[key]
    if (!isExpectType(res, 'object', 'array')) return res
    data = res
  }
  return data
}

export const has = (data: object, key: string | number): boolean => {
  return Object.prototype.hasOwnProperty.call(data, key)
}

/**
 * 移除\n
 * @param { string } str 将要处理的字符串
 * @return { string } 返回新的字符串
 */
export const removeEnter = (str: string): string => {
  return [].filter.call(str, s => s !== '\n').join('')
}

/**
 * 把任何数据类型转成数字
 * @param num 
 */
export const getNumber = (num: unknown): number => {
  if (num === null) return 0
  if (typeof num === 'object') return NaN
  if (typeof num === 'number') return num
  if (typeof num === 'string') {
    if (num[num.length - 1] === '%') {
      return Number(num.slice(0, -1)) / 100
    }
    return Number(num)
  }
  return NaN
}

/**
 * 判断颜色是否有效 (透明色 === 无效)
 * @param color 颜色
 */
export const hasBackground = (color: string | undefined | null): boolean => {
  if (typeof color !== 'string') return false
  color = color.toLocaleLowerCase().trim()
  if (color === 'transparent') return false
  if (/^rgba/.test(color)) {
    const alpha = /([^\s,]+)\)$/.exec(color)
    if (getNumber(alpha) === 0) return false
  }
  return true
}

/**
 * 通过padding计算
 * @return { object } block 边框信息
 */
export const computePadding = (
  block: { padding?: string },
  getLength: Function
): [number, number, number, number] => {
  let padding = block.padding?.split(' ').map(n => getLength(n)) || [0],
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
    res[key] = has(block, key) && isExpectType(block[key], 'string', 'number')
      ? getLength(block[key])
      : res[key]
  }
  return [paddingTop, paddingBottom, paddingLeft, paddingRight]
}

/**
 * 节流函数
 * @param fn 将要处理的函数
 * @param wait 时间, 单位为毫秒
 * @returns 包装好的节流函数
 */
export const throttle = (fn: Function, wait = 300) => {
  let timeId = null as any
  return function (this: any, ...args: any[]) {
    if (timeId) return
    timeId = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timeId)
      timeId = null
    }, wait)
  }
}

/**
 * 通过概率计算出一个奖品索引
 * @param { Array<number | undefined> } rangeArr 概率
 * @returns { number } 中奖索引
 */
export const computeRange = (rangeArr: Array<number | undefined>): number => {
  const ascendingArr: number[] = []
  // 额外增加 map 来优化 ts 的类型推断
  const sum = rangeArr.map(num => Number(num)).reduce((prev, curr) => {
    if (curr > 0) { // 大于0
      const res = prev + curr
      ascendingArr.push(res)
      return res
    } else { // 小于等于0或NaN
      ascendingArr.push(NaN)
      return prev
    }
  }, 0)
  const random = Math.random() * sum
  return ascendingArr.findIndex(num => random <= num)
}

/**
 * 根据宽度分割字符串, 来达到换行的效果
 * @param text 
 * @param maxWidth 
 * @returns 
 */
export const splitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  getWidth: (lines: string[]) => number,
  lineClamp: number = Infinity
): string[] => {
  // 如果 lineClamp 设置不正确, 则忽略该属性
  if (lineClamp <= 0) lineClamp = Infinity
  let str = ''
  const lines = []
  const EndWidth = ctx.measureText('...').width
  for (let i = 0; i < text.length; i++) {
    str += text[i]
    let currWidth = ctx.measureText(str).width
    const maxWidth = getWidth(lines)
    // 如果正在计算最后一行, 则加上三个小点的宽度
    if (lineClamp === lines.length + 1) currWidth += EndWidth
    // 如果已经没有宽度了, 就没有必要再计算了
    if (maxWidth < 0) return lines
    // 如果当前一行的宽度不够了, 则处理下一行
    if (currWidth > maxWidth) {
      lines.push(str.slice(0, -1))
      str = text[i]
    }
    // 如果现在是最后一行, 则加上三个小点并跳出
    if (lineClamp === lines.length) {
      lines[lines.length - 1] += '...'
      return lines
    }
  }
  if (str) lines.push(str)
  if (!lines.length) lines.push(text)
  return lines
}

// 获取一个重新排序的数组
export const getSortedArrayByIndex = <T>(arr: T[], order: number[]): T[] => {
  const map: { [key: number]: T } = {}, res = []
  for (let i = 0; i < arr.length; i++) {
    map[i] = arr[i]
  }
  for (let i = 0; i < order.length; i++) {
    const curr = map[order[i]]
    if (curr) (res[i] = curr)
  }
  return res
}
