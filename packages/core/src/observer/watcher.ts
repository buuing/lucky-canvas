import Lucky from '../lib/lucky'
import Dep from './dep'
import { parsePath, traverse } from './utils'

export interface WatchOptType {
  handler?: () => Function
  immediate?: boolean
  deep?: boolean
}

let uid = 0
export default class Watcher {
  id: number
  $lucky: Lucky
  expr: string | Function
  cb: Function
  deep: boolean
  getter: Function
  value: any

  /**
   * 观察者构造器
   * @param {*} $lucky 
   * @param {*} expr 
   * @param {*} cb 
   */
  constructor ($lucky: Lucky, expr: string | Function, cb: Function, options: WatchOptType = {}) {
    this.id = uid++
    this.$lucky = $lucky
    this.expr = expr
    this.deep = !!options.deep
    if (typeof expr === 'function') {
      this.getter = expr
    } else {
      this.getter = parsePath(expr)
    }
    this.cb = cb
    this.value = this.get()
  }

  /**
   * 根据表达式获取新值
   */
  get () {
    Dep.target = this
    const value = this.getter.call(this.$lucky, this.$lucky)
    // 处理深度监听
    if (this.deep) {
      traverse(value)
    }
    Dep.target = null
    return value
  }

  /**
   * 触发 watcher 更新
   */
  update () {
    // get获取新值
    const newVal = this.get()
    // 读取之前存储的旧值
    const oldVal = this.value
    this.value = newVal
    // 触发 watch 回调
    this.cb.call(this.$lucky, newVal, oldVal)
  }
}
