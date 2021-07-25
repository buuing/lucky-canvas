import imgs from './img'
Page({
  data: {
    prizes: [],
    blocks: [
      { padding: '1px', background: '#e2cea3', borderRadius: '13px' },
      { padding: '5px 0px', background: '#f3ecdc', borderRadius: '13px' },
      { padding: '1px', background: '#e2cea3', borderRadius: '8px' },
      { padding: '15px 10px', background: '#fffcf5', borderRadius: '8px' },
    ],
    buttons: [{
      x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
      imgs: [
        { src: imgs['btn.png'], width: '90%', top: '5%' }
      ]
    }],
    defaultStyle: {
      background: '#ffefd6',
      borderRadius: '5px',
      fontColor: '#755c28',
      fontSize: '10px',
      lineHeight: '12px'
    },
    activeStyle: {
      background: '#de7247',
      fontColor: '#ffefd6',
    }
  },
  onReady () {
    // 模拟接口异步请求奖品列表
    this.getPrizesList()
  },
  getPrizesList () {
    const prizes = []
    let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
    let data = ['电热烘干毛巾架', '10元满减红包', '2积分', '胖喵焖烧罐', '5元满减红包', '多层置物架', '3元直减红包', '全场满99减10']
    axis.forEach((item, index) => {
      prizes.push({
        x: item[0], y: item[1],
        title: data[index],
        imgs: [{
          width: '100%',
          height: '100%',
          src: imgs[`default-${index}.png`],
          activeSrc: imgs[`active-${index}.png`]
        }]
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
