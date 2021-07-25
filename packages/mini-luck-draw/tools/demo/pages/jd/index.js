import imgs from './img'
Page({
  data: {
    blocks: [
      { padding: '30px', imgs: [{ src: imgs['bg.png'], width: '100%' }] },
    ],
    prizes: [],
    buttons: [
      { radius: '40px', imgs: [{ src: imgs['button.png'], width: '140%', top: '-140%' }] },
      { radius: '15%', imgs: [{ src: imgs['btn.png'], width: '100%', top: '-830%' }] }
    ],
    defaultStyle: {
      fontColor: '#000',
      fontSize: '13px',
      fontStyle: 'SimHei',
    },
    defaultConfig: {
      offsetDegree: 22.5
    },
  },
  onReady () {
    this.getPrizesList()
  },
  getPrizesList () {
    const prizes = []
    let data = [
      { name: '10个京豆', img: imgs['1.png'], color: '#F8DEF8' },
      { name: '5个京豆', img: imgs['1.png'], color: '#FEF3FC' },
      { name: '1个京豆', img: imgs['1.png'], color: '#F8DEF8' },
      { name: '谢谢参与', img: imgs['0.png'], color: '#FEF3FC' },
      { name: '10个京豆', img: imgs['1.png'], color: '#F8DEF8' },
      { name: '5个京豆', img: imgs['1.png'], color: '#FEF3FC' },
      { name: '1个京豆', img: imgs['1.png'], color: '#F8DEF8' },
      { name: '谢谢参与', img: imgs['0.png'], color: '#FEF3FC' },
    ]
    data.forEach((item, index) => {
      prizes.push({
        name: item.name,
        background: item.color,
        fonts: [{ text: item.name, top: '12%' }],
        imgs:[{ src: item.img, width: '45%', top: '35%' }],
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