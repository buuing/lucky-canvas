<template>
  <LuckyGrid v-bind="$attrs" />
</template>

<script>
// 继承src下面的九宫格组件
import LuckyGrid from '../../../src/LuckyGrid.vue'
export default {
  components: { LuckyGrid }
}
</script>
