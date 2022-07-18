<template>
  <ul>
    <BaseItem v-for="(item, i) in datas" :key="i">{{ item }}</BaseItem>
    <!-- <BaseItem v-for="(item, i) in datas" :key="i" :item="item"></BaseItem> -->
    <BaseItem></BaseItem>
  </ul>
  <router-view/>
</template>
<script>
/* eslint-disable */
import BaseItem from '@/components/BaseItem.vue'
export default {
  name: 'App',
  components: { BaseItem },
  setup() {
    const datas = ['아이템1', '아이템2', '아이템3', '아이템4']
    return {
      datas
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
