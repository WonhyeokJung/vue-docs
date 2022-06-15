import { h } from 'vue'

export const HExample = {
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
  setup (props, context) {
    const {
      attrs,
      slots,
      emit,
      expose
    } = context
    // h를 바로 return시, expose와 ref를 통해 부모 컴포넌트에 값을 전달할 수 있다.
    const abc = () => `현재 props로 전달받은 태그 값은 ${props.tag}`
    const def = 'expose를 통해 값이 전달됩니다.'
    expose({
      abc,
      def
    })
    // context의 properties
    console.log(attrs, slots, emit, expose)
    return () => {
      return h(props.tag,
        { style: [`color: ${props.color}`] },
        [
          'Children 1번입니다.', h('div', 'Children 2번 입니다.'), slots.default && slots.default()
        ])
    }
  }
}
