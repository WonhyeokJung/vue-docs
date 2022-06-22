<template>
<div class="parent">
  <slot-props-child>
    <template #container="fromChild">
      <div>Slot을 통해 전달받은 Props: {{ fromChild }}</div>
      <div>Props의 타입은? {{ typeof(fromChild) }}</div>
    </template>
  </slot-props-child>
  <br />
  <div><h2>Scoped Slots의 활용 : Fancy List 예제</h2></div>
  <fancy-list api-url="url" per-page="10">
    <template #item="{ body, username, likes }">
      <div class="item">
        <p>{{ body }}</p>
        <p style="font-size: 0.8em; color: #42b883">by {{ username }} | {{ likes }} likes</p>
      </div>
    </template>
  </fancy-list>
</div>
</template>
<script>
import SlotPropsChild from '../components/SlotPropsChild'
import FancyList from '../components/FancyList.vue'
export default {
  name: 'SlotProps',
  components: {
    SlotPropsChild,
    FancyList
  },
  data () {
    return {
      sampleData: ''
    }
  },
  setup () {},
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeUnmount () {},
  unmounted () {},
  computed: {},
  watch: {},
  methods: {}
}
</script>
