<template>
  <div class="parents">
    <default-slot-comp>
      결과는 ?
    </default-slot-comp>
  </div>
</template>

<script>
import DefaultSlotComp from '../components/DefaultSlotComp.vue'
export default {
  name: 'DefaultSlot',
  components: { DefaultSlotComp }
}
</script>
