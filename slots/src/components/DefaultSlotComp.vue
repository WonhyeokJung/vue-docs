<template>
  <div class="child">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DefaultComp',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
