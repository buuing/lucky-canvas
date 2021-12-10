<br />

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.jpg" width="210" alt="logo" />
  <h1>lucky-canvas 抽奖插件</h1>
  <p>一个基于 JavaScript 的跨平台 ( 大转盘 / 九宫格 / 老虎机 ) 抽奖插件</p>
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
|[`Vue` 中使用](https://100px.net/usage/vue.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/vue" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/vue?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|<a href="https://www.jsdelivr.com/package/npm/@lucky-canvas/vue" target="_black"><img src="https://data.jsdelivr.com/v1/package/npm/@lucky-canvas/vue/badge" alt="downloads" /></a>|
|[`React` 中使用](https://100px.net/usage/react.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/react" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/react?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`UniApp` 中使用](https://100px.net/usage/uni.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/uni" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/uni?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`Taro3.x` 中使用](https://100px.net/usage/taro.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/taro" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/taro?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|
|[`微信小程序` 中使用](https://100px.net/usage/wx.html)|<a href="https://www.npmjs.com/package/@lucky-canvas/mini" target="_black"><img src="https://img.shields.io/npm/dm/@lucky-canvas/mini?color=%23ffba15&logo=npm&style=flat-square" alt="downloads" /></a>|-|

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

- 另外: 如果你修复了某些bug或兼容, 欢迎提给我, 我会把你展示到官网的贡献者列表当中


<br />

### 5. 常见问题

1. 转盘层级太高了, 我的弹窗盖不住怎么办?

> 答: 因为小程序里canvas是原生组件顶层渲染, 我无法控制canvas的层级, 如果你想盖住它也肯简单, 你可以百度搜索`<cover>`组件

2. 你这些素材, 图片组件从哪下载?

> 答: 官网里的任何图片素材, 所使用到的图片资源均为学习交流使用, 请勿将其用于商业用途, 由此产生的任何商业纠纷我这边概不负责

3. xxx属性怎么使用? xxx方法怎么调用?

> 答: 自己去看文档, 不然难道要我把代码给你写好吗?

4. 这个属性的效果与官网的描述不一致?

> 答: 可能有bug, 你可以去github上的issues去提问 (请认真填写模板)

5. 为什么这个插件不支持app和其他小程序

> 答: 没时间, 但是希望志同道合的同学来一起参与uniapp的兼容开发

---

<font color="blue">作者留言: 为了使我自己保持心情愉悦, 低于5星的提问我用浏览器插件都屏蔽了</font>
