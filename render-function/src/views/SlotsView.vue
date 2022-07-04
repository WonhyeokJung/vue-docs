<template>
<div>
  <without-slots>컨텐츠를 넣고 싶어요.</without-slots>
  <with-slots>
    <template #default>
    </template>
  </with-slots>
  <br />
  <named-slot>
    <template #foo-slot>
      반갑습니다. Foo slot입니다.
    </template>
    <div>Named Slot 내부입니다.</div>
  </named-slot>
</div>
</template>
<script>
import { WithoutSlots, WithSlots, NamedSlot } from '@/assets/js/render-function/slots.js'
export default {
  components: {
    WithoutSlots,
    WithSlots,
    NamedSlot
  }
}
</script>
