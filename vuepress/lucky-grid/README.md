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

<Exhibition>
  <template v-slot:header>
    blocks - 示例1：如何绘制边框
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '10px', background: '#ffc27a' },
        { padding: '10px', background: '#ff4a4c', radius: 10 },
        { padding: '10px', background: '#ff625b', radius: Infinity },
      ]"
    />
  </template>
  <template v-slot:text>
    <code>blocks</code>用来绘制矩形（宽度和高度不可配置）第一个矩形的宽高等于<code>&lt;luckyGrid /&gt;</code>的宽高，
    但可以通过<code>padding</code>属性挤出边框的样式，比如我在下面绘制三个block，最后一个block就可以作为奖品区域的底色
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '10px', background: '#ffc27a' },
    { padding: '10px', background: '#ff4a4c', radius: 10 },
    { padding: '10px', background: '#ff625b', radius: Infinity },
  ]"
/>
```

### 奖品格子 - prizes

- <ldq-describe name="prizes?: Array<object>" mean="奖品列表" />
  - <ldq-describe name="index: number" mean="奖品索引" desc="必须从 0 开始表示第几个格子, 中奖标识按照升序进行游走" />
  - <ldq-describe name="x: number" mean="相对坐标x" desc="如果是标准的 3*3 宫格，那 x 的范围是 0 ~ 2" />
  - <ldq-describe name="y: number" mean="相对坐标y" desc="如果是标准的 3*3 宫格，那 y 的范围是 0 ~ 2" />
  - <ldq-describe name="col?: number" mean="横向合并格子" desc="用来实现异型格子, 默认为 1" />
  - <ldq-describe name="row?: number" mean="纵向合并格子" desc="用来实现异型格子, 默认为 1" />
  - <ldq-describe name="radius?: number" mean="格子圆角" desc="可继承 defaultStyle 圆角，默认为 20" />
  - <ldq-describe name="shadow?: string" mean="格子阴影" desc="由 4 个值组成：1.水平位置、2.垂直位置、3.模糊度、4.阴影颜色" />
  - <ldq-describe name="background?: string" mean="格子背景色" desc="可继承 defaultStyle 背景色，默认为 '#fff'" />

  - <ldq-describe name="fonts?: Array<object>" mean="文字列表" />
    - <ldq-describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" />
    - <ldq-describe name="color?: string" mean="字体颜色" />
    - <ldq-describe name="top?: string" mean="距离顶部的高度" desc="书写格式为：20 | '20px' | '20%'，默认为 0" />
    - <ldq-describe name="style?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 '16px sans-serif'" />
    - <ldq-describe name="lineHeight?: string" mean="字体行高" desc="默认使用字体样式中的字体大小" />

  - <ldq-describe name="imgs?: Array<object>" mean="图片列表" />
    - <ldq-describe name="src: string" mean="图片路径" />
    - <ldq-describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <ldq-describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <ldq-describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />

> 1.宽高都未设置：则使用图片原大小；2.有宽度无高度：则高度随着宽度等比缩放；3.有高度无宽度：则宽度随着高度等比缩放；4.既有宽度也有高度：则图片宽高均等于设置的值（会被拉伸）

<Exhibition>
  <template v-slot:header>
    prizes - 示例1：配置简单格子
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      cols="2"
      rows="2"
      :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
      :prizes="[
        {
          index: 0, x: 0, y: 0,
          fonts: [{ text: '0号\n格子', style: '24px sans-serif', top: 0 }],
        },
        {
          index: 1, x: 1, y: 0,
          fonts: [{ text: '1号\n格子', style: '24px sans-serif', color: '#000', top: '100%' }],
        },
        {
          index: 2, x: 0, y: 1,
          radius: Infinity,
          background: 'pink',
          fonts: [{ text: '2号\n格子', style: '24px sans-serif', top: '20%' }],
        }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>格子的文字默认居中</li>
    <li>文字可以使用<code>\n</code>来换行，注意不要写成<code>/n</code>，否则不生效</li>
    <li>关于<code>x</code>和<code>y</code>：计算机的坐标系位于左上角</li>
    <li>关于<code>top</code>属性：你可以把格子想象成带有<code>绝对定位</code>, 由于1号格子的文字<code>top: '100%'</code>，所以文字会超出格子</li>
    <li>关于<code>background</code>属性：普通格子的背景色默认是<code>#fff</code>，但中奖标识会默认停在0号格子的位置，所以0号格子的背景色是橘黄色</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  cols="2"
  rows="2"
  :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
  :prizes="[
    {
      index: 0, x: 0, y: 0,
      fonts: [{ text: '0号\n格子', style: '24px sans-serif', top: 0 }],
    },
    {
      index: 1, x: 1, y: 0,
      fonts: [{ text: '1号\n格子', style: '24px sans-serif', color: '#000', top: '100%' }],
    },
    {
      index: 2, x: 0, y: 1,
      radius: Infinity,
      background: 'pink',
      fonts: [{ text: '2号\n格子', style: '24px sans-serif', top: '20%' }],
    }
  ]"
/>
```

<Exhibition>
  <template v-slot:header>
    prizes - 示例2：关于如何配置图片
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      cols="2"
      rows="2"
      :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
      :prizes="[
        {
          index: 0, x: 0, y: 0,
          fonts: [{ text: '0号格子', top: '70%' }],
          imgs: [{ src: $withBase('/img/1.png'), width: '50%', top: '10%' }]
        },
        {
          index: 1, x: 1, y: 0,
          fonts: [{ text: '1号格子', top: '5%' }],
          imgs: [{ src: $withBase('/img/1.png'), top: '20%' }]
        },
        {
          index: 2, x: 0, y: 1,
          fonts: [{ text: '2号格子', top: '70%' }],
          imgs: [{ src: $withBase('/img/1.png'), width: '100%', height: '50%', top: '0%' }]
        },
      ]"
    />
  </template>
  <template v-slot:text>
    <li>跟文字一样也是默认居中并可以引入多个，在<code>imgs</code>数组里配置</li>
    <li><code>width</code>和<code>height</code>属性可以设置：50 | '50px' | '50%'</li>
    <li>建议只设置<code>width</code>或<code>height</code>，这样可以实现等比缩放，不然会像2号格子那样导致图片被拉伸</li>
    <li>由于1号格子的图片没有设置宽或高，则会渲染图片的实际大小</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  cols="2"
  rows="2"
  :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
  :prizes="[
    {
      index: 0, x: 0, y: 0,
      fonts: [{ text: '0号格子', top: '70%' }],
      imgs: [{ src: $withBase('/img/1.png'), width: '50%', top: '10%' }]
    },
    {
      index: 1, x: 1, y: 0,
      fonts: [{ text: '1号格子', top: '5%' }],
      imgs: [{ src: $withBase('/img/1.png'), top: '20%' }]
    },
    {
      index: 2, x: 0, y: 1,
      fonts: [{ text: '2号格子', top: '70%' }],
      imgs: [{ src: $withBase('/img/1.png'), width: '100%', height: '50%', top: '0%' }]
    },
  ]"
/>
```

<Exhibition>
  <template v-slot:header>
    prizes - 示例3：使用 col 和 row 合并格子
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px; float: left"
      :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
      :prizes="[
        { index: 0, x: 0, y: 0, col: 3 },
        { index: 1, x: 1, y: 1, col: 2, row: 2 },
        { index: 2, x: 0, y: 1, row: 2 }
      ]"
    />
    <!--  -->
    <LuckyGrid
      style="width: 200px; height: 200px; float: left; margin-left: 10px"
      :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
      :prizes="[
        { index: 0, x: 0, y: 0, col: 2 },
        { index: 1, x: 2, y: 0, row: 2 },
        { index: 2, x: 1, y: 2, col: 2 },
        { index: 3, x: 0, y: 1, row: 2 }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>默认情况下<code>col</code>和<code>row</code>都等于1</li>
    <li>通过改变格子的<code>col</code>或<code>row</code>可以实现合并单元格的效果，但是你得提前计算好格子的坐标，以免两个格子互相压到</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px; float: left"
  :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
  :prizes="[
    { index: 0, x: 0, y: 0, col: 3 },
    { index: 1, x: 1, y: 1, col: 2, row: 2 },
    { index: 2, x: 0, y: 1, row: 2 }
  ]"
/>
<!--  -->
<LuckyGrid
  style="width: 200px; height: 200px; float: left; margin-left: 10px"
  :blocks="[{ padding: '5px', background: '#ff4a4c', radius: 10 }]"
  :prizes="[
    { index: 0, x: 0, y: 0, col: 2 },
    { index: 1, x: 2, y: 0, row: 2 },
    { index: 2, x: 1, y: 2, col: 2 },
    { index: 3, x: 0, y: 1, row: 2 }
  ]"
/>
```

<br />

### 按钮格子 - button

<br />

### 格子的默认样式 - defaultStyle

<br />

### 中奖标记的样式 - activeStyle

<br />

### 格子布局 - cols & rows

<br />