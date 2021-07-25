import Watcher from './watcher'

export default class Dep {
  static target: Watcher | null
  private subs: Array<Watcher>

  /**
   * 订阅中心构造器
   */
  constructor () {
    this.subs = []
  }

  /**
   * 收集依赖
   * @param {*} sub 
   */
  public addSub (sub: Watcher) {
    // 此处临时使用includes防重复添加
    if (!this.subs.includes(sub)) {
      this.subs.push(sub)
    }
  }

  /**
   * 派发更新
   */
  public notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
