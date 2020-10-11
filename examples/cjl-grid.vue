<template>
  <LuckyGrid
    style="width: 310px; height: 300px"
    ref="LuckDraw"
    :blocks="[
      { padding: '15px', background: '#4f73db', borderRadius: '10px' },
      { padding: '5px', background: '#5f3173', borderRadius: '8px' },
    ]"
    :button="{
      x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
      imgs: [
        { src: require('./img/cjl/btn.png'), width: '100%', height: '100%' }
      ]
    }"
    :prizes="prizes"
    :default-style="{
      background: '#fff3f3',
      borderRadius: '6px',
      fontColor: '#ff3e78',
      fontSize: '12px',
      shadow: '0 6 0 #ffcacb'
    }"
    :activeStyle="{
      background: '#ffb868',
      fontColor: '#ffefd6',
    }"
    @start="startCallBack"
    @end="endCallBack"
  />
</template>

<script>
import LuckyGrid from '../src/LuckyGrid.vue'
export default {
  components: { LuckyGrid },
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
      let data = [
        { name: '谢谢参与', img: require('./img/cjl/00.png'), color: '#d7d7d7' },
        { name: '礼物', img: require('./img/cjl/01.png'), color: '#fef43e' },
        { name: '抽奖券', img: require('./img/cjl/02.png'), color: '#ef7683' },
        { name: '元宝', img: require('./img/cjl/04.png'), color: '#fef43e' },
        { name: '抽奖券', img: require('./img/cjl/02.png'), color: '#ef7683' },
        { name: '元宝', img: require('./img/cjl/06.png'), color: '#d7d7d7' },
        { name: '抽奖券', img: require('./img/cjl/02.png'), color: '#fef43e' },
        { name: '元宝', img: require('./img/cjl/03.png'), color: '#d7d7d7' },
      ]
      data.forEach((item, index) => {
        this.prizes.push({
          x: axis[index][0], y: axis[index][1],
          title: item.name,
          fonts: [{ text: item.name, top: '65%' }],
          imgs: [{ src: item.img, width: '45%', top: '20%' }]
        })
      })
      this.prizes[0].imgs[0].width = '40%'
      this.prizes[1].imgs[0].width = '35%'
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
