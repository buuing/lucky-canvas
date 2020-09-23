<template>
  <LuckyGrid
    style="width: 310px; height: 330px"
    ref="LuckDraw"
    :blocks="[
      { padding: '1px', background: '#e2cea3', borderRadius: '13px' },
      { padding: '5px 0px', background: '#f3ecdc', borderRadius: '13px' },
      { padding: '1px', background: '#e2cea3', borderRadius: '8px' },
      { padding: '15px 10px', background: '#fffcf5', borderRadius: '8px' },
    ]"
    :button="{
      x: 1, y: 1, background: 'rgba(0, 0, 0, 0)',
      imgs: [
        { src: require('./img/yx/btn.png'), width: '90%', top: '5%' }
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
