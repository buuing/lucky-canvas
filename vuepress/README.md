
<grid
  style="width: 400px; height: 400px"
  ref="LuckDraw"
  :prizes="[
    {
      index: 0, x: 0, y: 0,
      font: [{ text: '1元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/0.png'), width: '50%', top: '10%' }]
    },
    {
      index: 1, x: 1, y: 0,
      font: [{ text: '100元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/1.png'), width: '50%', top: '10%' }]
    },
    {
      index: 2, x: 2, y: 0,
      font: [{ text: '0.5元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/2.png'), width: '50%', top: '10%' }]
    },
    {
      index: 3, x: 2, y: 1,
      font: [{ text: '2元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/3.png'), width: '50%', top: '10%' }]
    },
    {
      index: 4, x: 2, y: 2,
      font: [{ text: '10元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/4.png'), width: '50%', top: '10%' }]
    },
    {
      index: 5, x: 1, y: 2,
      font: [{ text: '50元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/5.png'), width: '50%', top: '10%' }]
    },
    {
      index: 6, x: 0, y: 2,
      font: [{ text: '0.3元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/6.png'), width: '50%', top: '10%' }]
    },
    {
      index: 7, x: 0, y: 1,
      font: [{ text: '5元现金红包', top: '85%' }],
      imgs: [{ src: $withBase('/img/7.png'), width: '50%', top: '10%' }]
    },
  ]"
  :button="{
    x: 1,
    y: 1,
    background: 'linear-gradient(to bottom, #FFDCB8, #FDC689)',
    shadow: '0 5 1 #e89b4f',
    imgs: [
      { src: $withBase('/img/button.png'), width: '70%', top: '18%' }
    ]
  }"
  :blocks="[
    { padding: '15px', background: '#ffc27a', radius: 28 },
    { padding: '4px', background: '#ff4a4c', radius: 25 },
    { padding: '4px', background: '#ff625b', radius: 25 },
  ]"
  :defaultStyle="{
    gutter: 5,
    radius: 15,
    fontColor: '#DF424B',
    fontStyle: '14px sans-serif',
    textAlign: 'center',
    background: '#fff',
    shadow: '0 5 1 #ebf1f4'
  }"
  :activeStyle="{
    background: 'linear-gradient(to bottom, #FFDCB8, #FDC689)',
    shadow: ''
  }"
/>

```vue
<template>
  <LuckyGrid
    class="luck-box"
    ref="LuckDraw"
    :prizes="prizes"
    :button="btnConfig"
    :blocks="[
      { padding: '15px', background: '#ffc27a', radius: 28 },
      { padding: '4px', background: '#ff4a4c', radius: 25 },
      { padding: '4px', background: '#ff625b', radius: 25 },
    ]"
    :defaultStyle="{
      gutter: 5,
      radius: 15,
      fontColor: '#DF424B',
      fontStyle: '14px sans-serif',
      textAlign: 'center',
      background: '#fff',
      shadow: '0 5 1 #ebf1f4'
    }"
    :activeStyle="{
      background: 'linear-gradient(to bottom, #FFDCB8, #FDC689)',
      shadow: ''
    }"
    @start="startCallBack"
    @end="endCallBack"
  />
</template>

<script>
export default {
  data () {
    return {
      luckyNum: 1,
      prizes: [
        {
          index: 0, x: 0, y: 0,
          font: [{ text: '1元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/0.png'), width: '50%', top: '10%' }]
        },
        {
          index: 1, x: 1, y: 0,
          font: [{ text: '100元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/1.png'), width: '50%', top: '10%' }]
        },
        {
          index: 2, x: 2, y: 0,
          font: [{ text: '0.5元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/2.png'), width: '50%', top: '10%' }]
        },
        {
          index: 3, x: 2, y: 1,
          font: [{ text: '2元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/3.png'), width: '50%', top: '10%' }]
        },
        {
          index: 4, x: 2, y: 2,
          font: [{ text: '10元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/4.png'), width: '50%', top: '10%' }]
        },
        {
          index: 5, x: 1, y: 2,
          font: [{ text: '50元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/5.png'), width: '50%', top: '10%' }]
        },
        {
          index: 6, x: 0, y: 2,
          font: [{ text: '0.3元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/6.png'), width: '50%', top: '10%' }]
        },
        {
          index: 7, x: 0, y: 1,
          font: [{ text: '5元现金红包', top: '85%' }],
          imgs: [{ src: require('./img/7.png'), width: '50%', top: '10%' }]
        },
      ],
    }
  },
  computed: {
    btnConfig () {
      return {
        x: 1,
        y: 1,
        background: 'linear-gradient(to bottom, #FFDCB8, #FDC689)',
        shadow: '0 5 1 #e89b4f',
        font: [{ text: `${this.luckyNum} 次`, color: '#fff', top: '86%', style: '12px sans-serif' }],
        imgs: [
          { src: require('./img/button.png'), width: '65%', top: '13%' },
          { src: require('./img/btn.png'), width: '50%', top: '73%' }
        ]
      }
    }
  },
  methods: {
    startCallBack () {
      if (!this.luckyNum) return alert('还剩0次抽奖机会')
      this.$refs.LuckDraw.play()
      setTimeout(() => {
        this.$refs.LuckDraw.stop(Math.random() * 7 >> 0)
      }, 2000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得大奖: ${prize.font[0].text}`)
      this.luckyNum--
    }
  }
}
</script>

<style>
  .luck-box {
    width: 400px;
    height: 400px;
  }
</style>
```