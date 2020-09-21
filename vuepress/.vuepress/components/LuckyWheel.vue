<template>
  <LuckyWheel v-bind="$attrs" />
</template>

<script>
// 继承src下面的九宫格组件
import LuckyWheel from '../../../src/LuckyWheel.vue'
export default {
  components: { LuckyWheel }
}
</script>
