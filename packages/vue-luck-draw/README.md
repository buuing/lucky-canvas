
<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png" width="128" alt="logo" />
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

> **中文**：[https://100px.net](https://100px.net)

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`

<br />

|适配框架|npm包|npm下载量|CDN使用量|
| :-: | :-: | :-: | :-: |
|`JS` / `JQ`|[lucky-canvas](https://100px.net/usage/js.html)|<img src="https://img.shields.io/npm/dm/lucky-canvas?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|<img src="https://data.jsdelivr.com/v1/package/npm/lucky-canvas/badge" alt="downloads" />|
|`Vue2.x` / `Vue3.x`|[vue-luck-draw](https://100px.net/usage/vue.html)|<img src="https://img.shields.io/npm/dm/vue-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|<img src="https://data.jsdelivr.com/v1/package/npm/vue-luck-draw/badge" alt="downloads" />|
|`React`|[react-luck-draw](https://100px.net/usage/react.html)|<img src="https://img.shields.io/npm/dm/react-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|<img src="https://data.jsdelivr.com/v1/package/npm/react-luck-draw/badge" alt="downloads" />|
|`UniApp`|[uni-luck-draw](https://100px.net/usage/uni.html)|<img src="https://img.shields.io/npm/dm/uni-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|/|
|`Taro3.x`|[taro-luck-draw](https://100px.net/usage/taro.html)|<img src="https://img.shields.io/npm/dm/taro-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|/|
|`微信小程序`|[mini-luck-draw](https://100px.net/usage/wx.html)|<img src="https://img.shields.io/npm/dm/mini-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />|/|

## 在 vue2.x / vue3.x 中使用

### 方式 1：通过 import 引入

1. 首先安装插件

```shell
# npm 安装：
npm install vue-luck-draw

# yarn 安装：
yarn add vue-luck-draw
```

2. 然后找到 `main.js` 引入插件并 `use`

```js
// vue2.x
import LuckDraw from 'vue-luck-draw'
Vue.use(LuckDraw)

// vue3.x
import LuckDraw from 'vue-luck-draw/vue3'
createApp(App).use(LuckDraw).mount('#app')
```

3. 最后在组件内使用 **`<LuckyWheel />`大转盘抽奖** 或 **`<LuckyGrid />`九宫格抽奖**

```vue
<template>
  <div>
    <!-- 大转盘抽奖 -->
    <LuckyWheel
      width="200px"
      height="200px"
      ...你的配置
    />
    <!-- 九宫格抽奖 -->
    <LuckyGrid
      width="200px"
      height="200px"
      ...你的配置
    />
  </div>
</template>
```

<br />

### 方式 2：通过 script 标签引入

> 为了避免 CDN 链接出现异常或波动，我非常建议你**缓存到本地或服务器(✿◡‿◡)**

- **vue2.x：** [https://cdn.jsdelivr.net/npm/vue-luck-draw@3.4/dist/vue-luck-draw.umd.min.js](https://cdn.jsdelivr.net/npm/vue-luck-draw@3.4/dist/vue-luck-draw.umd.min.js)

- **vue3.x：** [https://cdn.jsdelivr.net/npm/vue-luck-draw@3.4/vue3/vue-luck-draw.umd.min.js](https://cdn.jsdelivr.net/npm/vue-luck-draw@3.4/vue3/vue-luck-draw.umd.min.js)


```html
<div id="app">
  <!-- 大转盘抽奖 -->
  <lucky-wheel
    width="200px"
    height="200px"
    ...你的配置
  />
  <!-- 九宫格抽奖 -->
  <lucky-grid
    width="200px"
    height="200px"
    ...你的配置
  />
</div>
<script src="./vue.min.js"></script>
<script src="./vue-luck-draw.umd.min.js"></script>
<script>
  new Vue({
    el: '#app',
    data () {
      return {}
    }
  })
</script>
```

<br />

### **如果您觉得这个项目还不错, 可以在 [Github](https://github.com/LuckDraw/lucky-canvas) 上面帮我点个`star` ☜(ﾟヮﾟ☜)**

