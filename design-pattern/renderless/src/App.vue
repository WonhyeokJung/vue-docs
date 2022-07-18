<template>
  <!-- Data Provider. 즉, 데이터 제공이 주 역할임. -->
  <FetchData url="https://jsonplaceholder.typicode.com/users/1">
    <template #default="props">
        <div v-if="props.loading">
          loading...
        </div>
        <div v-else>
          {{ props.response }}
        </div>
    </template>
  </FetchData>
</template>

<script>
import FetchData from './components/FetchData.vue'

export default {
  name: 'App',
  components: {
    FetchData
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
  margin-top: 60px;
}
</style>
