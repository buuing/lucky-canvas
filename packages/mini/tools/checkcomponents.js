const path = require('path')

const _ = require('./utils')
const config = require('./config')

const srcPath = config.srcPath
let hasCheckCompoenntMap = {}

/**
 * 获取 json 路径相关信息
 */
function getJsonPathInfo(jsonPath) {
  const dirPath = path.dirname(jsonPath)
  const fileName = path.basename(jsonPath, '.json')
  const relative = path.relative(srcPath, dirPath)
  const fileBase = path.join(relative, fileName)

  return {
    dirPath, fileName, relative, fileBase
  }
}

/**
 * 检测是否包含其他自定义组件
 */
const checkProps = ['usingComponents', 'componentGenerics']
async function checkIncludedComponents(jsonPath, componentListMap) {
  const json = _.readJson(jsonPath)
  if (!json) throw new Error(`json is not valid: "${jsonPath}"`)

  const {dirPath, fileName, fileBase} = getJsonPathInfo(jsonPath)
  if (hasCheckCompoenntMap[fileBase]) return
  hasCheckCompoenntMap[fileBase] = true

  for (let i = 0, len = checkProps.length; i < len; i++) {
    const checkProp = checkProps[i]
    const checkPropValue = json[checkProp] || {}
    const keys = Object.keys(checkPropValue)

    for (let j = 0, jlen = keys.length; j < jlen; j++) {
      const key = keys[j]
      let value = typeof checkPropValue[key] === 'object' ? checkPropValue[key].default : checkPropValue[key]
      if (!value || typeof value === 'boolean') continue

      value = _.transformPath(value, path.sep)

      // 检查相对路径
      const componentPath = `${path.join(dirPath, value)}.json`
      const isExists = await _.checkFileExists(componentPath)
      if (isExists) {
        await checkIncludedComponents(componentPath, componentListMap)
      }
    }
  }

  const wholeFileBase = path.join(dirPath, fileName)
  let jsExt = '.js'
  const isJsFileExists = await _.checkFileExists(wholeFileBase + '.ts')
  if (isJsFileExists) {
    jsExt = '.ts'
  }

  // 进入存储
  componentListMap.wxmlFileList.push(`${fileBase}.wxml`)
  componentListMap.wxssFileList.push(`${fileBase}.wxss`)
  componentListMap.jsonFileList.push(`${fileBase}.json`)
  componentListMap.jsFileList.push(`${fileBase}${jsExt}`)

  componentListMap.jsFileMap[fileBase] = `${wholeFileBase}${jsExt}`
}

module.exports = async function (entry) {
  const componentListMap = {
    wxmlFileList: [],
    wxssFileList: [],
    jsonFileList: [],
    jsFileList: [],

    jsFileMap: {}, // 为 webpack entry 所用
  }

  const isExists = await _.checkFileExists(entry)
  if (!isExists) {
    const {dirPath, fileName, fileBase} = getJsonPathInfo(entry)

    const wholeFileBase = path.join(dirPath, fileName)
    let jsExt = '.js'
    const isJsFileExists = await _.checkFileExists(wholeFileBase + '.ts')
    if (isJsFileExists) {
      jsExt = '.ts'
    }
    componentListMap.jsFileList.push(`${fileBase}${jsExt}`)
    componentListMap.jsFileMap[fileBase] = `${wholeFileBase}${jsExt}`

    return componentListMap
  }

  hasCheckCompoenntMap = {}
  await checkIncludedComponents(entry, componentListMap)

  return componentListMap
}
