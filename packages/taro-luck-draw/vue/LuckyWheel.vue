<template>
  <view class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      type="2d"
      id="lucky-wheel"
      canvasId="lucky-wheel"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    />
    <!-- 按钮 -->
    <view v-if="flag === 'WEB'" class="lucky-wheel-btn" @touchstart="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></view>
    <cover-view v-else class="lucky-wheel-btn" @touchstart="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></cover-view>
    <!-- 图片 -->
    <view v-if="$lucky && flag !== 'WEB'">
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
import { LuckyWheel as Wheel } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag } from '../utils'
export default {
  props: {
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
    buttons: {
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
      $lucky: null,
      boxWidth: 300,
      boxHeight: 300,
      btnWidth: 0,
      btnHeight: 0,
    }
  },
  watch: {
    blocks (newData) {
      this.$lucky.blocks = newData
    },
    prizes (newData) {
      this.$lucky.prizes = newData
    },
    buttons (newData) {
      this.$lucky.buttons = newData
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
      Taro.createSelectorQuery().in(page).select('#lucky-wheel').fields({
        node: true, size: true
      }).exec((res) => {
        let flag = this.flag, rAF
        if (flag === 'WEB') {
          res[0] = {
            node: document.querySelector('#lucky-wheel canvas'),
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
        const $lucky = this.$lucky = new Wheel({
          flag,
          ctx,
          dpr,
          width,
          height,
          rAF,
          setTimeout,
          clearTimeout,
          setInterval,
          clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          beforeCreate: function () {
            if (flag === 'WEB') return
            const Radius = Math.min(this.config.width, this.config.height) / 2
            ctx.translate(Radius, Radius)
          },
          beforeInit: function () {
            if (flag === 'WEB') return
            ctx.translate(-this.Radius, -this.Radius)
          },
          afterInit: function () {
            _this.btnWidth = this.maxBtnRadius * 2
            _this.btnHeight = this.maxBtnRadius * 2
          },
        }, {
          ...this.$props,
          start: (...rest) => this.$emit('start', ...rest),
          end: (...rest) => this.$emit('end', ...rest),
        })
      })
    },
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
    toPlay () {
      this.$lucky.startCallback()
    },
  }
}
</script>

<style>
  .lucky-box {
    position: relative;
    overflow: hidden;
  }
  #lucky-wheel {
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
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
