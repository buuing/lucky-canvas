import React from 'react'
import Taro from '@tarojs/taro'
import { View, Canvas, CoverView, Image } from '@tarojs/components'
import { LuckyGrid as Grid } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag } from '../utils'
import '../utils/index.css'

export default class LuckyGrid extends React.Component {
  flag = getFlag()
  ctx = null
  canvas = null
  state = {
    $lucky: null,
    boxWidth: 300,
    boxHeight: 300,
    btns: [],
    btnShow: false,
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.initLucky()
  }

  componentDidUpdate (prevProps) {
    const { props, state } = this
    if (props.cols !== prevProps.cols) {
      state.$lucky.cols = props.cols
    }
    if (props.rows !== prevProps.rows) {
      state.$lucky.rows = props.rows
    }
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

  async imgBindloadActive (res, name, index, i) {
    const img = this.props[name][index].imgs[i]
    resolveImage(img, this.canvas, 'activeSrc', '$activeResolve')
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
      Taro.createSelectorQuery().in(page).select('#lucky-grid').fields({
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
    const { props } = this
    const $lucky = new Grid({
      ...config,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      unitFunc: (num, unit) => changeUnits(num + unit),
      afterInit: function () {
        // 动态设置按钮大小
        const btns = []
        props.buttons.forEach((btn, index) => {
          if (!btn) return
          const [left, top, width, height] = this.getGeometricProperty([
            btn.x,
            btn.y,
            btn.col || 1,
            btn.row || 1
          ])
          btns[index] = { top, left, width, height }
        })
        _this.setState({ btns, btnShow: true })
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

  toPlay (btn) {
    this.state.$lucky.startCallback(btn)
  }

  render () {
    const { props, state } = this
    return this.flag === 'WEB' ? <div id="lucky-box"></div> : (
      <View className="lucky-box" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}>
        <Canvas
          type="2d"
          id="lucky-grid"
          canvasId="lucky-grid"
          style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}
        ></Canvas>
        {/* 按钮 */}
        {
          state.btnShow ? <View>
            {
              state.btns.map((btn, index) => <CoverView className="lucky-grid-btn" key={index} onTouchstart={e => this.toPlay(btn)} style={{
                top: btn.top + 'px',
                left: btn.left + 'px',
                width: btn.width + 'px',
                height: btn.height + 'px',
              }}></CoverView>)
            }
          </View> : null
        }
        {/* 图片 */}
        { state.$lucky && flag !== 'WEB' ? <View className="lucky-imgs">
          {
            props.prizes.map((prize, index) => <View key={index}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img, i) => <View key={i}>
                    <Image src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>
                    <Image src={img.activeSrc} onLoad={e => this.imgBindloadActive(e, 'prizes', index, i)}></Image>
                  </View>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
        { state.$lucky && flag !== 'WEB' ? <View className="lucky-imgs">
          {
            props.buttons.map((button, index) => <View key={index}>
              {
                button.imgs ? <View>
                  { button.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'buttons', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
      </View>
    )
  }
}

LuckyGrid.defaultProps = {
  width: '600rpx',
  height: '600rpx',
  cols: 3,
  rows: 3,
  blocks: [],
  prizes: [],
  buttons: [],
  defaultStyle: {},
  activeStyle: {},
  defaultConfig: {},
}
