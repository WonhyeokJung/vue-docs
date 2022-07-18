<template>
  <AppHeader :title="appTitle"></AppHeader>
  <AppContent :items="items" @renew="renewItems"></AppContent>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppContent from '@/components/AppContent.vue'
import { ref } from '@vue/reactivity'

export default {
  /* eslint-disable */
  components: {
    AppHeader,
    AppContent
  },
  setup() {
    const appTitle = 'Common Approach';
    const items = ref([10, 20, 30]);
    function renewItems(...params) {
      console.log(params[0], '/ 발생 위치: ', params[1])
      for (let i = 0; i < items.value.length; i++) {
        items.value[i] += 10;
      }
    };
    return {
      appTitle,
      items,
      renewItems
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
