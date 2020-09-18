<template>
  <LuckyWheel
    style="width: 300px; height: 500px"
    ref="LuckyWheel"
    :defaultStyle="{
      fontColor: '#d64737',
      fontSize: '20px'
    }"
    :blocks="[
      { padding: '15px', background: '#d64737' }
    ]"
    :buttons="[
      { radius: '30%', background: '#d64737' },
      { radius: '27%', background: '#fff' },
      { radius: '24%', background: '#f6c66f', pointer: true },
      { radius: '18%', background: '#ffdea0' }
    ]"
    :prizes="[
      { fonts: [{ text: '0.88元\n红包', top: '10%' }], background: '#f8d384' },
      { fonts: [{ text: '10元\n红包', top: '10%' }], background: '#f9e3bb' },
      { fonts: [{ text: '88元\n红包', top: '10%' }], background: '#f8d384' },
      { fonts: [{ text: '100元\n红包', top: '10%' }], background: '#f9e3bb' },
      { fonts: [{ text: '188元\n红包', top: '10%' }], background: '#f8d384' },
      { fonts: [{ text: '666元\n红包', top: '10%' }], background: '#f9e3bb' },
      { fonts: [{ text: '888元\n红包', top: '10%' }], background: '#f8d384' },
      { fonts: [{ text: '999元\n红包', top: '10%' }], background: '#f9e3bb' },
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
