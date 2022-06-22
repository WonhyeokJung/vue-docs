<template>
<div>
  <ul>
    <li v-if="!items.length">
      Loading...
    </li>
    <li v-for="(item, i) in items" :key="i">
      <slot name="item" v-bind="item"/>
    </li>
  </ul>
</div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  props: ['api-url', 'per-page'],
  setup () {
    const items = ref([])
    onMounted(() => {
      setTimeout(() => {
        items.value = [
          { body: 'Scoped Slots Guide', username: 'Evan You', likes: 20 },
          { body: 'Vue Tutorial', username: 'Natalia Tepluhina', likes: 10 }
        ]
      }, 2000)
    })
    return {
      items
    }
  }
}
</script>

<style scoped>
  div {
    display: flex;
    justify-content: center;
  }
  ul {
    list-style-type: none;
    padding: 5px;
    max-width: 500px;
    background: linear-gradient(315deg, #42d392 25%, #647eff);
  }
  li {
    padding: 5px 20px;
    margin: 10px;
    background: #fff;
  }
</style>
