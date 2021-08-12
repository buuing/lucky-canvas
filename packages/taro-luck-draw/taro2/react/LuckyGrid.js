import Taro, { Component } from '@tarojs/taro'
import { View, Canvas, CoverView, Image } from '@tarojs/components'
import { LuckyGrid as Grid } from 'lucky-canvas/dist/lucky-canvas.cjs.js'
import { changeUnits, resolveImage, getFlag } from '../../utils'
import '../../react/index.css'

export default class LuckyGrid extends Component {
  ctx = null
  flag = getFlag()
  $lucky = null
  state = {
    boxWidth: 300,
    boxHeight: 300,
    btns: [],
    btnShow: false,
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
    if (this.props.cols !== prevProps.cols) {
      this.$lucky.cols = this.props.cols
    }
    if (this.props.rows !== prevProps.rows) {
      this.$lucky.rows = this.props.rows
    }
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
  async imgBindloadActive (res, name, index, i) {
    const img = this.props[name][index].imgs[i]
    resolveImage(res, img, 'activeSrc', '$activeResolve')
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
        ctx = this.ctx = Taro.createCanvasContext('luckyGrid', this)
      }
      this.$lucky = new Grid({
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
        afterDraw: function () {
          if (flag === 'WEB') return
          ctx.draw()
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
      // 动态设置按钮大小
      const btns = []
      props.buttons.forEach((btn, index) => {
        if (!btn) return
        const [left, top, width, height] = this.$lucky.getGeometricProperty([
          btn.x,
          btn.y,
          btn.col || 1,
          btn.row || 1
        ])
        btns[index] = { top, left, width, height }
      })
      this.setState({ btns, btnShow: true })
    })
  }
  play (...rest) {
    this.$lucky.play(...rest)
  }
  stop (...rest) {
    this.$lucky.stop(...rest)
  }
  toPlay (btn) {
    this.$lucky.startCallback(btn)
  }
  render () {
    const { props } = this
    const { state } = this
    return this.flag === 'WEB' ? <div ref={this.myLucky}></div> : (
      <View className="lucky-box" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }}>
        <Canvas id="lucky-canvas" style={{ width: state.boxWidth + 'px', height: state.boxHeight + 'px' }} canvasId="luckyGrid"></Canvas>
        {
          <View>
            {
              state.btns.map((btn, index) => <CoverView className="lucky-grid-btn" key={btn} onTouchstart={e => this.toPlay(btn)} style={{
                top: btn.top + 'px',
                left: btn.left + 'px',
                width: btn.width + 'px',
                height: btn.height + 'px',
              }}></CoverView>)
            }
          </View>
        }
        <View className="lucky-imgs">
          {
            props.prizes.map((prize, index) => <View key={prize}>
              {
                prize.imgs ? <View>
                  { prize.imgs.map((img, i) => <View key={img}>
                    <Image src={img.src} onLoad={e => this.imgBindload(e, 'prizes', index, i)}></Image>
                    <Image src={img.activeSrc} onLoad={e => this.imgBindloadActive(e, 'prizes', index, i)}></Image>
                  </View>) }
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
