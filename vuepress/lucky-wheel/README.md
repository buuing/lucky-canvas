
## 安装

> `npm i vue-luck-draw`

<br />

## Demo演示

<iframe src="https://100px.net/vue-luck-draw/" style="width: 100%; height: 750px"></iframe>

<br />

## 使用

> 先找到`main.js`引入插件并`use`

```js
import LuckDraw from 'vue-luck-draw'

Vue.use(LuckDraw)
```

> 然后就可以使用插件了, 以下是最基本的使用

```html
<template>
  <div id="app">
    <LuckDraw
      ref="luckDraw"
      v-model="currIndex"
      :awards="awards"
      :async="true"
      @before-start="handleBeforeStart"
      @start="handleStart"
      @end="handleEnd"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      currIndex: 0, // 奖品的索引
      awards: [     // 奖品
        { name: '价值5988元华为 P30pro', color: '#f9e3bb' },
        { name: '价值398元车载空气净化器', color: '#f8d384' },
        { name: '价值25元百叶帘遮阳挡', color: '#f9e3bb' },
        { name: '16元油卡套餐红包', color: '#f8d384' },
        { name: '5元油卡直冲红包', color: '#f9e3bb' },
        { name: '3元话费直冲红包', color: '#f8d384' },
        { name: '价值32元重力感应手机支架', color: '#f9e3bb' },
        { name: '价值198元手提迷你车在保温冷藏箱', color: '#f8d384' },
      ],
    }
  },
  methods: {
    handleBeforeStart () { // 新增异步抽奖
      setTimeout(() => {
        this.$refs.luckDraw.play(3)
      }, 3000)
    },
    handleStart () {
      console.log('开始抽奖')
    },
    handleEnd (index) {
      alert('恭喜您抽到大奖, 奖品为' + this.awards[this.currIndex].name)
    }
  }
}
</script>
```

> 增加异步抽奖方法：
> 设置属性`async`=true
> 监听事件`@before-start`，执行`this.$refs.luckDraw.play(中奖的索引)`

<br />

> 但我提供了更多可配置的参数, 比如:

```html
<template>
  <div id="app">
    <!-- 以下是默认配置参数, 可以根据个人需要进行修改 -->
    <LuckDraw
      ref="luckDraw"
      v-model="currIndex"
      :awards="awards"
      :rate="rate"
      :radius="radius"
      :textFontSize="textFontSize"
      :lineHeight="lineHeight"
      :textColor="textColor"
      :textMargin="textMargin"
      :textPadding="textPadding"
      :btnFontSize="btnFontSize"
      :btnColor="btnColor"
      :btnBorderColor1="btnBorderColor1"
      :btnBorderColor2="btnBorderColor2"
      :btnBorderColor3="btnBorderColor3"
      :btnBgColor="btnBgColor"
      :btnText="btnText"
      :btnRadius="btnRadius"
      :borderColor="borderColor"
      @start="handleStart"
      @end="handleEnd"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      currIndex: 0,               // 奖品的索引
      rate: 80,                   // 转盘速率
      radius: 180,                // 转盘半径
      textFontSize: '13px',       // 文字大小
      lineHeight: 20,             // 文字行高
      textColor: '#d64737',       // 文字颜色
      textMargin: 30,             // 文字距离边框距离
      textPadding: 0,             // 文字补偿宽度
      btnFontSize: '26px',        // 按钮文字大小
      btnColor: '#d64737',        // 按钮文件颜色
      btnBorderColor1: '#d64737', // 按钮外边框颜色
      btnBorderColor2: '#ffffff', // 按钮内边框颜色
      btnBorderColor3: '#f6c66f', // 按钮指针颜色
      btnBgColor: '#ffdea0',      // 按钮背景颜色
      btnText: '抽奖',            // 按钮内容
      btnRadius: 60,              // 按钮半径
      borderColor: '#d64737',     // 边框颜色
      awards: [                   // 奖品
        { name: '价值5988元华为 P30pro', color: '#f9e3bb' },
        { name: '价值398元车载空气净化器', color: '#f8d384' },
        { name: '价值25元百叶帘遮阳挡', color: '#f9e3bb' },
        { name: '16元油卡套餐红包', color: '#f8d384' },
        { name: '5元油卡直冲红包', color: '#f9e3bb' },
        { name: '3元话费直冲红包', color: '#f8d384' },
        { name: '价值32元重力感应手机支架', color: '#f9e3bb' },
        { name: '价值198元手提迷你车在保温冷藏箱', color: '#f8d384' },
      ],
    }
  },
  methods: {
    handleStart () {
      console.log('开始抽奖')
    },
    handleEnd (index) {
      alert('恭喜您抽到大奖, 奖品为' + this.awards[this.currIndex].name)
    }
  }
}
</script>
```