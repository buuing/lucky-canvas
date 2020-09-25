<template>
  <LuckyWheel
    style="width: 310px; height: 310px"
    ref="LuckyWheel"
    :default-style="{
      fontColor: '#d64737',
      fontSize: '14px'
    }"
    :blocks="[
      { padding: '13px', background: '#d64737' }
    ]"
    :prizes="prizes"
    :buttons="[
      { radius: '50px', background: '#d64737' },
      { radius: '45px', background: '#fff' },
      { radius: '41px', background: '#f6c66f', pointer: true },
      {
        radius: '35px', background: '#ffdea0',
        imgs: [{ src: require('./img/button.png'), width: '65%', top: '-13%' }]
      }
    ]"
    @start="startCallBack"
    @end="endCallBack"
  />
</template>

<script>
import LuckyWheel from '../src/LuckyWheel.vue'
export default {
  components: { LuckyWheel },
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
      let data = ['1元红包', '100元红包', '0.5元红包', '2元红包', '10元红包', '50元红包', '0.3元红包', '5元红包']
      data.forEach((item, index) => {
        this.prizes.push({
          title: item,
          background: index % 2 ? '#f9e3bb' : '#f8d384',
          fonts: [{ text: item, top: '8%' }],
          imgs:[{ src: require(`./img/${index}.png`), width: '30%', top: '25%' }],
        })
      })
    },
    startCallBack () {
      this.$refs.LuckyWheel.play()
      setTimeout(() => {
        this.$refs.LuckyWheel.stop(Math.random() * 8 >> 0)
      }, 3000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得${prize.title}`)
    },
  }
}
</script>
