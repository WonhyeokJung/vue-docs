<template>
<div>
  <slot-default-value-child></slot-default-value-child>
</div>
</template>
<script>
import SlotDefaultValueChild from '@/components/SlotDefaultValueChild.vue'
export default {
  components: {
    SlotDefaultValueChild
  }
}
</script>
