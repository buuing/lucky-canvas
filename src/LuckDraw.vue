<template>
  <canvas id="canvas" class="ldq-luck"></canvas>  
</template>

<script>
export default {
  data () {
    return {
      canvas: '',
      ctx: '',
      startRadian: 0, // 初始角度
      canBeClick: true, // 控制抽奖进行中不让再抽奖
      currIndex: this.value,
    }
  },
  props: {
    value: { type: Number, default: 0 },                   // 中奖的索引
    awards: { type: Array, default: [] },                  // 奖品数组
    rate: { type: Number, default: 80 },                   // 转盘速率
    radius: { type: Number, default: 180 },                // 转盘半径
    textFontSize: { type: String, default: '13px' },       // 文字大小
    lineHeight: { type: Number, default: 20 },             // 文字行高
    textColor: { type: String, default: '#d64737' },       // 文字颜色
    textMargin: { type: Number, default: 30 },             // 文字距离边框距离
    textPadding: { type: Number, default: 0 },             // 文字补偿宽度
    btnFontSize: { type: String, default: '26px' },        // 按钮文字大小
    btnColor: { type: String, default: '#d64737' },        // 按钮文件颜色
    btnBorderColor1: { type: String, default: '#d64737' }, // 按钮外边框颜色
    btnBorderColor2: { type: String, default: '#fff',   }, // 按钮内边框颜色
    btnBorderColor3: { type: String, default: '#f6c66f' }, // 按钮指针颜色
    btnBgColor: { type: String, default: '#ffdea0' },      // 按钮背景颜色
    btnText: { type: String, default: '抽奖' },            // 按钮内容
    btnRadius: { type: Number, default: 60 },              // 按钮半径
    borderColor: { type: String, default: '#d64737' },     // 边框颜色
  },
  watch: {
    value (val) {
      this.currIndex = val
    }
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    /**
     * 初始化转盘
     */
    initCanvas() {
      this.canvas = document.querySelector('#canvas')
      this.ctx = canvas.getContext('2d')
      this.canvas.width = this.radius * 2
      this.canvas.height = this.radius * 2
      this.render()
      this.startRotate()
    },
    /**
     * 处理文字换行
     */
    getLineTextList(ctx, text, maxLineWidth) {
      maxLineWidth += this.textPadding
      let wordList = text.split(''), tempLine = '', lineList = []
      for (let i = 0; i < wordList.length; i++) {
        if (ctx.measureText(tempLine).width >= maxLineWidth) {
          lineList.push(tempLine)
          maxLineWidth -= ctx.measureText(text[0]).width
          tempLine = ''
        }
        tempLine += wordList[i]
      }
      lineList.push(tempLine)
      return lineList
    },

    /**
     * 绘制转盘
     */
    drawPanel() {
      const ctx = this.ctx
      const startRadian = this.startRadian
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.borderColor
      // 根据我们设定的初始角度来绘制转盘
      ctx.arc(this.radius, this.radius, this.radius, startRadian, Math.PI * 2 + startRadian, false)
      ctx.fill()
      ctx.restore()
    },

    /**
     * 绘制奖品
     */
    drawPrizeBlock() {
      const ctx = this.ctx
      const awards = this.awards
      // 根据初始角度来绘制奖品块
      let startRadian = this.startRadian
      let RadianGap = Math.PI * 2 / awards.length
      let endRadian = startRadian + RadianGap
      for (let i = 0; i < awards.length; i++) {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = awards[i].color || (i % 2 == 0 ? '#f8d384' : '#f9e3bb')
        ctx.moveTo(this.radius, this.radius)
        ctx.arc(this.radius, this.radius, this.radius - 20, startRadian, endRadian, false)
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.fillStyle = this.textColor
        ctx.font = `${this.textFontSize} Arial`
        ctx.translate(
          this.radius + Math.cos(startRadian + RadianGap / 2) * (this.radius - this.textMargin),
          this.radius + Math.sin(startRadian + RadianGap / 2) * (this.radius - this.textMargin)
        )
        ctx.rotate(startRadian + RadianGap / 2 + Math.PI / 2)
        this.getLineTextList(ctx, awards[i].name, 70).forEach((line, index) => {
          ctx.fillText(line, -ctx.measureText(line).width / 2, ++index * this.lineHeight)
        })
        ctx.restore()

        startRadian += RadianGap
        endRadian += RadianGap
      }
    },

    // 将canvas再window中的坐标点转化为canvas中的坐标点
    windowToCanvas(canvas, e) {
      // getBoundingClientRect这个方法返回html元素的大小及其相对于视口的位置
      const canvasPostion = canvas.getBoundingClientRect(), x = e.clientX, y = e.clientY
      return {
        x: x - canvasPostion.left,
        y: y - canvasPostion.top
      }
    },
    play (index, e) { // 开始游戏的方法
      let dom = document.querySelector('.ldq-luck')
      const canvas = this.canvas
      const ctx = this.ctx
      if (index < 0 || index >= this.awards.length) console.error('该索引的奖品不存在!')
      if (!this.canBeClick || index < 0 || index >= this.awards.length) return false
      this.currIndex = index
      this.canBeClick = false
      let loc = e ? this.windowToCanvas(canvas, e) : { // 模拟点击坐标
        x: dom.offsetWidth/2,
        y: dom.offsetHeight/2
      }
      ctx.beginPath()
      ctx.arc(this.radius, this.radius, 50, 0, Math.PI * 2, false)
      if (ctx.isPointInPath(loc.x, loc.y)) {
        this.$emit('start')
        // 每次点击抽奖，都将初始化角度重置
        this.startRadian = -Math.floor(Math.random() * 180)
        // distance是计算出的将指定奖品旋转到指针处需要旋转的角度距离，distanceToStop下面会又说明
        const distance = this.distanceToStop()
        this.rotatePanel(distance)
      } else {
        this.canBeClick = true
      }
    },
    // 初始化
    startRotate() {
      const canvas = this.canvas
      const ctx = this.ctx
      const canvasStyle = canvas.getAttribute('style');
      this.render()
      canvas.addEventListener('mousedown', e => this.play(this.currIndex, e))
      canvas.addEventListener('mousemove', e => {
        let loc = this.windowToCanvas(canvas, e)
        ctx.beginPath()
        ctx.arc(this.radius, this.radius, 30, 0, Math.PI * 2, false)
        if (ctx.isPointInPath(loc.x, loc.y)) {
          canvas.setAttribute('style', `cursor: pointer;${canvasStyle}`)
        } else {
          canvas.setAttribute('style', canvasStyle)
        }
      })
    },

    // 处理旋转的关键方法
    rotatePanel(distance) {
      // 这里用一个很简单的缓动函数来计算每次绘制需要改变的角度，这样可以达到一个转盘从块到慢的渐变的过程
      let changeRadian = (distance - this.startRadian) / this.rate
      this.startRadian += changeRadian
      // 当最后的目标距离与startRadian之间的差距低于0.05时，就默认奖品抽完了，可以继续抽下一个了。
      if (distance - this.startRadian <= 0.05) {
        this.$emit('input', this.currIndex)
        this.$emit('end', this.currIndex)
        return this.canBeClick = true
      }
      this.render()
      window.requestAnimationFrame(this.rotatePanel.bind(this, distance))
    },

    // 绘制按钮，以及按钮上start的文字
    drawButton() {
      const ctx = this.ctx
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnBorderColor1
      ctx.arc(this.radius, this.radius, this.btnRadius, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnBorderColor2
      ctx.arc(this.radius, this.radius, this.btnRadius - 5, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnBorderColor3
      ctx.arc(this.radius, this.radius, this.btnRadius - 10, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnBorderColor3
      ctx.moveTo(this.radius - this.btnRadius/2, this.radius - this.btnRadius/2 - 5)
      ctx.lineTo(this.radius, this.radius - this.btnRadius - 25)
      ctx.lineTo(this.radius + this.btnRadius/2, this.radius - this.btnRadius/2 - 5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnBgColor
      ctx.arc(this.radius, this.radius, this.btnRadius - 20, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.restore()
      
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.btnColor
      ctx.font = `${this.btnFontSize} Arial`
      ctx.translate(this.radius, this.radius)
      ctx.fillText(this.btnText, -ctx.measureText(this.btnText).width / 2, 8)
      ctx.restore()
    },

    distanceToStop() {
      // middleDegrees为奖品块的中间角度（最终停留都是以中间角度进行计算的）距离初始的startRadian的距离，distance就是当前奖品跑到指针位置要转动的距离。
      let middleDegrees = 0, distance = 0
      // 映射出每个奖品的middleDegrees
      const awardsToDegreesList = this.awards.map((data, index) => {
        let awardRadian = (Math.PI * 2) / this.awards.length
        return awardRadian * index + (awardRadian * (index + 1) - awardRadian * index) / 2
      });
      // 此次抽奖应该中的奖品
      const currentPrizeIndex = this.currIndex
      middleDegrees = awardsToDegreesList[currentPrizeIndex];
      // 因为指针是垂直向上的，相当坐标系的Math.PI/2,所以这里要进行判断来移动角度
      distance = Math.PI * 3 / 2 - middleDegrees
      distance = distance > 0 ? distance : Math.PI * 2 + distance
      // 这里额外加上后面的值，是为了让转盘多转动几圈，看上去更像是在抽奖
      return distance + Math.PI * 10;
    },

    render() {
      this.drawPanel()
      this.drawPrizeBlock()
      this.drawButton()
    }
  }
}
</script>
