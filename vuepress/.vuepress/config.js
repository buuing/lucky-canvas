module.exports = {
  title: 'vue-luck-draw 抽奖插件',
  description: '一个基于vue的多功能、多配置的抽奖插件, 集合了大转盘抽奖与九宫格抽奖等',
  themeConfig: {
    nav: [
      { text: ' 感谢 github 帮我点星', link: 'https://github.com/buuing/vue-luck-draw' },
      { text: 'BUG 反馈', link: 'https://github.com/buuing/vue-luck-draw/issues' }
    ],
    sidebarDepth: 3,
    sidebar: [
      {
        title: '安装 & 使用',
        path: '/',
        collapsable: false,
      },
      {
        title: '大转盘 - 配置项',
        path: '/lucky-wheel/',
        collapsable: false,
      },
      {
        title: '九宫格 - 配置项',
        path: '/lucky-grid/',
        collapsable: false,
      }
    ]
  },
  base: '/vue-luck-draw/',
}
