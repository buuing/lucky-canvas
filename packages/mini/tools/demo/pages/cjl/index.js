import imgs from './img'
Page({
  data: {
    prizes: [],
    buttons: [{
      radius: '40px',
      imgs: [{ src: imgs['button.png'], width: '105%', top: '-180%' }]
    }],
    blocks: [
      { padding: '20px', imgs: [{ src: imgs['bg.png'], width: '100%' }] },
      { padding: '1px', background: '#fa3e3f' },
      { padding: '10px', background: '#f9d400' },
      { padding: '1px', background: '#e76f51' },
    ],
    defaultStyle: {
      fontColor: '#303133',
      fontSize: '10px',
    },
    defaultConfig: {
      gutter: '1px',
    },
  },
  onReady () {
    this.getPrizesList()
  },
  getPrizesList () {
    const prizes = []
    let data = [
      { name: '谢谢参与', img: imgs['0.png'], color: '#d7d7d7' },
      { name: '礼物', img: imgs['1.png'], color: '#fef43e' },
      { name: '抽奖券', img: imgs['2.png'], color: '#ef7683' },
      { name: '元宝', img: imgs['3.png'], color: '#d7d7d7' },
      { name: '元宝', img: imgs['4.png'], color: '#fef43e' },
      { name: '抽奖券', img: imgs['2.png'], color: '#ef7683' },
      { name: '元宝', img: imgs['6.png'], color: '#d7d7d7' },
      { name: '抽奖券', img: imgs['2.png'], color: '#fef43e' },
    ]
    data.forEach((item, index) => {
      prizes.push({
        name: item.name,
        background: item.color,
        fonts: [{ text: item.name, top: '10%' }],
        imgs:[{ src: item.img, width: '30%', top: '35%' }],
      })
    })
    this.setData({
      prizes
    })
  },
  wheelStart () {
    // 获取抽奖组件实例
    const child = this.selectComponent('#lucky-wheel')
    // 调用play方法开始旋转
    child.play()
    // 用定时器模拟请求接口
    setTimeout(() => {
      // 3s 后得到中奖索引
      const index = Math.random() * 8 >> 0
      // 调用stop方法然后缓慢停止
      child.stop(index)
    }, 3000)
  },
  wheelEnd (event) {
    // 中奖奖品详情
    wx.showModal({
      title: '提示',
      content: '恭喜你获得大奖: ' + event.detail.name,
      success (res) {}
    })
  },
})