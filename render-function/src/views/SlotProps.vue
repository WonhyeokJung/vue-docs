<template>
<div>
  Render function의 Slot Props Test
  <slot-props>
    <template #default="props">
      {{ props }}
    </template>
  </slot-props>
</div>
</template>
<script>
import { SlotProps } from '@/assets/js/render-function/slots.js'
export default {
  components: {
    SlotProps
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
