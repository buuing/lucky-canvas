
<Empty />

<div align="center">
  <img src="./logo.png" width="200" />
  <h1>vue-luck-draw</h1>
  <p>A Vue component, can realize lucky draw through simple configuration</p>
  <p class="hidden">
    <a href="https://github.com/LuckDraw/vue-luck-draw#readme">简体中文</a>
    ·
    <a href="https://github.com/LuckDraw/vue-luck-draw/tree/master/en">English</a>
  </p>
  <p>
    <a href="https://github.com/LuckDraw/vue-luck-draw/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/vue-luck-draw?&logo=github" alt="stars" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/buuing/vue-luck-draw?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/github/package-json/v/buuing/vue-luck-draw?&logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/vue-luck-draw" target="_black">
      <img src="https://img.shields.io/npm/dt/vue-luck-draw?&logo=npm" alt="downloads" />
    </a>
    <a href="https://github.com/buuing/vue-luck-draw/tree/master/dist" target="_black">
      <img src="https://img.shields.io/github/size/buuing/vue-luck-draw/dist/luckdraw.common.js?&logo=npm" alt="size" />
    </a>
  </p>
  <p>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://github.com/LuckDraw/vue-luck-draw/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/vue-luck-draw?&logo=github" alt="license" />
    </a>
  </p>
</div>

<br />

## Docs & Demo

> **中文**：[https://100px.net?vue](https://100px.net?vue)  

> **English**：**If anyone can help translate the document, please contact me** `ldq404@qq.com`

<br />

##  vue2.x or vue3.x is required

### Method 1: With Import

1. Installation

```shell
# with npm：
npm install vue-luck-draw

# with yarn：
yarn add vue-luck-draw
```

2. Introducing component and `use`

```js
// vue2.x
import LuckDraw from 'vue-luck-draw'
Vue.use(LuckDraw)

// vue3.x
import LuckDraw from 'vue-luck-draw/vue3'
createApp(App).use(LuckDraw).mount('#app')
```

3. Using <LuckyWheel /> to render **turntable lottery** or using <LuckyGrid /> to render **grid lottery**

```vue
<template>
  <div>
    <!-- turntable lottery -->
    <LuckyWheel
      style="width: 200px; height: 200px"
      ...your settings
    />
    <!-- grid lottery -->
    <LuckyGrid
      style="width: 200px; height: 200px"
      ...your settings
    />
  </div>
</template>
```

<br />

### Method 2：Direct <script> Include

Download the `luckdraw.umd.min.js` from the link below and include with a script tag

- vue2.x：[https://github.com/buuing/vue-luck-draw/tree/master/dist](https://github.com/buuing/vue-luck-draw/tree/master/dist)
- vue3.x：[https://github.com/buuing/vue-luck-draw/tree/master/vue3](https://github.com/buuing/vue-luck-draw/tree/master/vue3)

```html
<div id="app">
  <!-- turntable lottery -->
  <lucky-wheel
    style="width: 200px; height: 200px"
    ...your settings
  />
  <!-- grid lottery -->
  <lucky-grid
    style="width: 200px; height: 200px"
    ...your settings
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
