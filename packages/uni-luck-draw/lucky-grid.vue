<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas id="lucky-wheel" canvas-id="lucky-wheel" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"></canvas>
    <!-- #ifdef APP-PLUS -->
    <view v-if="btnShow">
      <view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @click="toPlay(btn)" :style="{
        top: btn.top + 'px',
        left: btn.left + 'px',
        width: btn.width + 'px',
        height: btn.height + 'px',
      }"></view>
    </view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <view v-if="btnShow">
      <cover-view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @click="toPlay(btn)" :style="{
        top: btn.top + 'px',
        left: btn.left + 'px',
        width: btn.width + 'px',
        height: btn.height + 'px',
      }"></cover-view>
    </view>
    <!-- #endif -->
    <div class="lucky-imgs">
      <div v-for="(prize, index) in prizes" :key="index">
        <div v-if="prize.imgs">
          <div v-for="(img, i) in prize.imgs" :key="i">
            <image :src="img.src" :data-index="index" :data-i="i" @load="e => imgBindload(e, 'prizes')"></image>
            <image :src="img.activeSrc" :data-index="index" :data-i="i" @load="e => imgBindloadActive(e, 'prizes')"></image>
          </div>
        </div>
      </div>
    </div>
    <div class="lucky-imgs">
      <div v-for="(btn, index) in buttons" :key="index">
        <div v-if="btn.imgs">
          <image v-for="(img, i) in btn.imgs" :key="i" :src="img.src" :data-index="index" :data-i="i" @load="e => imgBindload(e, 'buttons')"></image>
        </div>
      </div>
    </div>
    <div class="lucky-imgs">
      <span v-if="button && button.imgs">
        <image v-for="(img, i) in button.imgs" :key="i" :src="img.src" :data-i="i" @load="e => imgBindloadBtn(e, 'button')"></image>
      </span>
    </div>
  </view>
</template>

<script>
  import { changeUnits, resolveImage } from './utils.js'
  import { LuckyGrid } from '../lucky-canvas'
  export default {
    name: 'lucky-grid',
    data () {
      return {
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        dpr: 1,
        transformStyle: '',
        btns: [],
        btnShow: false,
      }
    },
    props: {
      width: {
        type: String,
        default: '600rpx'
      },
      height: {
        type: String,
        default: '600rpx'
      },
      cols: {
        type: [String, Number],
        default: 3,
      },
      rows: {
        type: [String, Number],
        default: 3,
      },
      blocks: {
        type: Array,
        default: () => []
      },
      prizes: {
        type: Array,
        default: () => []
      },
      buttons: {
        type: Array,
        default: () => []
      },
      button: {
        type: Object,
        default: undefined
      },
      defaultConfig: {
        type: Object,
        default: () => {
          return {}
        }
      },
      defaultStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      activeStyle: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    mounted () {
      this.initLucky()
    },
    watch: {
      cols (newData) {
        this.$lucky && (this.$lucky.cols = newData)
      },
      rows (newData) {
        this.$lucky && (this.$lucky.rows = newData)
      },
      blocks (newData) {
        this.$lucky && (this.$lucky.blocks = newData)
      },
      prizes (newData) {
        this.$lucky && (this.$lucky.prizes = newData)
      },
      buttons (newData) {
        this.$lucky && (this.$lucky.buttons = newData)
      },
      button (newData) {
        this.$lucky && (this.$lucky.button = newData)
      },
      defaultStyle (newData) {
        this.$lucky && (this.$lucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.$lucky && (this.$lucky.defaultConfig = newData)
      },
      activeStyle (newData) {
        this.$lucky && (this.$lucky.activeStyle = newData)
      },
    },
    methods: {
      async imgBindload (res, name) {
        const { index, i } = res.currentTarget.dataset
        const img = this[name][index].imgs[i]
        resolveImage(res, img)
      },
      async imgBindloadActive (res, name) {
        const { index, i } = res.currentTarget.dataset
        const img = this[name][index].imgs[i]
        resolveImage(res, img, 'activeSrc', '$activeResolve')
      },
      async imgBindloadBtn (res, name) {
        const { i } = res.currentTarget.dataset
        const img = this[name].imgs[i]
        resolveImage(res, img)
      },
      initLucky () {
        const dpr = this.dpr = uni.getSystemInfoSync().pixelRatio
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        const compute = (len) => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
        this.transformStyle = `scale(${1 / dpr}) translate(
          ${-compute(this.boxWidth * dpr)}%, ${-compute(this.boxHeight * dpr)}%
        )`
        this.isShow = true
        this.$nextTick(() => this.draw())
      },
      draw () {
        const _this = this
        const ctx = this.ctx = uni.createCanvasContext('lucky-grid', this)
        const $lucky = this.$lucky = new LuckyGrid({
          // #ifdef H5 || APP-PLUS
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MP',
          // #endif
          dpr: 1,
          ctx: this.ctx,
          width: this.width,
          height: this.height,
          // #ifdef H5
          rAF: requestAnimationFrame,
          // #endif
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          afterDraw: function () {
            ctx.draw()
          },
          afterInit: function () {
            [..._this.$props.buttons, _this.$props.button].forEach((btn, index) => {
              if (!btn) return
              const [left, top, width, height] = this.getGeometricProperty([
                btn.x,
                btn.y,
                btn.col || 1,
                btn.row || 1
              ])
              _this.btns[index] = { top, left, width, height }
            })
            _this.$forceUpdate()
          },
        }, {
          ...this.$props,
          start: (...rest) => {
            this.$emit('start', ...rest)
          },
          end: (...rest) => {
            this.$emit('end', ...rest)
          },
        })
        this.btnShow = true
      },
      toPlay (btn) {
        // 触发抽奖逻辑
        this.$lucky.startCallback(btn)
      },
      init () {
        this.$lucky.init({})
      },
      play (...rest) {
        this.$lucky.play(...rest)
      },
      stop (...rest) {
        this.$lucky.stop(...rest)
      },
    },
  }
</script>

<style scoped>
  .lucky-box {
    position: relative;
    overflow: hidden;
  }
  .lucky-box canvas {
    position: absolute;
    pointer-events: none;
  }
  .lucky-grid-btn {
    position: absolute;
    background: rgba(0, 0, 0, 0);
    border-radius: 0;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
