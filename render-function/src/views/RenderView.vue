<template>
  <div class="render">
    <RenderExample color="blue" ref="child_comp">
      <template #default="props">
        <!-- slot Props 이용 -->
        {{ props.abc }}
        <!-- refs 이용 -->
        <div>{{ def }}</div>
        <button @click="checkDef">자식 변경 조회</button>
      </template>
    </RenderExample>
  </div>
</template>
<script>
import { RenderExample } from '@/assets/js/render-function/render-example.js'
export default {
  components: {
    RenderExample
  },
  data () {
    return {
      def: null
    }
  },
  methods: {
    checkDef () {
      alert(this.$refs.child_comp.def)
    }
  },
  computed: {
  },
  // mounted가 완료된 이후 $refs 조회가 가능하다.
  mounted () {
    this.def = this.$refs.child_comp.def
  }
}
</script>
