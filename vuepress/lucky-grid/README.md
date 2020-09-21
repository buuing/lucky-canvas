
<Empty />

## 边框 - blocks

> `blocks`用来绘制矩形（宽度和高度不可配置）第一个矩形的宽高等于`<luckyGrid />`的宽高，但可以通过`padding`属性挤出边框的样式

- <Describe name="blocks?: Array<object>" mean="" />
  - <Describe name="borderRadius?: string | number" mean="圆角半径" desc="默认为 0, 配置范围为 0 ~ Infinity" />
  - <Describe name="background: string" mean="背景颜色" desc="可填写16进制颜色哈希值或 rgba" :isRequire="true" />
  - <Describe name="padding: string" mean="内边距" desc="与 css 中 padding 使用方式一样" :isRequire="true" />
  - <Describe name="paddingTop: string | number" mean="上边距" desc="优先级大于 padding" />
  - <Describe name="paddingBottom: string | number" mean="下边距" desc="优先级大于 padding" />
  - <Describe name="paddingLeft: string | number" mean="左边距" desc="优先级大于 padding" />
  - <Describe name="paddingRight: string | number" mean="右边距" desc="优先级大于 padding" />

<Exhibition>
  <template v-slot:header>
    blocks - 示例1：如何绘制边框
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      :blocks="[
        { padding: '30px 10px', background: '#ffc27a' },
        { padding: '10px', paddingRight: '90px', background: '#ff4a4c' },
        { padding: '0px', background: '#fff' }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>第一个橘色的 block 的宽高等于200px，等于父容器的宽高</li>
    <li>第二个红色的 block：宽180px 高140px，因为第一个 block 的<code>padding</code>上下分别挤出10px, 左右分别挤出30px</li>
    <li>第三个白色的 block：宽80px 高120px，因为第二个 block 的<code>paddingRight</code>覆盖了<code>padding</code>的10px</li>
    <li>最后白色 block 挤出的部分就是奖品区域了</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  :blocks="[
    { padding: '30px 10px', background: '#ffc27a' },
    { padding: '10px 30px', background: '#ff4a4c', borderRadius: 10 },
    { padding: '10px', background: '#ff625b', borderRadius: Infinity },
  ]"
/>
```

## 奖品 - prizes

> 奖品列表是一个数组，item里面有三个必须的参数：`x`、`y`、`index`

- <Describe name="prizes?: Array<object>" mean="奖品列表" />

  - <Describe name="x: number" mean="相对坐标x" desc="如果是标准的 3*3 宫格，那 x 的范围是 0 ~ 2" :isRequire="true" />
  - <Describe name="y: number" mean="相对坐标y" desc="如果是标准的 3*3 宫格，那 y 的范围是 0 ~ 2" :isRequire="true" />
  - <Describe name="col?: number" mean="横向合并格子" desc="用来横向合并单元格，默认为 1" />
  - <Describe name="row?: number" mean="纵向合并格子" desc="用来纵向合并单元格，默认为 1" />
  - <Describe name="borderRadius?: number" mean="格子圆角" desc="可继承 defaultStyle 圆角，默认为 20" />
  - <Describe name="shadow?: string" mean="格子阴影" desc="由 4 个值组成：1.水平位置、2.垂直位置、3.模糊度、4.阴影颜色" />
  - <Describe name="background?: string" mean="格子背景色" desc="可继承 defaultStyle 背景色，默认为 '#fff'" />

  - <Describe name="fonts?: Array<object>" mean="文字列表" />
    - <Describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="书写格式为：20 | '20px' | '20%'，默认为 0" />
    - <Describe name="fontColor?: string" mean="字体颜色" />
    - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体样式，默认为 '18px'" />
    - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
    - <Describe name="lineHeight?: string" mean="字体行高" desc="默认使用字体样式中的字体大小" />

  - <Describe name="imgs?: Array<object>" mean="图片列表" />
    - <Describe name="src: string" mean="图片路径" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <Describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <Describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />

1.宽高都未设置：则使用图片原大小；2.有宽度无高度：则高度随着宽度等比缩放；3.有高度无宽度：则宽度随着高度等比缩放；4.既有宽度也有高度：则图片宽高均等于设置的值（会被拉伸）

<Exhibition>
  <template v-slot:header>
    prizes - 示例1：配置简单格子
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      rows="2"
      cols="2"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        {
          x: 0, y: 0,
          fonts: [{ text: '0号\n格子', fontSize: '24px', top: 0 }],
        },
        {
          x: 1, y: 0,
          fonts: [{ text: '1号\n格子', fontSize: '24px', top: '100%' }],
        },
        {
          x: 0, y: 1,
          borderRadius: Infinity,
          background: 'pink',
          fonts: [{ text: '2号\n格子', fontSize: '24px', top: '20%' }],
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
  rows="2"
  cols="2"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    {
      x: 0, y: 0,
      fonts: [{ text: '0号\n格子', fontSize: '24px', top: 0 }],
    },
    {
      x: 1, y: 0,
      fonts: [{ text: '1号\n格子', fontSize: '24px', top: '100%' }],
    },
    {
      x: 0, y: 1,
      borderRadius: Infinity,
      background: 'pink',
      fonts: [{ text: '2号\n格子', fontSize: '24px', top: '20%' }],
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
      rows="2"
      cols="2"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        {
          x: 0, y: 0,
          fonts: [{ text: '0号格子', top: '70%' }],
          imgs: [{ src: $withBase('/img/1.png'), width: '50%', top: '10%' }]
        },
        {
          x: 1, y: 0,
          fonts: [{ text: '1号格子', top: '5%' }],
          imgs: [{ src: $withBase('/img/1.png'), top: '20%' }]
        },
        {
          x: 0, y: 1,
          fonts: [{ text: '2号格子', top: '70%' }],
          imgs: [{ src: $withBase('/img/1.png'), width: '100%', height: '50%', top: 0 }]
        },
      ]"
    />
  </template>
  <template v-slot:text>
    <li>在<code>imgs</code>数组里配置，跟文字一样也是默认居中并可以引入多个</li>
    <li><code>width</code>和<code>height</code>属性可以设置：50 | '50px' | '50%'</li>
    <li>由于1号格子的图片没有设置宽或高，则会渲染图片的实际大小</li>
    <li>建议只设置<code>width</code>或<code>height</code>，这样可以实现等比缩放，不然会像2号格子那样导致图片被拉伸</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  rows="2"
  cols="2"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    {
      x: 0, y: 0,
      fonts: [{ text: '0号格子', top: '70%' }],
      imgs: [{ src: require('/img/1.png'), width: '50%', top: '10%' }]
    },
    {
      x: 1, y: 0,
      fonts: [{ text: '1号格子', top: '5%' }],
      imgs: [{ src: require('/img/1.png'), top: '20%' }]
    },
    {
      x: 0, y: 1,
      fonts: [{ text: '2号格子', top: '70%' }],
      imgs: [{ src: require('/img/1.png'), width: '100%', height: '50%', top: 0 }]
    },
  ]"
/>
```

<Exhibition>
  <template v-slot:header>
    prizes - 示例3：使用 col 和 row 合并格子
  </template>
  <template v-slot:code>
    <!-- 左边3宫格 -->
    <LuckyGrid
      style="width: 200px; height: 200px; float: left"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        { x: 0, y: 0, col: 3 },
        { x: 1, y: 1, col: 2, row: 2 },
        { x: 0, y: 1, row: 2 }
      ]"
    />
    <!-- 右边4宫格 -->
    <LuckyGrid
      style="width: 200px; height: 200px; float: left; margin-left: 10px"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        { x: 0, y: 0, col: 2 },
        { x: 2, y: 0, row: 2 },
        { x: 1, y: 2, col: 2 },
        { x: 0, y: 1, row: 2 }
      ]"
    />
  </template>
  <template v-slot:text>
    <li>默认情况下<code>col</code>和<code>row</code>都等于1</li>
    <li>通过改变格子的<code>col</code>或<code>row</code>可以实现合并单元格的效果，但是你得提前计算好格子的坐标，以免两个格子互相压到</li>
  </template>
</Exhibition>

```vue
<!-- 左边3宫格 -->
<LuckyGrid
  style="width: 200px; height: 200px; float: left"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    { x: 0, y: 0, col: 3 },
    { x: 1, y: 1, col: 2, row: 2 },
    { x: 0, y: 1, row: 2 }
  ]"
/>
<!-- 右边4宫格 -->
<LuckyGrid
  style="width: 200px; height: 200px; float: left; margin-left: 10px"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    { x: 0, y: 0, col: 2 },
    { x: 2, y: 0, row: 2 },
    { x: 1, y: 2, col: 2 },
    { x: 0, y: 1, row: 2 }
  ]"
/>
```

<br />

## 抽奖按钮 - button

> 实际上`奖品格子`的属性与`按钮格子`的属性相差无几，但是有个区别：1.奖品有很多个所以是数组，而抽奖按钮只有一个所以是对象；

- <Describe name="button?: object" mean="抽奖按钮" />
  - <Describe name="x: number" mean="相对坐标x" desc="如果是标准的 3*3 宫格，那 x 的范围是 0 ~ 2" :isRequire="true" />
  - <Describe name="y: number" mean="相对坐标y" desc="如果是标准的 3*3 宫格，那 y 的范围是 0 ~ 2" :isRequire="true" />
  - <Describe name="col?: number" mean="横向合并格子" desc="用来横向合并单元格，默认为 1" />
  - <Describe name="row?: number" mean="纵向合并格子" desc="用来纵向合并单元格，默认为 1" />
  - <Describe name="borderRadius?: number" mean="格子圆角" desc="可继承 defaultStyle 圆角，默认为 20" />
  - <Describe name="shadow?: string" mean="格子阴影" desc="由 4 个值组成：1.水平位置、2.垂直位置、3.模糊度、4.阴影颜色" />
  - <Describe name="background?: string" mean="格子背景色" desc="可继承 defaultStyle 背景色，默认为 '#fff'" />

  - <Describe name="fonts?: Array<object>" mean="文字列表" />
    - <Describe name="text: string" mean="字体内容" desc="可以使用 \n 用来换行" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="书写格式为：20 | '20px' | '20%'，默认为 0" />
    - <Describe name="fontColor?: string" mean="字体颜色" />
    - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体样式，默认为 '18px'" />
    - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
    - <Describe name="lineHeight?: string" mean="字体行高" desc="默认等于字体大小" />

  - <Describe name="imgs?: Array<object>" mean="图片列表" />
    - <Describe name="src: string" mean="图片路径" :isRequire="true" />
    - <Describe name="top?: string" mean="距离顶部的高度" desc="可以写 20px 也可以是 20%，默认为 0" />
    - <Describe name="width?: string" mean="图片宽度" desc="关于图片宽高有四种可能" />
    - <Describe name="height?: string" mean="图片高度" desc="关于图片宽高有四种可能" />

1.宽高都未设置：则使用图片原大小；2.有宽度无高度：则高度随着宽度等比缩放；3.有高度无宽度：则宽度随着高度等比缩放；4.既有宽度也有高度：则图片宽高均等于设置的值（会被拉伸）

<Exhibition>
  <template v-slot:header>
    button - 示例1：绘制抽奖按钮
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      :demo="true"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        {
          x: 0, y: 0, col: 2,
          fonts: [{ text: '一年的好运', top: '20px' }]
        },
        {
          x: 2, y: 0, row: 2,
          fonts: [{ text: '升\n职\n加\n薪', lineHeight: '18px', top: '25px' }]
        },
        {
          x: 1, y: 2, col: 2,
          fonts: [{ text: '今年无bug', top: '20px' }]
        },
        {
          x: 0, y: 1, row: 2,
          fonts: [{ text: '转\n角\n遇\n到\n爱', lineHeight: '18px', top: '12px' }]
        }
      ]"
      :button="{
        x: 1, y: 1, borderRadius: 10,
        imgs: [{ src: $withBase('/img/button.png'), width: '75%', top: '20%' }]
      }"
    />
  </template>
  <template v-slot:text>
    <li>别点了，没用的</li>
    <li>点击抽奖按钮会触发<code>@start</code>回调函数，这样设计是为了方便你在里面请求接口，或执行一些其他抽奖前的逻辑</li>
    <li>所以目前为止还不能进行抽奖，这里也仅仅只是为了展示按钮如何配置</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    {
      x: 0, y: 0, col: 2,
      fonts: [{ text: '一年的好运', top: '20px' }]
    },
    {
      x: 2, y: 0, row: 2,
      fonts: [{ text: '升\n职\n加\n薪', lineHeight: '18px', top: '25px' }]
    },
    {
      x: 1, y: 2, col: 2,
      fonts: [{ text: '今年无bug', top: '20px' }]
    },
    {
      x: 0, y: 1, row: 2,
      fonts: [{ text: '转\n角\n遇\n到\n爱', lineHeight: '18px', top: '12px' }]
    }
  ]"
  :button="{
    x: 1, y: 1, borderRadius: 10,
    imgs: [{ src: require('/img/button.png'), width: '75%', top: '20%' }]
  }"
/>
```

<br />

## 默认样式 - defaultStyle

> 如果你觉得写一堆重复的数据很烦的话，那你可以在这里进行统一的管理，其中包括`奖品`和`抽奖按钮`，在没有配置的情况下都会继承这里的属性

- <Describe name="defaultStyle?: object" mean="格子默认样式" />
  - <Describe name="gutter?: number" mean="格子之间的间距" desc="默认等于 5" />
  - <Describe name="borderRadius?: string | number" mean="格子圆角" desc="默认等于 20" />
  - <Describe name="fontColor?: string" mean="字体颜色" />
  - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体样式，默认为 '18px'" />
  - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
  - <Describe name="textAlign?: string" mean="文字和图片的对其方式" desc="目前只能居中!" />
  - <Describe name="background?: string" mean="格子的背景颜色" desc="默认是 '#fff' 白色" />
  - <Describe name="shadow?: string" mean="格子阴影" desc="由 4 个值组成：1.水平位置、2.垂直位置、3.模糊度、4.阴影颜色" />

<Exhibition>
  <template v-slot:header>
    defaultStyle - 示例1：配置默认样式
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      rows="2"
      cols="2"
      :demo="true"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        { x: 0, y: 0, fonts: [{ text: '0元', top: '35%' }] },
        { x: 1, y: 0, fonts: [{ text: '1元', top: '35%' }] },
        { x: 0, y: 1, fonts: [{ text: '2元', top: '35%' }] }
      ]"
      :button="{ x: 1, y: 1, fonts: [{ text: '抽奖', top: '35%' }] }"
      :defaultStyle="{
        gutter: 20,
        borderRadius: 8,
        fontColor: '#DF424B',
        fontSize: '22px',
        fontStyle: 'sans-serif',
        textAlign: 'center',
        background: 'pink',
        shadow: '0 5 1 #ebf1f4'
      }"
    />
  </template>
  <template v-slot:text>
    <li><code>gutter</code>只是格子之间的间距，不会叠加边框的<code>padding</code></li>
    <li><code>shadow</code>阴影会挤占格子本身的宽度或高度</li>
    <li><code>textAlign</code>对其方式目前只支持 center</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  rows="2"
  cols="2"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    { x: 0, y: 0, fonts: [{ text: '0元', top: '35%' }] },
    { x: 1, y: 0, fonts: [{ text: '1元', top: '35%' }] },
    { x: 0, y: 1, fonts: [{ text: '2元', top: '35%' }] }
  ]"
  :button="{ x: 1, y: 1, fonts: [{ text: '抽奖', top: '35%' }] }"
  :defaultStyle="{
    gutter: 20,
    borderRadius: 8,
    fontColor: '#DF424B',
    fontSize: '22px',
    fontStyle: 'sans-serif',
    textAlign: 'center',
    background: 'pink',
    shadow: '0 5 1 #ebf1f4'
  }"
/>
```

<br />

## 中奖标记样式 - activeStyle

> 中奖标记目前可支持的属性较少

- <Describe name="activeStyle?: object" mean="中奖标记样式" />
  - <Describe name="fontColor?: string" mean="字体颜色" />
  - <Describe name="fontSize?: string" mean="字体大小(px)" desc="可继承 defaultStyle 字体样式，默认为 '18px'" />
  - <Describe name="fontStyle?: string" mean="字体样式" desc="可继承 defaultStyle 字体样式，默认为 'sans-serif'" />
  - <Describe name="background?: string" mean="格子的背景颜色" desc="默认是 '#ffce98' 橘黄色" />
  - <Describe name="shadow?: string" mean="格子阴影" desc="由 4 个值组成：1.水平位置、2.垂直位置、3.模糊度、4.阴影颜色" />

<Exhibition>
  <template v-slot:header>
    activeStyle - 示例1：配置中奖标记样式
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 200px; height: 200px"
      :demo="true"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        { x: 0, y: 0, fonts: [{ text: '1元', top: '35%' }] },
        { x: 0, y: 1, fonts: [{ text: '4元', top: '35%' }] },
        { x: 1, y: 1, fonts: [{ text: '3元', top: '35%' }] },
        { x: 1, y: 0, fonts: [{ text: '2元', top: '35%' }] }
      ]"
      :button="{ x: 2, y: 2, fonts: [{ text: '抽奖', top: '35%' }] }"
      :activeStyle="{
        fontColor: '#ff4a4c',
        background: 'pink',
        shadow: '0 5 1 #ebf1f4'
      }"
    />
  </template>
  <template v-slot:text>
    <li><code>activeStyle</code>配置的样式只有在中奖标记滑过时才会生效，如果没有开始抽奖，中奖标记则会默认停留在0号格子的位置</li>
    <li>中奖标记会以<code>index</code>升序的方式进行游走，所以<code>index</code>决定了九宫格该如何旋转</li>
    <li>这也就是为什么<code>button</code>没有<code>index</code>的原因</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 200px; height: 200px"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    { x: 0, y: 0, fonts: [{ text: '1元', top: '35%' }] },
    { x: 0, y: 1, fonts: [{ text: '4元', top: '35%' }] },
    { x: 1, y: 1, fonts: [{ text: '3元', top: '35%' }] },
    { x: 1, y: 0, fonts: [{ text: '2元', top: '35%' }] }
  ]"
  :button="{ x: 2, y: 2, fonts: [{ text: '抽奖', top: '35%' }] }"
  :activeStyle="{
    fontColor: '#ff4a4c',
    background: 'pink',
    shadow: '0 5 1 #ebf1f4'
  }"
/>
```

<br />

## 格子布局 - rows & cols

> 你可以把整个抽奖插件想象成一个`cols * rows`的 table 表格，默认情况下`cols`和`rows`都等于 3, 也就是`3 * 3 = 九宫格布局`

- <Describe name="rows?: string | number" mean="设置布局有几行" desc="默认为 3" />
- <Describe name="cols?: string | number" mean="设置布局有几列" desc="默认为 3" />

<Exhibition>
  <template v-slot:header>
    rows & cols - 示例1：如果我有十个奖品
  </template>
  <template v-slot:code>
    <LuckyGrid
      style="width: 265px; height: 200px"
      rows="3"
      cols="4"
      :demo="true"
      :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
      :prizes="[
        { x: 0, y: 0, fonts: [{ text: '0元', top: 20 }] },
        { x: 1, y: 0, fonts: [{ text: '1元', top: 20 }] },
        { x: 2, y: 0, fonts: [{ text: '2元', top: 20 }] },
        { x: 3, y: 0, fonts: [{ text: '3元', top: 20 }] },
        { x: 3, y: 1, fonts: [{ text: '4元', top: 20 }] },
        { x: 3, y: 2, fonts: [{ text: '5元', top: 20 }] },
        { x: 2, y: 2, fonts: [{ text: '6元', top: 20 }] },
        { x: 1, y: 2, fonts: [{ text: '7元', top: 20 }] },
        { x: 0, y: 2, fonts: [{ text: '8元', top: 20 }] },
        { x: 0, y: 1, fonts: [{ text: '9元', top: 20 }] }
      ]"
      :button="{ x: 1, y: 1, col: 2, fonts: [{ text: '抽奖按钮', top: 20 }] }"
    />
  </template>
  <template v-slot:text>
    <li>设置<code>rows=3, col=4</code>即三行四列，也就意味着奖品格子<code>x</code>的范围就是0~3，<code>y</code>的范围就是0~2</li>
    <li>然后我通过计算<code>padding</code>和<code>gutter</code>使得奖品格子变成我想要的正方形</li>
    <li>最后设置抽奖按钮<code>col=2</code>使其占两个格子，但是需要注意的是<code>index</code>的排列顺序, 决定了中奖标识的游走顺序</li>
  </template>
</Exhibition>

```vue
<LuckyGrid
  style="width: 265px; height: 200px"
  rows="3"
  cols="4"
  :blocks="[{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }]"
  :prizes="[
    { x: 0, y: 0, fonts: [{ text: '0元', top: 20 }] },
    { x: 1, y: 0, fonts: [{ text: '1元', top: 20 }] },
    { x: 2, y: 0, fonts: [{ text: '2元', top: 20 }] },
    { x: 3, y: 0, fonts: [{ text: '3元', top: 20 }] },
    { x: 3, y: 1, fonts: [{ text: '4元', top: 20 }] },
    { x: 3, y: 2, fonts: [{ text: '5元', top: 20 }] },
    { x: 2, y: 2, fonts: [{ text: '6元', top: 20 }] },
    { x: 1, y: 2, fonts: [{ text: '7元', top: 20 }] },
    { x: 0, y: 2, fonts: [{ text: '8元', top: 20 }] },
    { x: 0, y: 1, fonts: [{ text: '9元', top: 20 }] }
  ]"
  :button="{ x: 1, y: 1, col: 2, fonts: [{ text: '抽奖按钮', top: 20 }] }"
/>
```

<br />

## 回调 & 方法

- <Describe name="strat?: Function" mean="开始抽奖前" desc="当点击抽奖按钮时，触发该回调" />
- <Describe name="end?: Function" mean="抽奖结束后" desc="当九宫格完全停止时，触发该回调" />
- <Describe name="play()" mean="开始抽奖" desc="调用该方法时，游戏才会开始, 没有参数" />
- <Describe name="stop(index)" mean="缓慢停止抽奖" desc="调用该方法时，才会缓慢停止, 参数是中奖的索引" />

<Exhibition>
  <template v-slot:header>
    点击按钮开始抽奖
  </template>
  <template v-slot:code>
    <demo-ldq-grid />
  </template>
  <template v-slot:text>
    <p>正常的流程是：</p>
    <p>1. 当你点击抽奖按钮时触发<code>strat</code>回调函数，接下来你可以调用<code>play()</code>方法先让九宫格转起来，然后紧接着去请求接口拿数据，或是你自己随机一个index</p>
    <p>2. 当接口拿到<code>index</code>中奖索引之后，你就可以调用<code>stop(index)</code>方法了，此时九宫格会缓慢停止，当完全停止之后就会触发end回调函数</p>
    <p>3. 最后在<code>end</code>回调函数里面，得到中奖奖品的全部信息，你就可以在这里执行逻辑告诉用户他中奖了</p>
  </template>
</Exhibition>

```vue
<template>
  <LuckyGrid
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
