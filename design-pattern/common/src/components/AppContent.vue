<template>
<div>
  <ul>
    <li v-for="(item, i) in items" :key="i">
      {{ item }}
    </li>
  </ul>
  <button @click="renew">Renew Items</button>
  <!-- <button @click="$emit('renew')"></button> -->
</div>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    /* emit은 함수 형태로 전달해야 함에 유의한다. */
    const renew = (event) => { emit('renew', 'emit 발생', event) };
    return {
      renew
    }
  }
}
</script>
