const fs = require('fs')
const path = require('path')

// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const through = require('through2')

/**
 * 异步函数封装
 */
function wrap(func, scope) {
  return function (...args) {
    if (args.length) {
      const temp = args.pop()
      if (typeof temp !== 'function') {
        args.push(temp)
      }
    }

    return new Promise(function (resolve, reject) {
      args.push(function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })

      func.apply((scope || null), args)
    })
  }
}

const accessSync = wrap(fs.access)
const statSync = wrap(fs.stat)
const renameSync = wrap(fs.rename)
const mkdirSync = wrap(fs.mkdir)
const readFileSync = wrap(fs.readFile)
const writeFileSync = wrap(fs.writeFile)

/**
 * 调整路径分隔符
 */
function transformPath(filePath, sep = '/') {
  return filePath.replace(/[\\/]/g, sep)
}

/**
 * 检查文件是否存在
 */
async function checkFileExists(filePath) {
  try {
    await accessSync(filePath)
    return true
  } catch (err) {
    return false
  }
}

/**
 * 递归创建目录
 */
async function recursiveMkdir(dirPath) {
  const prevDirPath = path.dirname(dirPath)
  try {
    await accessSync(prevDirPath)
  } catch (err) {
    // 上一级目录不存在
    await recursiveMkdir(prevDirPath)
  }

  try {
    await accessSync(dirPath)

    const stat = await statSync(dirPath)
    if (stat && !stat.isDirectory()) {
      // 目标路径存在，但不是目录
      await renameSync(dirPath, `${dirPath}.bak`) // 将此文件重命名为 .bak 后缀
      await mkdirSync(dirPath)
    }
  } catch (err) {
    // 目标路径不存在
    await mkdirSync(dirPath)
  }
}

/**
 * 读取 json
 */
function readJson(filePath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const content = require(filePath)
    delete require.cache[require.resolve(filePath)]
    return content
  } catch (err) {
    return null
  }
}

/**
 * 读取文件
 */
async function readFile(filePath) {
  try {
    return await readFileSync(filePath, 'utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err)
  }
}

/**
 * 写文件
 */
async function writeFile(filePath, data) {
  try {
    await recursiveMkdir(path.dirname(filePath))
    return await writeFileSync(filePath, data, 'utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err)
  }
}

/**
 * 时间格式化
 */
function format(time, reg) {
  const date = typeof time === 'string' ? new Date(time) : time
  const map = {}
  map.yyyy = date.getFullYear()
  map.yy = ('' + map.yyyy).substr(2)
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M
  map.d = date.getDate()
  map.dd = (map.d < 10 ? '0' : '') + map.d
  map.H = date.getHours()
  map.HH = (map.H < 10 ? '0' : '') + map.H
  map.m = date.getMinutes()
  map.mm = (map.m < 10 ? '0' : '') + map.m
  map.s = date.getSeconds()
  map.ss = (map.s < 10 ? '0' : '') + map.s

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}

/**
 * 日志插件
 */
function logger(action = 'copy') {
  return through.obj(function (file, enc, cb) {
    const type = path.extname(file.path).slice(1).toLowerCase()

    // eslint-disable-next-line no-console
    console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss').grey}] [${action.green} ${type.green}] ${'=>'.cyan} ${file.path}`)

    this.push(file)
    cb()
  })
}

/**
 * 比较数组是否相等
 */
function compareArray(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length !== arr2.length) return false

  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}

/**
 * 合并两个对象
 */
function merge(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      obj1[key] = obj1[key].concat(obj2[key])
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      obj1[key] = Object.assign(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  })

  return obj1
}

/**
 * 获取 id
 */
let seed = +new Date()
function getId() {
  return ++seed
}

module.exports = {
  wrap,
  transformPath,

  checkFileExists,
  readJson,
  readFile,
  writeFile,

  logger,
  format,
  compareArray,
  merge,
  getId,
}
