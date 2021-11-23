import React from 'react'
import { LuckyGrid as Grid } from 'lucky-canvas'
import { name, version } from '../../package.json'

export default class LuckyGrid extends React.Component {
  constructor (props) {
    super(props)
    this.myLucky = React.createRef()
  }
  componentDidMount () {
    const { props } = this
    this.myLucky.current.setAttribute('package', `${name}@${version}`)
    try {
      this.init()
      props.onSuccess && props.onSuccess()
    } catch (err) {
      props.onError && props.onError(err)
    } finally {
      props.onFinally && props.onFinally(err)
    }
  }
  componentDidUpdate (prevProps) {
    if (!this.$lucky) return
    if (this.props.width !== prevProps.width) {
      this.$lucky.width = this.props.width
    }
    if (this.props.height !== prevProps.height) {
      this.$lucky.height = this.props.height
    }
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
  init () {
    const { props } = this
    this.$lucky = new Grid({
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
  play (...rest) {
    this.$lucky.play(...rest)
  }
  stop (...rest) {
    this.$lucky.stop(...rest)
  }
  render () {
    return <div ref={this.myLucky}></div>
  }
}

LuckyGrid.defaultProps = {
  width: '',
  height: '',
  cols: 3,
  rows: 3,
  blocks: [],
  prizes: [],
  buttons: [],
  defaultStyle: {},
  activeStyle: {},
  defaultConfig: {},
}
