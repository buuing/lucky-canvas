Page({
  data: {
    prizes: [],
    wheel: {
      defaultStyle: {
        fontColor: '#ff625b',
        fontSize: '16px'
      },
      blocks: [
        { padding: '20rpx', background: '#ffc27a' },
        { padding: '10rpx', background: '#ff4a4c' },
      ],
      buttons: [
        { radius: '50px', background: '#ff4a4c' },
        { radius: '45px', background: '#fff' },
        { radius: '41px', background: '#f6c66f', pointer: true },
        {
          radius: '35px', background: '#ffdea0',
          imgs: [{ src: 'https://100px.net/assets/img/button.2f4ac3e9.png', width: '70%', top: '-55%' }]
        }
      ],
    },
    grid: {
      rows: 3,
      cols: 4,
      blocks: [{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }],
      prizes: [
        { x: 0, y: 0, fonts: [{ text: '0元', top: 20 }], imgs: [{ src: 'https://100px.net/assets/img/4.1349538d.png', activeSrc: 'https://100px.net/assets/img/00.a8cd98c2.png', width: '50%' }] },
        { x: 1, y: 0, fonts: [{ text: '1元', top: 20 }] },
        { x: 2, y: 0, fonts: [{ text: '2元', top: 20 }] },
        { x: 3, y: 0, fonts: [{ text: '3元', top: 20 }] },
        { x: 3, y: 1, fonts: [{ text: '4元', top: 20 }] },
        { x: 3, y: 2, fonts: [{ text: '5元', top: 20 }] },
        { x: 2, y: 2, fonts: [{ text: '6元', top: 20 }] },
        { x: 1, y: 2, fonts: [{ text: '7元', top: 20 }] },
        { x: 0, y: 2, fonts: [{ text: '8元', top: 20 }] },
        { x: 0, y: 1, fonts: [{ text: '9元', top: 20 }] }
      ],
      buttons: [{ x: 1, y: 1, col: 2, fonts: [{ text: '抽奖按钮', top: 20 }], imgs: [{ src: 'https://100px.net/assets/img/4.1349538d.png', width: '50%' }] }],
    }
  },
  onReady () {
    this.setData({
      prizes: []
    });
    setTimeout(() => {
    [
      { title: '1元红包', background: '#ffd185', fonts: [{ text: '1元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/0.efbe4dff.png', width: '35%', top: '35%' }] },
      { title: '100元红包', background: '#f9e3bb', fonts: [{ text: '100元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/1.de299995.png', width: '35%', top: '35%' }] },
      { title: '0.5元红包', background: '#ffd185', fonts: [{ text: '0.5元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/2.8f1949c9.png', width: '35%', top: '35%' }] },
      { title: '2元红包', background: '#f9e3bb', fonts: [{ text: '2元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/3.9307595d.png', width: '35%', top: '35%' }] },
      { title: '10元红包', background: '#ffd185', fonts: [{ text: '10元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/4.1349538d.png', width: '35%', top: '35%' }] },
      { title: '50元红包', background: '#f9e3bb', fonts: [{ text: '50元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/5.b92ceb2f.png', width: '35%', top: '35%' }] },
      { title: '0.3元红包', background: '#ffd185', fonts: [{ text: '0.3元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/6.02483a09.png', width: '35%', top: '35%' }] },
      { title: '5元红包', background: '#f9e3bb', fonts: [{ text: '5元红包', top: '10%' }], imgs: [{ src: 'https://100px.net/assets/img/7.48cda152.png', width: '35%', top: '35%' }] },
    ].forEach(_ => {
      this.setData({
        prizes: [...this.data.prizes, _]
      });
    })
    }, 1000);
  },
  wheelStart () {
    // 获取抽奖组件实例
    const child = this.selectComponent('#lucky-wheel')
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
  wheelEnd (event) {
    // 中奖奖品详情
    console.log(event.detail)
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
    console.log(event.detail)
  }
})