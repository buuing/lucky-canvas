import imgs from './img'
Page({
  data: {
    blocks: [
      { padding: '3px', background: '#92c53a', borderRadius: '8px' },
      { padding: '2px', background: '#bdd333', borderRadius: '8px' },
      { padding: '7px', background: '#0D6630', borderRadius: '8px' },
    ],
    prizes: [
      {
        x: 0, y: 0,
        fonts: [{ text: '谢谢参与', top: '68%' }],
        imgs: [{ src: imgs['0.png'], width: '50%', top: '12%' }],
      },
      {
        x: 1, y: 0,
        fonts: [{ text: '1个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
      {
        x: 2, y: 0,
        fonts: [{ text: '5个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
      {
        x: 2, y: 1,
        fonts: [{ text: '10个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
      {
        x: 2, y: 2,
        fonts: [{ text: '谢谢参与', top: '68%' }],
        imgs: [{ src: imgs['0.png'], width: '50%', top: '12%' }],
      },
      {
        x: 1, y: 2,
        fonts: [{ text: '1个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
      {
        x: 0, y: 2,
        fonts: [{ text: '5个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
      {
        x: 0, y: 1,
        fonts: [{ text: '10个星球币', top: '68%' }],
        imgs: [{ src: imgs['1.png'], width: '50%', top: '12%' }],
      },
    ],
    buttons: [{
      x: 1, y: 1,
      imgs: [{ src: imgs['button.png'], width: '100%', height: '100%' }]
    }],
    defaultConfig: {
      gutter: 8
    },
    defaultStyle: {
      background: '#f4f7cc',
      borderRadius: '13px',
      fontColor: '#d55a07',
      fontSize: '11px',
      shadow: '0 9 0.1 #E9E967',
    },
    activeStyle: {
      background: '#e9e967',
      shadow: '0 9 0.1 #E1E13B',
    }
  },
  onReady () {
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
      content: '恭喜你获得大奖: ' + event.detail.fonts[0].text,
      success (res) {}
    })
  }
})
