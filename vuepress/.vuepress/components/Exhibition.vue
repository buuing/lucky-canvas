<template>
  <div class="box" ref="box">
    <div class="box-header">
      <slot name="header" />
    </div>
    <div class="box-code">
      <slot name="code" />
    </div>
    <div class="box-line"></div>
    <div class="box-text">
      <slot name="text" />
    </div>
    <div ref="footer" class="box-footer"></div>
  </div>
</template>

<script>
export default {
  mounted () {
    let prev = null
    Array.from(this.$refs.box.parentNode.children).some(node => {
      if (prev === this.$refs.box) {
        this.$refs.footer.appendChild(node)
        node.style.borderRadius = 0
        node.children[0].style.margin = 0
        return true
      }
      prev = node
      return false
    })
  }
}
</script>

<style scoped>
  .box {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: hidden;
    margin: 40px 0;
  }
  .box-code {
    padding: 15px;
    border-right: 1px solid #ebebeb;
  }
  .box-text {
    flex: 1;
    padding: 15px 15px;
    line-height: 24px;
    font-weight: 600;
  }
  .box-text li {
    margin: 10px 0 10px 0;
  }
  .box-text li:first-child {
    margin-top: 0;
  }
  .box-text li:last-child {
    margin-bottom: 0;
  }
  .box-header {
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #ebebeb;
    font-size: 18px;
    font-weight: 700;
  }
  .box-footer {
    width: 100%;
  }
</style>
