
<Empty />

<h2 class="hidden">官方文档 & Demo演示</h2>

<blockquote class="hidden">
  <p><a href="https://100px.net/vue-luck-draw" rel="nofollow">https://100px.net/vue-luck-draw</a></p>
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
