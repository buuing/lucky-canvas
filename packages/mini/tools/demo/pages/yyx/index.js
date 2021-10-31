import imgs from './img'
Page({
  data: {
    prizes: [],
    blocks: [
      { padding: '1px', background: '#192b2c', borderRadius: '10px' },
      { padding: '2px', background: '#316d70', borderRadius: '10px' },
      { padding: '5px', background: '#183233', borderRadius: '10px' },
    ],
    buttons: [{
      x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
      fonts: [
        { text: '剩余次数:???次', fontColor: '#ca620d', top: '75%' }
      ],
      imgs: [
        { src: imgs['btn.png'], width: '100%', top: '0' }
      ]
    }],
    defaultStyle: {
      fontColor: '#AFFFD7',
      fontSize: '10px',
      lineHeight: '13px',
      wordWrap: false
    },
    activeStyle: {
      fontColor: '#fff',
    }
  },
  onReady () {
    // 模拟接口异步请求奖品列表
    this.getPrizesList()
  },
  getPrizesList () {
    const prizes = []
    let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
    let data = [
      { name: 'steam游戏任选\n(限款)', img: imgs['1.png'], top: '60%' },
      { name: '百元京东卡', img: imgs['2.png'], top: '69%' },
      { name: '暴雪游戏30点数', img: imgs['3.png'], top: '69%' },
      { name: '云币2888', img: imgs['4.png'], top: '69%' },
      { name: '手游月卡', img: imgs['5.png'], top: '69%' },
      { name: '连续3日\n手游时长+1h', img: imgs['6.png'], top: '60%' },
      { name: '手游时长+30min', img: imgs['6.png'], top: '69%' },
      { name: '端游时长+1h', img: imgs['7.png'], top: '69%' },
    ]
    data.forEach((item, index) => {
      prizes.push({
        x: axis[index][0], y: axis[index][1],
        title: item.name,
        fonts: [{ text: item.name, top: item.top }],
        imgs: [
          {
            src: imgs['cell.png'],
            activeSrc: imgs['active.png'],
            width: '100%',
            height: '100%',
          },
          {
            src: item.img,
            width: '70%',
            top: '3%'
          }
        ]
      })
    })
    this.setData({ prizes })
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
    // 中奖奖品详情
    wx.showModal({
      title: '提示',
      content: '恭喜你获得大奖: ' + event.detail.title,
      success (res) {}
    })
  }
})
