<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      type="2d"
      id="slot-machine"
      canvas-id="slot-machine"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></canvas>
    <image
      v-if="imgSrc"
      :src="imgSrc"
      @load="myLucky.clearCanvas()"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></image>
    <!-- #ifndef H5 -->
    <view v-if="myLucky">
      <div class="lucky-imgs">
        <div v-for="(block, index) in blocks" :key="index">
          <div v-if="block.imgs">
            <image v-for="(img, i) in block.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'blocks', index, i)"></image>
          </div>
        </div>
      </div>
      <div class="lucky-imgs">
        <div v-for="(prize, index) in prizes" :key="index">
          <div v-if="prize.imgs">
            <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
          </div>
        </div>
      </div>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  import { changeUnits, resolveImage, getImage } from './utils.js'
  import { SlotMachine } from '../../lucky-canvas'
  export default {
    name: 'slot-machine',
    data () {
      return {
        imgSrc: '',
        myLucky: null,
        canvas: null,
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
        dpr: 1,
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
      defaultConfig: {
        type: Object,
        default: () => ({})
      },
      defaultStyle: {
        type: Object,
        default: () => ({})
      },
    },
    mounted () {
      // #ifndef APP-PLUS
      this.initLucky()
      // #endif
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
      defaultStyle (newData) {
        this.myLucky && (this.myLucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.myLucky && (this.myLucky.defaultConfig = newData)
      },
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        resolveImage(img, this.canvas)
      },
      getImage () {
        return getImage.call(this, 'slot-machine', this.canvas)
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
        uni.createSelectorQuery().in(this).select('#slot-machine').fields({
          node: true, size: true
        }).exec((res) => {
          // #ifdef H5
          res[0].node = document.querySelector('#slot-machine canvas')
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
          const myLucky = this.myLucky = new SlotMachine({
            // #ifdef H5
            flag: 'WEB',
            // #endif
            // #ifdef MP
            flag: 'MP-WX',
            // #endif
            ctx,
            dpr,
            // #ifndef H5
            offscreenCanvas: uni.createOffscreenCanvas({ type: '2d' }),
            // #endif
            setTimeout,
            clearTimeout,
            setInterval,
            clearInterval,
            // #ifdef H5
            rAF: requestAnimationFrame,
            // #endif
            unitFunc: (num, unit) => changeUnits(num + unit),
            afterStart: () => {
              this.imgSrc = ''
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
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
