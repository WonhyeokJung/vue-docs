<template>
  <div class="about">
    <div>
      <div>
        사진 불러올 페이지 변경 :
        <button type="button" v-for="i in 20" :key="i" @click="page=i">{{ i }}</button>
      </div>
      총 사진 수 변경 :
      <button type="button" v-for="i in 20" :key="i" @click="id=i">{{ i }}</button>
      <div>
        URL : {{ url }}
      </div>
    </div>
    <div v-if="data">
      <div v-for="(v, i) in data" :key="i">
        <img :src="v.download_url" alt="..." style="width: 500px; height: 375px;">
      </div>
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useFetch } from '../composables/fetch'
const page = ref(1)
const id = ref(1)
const url = computed(() => `https://picsum.photos/v2/list?page=${page.value}&limit=${id.value}`)
const { data, error } = useFetch(url)
</script>
