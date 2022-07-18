<template>
  <input type="checkbox" :value="modelValue" @input="updateChecked">
  <!-- input의 value를 newName으로 실시간 업뎃 / input발생시 toggleCheckBox 실행 -->
  <!-- <input type="checkbox" :value="newName" @input="toggleCheckBox"> -->
</template>
<script>
// import { computed } from '@vue/runtime-core'
export default {
  props: {
    modelValue: {
      type: Boolean
    },
    newName: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    // const updateChecked = computed({
    //   get: () => props.isChecked,
    //   set: (event) => console.log(event)
    // })
    function updateChecked() {
      // emit('update:modelValue', !props.modelValue)
      emit('onMyWay', !props.modelValue)
    }
    function toggleCheckBox() {
      emit('update:newName', !props.newName)
      emit('emitFromChild', !props.newName)
    }
    return{
      updateChecked,
      toggleCheckBox
    }
  }
}
</script>