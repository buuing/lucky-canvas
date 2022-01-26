<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      type="2d"
      id="lucky-grid"
      canvas-id="lucky-grid"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></canvas>
    <image
      v-if="imgSrc"
      :src="imgSrc"
      @load="myLucky.clearCanvas()"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></image>
    <!-- #ifdef APP-PLUS -->
    <view v-if="btnShow">
      <view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @click="toPlay(btn, index)" :style="{
        top: btn.top + 'px',
        left: btn.left + 'px',
        width: btn.width + 'px',
        height: btn.height + 'px',
      }"></view>
    </view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <view v-if="btnShow">
      <cover-view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @click="toPlay(btn, index)" :style="{
        top: btn.top + 'px',
        left: btn.left + 'px',
        width: btn.width + 'px',
        height: btn.height + 'px',
      }"></cover-view>
    </view>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <view v-if="myLucky">
      <div class="lucky-imgs">
        <div v-for="(block, index) in blocks" :key="index">
          <div v-if="block.imgs">
            <div v-for="(img, i) in block.imgs" :key="i">
              <image :src="img.src" :data-index="index" :data-i="i" @load="e => imgBindload(e, 'blocks')"></image>
              <image :src="img.activeSrc" :data-index="index" :data-i="i" @load="e => imgBindloadActive(e, 'blocks')"></image>
            </div>
          </div>
        </div>
      </div>
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
    <!-- #endif -->
  </view>
</template>

<script>
  import { changeUnits, resolveImage, getImage } from './utils.js'
  import { LuckyGrid } from '../../lucky-canvas'
  export default {
    name: 'lucky-grid',
    data () {
      return {
        imgSrc: '',
        myLucky: null,
        canvas: null,
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        dpr: 1,
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
        default: () => ({})
      },
      defaultStyle: {
        type: Object,
        default: () => ({})
      },
      activeStyle: {
        type: Object,
        default: () => ({})
      }
    },
    mounted () {
      // #ifdef APP-PLUS
      console.error('该抽奖插件的最新版暂不支持app端, 请通过npm安装旧版本【npm i uni-luck-draw@1.3.9】')
      // #endif
      // #ifndef APP-PLUS
      this.initLucky()
      // #endif
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
      button (newData) {
        this.myLucky && (this.myLucky.button = newData)
      },
      defaultStyle (newData) {
        this.myLucky && (this.myLucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.myLucky && (this.myLucky.defaultConfig = newData)
      },
      activeStyle (newData) {
        this.myLucky && (this.myLucky.activeStyle = newData)
      },
    },
    methods: {
      async imgBindload (res, name) {
        const { index, i } = res.currentTarget.dataset
        const img = this[name][index].imgs[i]
        resolveImage(img, this.canvas)
      },
      async imgBindloadActive (res, name) {
        const { index, i } = res.currentTarget.dataset
        const img = this[name][index].imgs[i]
        resolveImage(img, this.canvas, 'activeSrc', '$activeResolve')
      },
      async imgBindloadBtn (res, name) {
        const { i } = res.currentTarget.dataset
        const img = this[name].imgs[i]
        resolveImage(img, this.canvas)
      },
      getImage () {
        return getImage.call(this, 'lucky-grid', this.canvas)
      },
      hideCanvas () {
        // #ifdef MP
        this.getImage().then(res => {
          this.imgSrc = res.tempFilePath
        })
        // #endif
      },
      initLucky () {
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        this.isShow = true
        // 某些情况下获取不到 canvas
        this.$nextTick(() => {
          setTimeout(() => {
            this.draw()
          })
        })
      },
      draw () {
        const _this = this
        uni.createSelectorQuery().in(this).select('#lucky-grid').fields({
          node: true, size: true
        }).exec((res) => {
          // #ifdef H5
          res[0].node = document.querySelector('#lucky-grid canvas')
          // #endif
          if (!res[0] || !res[0].node) return console.error('lucky-canvas 获取不到 canvas 标签')
          const { node, width, height } = res[0]
          const canvas = this.canvas = node
          const ctx = this.ctx = canvas.getContext('2d')
          const dpr = this.dpr = uni.getSystemInfoSync().pixelRatio
          // #ifndef H5
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)
          // #endif
          const myLucky = this.myLucky = new LuckyGrid({
            // #ifdef H5
            flag: 'WEB',
            // #endif
            // #ifdef MP
            flag: 'MP-WX',
            // #endif
            ctx,
            dpr,
            setTimeout,
            clearTimeout,
            setInterval,
            clearInterval,
            // #ifdef H5
            rAF: requestAnimationFrame,
            // #endif
            unitFunc: (num, unit) => changeUnits(num + unit),
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
            afterStart: () => {
              this.imgSrc = ''
            },
          }, {
            ...this.$props,
            width,
            height,
            start: (...rest) => {
              this.$emit('start', ...rest)
            },
            end: (...rest) => {
              this.$emit('end', ...rest)
              this.hideCanvas()
            },
          })
          this.btnShow = true
        })
      },
      toPlay (btn, index) {
        this.myLucky.startCallback(btn, this.$props.buttons[index])
      },
      init () {
        this.myLucky.init()
      },
      play (...rest) {
        this.myLucky.play(...rest)
      },
      stop (...rest) {
        this.myLucky.stop(...rest)
      },
    },
  }
</script>

<style scoped>
  .lucky-box {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }
  .lucky-box canvas {
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
  }
  .lucky-grid-btn {
    position: absolute;
    background: rgba(0, 0, 0, 0);
    border-radius: 0;
    cursor: pointer;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
