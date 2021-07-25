const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const args = process.argv.splice(2)
const packgeJsonVersion = args[0]

main()

function main () {
  rimraf('./node_modules', function (err) { // 删除当前目录下的 aaa
    if (err){
      console.log(err)
      return false
    }
    updatePackgeJsonFile()
  })
}

function updatePackgeJsonFile () {
  const packgeJsonTemplate = fs.readFileSync(path.join(__dirname, `./package-json-template/package${packgeJsonVersion}.json`), 'utf8')
  const packgeJsonFilePath = path.join(__dirname, '', '', 'package.json')
  createFile(packgeJsonFilePath, packgeJsonTemplate)
}

function createFile (targetFilePath, content) {
  fs.writeFile(targetFilePath, content, (err) => {
    if (err) throw err
    console.log('The ' + targetFilePath + ' file has been created!')
  })
}
