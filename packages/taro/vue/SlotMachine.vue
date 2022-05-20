<template>
  <view class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      type="2d"
      class="lucky-canvas"
      :id="canvasId"
      :canvasId="canvasId"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    />
    <image
      :src="imgSrc"
      @load="myLucky.clearCanvas()"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></image>
    <!-- 图片 -->
    <view v-if="myLucky && flag !== 'WEB'">
      <view class="lucky-imgs">
        <view v-for="(block, index) in blocks" :key="index">
          <view v-if="block.imgs">
            <image v-for="(img, i) in block.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'blocks', index, i)"></image>
          </view>
        </view>
      </view>
      <view class="lucky-imgs">
        <view v-for="(prize, index) in prizes" :key="index">
          <view v-if="prize.imgs">
            <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { SlotMachine as Slot } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag, getImage } from '../utils'
export default {
  props: {
    canvasId: {
      type: String,
      default: 'slot-machine'
    },
    width: {
      type: [String, Number],
      default: '600rpx'
    },
    height: {
      type: [String, Number],
      default: '600rpx'
    },
    blocks: {
      type: Array,
      default: () => []
    },
    prizes: {
      type: Array,
      default: () => []
    },
    slots: {
      type: Array,
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    defaultConfig: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      flag: getFlag(),
      ctx: null,
      canvas: null,
      myLucky: null,
      boxWidth: 300,
      boxHeight: 300,
      imgSrc: '',
    }
  },
  watch: {
    blocks (newData) {
      this.myLucky && (this.myLucky.blocks = newData)
    },
    prizes (newData) {
      this.myLucky && (this.myLucky.prizes = newData)
    },
    slots (newData) {
      this.myLucky && (this.myLucky.slots = newData)
    },
  },
  mounted () {
    this.initLucky()
  },
  methods: {
    async imgBindload (res, name, index, i) {
      const img = this[name][index].imgs[i]
      resolveImage(img, this.canvas)
    },
    getImage () {
      const page = Taro.getCurrentInstance().page
      return getImage.call(page, this.canvasId, this.canvas)
    },
    showCanvas () {
      this.imgSrc = ''
    },
    hideCanvas () {
      if (this.flag === 'WEB') return
      this.getImage().then(res => {
        if (res.errMsg !== 'canvasToTempFilePath:ok') {
          return console.error(res)
        }
        this.imgSrc = res.tempFilePath
      })
    },
    initLucky () {
      this.boxWidth = changeUnits(this.width)
      this.boxHeight = changeUnits(this.height)
      // 某些情况下获取不到 canvas
      this.$nextTick(() => {
        setTimeout(() => {
          this.draw()
        }, 100)
      })
    },
    draw () {
      const _this = this
      const page = Taro.getCurrentInstance().page
      Taro.createSelectorQuery().in(page).select(`#${this.canvasId}`).fields({
        node: true, size: true
      }).exec((res) => {
        let flag = this.flag, rAF, offscreenCanvas
        if (flag === 'WEB') {
          res[0] = {
            node: document.querySelector(`#${this.canvasId} canvas`),
            width: this.boxWidth,
            height: this.boxHeight,
          }
          // 小程序使用帧动画真机会报错
          rAF = requestAnimationFrame
        } else {
          // 小程序提供离屏 canvas
          offscreenCanvas = Taro.createOffscreenCanvas({ type: '2d' })
        }
        if (!res[0] || !res[0].node) return console.error('lucky-canvas 获取不到 canvas 标签')
        const { node, width, height } = res[0]
        const canvas = this.canvas = node
        const ctx = this.ctx = canvas.getContext('2d')
        const dpr = this.dpr = Taro.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        const myLucky = this.myLucky = new Slot({
          flag,
          ctx,
          dpr,
          rAF,
          offscreenCanvas,
          setTimeout,
          clearTimeout,
          setInterval,
          clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          afterStart: () => {
            this.showCanvas()
          },
        }, {
          ...this.$props,
          width,
          height,
          end: (...rest) => {
            this.$emit('end', ...rest)
            this.hideCanvas()
          },
        })
      })
    },
    init (...rest) {
      this.myLucky.init(...rest)
    },
    play (...rest) {
      this.myLucky.play(...rest)
    },
    stop (...rest) {
      this.myLucky.stop(...rest)
    },
  }
}
</script>

<style>
@import url('../utils/index.css');
</style>
