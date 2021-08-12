import Taro, { Component } from '@tarojs/taro'
import { View, Canvas, CoverView, Image } from '@tarojs/components'
import { LuckyWheel as Wheel } from 'lucky-canvas/dist/lucky-canvas.cjs.js'
import { changeUnits, resolveImage, getFlag } from '../../utils'
import '../../react/index.css'

export default class LuckyWheel extends Component {
  ctx = null
  flag = getFlag()
  $lucky = null
  state = {
    boxWidth: 300,
    boxHeight: 300,
    btnWidth: 0,
    btnHeight: 0,
  }
  constructor (props) {
    super(props)
    this.myLucky = Taro.createRef()
  }
  componentDidMount () {
    const { props } = this
    try {
      this.init()
      props.onSuccess && props.onSuccess()
    } catch (err) {
      console.error(err)
      props.onError && props.onError(err)
    } finally {
      props.onFinally && props.onFinally(err)
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.blocks !== prevProps.blocks) {
      this.$lucky.blocks = this.props.blocks
    }
    if (this.props.prizes !== prevProps.prizes) {
      this.$lucky.prizes = this.props.prizes
    }
    if (this.props.buttons !== prevProps.buttons) {
      this.$lucky.buttons = this.props.buttons
    }
  }
  async imgBindload (res, name, index, i) {
    const img = this.props[name][index].imgs[i]
    resolveImage(res, img)
  }
  init () {
    const { props } = this
    this.setState({
      boxWidth: changeUnits(props.width),
      boxHeight: changeUnits(props.height)
    }, () => {
      let ctx, divElement, flag = this.flag
      let dpr = Taro.getSystemInfoSync().pixelRatio
      if (flag === 'WEB') {
        divElement = this.myLucky.current
      } else {
        ctx = this.ctx = Taro.createCanvasContext('luckyWheel', this)
      }
      const $lucky = this.$lucky = new Wheel({
        flag,
        divElement,
        ctx,
        dpr,
        width: this.state.boxWidth,
        height: this.state.boxHeight,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
        unitFunc: (num, unit) => changeUnits(num + unit),
        beforeInit: function () {
          if (flag === 'WEB') return
          const Radius = Math.min(this.config.width, this.config.height) / 2
          ctx.translate(-Radius, -Radius)
        },
        beforeDraw: function () {
          if (flag === 'WEB') return
          ctx.translate(this.Radius, this.Radius)
        },
        afterDraw () {
          if (flag === 'WEB') return
          ctx.draw()
        }
      }, {
        ...props,
        start: (...rest) => {
          props.onStart && props.onStart(...rest)
        },
        end: (...rest) => {
          props.onEnd && props.onEnd(...rest)
        }
      })
      // 动态设置按钮大小
      this.setState({
        btnWidth: $lucky.maxBtnRadius * 2,
        btnHeight: $lucky.maxBtnRadius * 2,
      })
    })
  }
  play (...rest) {
    this.$lucky.play(...rest)
  }
  stop (...rest) {
    this.$lucky.stop(...rest)
  }
  toPlay () {
    this.$lucky.startCallback()
  }
  render () {
    const { state } = this
    const { props } = this
    return this.flag === 'WEB' ? <div ref={this.myLucky}></div> : (
      <View className="lucky-box" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}>
        <Canvas id="lucky-canvas" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }} canvasId="luckyWheel"></Canvas>
        <CoverView className="lucky-wheel-btn" onTouchstart={e => this.toPlay(e)} style={{ width: state.btnWidth + 'px', height: state.btnHeight + 'px' }}></CoverView>
        <View className="lucky-imgs">
          {
            props.blocks.map((block, index) => <View key={block}>
              {
                block.imgs ? <View>
                  { block.imgs.map((img, i) => <Image key={img} src={img.src} onLoad={e => this.imgBindload(e, 'blocks', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View>
        <View className="lucky-imgs">
          {
            props.prizes.map((prize, index) => <View key={prize}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img, i) => <Image key={img} src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>) }
                </View> : null
              }
            </View>)
          }
        </View>
        <View className="lucky-imgs">
          {
            props.buttons.map((button, index) => <View key={button}>
              {
                button.imgs ? <View>
                  { button.imgs.map((img, i) => <Image key={img} src={img.src} onLoad={e => this.imgBindload(e, 'buttons', index, i)}></Image>) }
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
