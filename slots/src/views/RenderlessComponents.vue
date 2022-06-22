<template>
<div>
  <mouse-tracker v-slot="{ x, y }">
    Mouse is at: {{ x }}, {{ y }}
  </mouse-tracker>
</div>
</template>
<script>
import MouseTracker from '../components/MouseTracker.vue'
export default {
  components: { MouseTracker },
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
