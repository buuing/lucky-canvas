
<Empty />

<div align="center">
  <img src="./.vuepress/logo.png" width="200" />
  <h1>vue-luck-draw 抽奖插件</h1>
  <p>一个基于vue的 ( 大转盘 / 九宫格 ) canvas 插件</p>
  <p class="hidden">
    <a href="https://github.com/LuckDraw/vue-luck-draw#readme">简体中文</a>
    <!-- · -->
    <!-- <a href="javascript: ;">English</a> -->
  </p>
  <p>
    <a href="https://github.com/buuing/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/badge/github-buuing-brightgreen.svg" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/github/package-json/v/buuing/vue-luck-draw" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/vue-luck-draw" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/npm/dt/vue-luck-draw" />
    </a>
    <a href="https://github.com/buuing/vue-luck-draw/tree/master/dist" target="_black">
      <img src="https://img.shields.io/github/size/buuing/vue-luck-draw/dist/index.common.js" />
    </a>
  </p>
  <p>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/author-%20ldq%20-7289da.svg" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/vue-luck-draw" />
    </a>
  </p>
</div>







<br />

<h2 class="hidden">官方文档 & Demo演示</h2>

<blockquote class="hidden">
  <p><a href="https://100px.net/vue-luck-draw?github" target="_black" rel="nofollow">https://100px.net/vue-luck-draw</a></p>
</blockquote>

<br />

## 安装

**使用 npm 安装：`npm i vue-luck-draw`**

**使用 yarn 安装：`yarn add vue-luck-draw`**

<br />

## 使用

### 方式1: 通过 import 引入

找到 `main.js` 引入插件并 `use`

```js
import LuckDraw from 'vue-luck-draw'

Vue.use(LuckDraw)
```

然后在组件内使用`<LuckyWheel />大转盘组件`或`<LuckyGrid />九宫格组件`

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

### 方式2: 通过 script 标签引入

从下面的链接里下载一个叫`index.umd.min.js`的 js 文件, 然后使用 script 标签引入

- 下载地址: [https://github.com/buuing/vue-luck-draw/tree/master/dist](https://github.com/buuing/vue-luck-draw/tree/master/dist)

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
<script src="./index.umd.min.js"></script>
<script>
  new Vue({
    el: '#app'
  })
</script>
```

<br />
