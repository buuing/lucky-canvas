import React from 'react'
import { LuckyWheel as Wheel } from 'lucky-canvas'
import { name, version } from '../../package.json'

export default class LuckyWheel extends React.Component {
  constructor (props) {
    super(props)
    this.myLucky = React.createRef()
    this.lucky = undefined
  }
  componentDidMount () {
    // 当前已经有实例时，不再进行，解决在`react18 + strictMode`下组件componentDidMount会被触发两次的问题
    if (this.lucky) {
      return
    }
    this.myLucky.current.setAttribute('package', `${name}@${version}`)
    try {
      this.initLucky()
      this.props.onSuccess && this.props.onSuccess()
    } catch (err) {
      this.props.onError && this.props.onError(err)
    } finally {
      this.props.onFinally && this.props.onFinally()
    }
  }
  componentDidUpdate (prevProps) {
    if (!this.lucky) return
    if (this.props.width !== prevProps.width) {
      this.lucky.width = this.props.width
    }
    if (this.props.height !== prevProps.height) {
      this.lucky.height = this.props.height
    }
    if (this.props.blocks !== prevProps.blocks) {
      this.lucky.blocks = this.props.blocks
    }
    if (this.props.prizes !== prevProps.prizes) {
      this.lucky.prizes = this.props.prizes
    }
    if (this.props.buttons !== prevProps.buttons) {
      this.lucky.buttons = this.props.buttons
    }
  }
  initLucky () {
    this.lucky = new Wheel({
      flag: 'WEB',
      divElement: this.myLucky.current
    }, {
      ...this.props,
      start: (...rest) => {
        this.props.onStart && this.props.onStart(...rest)
      },
      end: (...rest) => {
        this.props.onEnd && this.props.onEnd(...rest)
      }
    })
  }
  init (...rest) {
    this.lucky.init(...rest)
  }
  play (...rest) {
    this.lucky.play(...rest)
  }
  stop (...rest) {
    this.lucky.stop(...rest)
  }
  render () {
    return <div ref={this.myLucky}></div>
  }
}

LuckyWheel.defaultProps = {
  width: '',
  height: '',
  prizes: [],
  blocks: [],
  buttons: [],
  defaultStyle: {},
  defaultConfig: {},
}
