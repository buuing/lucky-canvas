module.exports = {
  title: 'vue-luck-draw@2.0.8',
  description: '一个基于vue的多功能、多配置的抽奖插件, 集合了大转盘抽奖与九宫格抽奖等',
  themeConfig: {
    nav: [
      { text: '欢迎大家来 github 帮我点星', link: 'https://github.com/buuing/vue-luck-draw' }
    ],
    sidebarDepth: 3,
    sidebar: [
      {
        title: '大转盘抽奖',
        path: '/lucky-wheel/',
        collapsable: false,
      },
      {
        title: '九宫格抽奖',
        path: '/lucky-grid/',
        collapsable: false,
      }
    ]
  }
}