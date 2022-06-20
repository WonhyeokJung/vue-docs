<template>
  <div>
    <slot name="container" :userData="user" :foodsData="foods"></slot>
  </div>
</template>
<script>
import { ref, reactive, toRefs } from 'vue'
export default {
  setup () {
    const state = reactive({
      user: {
        lastName: 'Doe',
        firstName: 'Jane'
      }
    })
    const foods = ref(['cutlet', 'hamburger', 'bulgogi'])

    return {
      ...toRefs(state),
      foods
    }
  }
}
</script>
