import React from 'react'
import Taro from '@tarojs/taro'
import { View, Canvas, CoverView, Image } from '@tarojs/components'
import { LuckyWheel as Wheel } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag } from '../utils'
import '../utils/index.css'

export default class LuckyWheel extends React.Component {
  flag = getFlag()
  ctx = null
  canvas = null
  state = {
    $lucky: null,
    boxWidth: 300,
    boxHeight: 300,
    btnWidth: 0,
    btnHeight: 0,
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.initLucky()
  }

  componentDidUpdate (prevProps) {
    const { props, state } = this
    if (props.blocks !== prevProps.blocks) {
      state.$lucky.blocks = props.blocks
    }
    if (props.prizes !== prevProps.prizes) {
      state.$lucky.prizes = props.prizes
    }
    if (props.buttons !== prevProps.buttons) {
      state.$lucky.buttons = props.buttons
    }
  }

  async imgBindload (res, name, index, i) {
    const img = this.props[name][index].imgs[i]
    resolveImage(img, this.canvas)
  }

  initLucky () {
    const { props } = this
    this.setState({
      boxWidth: changeUnits(props.width),
      boxHeight: changeUnits(props.height)
    }, () => {
      // 某些情况下获取不到 canvas
      setTimeout(() => {
        this.getConfig()
      }, 100)
    })
  }

  getConfig () {
    let flag = this.flag
    const dpr = this.dpr = Taro.getSystemInfoSync().pixelRatio
    if (flag === 'WEB') {
      // H5 环境
      const divElement = document.querySelector('#lucky-box')
      this.drawLucky({
        dpr,
        flag,
        divElement,
        width: this.state.boxWidth,
        height: this.state.boxHeight,
        rAF: requestAnimationFrame,
      })
    } else {
      // 小程序环境
      const page = Taro.getCurrentInstance().page
      Taro.createSelectorQuery().in(page).select('#lucky-wheel').fields({
        node: true, size: true
      }).exec((res) => {
        if (!res[0] || !res[0].node) return console.error('lucky-canvas 获取不到 canvas 标签')
        const { node, width, height } = res[0]
        const canvas = this.canvas = node
        const ctx = this.ctx = canvas.getContext('2d')
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        this.drawLucky({
          dpr,
          flag,
          ctx,
          width,
          height,
        })
      })
    }
  }

  drawLucky (config) {
    const _this = this
    const { props, flag } = this
    const $lucky = new Wheel({
      ...config,
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
        // 动态设置按钮大小
        _this.setState({
          btnWidth: this.maxBtnRadius * 2,
          btnHeight: this.maxBtnRadius * 2,
        })
      },
    }, {
      ...props,
      start: (...rest) => {
        props.onStart && props.onStart(...rest)
      },
      end: (...rest) => {
        props.onEnd && props.onEnd(...rest)
      }
    })
    this.setState({ $lucky })
  }

  play (...rest) {
    this.state.$lucky.play(...rest)
  }

  stop (...rest) {
    this.state.$lucky.stop(...rest)
  }

  toPlay () {
    this.state.$lucky.startCallback()
  }

  render () {
    const { props, state } = this
    return this.flag === 'WEB' ? <div id="lucky-box"></div> : (
      <View className="lucky-box" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}>
        <Canvas
          type="2d"
          id="lucky-wheel"
          canvasId="lucky-wheel"
          style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}
        ></Canvas>
        {/* 按钮 */}
        <CoverView
          className="lucky-wheel-btn"
          onTouchstart={e => this.toPlay(e)}
          style={{ width: state.btnWidth + 'px', height: state.btnHeight + 'px' }}
        ></CoverView>
        {/* 图片 */}
        <View className="lucky-imgs">
          {
            props.blocks.map((block, index) => <View key={index}>
              {
                block.imgs ? <View>
                  { block.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'blocks', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View>
        <View className="lucky-imgs">
          {
            props.prizes.map((prize, index) => <View key={index}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View>
        <View className="lucky-imgs">
          {
            props.buttons.map((button, index) => <View key={index}>
              {
                button.imgs ? <View>
                  { button.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'buttons', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View>
      </View>
    )
  }
}

LuckyWheel.defaultProps = {
  width: '600rpx',
  height: '600rpx',
  blocks: [],
  prizes: [],
  buttons: [],
  defaultStyle: {},
  defaultConfig: {},
}
