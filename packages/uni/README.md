<br />

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.jpg" width="210" alt="logo" />
  <h1>lucky-canvas 抽奖插件</h1>
  <p>一个基于 JavaScript 的跨平台 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p>
    <a href="https://github.com/buuing/lucky-canvas/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/buuing/lucky-canvas/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/buuing/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/buuing/lucky-canvas/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/lucky-canvas?color=%232dce89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>


|适配框架|npm下载量|CDN使用量|
| :-: | :-: | :-: |
|[`JS` / `JQ` 中使用](https://100px.net/usage/js.html)|<a href="https://www.npmjs.com/package/lucky-canvas" target="_black"><img src="https://img.shields.io/npm/dm/lucky-canvas?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/lucky-canvas" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/lucky-canvas/badge" alt="downloads" /></a>|
|[`Vue` 中使用](https://100px.net/usage/vue.html)|<a href="https://www.npmjs.com/package/vue-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/vue-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/vue-luck-draw" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/vue-luck-draw/badge" alt="downloads" /></a>|
|[`React` 中使用](https://100px.net/usage/react.html)|<a href="https://www.npmjs.com/package/react-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/react-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`UniApp` 中使用](https://100px.net/usage/uni.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/uni" target="_black"><img src="https://img.shields.io/npm/dm/@lucky?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`Taro3.x` 中使用](https://100px.net/usage/taro.html)|<a href="https://www.npmjs.com/package/taro-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/taro-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`微信小程序` 中使用](https://100px.net/usage/wx.html)|<a href="https://www.npmjs.com/package/mini-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/mini-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|

<br />

## 官方文档 & Demo演示

> **中文**：[https://100px.net](https://100px.net)

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`
  
<br />

## 在 uni-app 中使用

### 1. 安装插件

- 你可以选择通过 `HBuilderX` 导入插件： [https://ext.dcloud.net.cn/plugin?id=3499](https://ext.dcloud.net.cn/plugin?id=3499)

- 也可以选择通过 `npm` / `yarn` 安装

```shell
# npm 安装：
npm install @lucky-canvas/uni

# yarn 安装：
yarn add @lucky-canvas/uni
```

<br />

### 2. 引入并使用

```html
<view>
  <!-- 大转盘抽奖 -->
  <LuckyWheel
    width="600rpx"
    height="600rpx"
    ...你的配置
  />
  <!-- 九宫格抽奖 -->
  <LuckyGrid
    width="600rpx"
    height="600rpx"
    ...你的配置
  />
</view>
```

```js
// npm 下载会默认到 node_modules 里面，直接引入包名即可
import LuckyWheel from '@lucky-canvas/uni/lucky-wheel' // 大转盘
import LuckyGrid from '@lucky-canvas/uni/lucky-grid' // 九宫格

// 如果你是通过 HBuilderX 导入插件，那你需要指定一下路径
// import LuckyWheel from '@/components/@lucky-canvas/uni/lucky-wheel' // 大转盘
// import LuckyGrid from '@/components/@lucky-canvas/uni/lucky-grid' // 九宫格

export default {
  // 注册组件
  components: { LuckyWheel, LuckyGrid },
}
```

<br />

### 3. 我提供了一个最基本的 demo 供你用于尝试

由于 uni-app 渲染 md 的时候会出问题，所以我把 demo 代码放到了文档里

- [https://100px.net/document/uni-app.html](https://100px.net/document/uni-app.html)

<br />

### **4. 补充说明**

- [**如果用着顺手, 可以在 Github 上面点个 <img height="22" align="top" src="https://img.shields.io/github/stars/buuing/lucky-canvas" /> 支持一下(●'◡'●)**](https://github.com/buuing/lucky-canvas)

- 后面提问的同学, 别一上来就中差评, 搞得我好像淘宝卖货一样, 你仔细想想, 你这边差评提问, 谁能有好心情给你调bug, 我开源就图个乐呵, 你给个5星我难道还能不管你(●ˇ∀ˇ●)?

- 另外: 如果你修复了某些bug或兼容, 欢迎提给我, 我会把你展示到官网的贡献者列表当中

---
