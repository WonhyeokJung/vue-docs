<template>
  <div class="h">
    <div>기본 구조 : h(<i>Type</i>, <i>{ Properties }</i>, <i>[ Children ]</i>)</div>
    <HExample color="black" ref="hexample">
      <template #default="props">
        <br />
        <div>{{ def }}</div>
        <div>{{ abc }}</div>
        <div>slot Props를 이용해 받은 값 : {{ props }}</div>
      </template>
    </HExample>
  </div>
</template>

<script>
import { HExample } from '@/assets/js/render-function/h-example.js'
import { ref, onMounted } from 'vue'
export default {
  name: 'HyperScriptView',
  components: {
    HExample
  },
  setup () {
    // ref 동일 이름 변수 설정
    const hexample = ref(null)
    const abc = ref('')
    const def = ref('')
    // ref onMounted 이후 읽기 가능.
    onMounted(() => {
      abc.value = hexample.value.abc()
      def.value = hexample.value.def
    })
    return {
      hexample,
      abc,
      def
    }
  }
}
</script>
