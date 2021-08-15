<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      type="2d"
      id="lucky-wheel"
      canvas-id="lucky-wheel"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></canvas>
    <!-- #ifdef APP-PLUS -->
    <view class="lucky-wheel-btn" @click="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <cover-view class="lucky-wheel-btn" @click="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></cover-view>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <view v-if="canvas">
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
      <div class="lucky-imgs">
        <div v-for="(btn, index) in buttons" :key="index">
          <div v-if="btn.imgs">
            <image v-for="(img, i) in btn.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'buttons', index, i)"></image>
          </div>
        </div>
      </div>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  import { changeUnits, resolveImage } from './utils.js'
  import { LuckyWheel } from '../lucky-canvas'
  export default {
    name: 'lucky-wheel',
    data () {
      return {
        canvas: null,
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
        dpr: 1,
        tmp: 0,
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
      buttons: {
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
      this.initLucky()
    },
    watch: {
      blocks (newData) {
        this.$lucky && (this.$lucky.blocks = newData)
      },
      prizes (newData) {
        this.$lucky && (this.$lucky.prizes = newData)
      },
      buttons (newData) {
        this.$lucky && (this.$lucky.buttons = newData)
      },
      defaultStyle (newData) {
        this.$lucky && (this.$lucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.$lucky && (this.$lucky.defaultConfig = newData)
      },
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        resolveImage(img, this.canvas)
      },
      initLucky () {
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        this.isShow = true
        // 某些情况下获取不到 canvas
        setTimeout(() => this.draw())
      },
      draw () {
        const _this = this
        uni.createSelectorQuery().in(this).select('#lucky-wheel').fields({
          node: true, size: true
        }).exec((res) => {
          // #ifdef H5
          res[0].node = document.querySelector('#lucky-wheel canvas')
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
          const $lucky = this.$lucky = new LuckyWheel({
            // #ifdef H5 || APP-PLUS
            flag: 'WEB',
            // #endif
            // #ifdef MP
            flag: 'MP-WX',
            // #endif
            ctx,
            dpr,
            width,
            height,
            setTimeout,
            clearTimeout,
            setInterval,
            clearInterval,
            // #ifdef H5
            rAF: requestAnimationFrame,
            // #endif
            unitFunc: (num, unit) => changeUnits(num + unit),
            beforeCreate: function () {
              const Radius = Math.min(this.config.width, this.config.height) / 2
              // 设置坐标轴
              ctx.translate(Radius, Radius)
            },
            beforeInit: function () {
              // 重置坐标轴
              ctx.translate(-this.Radius, -this.Radius)
            },
            afterInit: function () {
              // 动态设置按钮
              _this.btnWidth = this.maxBtnRadius * 2
              _this.btnHeight = this.maxBtnRadius * 2
              _this.$forceUpdate()
            },
          }, {
            ...this.$props,
            start: function (...rest) {
              // #ifdef H5
              // 一个奇怪的渲染问题, 我怀疑uniapp有bug
              if (_this.tmp++ === 0) {
                ctx.translate(this.Radius, this.Radius)
              }
              // #endif
              _this.$emit('start', ...rest)
            },
            end: (...rest) => {
              this.$emit('end', ...rest)
            },
          })
        })
      },
      toPlay (e) {
        this.$lucky.startCallback()
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
  .lucky-wheel-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0);
    border-radius: 50%;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
