import React from 'react'
import Taro from '@tarojs/taro'
import { View, Canvas, Image } from '@tarojs/components'
import { SlotMachine as Slot } from 'lucky-canvas'
import { changeUnits, resolveImage, getFlag, getImage } from '../utils'
import '../utils/index.css'

export default class SlotMachine extends React.Component {
  flag = getFlag()
  ctx = null
  canvas = null
  state = {
    imgSrc: '',
    myLucky: null,
    boxWidth: 300,
    boxHeight: 300,
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.initLucky()
  }

  componentDidUpdate (prevProps) {
    const { props, state } = this
    if (!state.myLucky) return
    if (props.blocks !== prevProps.blocks) {
      state.myLucky.blocks = props.blocks
    }
    if (props.prizes !== prevProps.prizes) {
      state.myLucky.prizes = props.prizes
    }
    if (props.slots !== prevProps.slots) {
      state.myLucky.slots = props.slots
    }
  }

  async imgBindload (res, name, index, i) {
    const img = this.props[name][index].imgs[i]
    resolveImage(img, this.canvas)
  }

  getImage () {
    const page = Taro.getCurrentInstance().page
    return getImage.call(page, this.props.canvasId, this.canvas)
  }

  showCanvas () {
    this.setState({ imgSrc: '' })
  }

  hideCanvas () {
    if (this.flag === 'WEB') return
    this.getImage().then(res => {
      if (res.errMsg !== 'canvasToTempFilePath:ok') {
        return console.error(res)
      }
      this.setState({
        imgSrc: res.tempFilePath
      })
    })
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
      const divElement = document.querySelector(`#${this.props.canvasId}`)
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
      Taro.createSelectorQuery().in(page).select(`#${this.props.canvasId}`).fields({
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
          offscreenCanvas: Taro.createOffscreenCanvas({ type: '2d' })
        })
      })
    }
  }

  drawLucky (config) {
    const _this = this
    const { props, flag, ctx } = this
    const myLucky = new Slot({
      ...config,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      unitFunc: (num, unit) => changeUnits(num + unit),
      afterStart: () => {
        this.showCanvas()
      },
    }, {
      ...props,
      width: config.width,
      height: config.height,
      end: (...rest) => {
        props.onEnd && props.onEnd(...rest)
        this.hideCanvas()
      }
    })
    this.setState({ myLucky })
  }

  init (...rest) {
    this.state.myLucky.init(...rest)
  }

  play (...rest) {
    this.state.myLucky.play(...rest)
  }

  stop (...rest) {
    this.state.myLucky.stop(...rest)
  }

  render () {
    const { props, state, flag } = this
    const boxSize = { width: state.boxWidth + 'px', height: state.boxHeight + 'px' }
    const showImage = state.myLucky && flag !== 'WEB'
    return flag === 'WEB' ? <div id={props.canvasId}></div> : (
      <View className="lucky-box" style={boxSize}>
        <Canvas type="2d" className="lucky-canvas" id={props.canvasId} canvasId={props.canvasId} style={boxSize}></Canvas>
        <Image src={state.imgSrc} onLoad={() => state.myLucky.clearCanvas()} style={boxSize}></Image>
        {/* 图片 */}
        { showImage ? <View className="lucky-imgs">
          {
            props.blocks.map((block, index) => <View key={index}>
              {
                block.imgs ? <View>
                  { block.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'blocks', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
        { showImage ? <View className="lucky-imgs">
          {
            props.prizes.map((prize, index) => <View key={index}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img, i) => <Image key={i} src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View> : null }
      </View>
    )
  }
}

SlotMachine.defaultProps = {
  canvasId: 'slot-machine',
  width: '600rpx',
  height: '600rpx',
  blocks: [],
  prizes: [],
  slots: [],
  defaultStyle: {},
  defaultConfig: {},
}
