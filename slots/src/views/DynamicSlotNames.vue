<template>
  <div class="parent">
    <dynamic-slot-names>
      <template #[slotName]>
        <p>#[slotName] 혹은 v-slot:[slotName]</p>
      </template>
    </dynamic-slot-names>
  </div>
</template>
<script>
import DynamicSlotNames from '../components/DynamicSlotNamesChild.vue'
export default {
  components: {
    DynamicSlotNames
  },
  setup () {
    const slotName = 'container'
    return {
      slotName
    }
  },
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
