---
sidebar: auto
---

<!-- # 九宫格抽奖 -->

## 安装

`npm i vue-luck-draw`

## 使用

### 方式1: 通过 import 引入

找到 `main.js` 引入插件并 `use`

```js
import LuckDraw from 'vue-luck-draw'

Vue.use(LuckDraw)
```

### 方式2: 通过 script 标签引入

在dist目录下找到一个js文件, 然后使用script引入

```html
<script src="./dist/index.umd.min.js"></script>
```

> 其中js文件要在vue后面引入

## 配置项

### 边框 - blocks

- <ldq-describe name="blocks?: Array<object>" mean="" />
  - <ldq-describe name="padding: string" mean="内边距" desc="与 css 中 padding 使用方式一样" />
  - <ldq-describe name="background: string" mean="背景颜色" desc="可填写16进制颜色哈希值或 rgba" />
  - <ldq-describe name="radius?: number" mean="圆角半径" desc="默认为 0, 配置范围为 0 ~ Infinity" />

<br />

**`blocks` 用来绘制矩形（并且宽度和高度不可配置）第一个矩形的宽高等于`<luckyGrid />`的宽高，可以通过`padding`属性挤出边框的样式，比如我在下面绘制三个block，最后一个block就可以作为奖品区域的底色**

<LuckyGrid
  style="width: 300px; height: 300px"
  :blocks="[
    { padding: '15px', background: '#ffc27a' },
    { padding: '4px', background: '#ff4a4c' },
    { padding: '4px', background: '#ff625b' },
  ]"
/>

```vue
<LuckyGrid
  style="width: 300px; height: 300px"
  :blocks="[
    { padding: '15px', background: '#ffc27a' },
    { padding: '4px', background: '#ff4a4c' },
    { padding: '4px', background: '#ff625b' },
  ]"
/>
```

<br />

### 奖品格子 - prizes

- <ldq-describe name="prizes?: Array<object>" mean="奖品列表" />
  - <ldq-describe name="index: number" mean="奖品索引" desc="从 0 开始表示第几个格子, 中奖标识按照升序进行游走" />
  - <ldq-describe name="x: number" mean="相对坐标x" desc="如果是标准的 3*3 宫格，那 x 的范围是 0 ~ 2" />
  - <ldq-describe name="y: number" mean="相对坐标y" desc="如果是标准的 3*3 宫格，那 y 的范围是 0 ~ 2" />
  - <ldq-describe name="col?: number" mean="横向合并格子" desc="用来实现异型格子, 默认为 1" />
  - <ldq-describe name="row?: number" mean="纵向合并格子" desc="用来实现异型格子, 默认为 1" />
  - <ldq-describe name="shadow?: string" mean="格子阴影" desc="阴影由 4 个值组成：1.水平位置、2.垂直位置、3.模糊距离、4.阴影颜色" />
  - <ldq-describe name="background?: string" mean="格子背景色" desc="此处优先级最高，可继承 defaultStyle 的背景色，默认为 '#fff'" />

  - <ldq-describe name="fonts?: Array<object>" mean="文字列表" />
    - <ldq-describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" />
    - <ldq-describe name="color?: string" mean="字体颜色" />
    - <ldq-describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <ldq-describe name="style?: string" mean="字体样式" desc="此处优先级最高，可继承 defaultStyle 的字体样式，默认为 '16px sans-serif'" />
    - <ldq-describe name="lineHeight?: string" mean="字体行高" desc="当文字换行时，会根据行高调节高度，默认使用字体样式中的文字大小" />

  - <ldq-describe name="imgs?: Array<object>" mean="图片列表" />
    - <ldq-describe name="src: string" mean="图片路径" />
    - <ldq-describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <ldq-describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <ldq-describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />
      1. <ldq-describe desc="宽高都没设置：则使用图片原大小" />
      2. <ldq-describe desc="有宽度无高度：则高度随着宽度等比缩放" />
      3. <ldq-describe desc="有高度无宽度：则宽度随着高度等比缩放" />
      4. <ldq-describe desc="既有宽度也有高度：则图片宽高均等于设置的值" />

<LuckyGrid
  style="width: 300px; height: 300px"
  :blocks="[
    { padding: '15px', background: '#ffc27a', radius: 25 },
    { padding: '4px', background: '#ff4a4c', radius: 20 },
    { padding: '4px', background: '#ff625b', radius: 20 }
  ]"
  :prizes="[
    {
      index: 0, x: 0, y: 0,
      fonts: [
        { text: '0号\n格子', style: '20px sans-serif', top: '25%' }
      ],
    },
    {
      index: 1, x: 1, y: 0,
      fonts: [{ text: '1号格子', top: '70%' }],
      imgs: [{ src: $withBase('/img/1.png'), width: '50%', top: '10%' }]
    },
    {
      index: 2, x: 2, y: 0, row: 2,
      shadow: '0 5 5 #ccc',
      fonts: [
        { text: '2号row=2\n所以图片的\n高度等于两\n个格子的\n50%', style: '14px sans-serif', top: '50%' },
      ],
      imgs: [{ src: $withBase('/img/2.png'), height: '50%', top: '0%' }]
    },
    {
      index: 3, x: 0, y: 1, col: 2,
      shadow: '0 -5 5 #aaa',
      fonts: [{ text: '3号col=2所以图片宽\n度等于两个格子的50%', top: '0%' }],
      imgs: [{ src: $withBase('/img/3.png'), width: '50%', top: '35%' }]
    },
    {
      index: 4, x: 0, y: 2, col: 3,
      background: 'pink',
      fonts: [{ text: '图片宽度为三个格子加起来的50%', top: '10%' }],
      imgs: [{ src: $withBase('/img/4.png'), width: '50%', top: '35%' }]
    },
  ]"
/>


<br />

### 按钮格子 - button

<br />

### 格子的默认样式 - defaultStyle

<br />

### 中奖标记的样式 - activeStyle

<br />

### 格子布局 - cols & rows

<br />