<template>
  <div></div>
</template>

<script>
export default {
  mounted () {
    Array.from(document.querySelectorAll('.ldq-mask')).forEach(item => {
      document.body.removeChild(item)
    })
    this.codeArr = Array.from(document.querySelectorAll('.extra-class'))
    this.codeArr.forEach((item, index) => {
      const mask = document.createElement('div')
      mask.className = 'ldq-mask'
      mask.addEventListener('click', e => {
        mask.style.display = 'none'
        document.documentElement.style.overflowY = 'scroll'
      })
      mask.append(item)
      item.addEventListener('click', e => {
        e.stopPropagation()
      }, false)
      document.body.append(mask)
    })
    const div = document.createElement('div')
    div.className = 'ldq-box'
    Array.from(document.querySelectorAll('.ldq-card')).forEach((dom, index) => {
      const btn = document.createElement('div')
      btn.className = 'ldq-btn'
      btn.innerHTML = '查看代码'
      btn.addEventListener('click', e => {
        this.showDialog(index)
      })
      dom.append(btn)
      div.append(dom)
    })
    document.querySelector('.content__default').append(div)
  },
  methods: {
    showDialog (index) {
      const mask = Array.from(document.querySelectorAll('.ldq-mask'))[index]
      mask.style.display = 'block'
      // const content = document.createElement('div')
      // content.className = 'mask-content'
      // mask.append(content)
      // const codeDiv = this.codeArr[index]
      // codeDiv.style.display = 'block'
      // content.append(codeDiv)
      document.documentElement.style.overflowY = 'hidden'
    }
  }
}
</script>

<style>
  .ldq-box {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .ldq-card {
    border-radius: 6px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    padding: 20px;
    margin-top: 20px;
    text-align: center;
    overflow: hidden;
  }
  .ldq-btn {
    margin-top: 20px;
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    cursor: pointer;
    padding: 7px 15px;
    font-size: 14px;
    border-radius: 4px;
  }
  .ldq-mask {
    background: rgba(0,0,0,0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    margin: 0 !important;
    display: none;
  }
  .ldq-mask .extra-class::-webkit-scrollbar {
    width: 0px;
  }
  .ldq-mask .extra-class {
    width: 80%;
    height: 70%;
    overflow: auto;
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
