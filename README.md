
<div align="center">
  <img src="./web.svg" width="200" alt="logo" />
  <h1>vue-luck-draw 抽奖插件</h1>
  <p>一个基于 vue 的 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p class="hidden">
    <a href="https://github.com/LuckDraw/vue-luck-draw#readme">简体中文</a>
    ·
    <a href="https://github.com/LuckDraw/vue-luck-draw/tree/master/en">English</a>
  </p>
  <p>
    <a href="https://github.com/LuckDraw/vue-luck-draw/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/vue-luck-draw?color=%2330a14e&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/buuing/vue-luck-draw?color=%2330a14e&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/github/package-json/v/buuing/vue-luck-draw?color=%2330a14e&logo=npm&style=flat-square" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/npm/dm/vue-luck-draw?color=%2330a14e&logo=npm&style=flat-square" alt="downloads" />
    </a>
    <a href="https://github.com/buuing/vue-luck-draw/tree/master/dist" target="_black">
      <img src="https://img.shields.io/github/size/buuing/vue-luck-draw/dist/luckdraw.common.js?color=%2330a14e&logo=npm&style=flat-square" alt="size" />
    </a>
  </p>
  <p>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/vue-luck-draw?color=%232DCE89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<br />

## 官方文档 & Demo演示

> **中文**：[https://100px.net/document/vue.html](https://100px.net/document/vue.html)  

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`

<br />

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
      style="width: 200px; height: 200px"
      ...你的配置
    />
    <!-- 九宫格抽奖 -->
    <LuckyGrid
      style="width: 200px; height: 200px"
      ...你的配置
    />
  </div>
</template>
```

<br />

### 方式 2：通过 script 标签引入

从下面的链接里下载一个叫`luckdraw.umd.min.js`的 js 文件, 然后使用 script 标签引入

- vue2.x：[https://github.com/buuing/vue-luck-draw/tree/master/dist](https://github.com/buuing/vue-luck-draw/tree/master/dist)
- vue3.x：[https://github.com/buuing/vue-luck-draw/tree/master/vue3](https://github.com/buuing/vue-luck-draw/tree/master/vue3)

```html
<div id="app">
  <!-- 大转盘抽奖 -->
  <lucky-wheel
    style="width: 200px; height: 200px"
    ...你的配置
  />
  <!-- 九宫格抽奖 -->
  <lucky-grid
    style="width: 200px; height: 200px"
    ...你的配置
  />
</div>
<script src="./vue.min.js"></script>
<script src="./luckdraw.umd.min.js"></script>
<script>
  new Vue({
    el: '#app'
  })
</script>
```
