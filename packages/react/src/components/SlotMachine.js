import React from 'react'
import { SlotMachine as Slot } from 'lucky-canvas'
import { name, version } from '../../package.json'

export default class SlotMachine extends React.Component {
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
    const { props } = this
    this.myLucky.current.setAttribute('package', `${name}@${version}`)
    try {
      this.initLucky()
      props.onSuccess && props.onSuccess()
    } catch (err) {
      props.onError && props.onError(err)
    } finally {
      props.onFinally && props.onFinally(err)
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
    if (this.props.slots !== prevProps.slots) {
      this.lucky.slots = this.props.slots
    }
  }
  initLucky () {
    const { props } = this
    this.lucky = new Slot({
      flag: 'WEB',
      divElement: this.myLucky.current
    }, {
      ...props,
      start: (...rest) => {
        props.onStart && props.onStart(...rest)
      },
      end: (...rest) => {
        props.onEnd && props.onEnd(...rest)
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

SlotMachine.defaultProps = {
  width: '',
  height: '',
  blocks: [],
  prizes: [],
  slots: [],
  defaultStyle: {},
  defaultConfig: {},
}
