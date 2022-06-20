<template>
<div>
  <named-slot-child>
    <template #default>Default Slot!</template>
    <template v-slot:container>
      <p>Container Slot!</p>
    </template>
  </named-slot-child>
</div>
</template>
<script>
import NamedSlotChild from '../components/NamedSlotChild'
export default {
  components: {
    NamedSlotChild
  }
}
</script>
