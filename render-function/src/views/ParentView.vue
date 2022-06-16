<template>
<div>
  <CompSlot>
    <template #bar>
      <div>
        네, Parent의 bar입니다. 반갑습니다.
      </div>
    </template>
  </CompSlot>
</div>
</template>
<script>
import { CompSlot } from '@/assets/js/render-function/slots.js'
export default {
  components: {
    CompSlot
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
