const gulp = require('gulp')
const clean = require('gulp-clean')

const config = require('./tools/config')
const BuildTask = require('./tools/build')
const id = require('./package.json').name || 'miniprogram-custom-component'

// 构建任务实例
// eslint-disable-next-line no-new
new BuildTask(id, config.entry)

// 清空生成目录和文件
gulp.task('clean', gulp.series(() => gulp.src(config.distPath, {read: false, allowEmpty: true}).pipe(clean()), done => {
  if (config.isDev) {
    return gulp.src(config.demoDist, {read: false, allowEmpty: true})
      .pipe(clean())
  }

  return done()
}))
// 监听文件变化并进行开发模式构建
gulp.task('watch', gulp.series(`${id}-watch`))
// 开发模式构建
gulp.task('dev', gulp.series(`${id}-dev`))
// 生产模式构建
gulp.task('default', gulp.series(`${id}-default`))
