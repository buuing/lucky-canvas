<template>
  <p style="margin: 5px 0">
    <code :class="{
      'weight': true, 'require': isRequire
    }" v-if="name" v-text="name"></code>
    <strong v-if="type" v-text="`{ ${type} }`"></strong>
    <span v-if="mean" v-html="mean"></span>
    <i v-if="desc" v-html="`（${desc}）`" style="margin-left: -5px; color: #c5c5c5"></i>
  </p>
</template>

<script>
export default {
  props: {
    name: String,
    isRequire: {
      type: Boolean,
      default: false
    },
    type: String,
    mean: String,
    desc: String
  }
}
</script>

<style scoped>
  .weight {
    font-weight: 700;
    background: #eee;
  }
  .require {
    background: #fff0f0;
    color: #ed4014;
  }
</style>