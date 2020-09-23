
<Empty />
<Demo />

### 演示 Demo - 点击可抽奖

<div class="ldq-card">
  <demo-ymc-wheel />
</div>

```vue
<template>
  <LuckyWheel
    style="width: 300px; height: 300px"
    ref="LuckyWheel"
    :default-style="{
      fontColor: '#d64737',
      fontSize: '14px'
    }"
    :blocks="[
      { padding: '13px', background: '#d64737' }
    ]"
    :buttons="[
      { radius: '50px', background: '#d64737' },
      { radius: '45px', background: '#fff' },
      { radius: '41px', background: '#f6c66f', pointer: true },
      {
        radius: '35px', background: '#ffdea0',
        imgs: [{ src: require('./img/button.png'), width: '65%', top: '-13%' }]
      }
    ]"
    :prizes="[
      {
        background: '#f8d384',
        fonts: [{ text: '1元红包', top: '8%' }],
        imgs:[{ src: require('./img/0.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f9e3bb',
        fonts: [{ text: '100元红包', top: '8%' }],
        imgs:[{ src: require('./img/1.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f8d384',
        fonts: [{ text: '0.5元红包', top: '8%' }],
        imgs:[{ src: require('./img/2.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f9e3bb',
        fonts: [{ text: '2元红包', top: '8%' }],
        imgs:[{ src: require('./img/3.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f8d384',
        fonts: [{ text: '10元红包', top: '8%' }],
        imgs:[{ src: require('./img/4.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f9e3bb',
        fonts: [{ text: '50元红包', top: '8%' }],
        imgs:[{ src: require('./img/5.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f8d384',
        fonts: [{ text: '0.3元红包', top: '8%' }],
        imgs:[{ src: require('./img/6.png'), width: '30%', top: '25%' }],
      },
      {
        background: '#f9e3bb',
        fonts: [{ text: '5元红包', top: '8%' }],
        imgs:[{ src: require('./img/7.png'), width: '30%', top: '25%' }],
      },
    ]"
    @start="startCallBack"
    @end="endCallBack"
  ></LuckyWheel>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    startCallBack () {
      this.$refs.LuckyWheel.play()
      setTimeout(() => {
        this.$refs.LuckyWheel.stop(Math.random() * 8 >> 0)
      }, 3000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得${prize.fonts[0].text}`)
    },
  }
}
</script>
```

<div class="ldq-card">
  <demo-yyjk-grid />
</div>

```vue
<template>
  <LuckyGrid
    style="width: 300px; height: 300px"
    ref="LuckDraw"
    :prizes="prizes"
    :button="btnConfig"
    :blocks="[
      { padding: '15px', background: '#ffc27a', borderRadius: 28 },
      { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
      { padding: '4px', background: '#ff625b', borderRadius: 20 },
    ]"
    :default-style="{
      gutter: 5,
      borderRadius: 15,
      fontColor: '#DF424B',
      fontSize: '14px',
      textAlign: 'center',
      background: '#fff',
      shadow: '0 5 1 #ebf1f4'
    }"
    :activeStyle="{
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
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
      luckyNum: 0,
      prizes: [],
    }
  },
  computed: {
    btnConfig () {
      return {
        x: 1,
        y: 1,
        background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
        shadow: '0 5 1 #e89b4f',
        fonts: [
          { text: `${this.luckyNum} 次`, fontColor: '#fff', top: '70%', fontSize: '12px' },
        ],
        imgs: [
          { src: require('./img/button.png'), width: '65%', top: '13%' },
          { src: require('./img/btn.png'), width: '50%', top: '73%' }
        ]
      }
    }
  },
  mounted () {
    this.getPrizeList()
  },
  methods: {
    getPrizeList () {
      // 模拟接口请求奖品列表
      setTimeout(() => {
        const data = [
          { name: '1元红包', img: require('./img/0.png') },
          { name: '100元红包', img: require('./img/1.png') },
          { name: '0.5元红包', img: require('./img/2.png') },
          { name: '2元红包', img: require('./img/3.png') },
          { name: '10元红包', img: require('./img/4.png') },
          { name: '50元红包', img: require('./img/5.png') },
          { name: '0.3元红包', img: require('./img/6.png') },
          { name: '5元红包', img: require('./img/7.png') }
        ]
        this.prizes = []
        this.luckyNum = 1
        let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
        for (let i = 0; i < 8; i++) {
          let item = data[i]
          this.prizes.push({
            index: i, x: axis[i][0], y: axis[i][1],
            fonts: [{ text: item.name, top: '72%' }],
            imgs: [{ src: item.img, width: '55%', top: '10%' }]
          })
        }
      }, 0)
    },
    startCallBack () {
      if (!this.luckyNum) return alert('还剩0次抽奖机会')
      this.$refs.LuckDraw.play()
      setTimeout(() => {
        this.$refs.LuckDraw.stop(Math.random() * 7 >> 0)
      }, 2000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得大奖: ${prize.fonts[0].text}`)
      this.luckyNum--
    }
  }
}
</script>
```


<div class="ldq-card">
  <demo-yx-grid />
</div>

```vue
<template>
  <LuckyGrid
    style="width: 350px; height: 370px"
    ref="LuckDraw"
    :blocks="[
      { padding: '1px', background: '#e2cea3', borderRadius: '13px' },
      { padding: '5px 0px', background: '#f3ecdc', borderRadius: '13px' },
      { padding: '1px', background: '#e2cea3', borderRadius: '8px' },
      { padding: '20px 15px', background: '#fffcf5', borderRadius: '8px' },
    ]"
    :button="{
      x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
      imgs: [
        { src: require('./img/yx/btn.png'), width: '90%', top: '7%' }
      ]
    }"
    :prizes="prizes"
    :default-style="{
      background: '#ffefd6',
      borderRadius: '5px',
      fontColor: '#755c28',
      fontSize: '10px',
      lineHeight: '12px'
    }"
    :activeStyle="{
      background: '#de7247',
      fontColor: '#ffefd6',
    }"
    @start="startCallBack"
    @end="endCallBack"
  />
</template>

<script>
export default {
  name: '',
  data () {
    return {
      prizes: []
    }
  },
  mounted () {
    this.getPrizesList()
  },
  methods: {
    getPrizesList () {
      this.prizes = []
      let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
      let data = ['电热烘干毛巾架', '10元满减红包', '2积分', '胖喵焖烧罐', '5元满减红包', '多层置物架', '3元直减红包', '全场满99减10']
      axis.forEach((item, index) => {
        this.prizes.push({
          x: item[0], y: item[1],
          title: data[index],
          imgs: [{
            width: '100%',
            height: '100%',
            src: require(`./img/yx/default-${index}.png`),
            activeSrc: require(`./img/yx/active-${index}.png`)
          }]
        })
      })
    },
    startCallBack () {
      this.$refs.LuckDraw.play()
      setTimeout(() => {
        this.$refs.LuckDraw.stop(Math.random() * 7 >> 0)
      }, 2000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得大奖: ${prize.title}`)
    }
  }
}
</script>
```


