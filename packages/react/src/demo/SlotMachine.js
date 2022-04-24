import SlotMachine from '../components/SlotMachine.js'
import React from 'react'

export default class SlotDemo extends React.Component {
  constructor () {
    super()
    this.myLucky = React.createRef()

    const data = [
        { name: '1元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '100元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '0.5元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '2元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '10元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '50元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '0.3元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' },
        { name: '5元红包', img: 'https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png' }
      ]
      let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
      const prizes = []
      for (let i = 0; i < 8; i++) {
        let item = data[i]
        prizes.push({
          name: item.name,
          index: i, x: axis[i][0], y: axis[i][1],
          fonts: [{ text: item.name, top: '70%' }],
          imgs: [{ src: item.img, width: '100%', top: '0%' }]
        })
      }
    this.state = {
      blocks: [
        { padding: '10px', background: '#ffc27a' },
        { padding: '10px', paddingRight: '90px', background: '#ff4a4c' },
        { padding: '0px', background: '#fff' }
      ],
      prizes,
      slots: [
          {},
          {},
          {},
      ],
      defaultStyle: {
        borderRadius: 15,
        fontColor: '#DF424B',
        fontSize: '14px',
        textAlign: 'center',
        background: '#fff',
        shadow: '0 5 1 #ebf1f4'
      },
    }
  }
  render () {
    return <div>
      <SlotMachine
        ref={this.myLucky}
        width="300px"
        height="300px"
        blocks={this.state.blocks}
        prizes={this.state.prizes}
        slots={this.state.slots}
        defaultStyle={this.state.defaultStyle}
        onStart={() => {
          this.myLucky.current.play()
          setTimeout(() => {
            const index = Math.random() * 6 >> 0
            this.myLucky.current.stop(index)
          }, 2500)
        }}
        onEnd={prize => { 
          alert('恭喜获得大奖:' + prize.name)
        }}
      ></SlotMachine>
      <button onClick={e => {
          this.myLucky.current.play()
      }}>play</button>
    </div>
  }
}
 