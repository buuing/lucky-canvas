import imgs from '../ymc/img'
Page({
  data: {
    maskShow: false,
    prizes: [],
    blocks: [
      { padding: '15px', background: '#ffc27a', borderRadius: 28 },
      { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
      { padding: '4px', background: '#ff625b', borderRadius: 20 },
    ],
    buttons: [{
      x: 1, y: 1,
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: '0 5 1 #e89b4f',
      imgs: [
        { src: imgs['button.png'], width: '70%', top: '20%' },
      ]
    }],
    activeStyle: {
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: ''
    },
    defaultConfig: {
      gutter: 5,
    },
    defaultStyle: {
      borderRadius: 15,
      fontColor: '#DF424B',
      fontSize: '14px',
      textAlign: 'center',
      background: '#fff',
      shadow: '0 5 1 #ebf1f4'
    },
  },
  onReady () {
    // 模拟接口异步请求奖品列表
    const prizes = []
    const data = [
      { name: '1元红包', img: imgs['0.png'] },
      { name: '100元红包', img: imgs['1.png'] },
      { name: '0.5元红包', img: imgs['2.png'] },
      { name: '2元红包', img: imgs['3.png'] },
      { name: '10元红包', img: imgs['4.png'] },
      { name: '50元红包', img: imgs['5.png'] },
      { name: '0.3元红包', img: imgs['6.png'] },
      { name: '5元红包', img: imgs['7.png'] }
    ]
    let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
    for (let i = 0; i < 8; i++) {
      let item = data[i]
      prizes.push({
        name: item.name,
        index: i, x: axis[i][0], y: axis[i][1],
        fonts: [{ text: item.name, top: '70%' }],
        imgs: [{ src: item.img, width: '53%', top: '8%' }]
      })
    }
    this.setData({
      prizes
    })
  },
  gridStart () {
    // 获取抽奖组件实例
    const child = this.selectComponent('#lucky-grid')
    // 调用play方法开始旋转
    child.play()
    // 用定时器模拟请求接口
    setTimeout(() => {
      // 3s 后得到中奖索引
      const index = Math.random() * 6 >> 0
      // 调用stop方法然后缓慢停止
      child.stop(index)
    }, 3000)
  },
  gridEnd (event) {
    this.setData({ maskShow: true })
    // 中奖奖品详情
    wx.showModal({
      title: '提示',
      content: '恭喜你获得大奖: ' + event.detail.name,
      success (res) {}
    })
  },
  maskHidden () {
    this.setData({ maskShow: false })
  },
})