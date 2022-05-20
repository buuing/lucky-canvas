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
    <!-- 按钮 -->
    <view v-show="btnShow">
      <view v-if="flag === 'WEB'">
        <view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @touchstart="toPlay(btn)" :style="{
          top: btn.top + 'px',
          left: btn.left + 'px',
          width: btn.width + 'px',
          height: btn.height + 'px',
        }"></view>
      </view>
      <view v-else>
        <cover-view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @touchstart="toPlay(btn)" :style="{
          top: btn.top + 'px',
          left: btn.left + 'px',
          width: btn.width + 'px',
          height: btn.height + 'px',
        }"></cover-view>
      </view>
    </view>
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
            <view v-for="(img, i) in prize.imgs" :key="i">
              <image :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
              <image :src="img.activeSrc" @load="e => imgBindloadActive(e, 'prizes', index, i)"></image>
            </view>
          </view>
        </view>
      </view>
      <view class="lucky-imgs">
        <view v-for="(btn, index) in buttons" :key="index">
          <view v-if="btn.imgs">
            <image v-for="(img, i) in btn.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'buttons', index, i)"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { LuckyGrid as Grid } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag, getImage } from '../utils'
export default {
  props: {
    canvasId: {
      type: String,
      default: 'lucky-grid'
    },
    width: {
      type: [String, Number],
      default: '600rpx'
    },
    height: {
      type: [String, Number],
      default: '600rpx'
    },
    cols: {
      type: [String, Number],
      default: 3
    },
    rows: {
      type: [String, Number],
      default: 3
    },
    prizes: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    blocks: {
      type: Array,
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    activeStyle: {
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
      btns: [],
      btnShow: false,
      imgSrc: '',
    }
  },
  watch: {
    cols (newData) {
      this.myLucky && (this.myLucky.cols = newData)
    },
    rows (newData) {
      this.myLucky && (this.myLucky.rows = newData)
    },
    blocks (newData) {
      this.myLucky && (this.myLucky.blocks = newData)
    },
    prizes (newData) {
      this.myLucky && (this.myLucky.prizes = newData)
    },
    buttons (newData) {
      this.myLucky && (this.myLucky.buttons = newData)
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
    async imgBindloadActive (res, name, index, i) {
      const img = this[name][index].imgs[i]
      resolveImage(img, this.canvas, 'activeSrc', '$activeResolve')
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
        let flag = this.flag, rAF
        if (flag === 'WEB') {
          res[0] = {
            node: document.querySelector(`#${this.canvasId} canvas`),
            width: this.boxWidth,
            height: this.boxHeight,
          }
          // 小程序使用帧动画真机会报错
          rAF = requestAnimationFrame
        }
        if (!res[0] || !res[0].node) return console.error('lucky-canvas 获取不到 canvas 标签')
        const { node, width, height } = res[0]
        const canvas = this.canvas = node
        const ctx = this.ctx = canvas.getContext('2d')
        const dpr = this.dpr = Taro.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        const myLucky = this.myLucky = new Grid({
          flag,
          ctx,
          dpr,
          rAF,
          setTimeout,
          clearTimeout,
          setInterval,
          clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          afterInit () {
            // 动态设置按钮大小
            this.buttons.forEach((btn, index) => {
              if (!btn) return
              const [left, top, width, height] = this.getGeometricProperty([
                btn.x,
                btn.y,
                btn.col || 1,
                btn.row || 1
              ])
              _this.btns[index] = { top, left, width, height }
            })
            _this.btnShow = true
          },
          afterStart: () => {
            this.showCanvas()
          },
        }, {
          ...this.$props,
          width,
          height,
          start: (...rest) => this.$emit('start', ...rest),
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
    toPlay (btn) {
      this.myLucky.startCallback(btn)
    },
  }
}
</script>

<style>
@import url('../utils/index.css');
</style>
