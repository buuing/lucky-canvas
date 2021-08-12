<template>
  <div v-if="flag === 'WEB'" ref="luckyBox"></div>
	<view v-else class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas id="lucky-canvas" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }" canvasId="luckyGrid" />
    <view v-if="btnShow">
      <cover-view class="lucky-grid-btn" v-for="(btn, index) in btns" :key="index" @touchstart="toPlay(btn)" :style="{
        top: btn.top + 'px',
        left: btn.left + 'px',
        width: btn.width + 'px',
        height: btn.height + 'px',
      }"></cover-view>
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
</template>

<script>
import Taro from '@tarojs/taro'
import { LuckyGrid as Grid } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag } from '../utils'
export default {
  props: {
    width: { type: [String, Number], default: '600rpx' },
    height: { type: [String, Number], default: '600rpx' },
    cols: { type: [String, Number], default: 3 },
    rows: { type: [String, Number], default: 3 },
    prizes: { type: Array, default: () => [] },
    buttons: { type: Array, default: () => [] },
    blocks: { type: Array, default: () => [] },
    defaultStyle: { type: Object, default () { return {} } },
    activeStyle: { type: Object, default () { return {} } },
    defaultConfig: { type: Object, default: () => { return {} } },
  },
  data () {
    return {
      ctx: null,
      flag: getFlag(),
      $lucky: null,
      boxWidth: 300,
      boxHeight: 300,
      btns: [],
      btnShow: false,
    }
  },
  watch: {
    cols (newData) {
      this.$lucky.cols = newData
    },
    rows (newData) {
      this.$lucky.rows = newData
    },
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
    try {
      this.init()
      this.$emit('success')
    } catch (err) {
      console.error(err)
      this.$emit('error', err)
    } finally {
      this.$emit('finally')
    }
  },
  methods: {
    async imgBindload (res, name, index, i) {
      const img = this[name][index].imgs[i]
      resolveImage(res, img)
    },
    async imgBindloadActive (res, name, index, i) {
      const img = this[name][index].imgs[i]
      resolveImage(res, img, 'activeSrc', '$activeResolve')
    },
    init () {
      this.boxWidth = changeUnits(this.width)
      this.boxHeight = changeUnits(this.height)
      let ctx, divElement, flag = this.flag
      if (flag === 'WEB') {
        divElement = this.$refs.luckyBox
      } else {
        ctx = this.ctx = Taro.createCanvasContext('luckyGrid', this)
      }
      const $lucky = this.$lucky = new Grid({
        flag,
        divElement,
        ctx,
        width: this.boxWidth,
        height: this.boxHeight,
        unitFunc: (num, unit) => changeUnits(num + unit),
        afterDraw: function () {
          if (flag === 'WEB') return
          ctx.draw()
        },
      }, {
        ...this.$props,
        start: (...rest) => this.$emit('start', ...rest),
        end: (...rest) => this.$emit('end', ...rest),
      })
      // 动态设置按钮大小
      this.$props.buttons.forEach((btn, index) => {
        if (!btn) return
        const [left, top, width, height] = this.$lucky.getGeometricProperty([
          btn.x,
          btn.y,
          btn.col || 1,
          btn.row || 1
        ])
        this.btns[index] = { top, left, width, height }
      })
      this.btnShow = true
    },
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
    toPlay (btn) {
      this.$lucky.startCallback(btn)
    },
  }
}
</script>

<style>
  .lucky-box {
    position: relative;
    overflow: hidden;
  }
  #lucky-canvas {
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
