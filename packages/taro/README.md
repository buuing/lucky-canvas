
<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/buuing/cdn/imgs/lucky-canvas.jpg" width="210" alt="logo" />
  <h1>@lucky-canvas/taro 抽奖插件</h1>
  <p>一个基于 Taro 的 ( 大转盘 / 九宫格 / 老虎机 ) 抽奖插件</p>
  <p>
    <a href="https://github.com/LuckDraw/lucky-canvas/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/LuckDraw/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/LuckDraw/lucky-canvas/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/LuckDraw/lucky-canvas?color=%23ffba15&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/LuckDraw/lucky-canvas/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/LuckDraw/lucky-canvas?color=%232dce89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<br />

## 官方文档

> **中文**：[https://100px.net/usage/taro.html](https://100px.net/usage/taro.html)

<br />

## 在 Taro 中使用

### 安装

> 为了确保相关依赖安装正确, 你必须通过 npm / yarn 来安装

```shell
# npm 安装：
npm install @lucky-canvas/taro@latest

# yarn 安装：
yarn add @lucky-canvas/taro@latest
```


<br />

### 使用

#### taro-vue 简单示例

- [点击查看 taro-vue 完整示例](https://100px.net/usage/taro.html)

```html
<template>
  <view>

    <!-- 大转盘抽奖 -->
    <LuckyWheel width="600rpx" height="600rpx" ...你的配置 />

    <!-- 九宫格抽奖 -->
    <LuckyGrid width="600rpx" height="600rpx" ...你的配置 />

    <!-- 老虎机抽奖 -->
    <SlotMachine width="600rpx" height="600rpx" ...你的配置 />

  </view>
</template>

<script>
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/taro/vue'
export default {
  components: { LuckyWheel, LuckyGrid, SlotMachine },
}
</script>
```

<br />

#### taro-react 简单示例

- [点击查看 taro-react 完整示例](https://100px.net/usage/taro.html)

```js
import React from 'react'
import { View } from '@tarojs/components'
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/taro/react'

export default class Index extends React.Component {
  render () {
    return <View>

      {/* 大转盘抽奖 */}
      <LuckyWheel width="300px" height="300px" ...你的配置 />

      {/* 大转盘抽奖 */}
      <LuckyGrid width="300px" height="300px" ...你的配置 />

      {/* 老虎机抽奖 */}
      <SlotMachine width="300px" height="300px" ...你的配置 />

    </View>
  }
}
```

<br />

## 完整文档: https://100px.net

<br />

## 🙏🙏🙏 点个Star

### **如果您觉得这个项目还不错, 可以在 [Github](https://github.com/buuing/lucky-canvas) 上面帮我点个`star`, 支持一下作者 ☜(ﾟヮﾟ☜) ☜(ﾟヮﾟ☜)**

<br />
