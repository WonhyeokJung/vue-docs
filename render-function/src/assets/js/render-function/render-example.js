import { h } from 'vue'

export const RenderExample = {
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    color: {
      type: String,
      default: 'red'
    }
  },
  data () {
    return {
      abc: `현재 props로 전달받은 태그 값은 ${this.tag}`,
      def: 'mount 후 this.$refs를 통해 값이 전달됩니다.'
    }
  },
  methods: {
    ghi () {
      this.def = 'def 값을 바꿔버렸습니다.'
    }
  },
  render ($setup) {
    return h(this.tag,
      { style: [`color: ${this.color}`], onClick: this.ghi },
      [
        'Children 1번입니다.', h('div', 'Children 2번 입니다.'),
        this.$slots.default && this.$slots.default({ abc: this.abc, def: this.def })
      ]
    )
  }
}
