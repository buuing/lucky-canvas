Page({
  data: {
    maskShow: false,
    prizes: [],
    slots: [],
    defaultStyle: {
      fontColor: '#ff625b',
      fontSize: '16px'
    },
    blocks: [
      { padding: '20rpx', background: '#ffc27a' },
      { padding: '10rpx', background: '#ff4a4c' },
    ],
  },
  onReady () {
    this.setData({
      prizes: []
    });
    setTimeout(() => {
      [
        {
          title: '1元红包', background: '#ffd185', fonts: [{ text: '1元红包', top: '10%' }],
        },
        {
          title: '100元红包', background: '#f9e3bb', fonts: [{ text: '100元红包', top: '10%' }],
        },
        {
          title: '0.5元红包', background: '#ffd185', fonts: [{ text: '0.5元红包', top: '10%' }],
        },
        {
          title: '2元红包', background: '#f9e3bb', fonts: [{ text: '2元红包', top: '10%' }],
        },
        {
          title: '10元红包', background: '#ffd185', fonts: [{ text: '10元红包', top: '10%' }],
        },
        {
          title: '50元红包', background: '#f9e3bb', fonts: [{ text: '50元红包', top: '10%' }],
        },
        {
          title: '0.3元红包', background: '#ffd185', fonts: [{ text: '0.3元红包', top: '10%' }],
        },
        {
          title: '5元红包', background: '#f9e3bb', fonts: [{ text: '5元红包', top: '10%' }],
        },
      ].forEach(_ => {
        this.setData({
          prizes: [...this.data.prizes, _]
        });
      })
      this.setData({
        slots: [
          {},
          { direction: -1 },
          {},
        ]
      })
    }, 50);
  },
  handleStart () {
    // 获取抽奖组件实例
    const child = this.selectComponent('#slot-machine')
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
  handleEnd (event) {
    // 中奖奖品详情
    this.setData({ maskShow: true })
    wx.showModal({
      title: '提示',
      content: '恭喜你获得大奖: ' + event.detail.title,
      success (res) {}
    })
  },
  maskHidden () {
    this.setData({ maskShow: false })
  },
})