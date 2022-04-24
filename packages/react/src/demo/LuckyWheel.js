import LuckyWheel  from '../components/LuckyWheel.js'
import React from 'react'

export default class Wheel extends React.Component {
  constructor () {
    super()
    this.myLucky = React.createRef()
    this.state = {
      currPrize: '哈哈哈',
      blocks: [
      ],
      prizes: [
        { title: '1元红包', background: '#f9e3bb', fonts: [{ text: '1元红包', top: '18%' }] },
        { title: '100元红包', background: '#f8d384', fonts: [{ text: '100元红包', top: '18%' }] },
        { title: '0.5元红包', background: '#f9e3bb', fonts: [{ text: '0.5元红包', top: '18%' }] },
        { title: '2元红包', background: '#f8d384', fonts: [{ text: '2元红包', top: '18%' }] },
        { title: '10元红包', background: '#f9e3bb', fonts: [{ text: '10元红包', top: '18%' }] },
        { title: '50元红包', background: '#f8d384', fonts: [{ text: '50元红包', top: '18%' }] },
      ],
      buttons: [
        {
          radius: '35px', background: '#ffdea0',
          fonts: [{ text: '开始\n抽奖', fontSize: '18px', top: -18 }]
        }
      ],
    }
  }
  render () {
    return <div>
      当前中奖: {this.state.currPrize}
      <LuckyWheel
        ref={this.myLucky}
        width="300px"
        height="300px"
        blocks={this.state.blocks}
        prizes={this.state.prizes}
        buttons={this.state.buttons}
        defaultStyle={this.state.defaultStyle}
        onStart={() => {
          console.log(this.state.currPrize)
          this.myLucky.current.play()
          setTimeout(() => {
            const index = Math.random() * 6 >> 0
            this.myLucky.current.stop(index)
          }, 2500)
        }}
        onEnd={prize => {
          this.setState({
            currPrize: prize.title
          })
        }}
      ></LuckyWheel>
    </div>
  }
}
 