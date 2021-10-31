const path = require('path')
const through = require('through2')
const Vinyl = require('vinyl')

const _ = require('./utils')

/**
 * 获取 import 列表
 */
function getImportList(wxss, filePath) {
  const reg = /@import\s+(?:(?:"([^"]+)")|(?:'([^']+)'));/ig
  const importList = []
  let execRes = reg.exec(wxss)

  while (execRes && (execRes[1] || execRes[2])) {
    importList.push({
      code: execRes[0],
      path: path.join(path.dirname(filePath), execRes[1] || execRes[2]),
    })
    execRes = reg.exec(wxss)
  }

  return importList
}

/**
 * 获取 wxss 内容
 */
async function getContent(wxss, filePath, cwd) {
  let importList = []

  if (wxss) {
    const currentImportList = getImportList(wxss, filePath)

    for (const item of currentImportList) {
      // 替换掉 import 语句，不让 less 编译
      wxss = wxss.replace(item.code, `/* *updated for miniprogram-custom-component* ${item.code} */`)

      // 处理依赖的 wxss
      const importWxss = await _.readFile(item.path)
      const importInfo = await getContent(importWxss, item.path, cwd)

      // 获取依赖列表
      importList.push(new Vinyl({
        cwd,
        path: item.path,
        contents: Buffer.from(importInfo.wxss, 'utf8'),
      }))
      importList = importList.concat(importInfo.importList)
    }
  }

  return {
    wxss,
    importList,
  }
}

module.exports = {
  start() {
    return through.obj(function (file, enc, cb) {
      if (file.isBuffer()) {
        getContent(file.contents.toString('utf8'), file.path, file.cwd).then(res => {
          const {wxss, importList} = res

          importList.forEach(importFile => this.push(importFile))

          file.contents = Buffer.from(wxss, 'utf8')
          this.push(file)
          // eslint-disable-next-line promise/no-callback-in-promise
          cb()
        }).catch(err => {
          // eslint-disable-next-line no-console
          console.warn(`deal with ${file.path} failed: ${err.stack}`)
          this.push(file)
          // eslint-disable-next-line promise/no-callback-in-promise
          cb()
        })
      } else {
        this.push(file)
        cb()
      }
    })
  },

  end() {
    return through.obj(function (file, enc, cb) {
      if (file.isBuffer) {
        const reg = /\/\*\s\*updated for miniprogram-custom-component\*\s(@import\s+(?:(?:"([^"]+)")|(?:'([^"]+)'));)\s\*\//ig
        const wxss = file.contents.toString('utf8').replace(reg, (all, $1) => $1)

        file.contents = Buffer.from(wxss, 'utf8')
        this.push(file)
        cb()
      } else {
        this.push(file)
        cb()
      }
    })
  },
}
