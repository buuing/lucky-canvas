import { SlotMachine } from 'lucky-canvas'
import { changeUnits, resolveImage, getImage } from '../utils'

Component({
  properties: {
    width: { type: String, value: '600rpx' },
    height: { type: String, value: '600rpx' },
    blocks: { type: Array, value: [] },
    prizes: { type: Array, value: [] },
    slots: { type: Array, value: [] },
    defaultConfig: { type: Object, value: {} },
    defaultStyle: { type: Object, value: {} },
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
    'slots.**': function (newData, oldData) {
      this.lucky && (this.lucky.slots = newData)
    },
  },
  ready() {
    wx.createSelectorQuery().in(this).select('#slot-machine').fields({
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
      this.lucky = new SlotMachine({
        flag: 'MP-WX',
        ctx,
        dpr,
        offscreenCanvas: wx.createOffscreenCanvas({ type: '2d', width: 300, height: 150 }),
        // rAF: canvas.requestAnimationFrame, // 帧动画真机调试会报错!
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        unitFunc: (num, unit) => changeUnits(num + unit),
        afterStart: () => {
          // 隐藏图片并显示canvas
          this.lucky.draw()
          this.setData({
            luckyImg: '',
            showCanvas: true
          })
        }
      }, {
        width: res[0].width,
        height: res[0].height,
        blocks: data.blocks,
        prizes: data.prizes,
        slots: data.slots,
        defaultConfig: data.defaultConfig,
        defaultStyle: data.defaultStyle,
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
