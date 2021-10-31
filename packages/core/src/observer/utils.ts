
import { isExpectType } from '../utils'

export const hasProto = '__proto__' in {}

export function def (obj: object, key: string | number, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export function parsePath (path: string) {
  path += '.'
  let segments: string[] = [], segment = ''
  for (let i = 0; i < path.length; i++) {
    let curr = path[i]
    if (/\[|\./.test(curr)) {
      segments.push(segment)
      segment = ''
    } else if (/\W/.test(curr)) {
      continue
    } else {
      segment += curr
    }
  }
  return function (data: object | any[]) {
    return segments.reduce((data, key) => {
      return data[key]
    }, data)
  }
}

export function traverse (value: any) {
  // const seenObjects = new Set()
  const dfs = (data: any) => {
    if (!isExpectType(data, 'array', 'object')) return
    Object.keys(data).forEach(key => {
      const value = data[key]
      dfs(value)
    })
  }
  dfs(value)
  // seenObjects.clear()
}