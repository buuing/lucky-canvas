/**
 * 重写数组的原型方法
 */
const oldArrayProto = Array.prototype
const newArrayProto = Object.create(oldArrayProto)
const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse']
methods.forEach(method => {
  newArrayProto[method] = function (...args: any[]) {
    const res = oldArrayProto[method].apply(this, args)
    const luckyOb = this['__luckyOb__']
    if (['push', 'unshift', 'splice'].includes(method)) luckyOb.walk(this)
    luckyOb.dep.notify()
    return res
  }
})

export { newArrayProto }
