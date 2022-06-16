import { h, reactive, toRefs } from 'vue'
import Child from '@/components/Child.vue'

export const WithoutSlots = {
  setup () {
    return () => {
      return h('div', {}, [])
    }
  }
}

export const WithSlots = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      return h('div', {}, { default: () => [slots.default && slots.default()[0] ? slots.default() : 'Default 값입니다요.'] })
    }
  }
}

export const NamedSlot = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      return h('div', {}, [slots.default && slots.default()[0] ? slots.default() : h('div', {}, ['Default 값입니다.']), slots.foo && slots.foo()[0] ? slots.foo() : 'Foo Slot default'])
    }
  }
}

export const CompSlot = {
  components: {
    Child
  },
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      return h(Child, {}, {
        default: context.slots.default && context.slots.default(),
        bar: () => slots.bar && slots.bar()
      })
    }
  }
}

export const SlotProps = {
  setup (props, context) {
    const state = reactive({
      food: ['burger', 'chicken', 'ramyeon'],
      beverage: ['powerade', 'coke', 'cider']
    })
    const {
      slots
    } = context
    return () => {
      return h('div', {}, [slots.default && slots.default({ state: toRefs(state) })])
    }
  }
}
