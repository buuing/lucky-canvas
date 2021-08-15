
<div align="center">
  <img src="https://raw.githubusercontent.com/LuckDraw/lucky-canvas/master/logo.png" width="128" alt="logo" />
  <h1>lucky-canvas 抽奖插件</h1>
  <p>一个基于 JavaScript 的 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p class="hidden">
    <a href="https://github.com/luckdraw/lucky-canvas#readme">简体中文</a>
    ·
    <a href="https://github.com/luckdraw/lucky-canvas/tree/master/en">English</a>
  </p>
  <p>
    <a href="https://github.com/LuckDraw/lucky-canvas/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/luckdraw/lucky-canvas?color=%23ffca28&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/luckdraw/lucky-canvas/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/luckdraw/lucky-canvas?color=%23ffca28&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/lucky-canvas" target="_black">
      <img src="https://img.shields.io/npm/v/lucky-canvas?color=%23ffca28&logo=npm&style=flat-square" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/lucky-canvas" target="_black">
      <img src="https://img.shields.io/npm/dm/lucky-canvas?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />
    </a>
    <a href="https://www.jsdelivr.com/package/npm/lucky-canvas" target="_black">
      <img src="https://data.jsdelivr.com/v1/package/npm/lucky-canvas/badge" alt="downloads" />
    </a>
  </p>
  <p>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/luckdraw/lucky-canvas/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/luckdraw/lucky-canvas?color=%232dce89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<br />

## 官方文档 & Demo演示

> **中文**：[https://100px.net/usage/js.html](https://100px.net/usage/js.html)  

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`

<br />

- **在 js / jq 中使用 [lucky-canvas](https://github.com/luckdraw/lucky-canvas)**

- **在 vue 中使用 [vue-luck-draw](https://github.com/luckdraw/vue-luck-draw)**

- **在 react 中使用 [react-luck-draw](https://github.com/luckdraw/react-luck-draw)**

- **在 uni-app 中使用 [uni-luck-draw](https://github.com/luckdraw/uni-luck-draw)**

- **在 taro 中使用 [taro-luck-draw](https://github.com/luckdraw/taro-luck-draw)**

- **在 微信小程序 中使用 [mini-luck-draw](https://github.com/luckdraw/mini-luck-draw)**

<br />

## 在 Js / JQuery 中使用

### 方式 1：通过 script 标签引入

> 为了避免 CDN 链接出现异常或波动，我非常建议你**缓存到本地或服务器**

- **指定版本：** [https://cdn.jsdelivr.net/npm/lucky-canvas@1.4/dist/lucky-canvas.umd.min.js](https://cdn.jsdelivr.net/npm/lucky-canvas@1.4/dist/lucky-canvas.umd.min.js)

```html
<div id="my-lucky"></div>
<script src="https://cdn.jsdelivr.net/npm/lucky-canvas@1.4/dist/lucky-canvas.umd.min.js"></script>
<script>

  // 大转盘抽奖
  let luckyWheel = new LuckyCanvas.LuckyWheel({
    el: '#my-lucky',
    width: '300px',
    height: '300px'
  }, {
    // ...你的配置
  })
  
  // 九宫格抽奖
  let luckyGrid = new LuckyCanvas.LuckyGrid({
    el: '#my-lucky',
    width: '300px',
    height: '300px'
  }, {
    // ...你的配置
  })

</script>
```

<br />

### **如果您觉得这个项目还不错, 可以帮我点个 <img src="https://img.shields.io/github/stars/LuckDraw/lucky-canvas?style=social" style="vertical-align: middle" /> ☜(ﾟヮﾟ☜)**

<br />

## 友情链接

- [🎁 h5-Dooring 一款功能强大，高可扩展的H5可视化编辑器](https://github.com/MrXujiang/h5-Dooring)
