import { defineComponent } from 'vue-demi'
import { LuckyWheel } from 'lucky-canvas'
import h from "../utils/h-demi"
// @ts-ignore
import { name, version } from '../../package.json'

export default defineComponent({
  name: 'LuckyWheel',
  props: {
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
    },
    blocks: {
      type: Array,
      default: () => []
    },
    prizes: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    defaultConfig: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'start',
    'end',
    'success',
    'error',
    'finally',
  ],
  watch: {
    blocks (newData, oldData) {
      this.lucky && ((this.lucky as any).blocks = newData)
    },
    prizes (newData, oldData) {
      this.lucky && ((this.lucky as any).prizes = newData)
    },
    buttons (newData, oldData) {
      this.lucky && ((this.lucky as any).buttons = newData)
    },
  },
  data() {
    return {
      lucky: null as LuckyWheel | null,
    };
  },
  mounted () {
    // 添加版本信息到标签上, 方便定位版本问题
    if (this.$refs.myLucky) {
      const dom = this.$refs.myLucky as HTMLDivElement
      dom.setAttribute('package', `${name}@${version}`)
    }
    // 开始创建组件
    try {
      this.initLucky()
      this.$emit('success')
    } catch (err) {
      this.$emit('error', err)
    } finally {
      this.$emit('finally')
    }
  },
  methods: {
    initLucky () {
      this.lucky = new LuckyWheel({
        flag: 'WEB',
        width: String(this.width),
        height: String(this.height),
        divElement: this.$refs.myLucky as HTMLDivElement,
        rAF: window.requestAnimationFrame,
        setTimeout: window.setTimeout,
        setInterval: window.setInterval,
        clearTimeout: window.clearTimeout,
        clearInterval: window.clearInterval,
      }, {
        ...this.$props as any,
        start: (e) => {
          this.$emit('start', e)
        },
        end: (prize) => {
          this.$emit('end', prize)
        },
      })
    },
    init () {
      this.lucky && this.lucky.init()
    },
    /**
     * play方法可以让抽奖开始旋转
     */
    play () {
      this.lucky?.play()
    },
    /**
     * stop方法可以传递一个中奖索引, 来停止游戏
     * @param index 中奖索引
     */
    stop (index?: number) {
      this.lucky?.stop(index)
    },
  },
  render() {
    return h('div', { ref: 'myLucky' })
  }
})
