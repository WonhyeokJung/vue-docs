<template>
  <div class="parent">
    <duplicated-slot-child>
      <template #foo>
        <p>자식에 중복 슬롯이 있다면 결과는 ?</p>
      </template>
    </duplicated-slot-child>
  </div>
</template>

<script>
import DuplicatedSlotChild from '../components/DuplicatedSlotChild.vue'
export default {
  components: { DuplicatedSlotChild }
}
</script>
