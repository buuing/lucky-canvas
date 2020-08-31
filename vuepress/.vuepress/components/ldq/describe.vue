<template>
  <p style="margin: 10px 0">
    <code v-if="name" v-text="name"></code><i v-if="isRequire" style="color: red; margin-right: 5px">*</i>
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

<style>

</style>