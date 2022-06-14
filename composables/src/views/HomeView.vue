<template>
  <div class="home">
    <div>
      It's from : {{ where }}
    </div>
    Mouse Position is at: {{ x }}, {{ y }}
  </div>
</template>

<script>
import { useMouse, where } from '@/composables/mouse.js'
export default {
  setup () {
    const { x, y } = useMouse()
    return {
      x, y, where
    }
  }
}
</script>
