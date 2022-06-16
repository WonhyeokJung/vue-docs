<template>
  <div>
    <div>Child.vue입니다.</div>
    <slot>
      Child Default에용
    </slot>
    <slot name="bar">
      <div> Child Bar에용</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'ChildComponent',
  setup () {}
}
</script>
