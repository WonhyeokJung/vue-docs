<template>
  <div>
    <slot :x="x" :y="y" />
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue'
export default {
  setup () {
    const x = ref(0)
    const y = ref(0)

    const locUpdate = function (e) {
      x.value = e.pageX
      y.value = e.pageY
    }
    onMounted(() => {
      window.addEventListener('mousemove', locUpdate)
    })
    onUnmounted(() => {
      window.removeEventListener('mousemove', locUpdate)
    })

    return {
      x, y
    }
  }
}
</script>
