const fs = require('fs')
const path = require('path')
const simulate = require('miniprogram-simulate')
const config = require('../tools/config')

// const dir = config.srcPath // 使用源码进行测试，对于 debug 和代码覆盖率检测会比较友好
const dir = config.distPath // 使用构建后代码进行测试，如果使用了 typescript 进行开发，必须选择此目录

try {
  fs.accessSync(dir)
} catch (err) {
  console.error('请先执行 npm run build 再进行单元测试！！！')
}

const oldLoad = simulate.load
simulate.load = function (componentPath, ...args) {
  if (typeof componentPath === 'string') componentPath = path.join(dir, componentPath)
  return oldLoad(componentPath, ...args)
}

module.exports = simulate

// adjust the simulated wx api 
const oldGetSystemInfoSync = global.wx.getSystemInfoSync
global.wx.getSystemInfoSync = function() {
  const res = oldGetSystemInfoSync()
  res.SDKVersion = '2.4.1'

  return res
}
