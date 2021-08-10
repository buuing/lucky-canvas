import { defineComponent } from 'vue-demi'
import { LuckyGrid } from 'lucky-canvas'
import h from "../utils/h-demi"
// import { name, version } from '../../package.json'

export default defineComponent({
  name: 'LuckyGrid',
  props: {
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    cols: {
      type: [String, Number],
      default: 3
    },
    rows: {
      type: [String, Number],
      default: 3
    },
    prizes: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    button: { // 老版本要兼容这个属性
      type: Object
    },
    blocks: {
      type: Array,
      default: () => []
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    activeStyle: {
      type: Object,
      default: () => ({})
    },
    defaultConfig: {
      type: Object,
      default: () => ({})
    },
  },
  emits: [
    'start',
    'end',
    'success',
    'error',
    'finally',
  ],
  watch: {
    cols (newData, oldData) {
      this.$lucky.cols = newData
    },
    rows (newData, oldData) {
      this.$lucky.rows = newData
    },
    blocks (newData, oldData) {
      this.$lucky.blocks = newData
    },
    prizes (newData, oldData) {
      this.$lucky.prizes = newData
    },
    buttons (newData, oldData) {
      this.$lucky.buttons = newData
    },
    button (newData, oldData) {
      this.$lucky.button = newData
    },
  },
  data() {
    return {
      $lucky: null as LuckyGrid | null,
    };
  },
  mounted () {
    // 添加版本信息到标签上, 方便定位版本问题
    // if (this.$refs.myLucky) {
    //   this.$refs.myLucky.setAttribute('package', `${name}@${version}`)
    // }
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
      this.$lucky = new LuckyGrid({
        flag: 'WEB',
        width: this.width,
        height: this.height,
        divElement: this.$refs.myLucky,
        rAF: window.requestAnimationFrame,
        setTimeout: window.setTimeout,
        setInterval: window.setInterval,
        clearTimeout: window.clearTimeout,
        clearInterval: window.clearInterval,
      }, {
        ...this.$props,
        start: (...rest) => {
          this.$emit('start', ...rest)
        },
        end: (...rest) => {
          this.$emit('end', ...rest)
        },
      })
    },
    init () {
      this.$lucky && this.$lucky.init({})
    },
    play (...rest) {
      this.$lucky.play(...rest)
    },
    stop (...rest) {
      this.$lucky.stop(...rest)
    },
  },
  render() {
    return h('div', { ref: 'myLucky' })
  }
})
