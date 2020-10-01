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

// 移除\n
export const removeEnter = str => {
  return [].filter.call(str, s => s !== '\n').join('')
}

// 参数校验器
export const paramsValidator = (data, params = {}, msg = '') => {
  if (isExpectType(data, 'object')) data = [data]
  return data.every((item, index) => {
    for (let key in params) {
      if (params[key] === 1 && !item.hasOwnProperty(key)) {
        return !!console.error(`参数 ${msg}[${index}] 缺少 ${key} 属性`)
      }
      else if (isExpectType(params[key], 'object') && item[key]) {
        if (!paramsValidator(
          item[key], params[key], msg ? `${msg}[${index}].${key}` : key
        )) return false
      }
    }
    return true
  })
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