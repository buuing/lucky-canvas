
<Empty />

## 边框 - blocks

> 为了使得大转盘始终是一个圆，所以这里不支持`paddingLeft`、`paddingRight`、`paddingTop`、`paddingBottom`等属性

- <Describe name="blocks?: Array<object>" mean="" />
  - <Describe name="padding: string" mean="内边距" desc="边框必须是等宽的, 所以 padding 只能输入一个值" :isRequire="true" />
  - <Describe name="background: string" mean="背景颜色" desc="可填写16进制颜色哈希值或 rgba" :isRequire="true" />

### 如何绘制边框

<Exhibition>
  <template v-slot:code>
    <LuckyWheel
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#ffc27a' },
        { padding: '10px', background: '#ff4a4c' },
        { padding: '0px', background: '#fff' }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>第一个橘色的 block 的直径等于200px，等于父容器的宽</li>
    <li>第二个红色的 block：直径等于180px，因为第一个 block 的<code>padding</code>上下左右同时挤出10px</li>
    <li>第三个白色的 block：直径等于160px，因为第二个 block 的<code>padding</code>同样也挤出10px</li>
    <li>最后白色 block 挤出的部分就是奖品区域了</li>
  </template>
</Exhibition>

```vue
<LuckyWheel
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#ffc27a' },
    { padding: '10px', background: '#ff4a4c' },
    { padding: '0px', background: '#fff' }
  ]"
/>
```

## 奖品 - prizes

> 奖品列表是一个数组，转盘会根据奖品数量来分配扇形区域

- <Describe name="prizes?: Array<object>" mean="奖品列表" />

  - <Describe name="background?: string" mean="扇形背景色" desc="可继承 defaultStyle 背景色，默认为 '#fff'" />

  - <Describe name="fonts?: Array<object>" mean="文字列表" />
    - <Describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="书写格式为：20 | '20px' | '20%'，默认为 0" />
    - <Describe name="fontColor?: string" mean="字体颜色" desc="可继承 defaultStyle 字体颜色，默认为 '#000'" />
    - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体大小，默认为 '22px'" />
    - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
    - <Describe name="lineHeight?: string" mean="字体行高" desc="默认等于字体大小" />
    - <Describe name="wordWrap?: boolean" mean="文字自动换行" desc="默认为 true 开启，但依然可以使用 \n 换行" />

  - <Describe name="imgs?: Array<object>" mean="图片列表" />
    - <Describe name="src: string" mean="图片路径" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <Describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <Describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />

1.宽高都未设置：则使用图片原大小；2.有宽度无高度：则高度随着宽度等比缩放；3.有高度无宽度：则宽度随着高度等比缩放；4.既有宽度也有高度：则图片宽高均等于设置的值（会被拉伸）

### 如何设置奖品

<Exhibition>
  <template v-slot:code>
    <LuckyWheel
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#d64737' },
      ]"
      :prizes="[
        { fonts: [{ text: '0' }], background: '#f8d384' },
        { fonts: [{ text: '1', top: '20px' }], background: '#f9e3bb' },
        { fonts: [{ text: '2', top: '100%' }], background: '#fff' }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>奖品区域为扇形，会平分整个大转盘并以顺时针方向绘制，建议配置不同的背景色方便区分</li>
    <li>文字默认以扇形的中线居中，会自动随着扇形的旋转而旋转</li>
    <li>2号扇形的top为100%，所以他的文字超出了原本的区域</li>
  </template>
</Exhibition>

```vue
<LuckyWheel
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#d64737' },
  ]"
  :prizes="[
    { fonts: [{ text: '0' }], background: '#f8d384' },
    { fonts: [{ text: '1', top: '20px' }], background: '#f9e3bb' },
    { fonts: [{ text: '2', top: '100%' }], background: '#fff' }
  ]"
/>
```

### 如何配置图片

<Exhibition>
  <template v-slot:code>
    <LuckyWheel
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#d64737' },
      ]"
      :prizes="[
        { imgs: [{ src: $withBase('/img/1.png') }], background: '#f8d384' },
        { imgs: [{ src: $withBase('/img/1.png'), width: '30%' }], background: '#f9e3bb' },
        { imgs: [{ src: $withBase('/img/1.png'), width: '40%', height: '50%' }] }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>图片跟文字一样，会默认以扇形的中线居中</li>
    <li>0号扇形的图片因为没有设置宽度或高度限制，所以他显示了图片的原本大小</li>
    <li>1号扇形的图片只设置了宽度，那高度就会随着宽度进行等比缩放</li>
    <li>2号扇形的图片同时设置了宽度和高度，所以他被拉伸了</li>
  </template>
</Exhibition>

```vue
<LuckyWheel
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#d64737' },
  ]"
  :prizes="[
    { imgs: [{ src: require('/img/1.png') }], background: '#f8d384' },
    { imgs: [{ src: require('/img/1.png'), width: '30%' }], background: '#f9e3bb' },
    { imgs: [{ src: require('/img/1.png'), width: '40%', height: '50%' }] }
  ]"
/>
```

## 抽奖按钮 - buttons

- <Describe name="buttons?: Array<object>" mean="抽奖按钮列表" />

  - <Describe name="radius?: string" mean="按钮半径" desc="" />
  - <Describe name="pointer?: boolean" mean="是否显示指针" desc="默认为 false" />
  - <Describe name="background?: string" mean="按钮背景色" desc="可继承 defaultStyle 背景色，默认为 '#fff'" />

  - <Describe name="fonts?: Array<object>" mean="文字列表" />
    - <Describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="书写格式为：20 | '20px' | '20%'，默认为 0" />
    - <Describe name="fontColor?: string" mean="字体颜色" desc="可继承 defaultStyle 字体颜色，默认为 '#000'" />
    - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体大小，默认为 '22px'" />
    - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
    - <Describe name="lineHeight?: string" mean="字体行高" desc="默认等于字体大小" />

  - <Describe name="imgs?: Array<object>" mean="图片列表" />
    - <Describe name="src: string" mean="图片路径" :isRequire="true" />
    - <Describe name="top?: string" mean="离圆心的距离" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <Describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <Describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />

1.宽高都未设置：则使用图片原大小；2.有宽度无高度：则高度随着宽度等比缩放；3.有高度无宽度：则宽度随着高度等比缩放；4.既有宽度也有高度：则图片宽高均等于设置的值（会被拉伸）

### 如何配置按钮

<Exhibition>
  <template v-slot:code>
    <LuckyWheel
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#d64737' },
        { padding: '0px', background: '#fff' },
      ]"
      :buttons="[
        { radius: '40px', background: '#d64737' },
        { radius: '35px', background: '#f6c66f', pointer: true },
        {
          radius: '30px',
          background: '#fff',
          fonts: [{ text: '开始', top: '-13px' }]
        }
      ]"
    />
  </template>
  <template v-slot:text>
    <li><code>buttons</code>的绘制顺序为从上到下，所以要注意半径的大小，以免下面的按钮过大，把后面的按钮覆盖掉</li>
    <li><code>pointer</code>属性控制 item 是否显示指针，如果你想要一个炫酷的指针，那你可以通过引入 img 的方式来实现</li>
    <li>我通常建议你在最后一个按钮里面绘制文字或图片，来避免被覆盖掉</li>
  </template>
</Exhibition>

```vue
<LuckyWheel
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#d64737' },
    { padding: '0px', background: '#fff' },
  ]"
  :buttons="[
    { radius: '40px', background: '#d64737' },
    { radius: '35px', background: '#f6c66f', pointer: true },
    {
      radius: '30px',
      background: '#fff',
      fonts: [{ text: '开始', top: '-13px' }]
    }
  ]"
/>
```

## 默认样式 - defaultStyle

> 如果你觉得写一堆重复的数据很烦的话，那你可以在这里进行统一的管理，其中包括`奖品`和`抽奖按钮`，在没有配置的情况下都会继承这里的属性

- <Describe name="defaultStyle?: object" mean="格子默认样式" />
  - <Describe name="fontColor?: string" mean="字体颜色" desc="默认是 '#000' 黑色" />
  - <Describe name="fontSize?: string" mean="字体大小(px)" desc="默认是 '18px'" />
  - <Describe name="fontStyle?: string" mean="字体样式" desc="默认是 'sans-serif'" />
  - <Describe name="lineHeight?: string" mean="字体行高" desc="默认等于字体大小" />
  - <Describe name="wordWrap?: boolean" mean="文字自动换行" desc="默认为 true 开启，但依然可以使用 \n 换行" />
  - <Describe name="textAlign?: string" mean="文字和图片的对其方式" desc="目前只能居中!" />
  - <Describe name="background?: string" mean="奖品区域背景颜色" desc="默认是 '#fff' 白色" />

### 关于默认样式

<Exhibition>
  <template v-slot:code>
    <LuckyWheel
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#d64737' }
      ]"
      :prizes="[
        { fonts: [{ text: '0' }], background: '#f8d384' },
        { fonts: [{ text: '1' }] },
        { fonts: [{ text: '2' }], background: '#f8d384' },
        { fonts: [{ text: '3' }] },
        { fonts: [{ text: '4' }], background: '#f8d384' },
        { fonts: [{ text: '5' }] },
      ]"
      :defaultStyle="{
        fontColor: 'red',
        fontSize: '30px',
        background: 'pink'
      }"
    />
  </template>
  <template v-slot:text>
    <li><code>textAlign</code>对其方式目前只支持 center</li>
    <li><code>background</code>属性只有在奖品区域没有配置背景色时才会生效，但是按钮的背景色不会继承这里，而是显示透明色</li>
  </template>
</Exhibition>

```vue
<LuckyWheel
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#d64737' }
  ]"
  :prizes="[
    { fonts: [{ text: '0' }], background: '#f8d384' },
    { fonts: [{ text: '1' }] },
    { fonts: [{ text: '2' }], background: '#f8d384' },
    { fonts: [{ text: '3' }] },
    { fonts: [{ text: '4' }], background: '#f8d384' },
    { fonts: [{ text: '5' }] },
  ]"
  :defaultStyle="{
    fontColor: 'red',
    fontSize: '30px',
    background: 'pink'
  }"
/>
```

## 回调 & 方法

- <Describe name="strat?: Function" mean="开始抽奖前" desc="当点击抽奖按钮时，触发该回调" />
- <Describe name="end?: Function" mean="抽奖结束后" desc="当九宫格完全停止时，触发该回调" />
- <Describe name="play()" mean="开始抽奖" desc="调用该方法时，游戏才会开始, 没有参数" />
- <Describe name="stop(index)" mean="缓慢停止抽奖" desc="调用该方法时，才会缓慢停止, 参数是中奖的索引" />

### 点击按钮开始抽奖

<Exhibition>
  <template v-slot:code>
    <demo-ymc-wheel />
  </template>
  <template v-slot:text>
    <p>正常的流程是：</p>
    <p>1. 当你点击抽奖按钮时触发<code>strat</code>回调函数，接下来你可以调用<code>play()</code>方法先让大转盘转起来，然后紧接着去请求接口拿数据，或是你自己随机一个index</p>
    <p>2. 当接口拿到<code>index</code>中奖索引之后，你就可以调用<code>stop(index)</code>方法了，此时大转盘会缓慢停止，当完全停止之后就会触发end回调函数</p>
    <p>3. 最后在<code>end</code>回调函数里面，得到中奖奖品的全部信息，你就可以在这里执行逻辑告诉用户他中奖了</p>
  </template>
</Exhibition>

```vue
<template>
  <LuckyWheel
    ...
    ref="LuckDraw"
    @start="startCallBack"
    @end="endCallBack"
  />
</template>

<script>
export default {
  methods: {
    // ...
    startCallBack () {
      // 开始旋转
      this.$refs.LuckDraw.play()
      // 模拟请求接口2s后返回数据
      setTimeout(() => {
        const index = Math.random() * 7 >> 0
        // 得到中奖索引, 开始缓慢停止
        this.$refs.LuckDraw.stop(index)
      }, 2000)
    },
    endCallBack (prize) {
      // 此时完全停止
      alert(`恭喜你获得大奖: ${prize.fonts[0].text}`)
    },
    // ...
  }
}
</script>
```
