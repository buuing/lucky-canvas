<template>
  <LuckyWheel
    style="width: 310px; height: 310px"
    ref="LuckyWheel"
    :defaultStyle="{
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
import LuckyWheel from '../src/LuckyWheel.vue'
export default {
  components: { LuckyWheel },
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
