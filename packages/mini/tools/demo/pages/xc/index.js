import imgs from './img'
Page({
  data: {
    prizes: [
      { name: '免费住酒店' },
      { name: '房型升级' },
      { name: '免费取消' },
      { name: '延迟退房' },
      { name: '免费早餐' },
      { name: '明天再来' },
    ],
    buttons: [{
      radius: '25%',
      fonts: [{ text: '开始\n抽奖', fontColor: '#fff', top: '-50%', fontSize: '16px' }],
      imgs: [{ src: imgs['btn.png'], width: '120%', top: '-175%' }]
    }],
    blocks: [
      { imgs: [{ src: imgs['bg.png'], width: '100%', rotate: true }] },
    ],
    defaultConfig: {
      offsetDegree: 30
    },
  },
  onReady () {
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