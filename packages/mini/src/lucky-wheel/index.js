import { LuckyWheel } from 'lucky-canvas'
import { changeUnits, resolveImage, getImage } from '../utils'

Component({
  properties: {
    width: { type: String, value: '600rpx' },
    height: { type: String, value: '600rpx' },
    blocks: { type: Array, value: [] },
    prizes: { type: Array, value: [] },
    buttons: { type: Array, value: [] },
    defaultConfig: { type: Object, value: {} },
    defaultStyle: { type: Object, value: {} },
    start: { type: null, value: () => {} },
    end: { type: null, value: () => {} },
  },
  data: {
    lucky: null,
    isShow: false,
    luckyImg: '',
    showCanvas: true,
  },
  observers: {
    'blocks.**': function (newData, oldData) {
      this.lucky && (this.lucky.blocks = newData)
    },
    'prizes.**': function (newData, oldData) {
      this.lucky && (this.lucky.prizes = newData)
    },
    'buttons.**': function (newData, oldData) {
      this.lucky && (this.lucky.buttons = newData)
    },
  },
  ready() {
    wx.createSelectorQuery().in(this).select('#lucky-wheel').fields({
      node: true, size: true
    }).exec((res) => {
      if (!res[0] || !res[0].node) {
        return console.error('lucky-canvas 获取不到 canvas 标签')
      }
      const canvas = this.canvas = res[0].node
      const dpr = this.dpr = wx.getSystemInfoSync().pixelRatio
      const ctx = this.ctx = canvas.getContext('2d')
      const data = this.data
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      this.lucky = new LuckyWheel({
        flag: 'MP-WX',
        ctx,
        dpr,
        width: res[0].width,
        height: res[0].height,
        // rAF: canvas.requestAnimationFrame, // 帧动画真机调试会报错!
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        unitFunc: (num, unit) => changeUnits(num + unit),
        beforeCreate() {
          const Radius = Math.min(this.config.width, this.config.height) / 2
          // 设置坐标轴
          ctx.translate(Radius, Radius)
        },
        beforeInit() {
          // 重置坐标轴
          ctx.translate(-this.Radius, -this.Radius)
        },
        afterStart: () => {
          // 隐藏图片并显示canvas
          this.lucky.draw()
          this.setData({
            luckyImg: '',
            showCanvas: true
          })
        }
      }, {
        blocks: data.blocks,
        prizes: data.prizes,
        buttons: data.buttons,
        defaultConfig: data.defaultConfig,
        defaultStyle: data.defaultStyle,
        start: (...rest) => {
          this.triggerEvent('start', ...rest)
        },
        end: (...rest) => {
          this.triggerEvent('end', ...rest)
          getImage.call(this).then(res => {
            this.setData({ luckyImg: res.tempFilePath })
          })
        },
      })
      // 为了保证 onload 回调准确
      this.setData({ isShow: true })
    })
  },
  methods: {
    imgBindload(e) {
      const { name, index, i } = e.currentTarget.dataset
      const img = this.data[name][index].imgs[i]
      resolveImage(e, img, this.canvas)
    },
    luckyImgLoad() {
      this.setData({ showCanvas: false })
      this.lucky.clearCanvas()
    },
    handleClickOfImg(e) {
      const { clientX: x, clientY: y } = e.changedTouches[0]
      wx.createSelectorQuery().in(this).select('.lucky-img').fields({
        rect: true
      }).exec((res) => {
        const { left, top } = res[0]
        this.toPlay(x - left, y - top)
      })
    },
    handleClickOfCanvas(e) {
      const { x, y } = e.changedTouches[0]
      this.toPlay(x, y)
    },
    toPlay(x, y) {
      const ctx = this.ctx
      ctx.beginPath()
      ctx.arc(0, 0, this.lucky.maxBtnRadius, 0, Math.PI * 2, false)
      if (!ctx.isPointInPath(x * this.dpr, y * this.dpr)) return
      // 触发抽奖逻辑
      this.lucky.startCallback()
    },
    init (...rest) {
      this.lucky.init(...rest)
    },
    play(...rest) {
      this.lucky.play(...rest)
    },
    stop(...rest) {
      this.lucky.stop(...rest)
    },
  },
})
