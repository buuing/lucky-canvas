<template>
  <view>
    <LuckyWheel
      ref="luckyWheel"
      :blocks="wheel.blocks"
      :prizes="wheel.prizes"
      :buttons="wheel.buttons"
      :defaultConfig="wheel.defaultConfig"
      @start="wheelStart"
      @end="wheelEnd"
    />
    <LuckyGrid
      ref="luckyGrid"
      :rows="grid.rows"
      :cols="grid.cols"
      :blocks="grid.blocks"
      :prizes="grid.prizes"
      :button="grid.button"
      @start="gridStart"
      @end="gridEnd"
    />
  </view>
</template>

<script>
  import LuckyWheel from './lucky-wheel.vue'
  import LuckyGrid from './lucky-grid.vue'
  export default {
    components: {
      LuckyWheel, LuckyGrid
    },
    data () {
      return {
        wheel: {
          blocks: [{ padding: '10px', background: '#d64737' }],
          prizes: [
            { background: '#f8d384', fonts: [{ text: '0', top: 5 }] },
            { background: '#f9e3bb', fonts: [{ text: '1', top: 5 }] },
            { background: '#f8d384', fonts: [{ text: '2', top: 5 }] },
            { background: '#f9e3bb', fonts: [{ text: '3', top: 5 }] },
            { background: '#f8d384', fonts: [{ text: '4', top: 5 }] },
            { background: '#f9e3bb', fonts: [{ text: '5', top: 5 }] },
          ],
          buttons: [
            { radius: '35px', background: '#d64737' },
            { radius: '30px', background: '#f6c66f', pointer: true },
            { radius: '25px', background: '#ffdea0' }
          ],
          defaultConfig: {
            gutter: '5px',
            offsetDegree: 30
          }
        },
        grid: {
          rows: 3,
          cols: 4,
          blocks: [{ padding: '5px', background: '#ff4a4c', borderRadius: 10 }],
          prizes: [
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
          ],
          button: { x: 1, y: 1, col: 2, fonts: [{ text: '抽奖按钮', top: 20 }] },
        }
      }
    },
    methods: {
      wheelStart () {
        this.$refs.luckyWheel.play()
        setTimeout(() => {
          this.$refs.luckyWheel.stop(1)
        }, 3000)
      },
      wheelEnd (prize) {
        console.log(prize)
      },
      gridStart () {
        this.$refs.luckyGrid.play()
        setTimeout(() => {
          this.$refs.luckyGrid.stop(1)
        }, 3000)
      },
      gridEnd (prize) {
        console.log(prize)
      },
    }
  }
</script>

<style>
</style>
