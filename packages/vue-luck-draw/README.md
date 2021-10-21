
<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.png" width="128" alt="logo" />
  <h1>lucky-canvas 抽奖插件</h1>
  <p>一个基于 JavaScript 的跨平台 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p>
    <a href="https://github.com/LuckDraw/lucky-canvas/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/luckdraw/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/luckdraw/lucky-canvas/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/luckdraw/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/luckdraw/lucky-canvas/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/luckdraw/lucky-canvas?color=%232dce89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<div align="center">

|适配框架|npm包|最新版本|npm下载量|CDN使用量|
| :-: | :-: | :-: | :-: | :-: |
|`JS` / `JQ`|[lucky-canvas](https://100px.net/usage/js.html)|<img src="https://img.shields.io/npm/v/lucky-canvas?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/lucky-canvas" target="_black"><img src="https://img.shields.io/npm/dm/lucky-canvas?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/lucky-canvas" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/lucky-canvas/badge" alt="downloads" /></a>|
|`Vue2.x` / `Vue3.x`|[@lucky-canvas/vue](https://100px.net/usage/vue.html)|<img src="https://img.shields.io/npm/v/@lucky-canvas/vue?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/@lucky-canvas/vue" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/vue?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/@lucky-canvas/vue" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/@lucky-canvas/vue/badge" alt="downloads" /></a>|
|`React`|[react-luck-draw](https://100px.net/usage/react.html)|<img src="https://img.shields.io/npm/v/react-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/react-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/react-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/react-luck-draw" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/react-luck-draw/badge" alt="downloads" /></a>|
|`UniApp`|[uni-luck-draw](https://100px.net/usage/uni.html)|<img src="https://img.shields.io/npm/v/uni-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/uni-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/uni-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|`Taro3.x`|[taro-luck-draw](https://100px.net/usage/taro.html)|<img src="https://img.shields.io/npm/v/taro-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/taro-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/taro-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|`微信小程序`|[mini-luck-draw](https://100px.net/usage/wx.html)|<img src="https://img.shields.io/npm/v/mini-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="version" />|<a href="https://www.npmjs.com/package/mini-luck-draw" target="_black"><img src="https://img.shields.io/npm/dm/mini-luck-draw?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|

</div>

<br />

## 在 vue2.x / vue3.x 中使用

### 方式 1：通过 import 引入

1. 首先安装插件

```shell
# npm 安装：
npm install @lucky-canvas/vue

# yarn 安装：
yarn add @lucky-canvas/vue
```

2. 然后找到 `main.js` 引入插件并 `use`

```js
// vue2.x
import VueLuckyCanvas from '@lucky-canvas/vue'
Vue.use(VueLuckyCanvas)

// vue3.x
import VueLuckyCanvas from '@lucky-canvas/vue'
createApp(App).use(VueLuckyCanvas).mount('#app')
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

- **CDN 链接：** https://cdn.jsdelivr.net/npm/@lucky-canvas/vue/dist/index.umd.min.js

### Vue2.x

```html
<div id="app">
  <!-- 大转盘抽奖简易demo -->
  <lucky-wheel
    width="200px"
    height="200px"
    :blocks="blocks"
    :prizes="prizes"
  />
</div>
<!-- vuejs 要在前面引入, 使用你自己本地的 vuejs 即可 -->
<script src="./vue2.js"></script>
<!-- 为了兼容 vue2.x 需要同时引入以下这三个 CDN 链接 -->
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.2.4/dist/vue-composition-api.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-demi@0.11.4/lib/index.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@lucky-canvas/vue/dist/index.umd.min.js"></script>
<script>
  new Vue({
    el: '#app',
    data () {
      return {
        blocks: [{ padding: '10px', background: '#869cfa' }],
        prizes: [
          { fonts: [{ text: '0' }], background: '#e9e8fe' },
          { fonts: [{ text: '1' }], background: '#b8c5f2' },
          { fonts: [{ text: '2' }], background: '#e9e8fe' },
          { fonts: [{ text: '3' }], background: '#b8c5f2' },
          { fonts: [{ text: '4' }], background: '#e9e8fe' },
          { fonts: [{ text: '5' }], background: '#b8c5f2' },
        ]
      }
    }
  })
</script>
```

### Vue3.x

```html
<div id="app">
  <!-- 大转盘抽奖简易demo -->
  <lucky-wheel
    width="200px"
    height="200px"
    :blocks="blocks"
    :prizes="prizes"
  />
</div>
<!-- vuejs 要在前面引入, 使用你自己本地的 vuejs 即可 -->
<script src="./vue3.js"></script>
<!-- 为了兼容 vue3.x 需要同时引入以下这两个 CDN 链接 -->
<script src="https://cdn.jsdelivr.net/npm/vue-demi@0.11.4/lib/index.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@lucky-canvas/vue/dist/index.umd.min.js"></script>
<script>
  const app = Vue.createApp({
    data() {
      return {
        blocks: [{ padding: '10px', background: '#869cfa' }],
        prizes: [
          { fonts: [{ text: '0' }], background: '#e9e8fe' },
          { fonts: [{ text: '1' }], background: '#b8c5f2' },
          { fonts: [{ text: '2' }], background: '#e9e8fe' },
          { fonts: [{ text: '3' }], background: '#b8c5f2' },
          { fonts: [{ text: '4' }], background: '#e9e8fe' },
          { fonts: [{ text: '5' }], background: '#b8c5f2' },
        ]
      }
    }
  }).use(VueLuckyCanvas).mount('#app')
</script>
```

<br />

### **如果您觉得这个项目还不错, 可以在 [Github](https://github.com/LuckDraw/lucky-canvas) 上面帮我点个`star` ☜(ﾟヮﾟ☜)**

