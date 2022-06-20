<template>
<div class="parent">
  <slot-props-child>
    <template #container="fromChild">
      <div>Slot을 통해 전달받은 Props: {{ fromChild }}</div>
      <div>Props의 타입은? {{ typeof(fromChild) }}</div>
    </template>
  </slot-props-child>
</div>
</template>
<script>
import SlotPropsChild from '../components/SlotPropsChild'
export default {
  name: 'SlotProps',
  components: {
    SlotPropsChild
  },
  data () {
    return {
      sampleData: ''
    }
  },
  setup () {},
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeUnmount () {},
  unmounted () {},
  computed: {},
  watch: {},
  methods: {}
}
</script>
