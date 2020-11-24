/**
 * 判断是否是期望的类型
 * @param { any } param 将要判断的变量
 * @param { ...string } types 期望的类型
 * @return { boolean } 返回期望是否正确
 */
export const isExpectType = (param, ...types) => {
  return types.some(type => Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type)
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
