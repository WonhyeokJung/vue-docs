<template>
  <!-- Data(isChecked)를 상위에서 관리하는 것이 큰 차이점. -->
  <!-- 굉장히 작은 단위로 쪼개진 컴포넌트를 관리할 때 아주 유용하다. -->
  <h4>실행 안되면 App.vue / BaseCheckBox.vue 주석 체크</h4>
  <!-- v-model은 기본적으로 아래와 같은 형태다. -->
  <input v-model="something" />
  {{ something }}
  <br />
  <!-- v-model을 풀어보면 이와 같다. -->
  <input :value="something2" @input="something2 = $event.target.value" />
  {{ something2 }}

  <hr />
  <!-- 컴포넌트에 사용할 때는 아래와 같다. -->
  <!-- 즉, update를 통해 newValue를 변경해주는 과정이 있다.(하위 컴포넌트에서 emit 통해 올려주어야 한다.) -->
  <div>
    [기본형] :modelValue="isChecked" @update:modelValue="newValue => isChecked = newValue"
    <CheckBox :modelValue="isChecked" @update:modelValue="newValue => isChecked = newValue"></CheckBox>
    {{ isChecked }}
  </div>
  <!-- 위 코드의 축약형은 이처럼 이뤄진다 -->
  <div>
    [축약형] v-model="isChecked2"
    <CheckBox v-model="isChecked2"></CheckBox>
      {{ isChecked2 }}
  </div>
  <!-- emit명을 update:modelValue가 아닌 다른 식으로 했을 경우, emit을 따로 불러와야 한다. -->
  <CheckBox v-model="isChecked3" @onMyWay="newValue => isChecked3 = newValue"></CheckBox>
  {{ isChecked3 }}
  <br />
  <!-- modelValue의 유일성을 유지하기 위해, v-model의 value명을 다르게 줄 수도 있다. -->
  <!-- 하위 컴포넌트에서 emit명을 update:newName 식으로 보낸다면, 따로 emit을 불러올 필요가 없다.(대신 v-model 명시가 필수이다.) -->
  <CheckBox v-model:newName="isChecked4"></CheckBox>
  {{ isChecked4 }}
  <!-- 명칭을 다르게 했다면, 무조건 불러와야 한다. -->
  <br />
  <CheckBox :newName="isChecked5" @emitFromChild="updateChecked2"></CheckBox>
  {{ isChecked5 }}
</template>

<script>
import { ref } from 'vue'; 
import CheckBox from './components/BaseCheckbox.vue';
export default {
  name: 'App',
  components: {
    CheckBox
  },
  setup() {
    const something = ref('test1:축약형');
    const something2 = ref('test2');
    const isChecked = ref(false);
    const isChecked2 = ref(false);
    const isChecked3 = ref(false);
    const isChecked4 = ref(false);
    const isChecked5 = ref(false);
    function updateChecked(v) {
      isChecked3.value = v
    }
    function updateChecked2(v) {
      isChecked4.value = v
    }
    return {
      something,
      something2,
      isChecked,
      isChecked2,
      isChecked3,
      isChecked4,
      isChecked5,
      updateChecked,
      updateChecked2
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
  margin-top: 60px;
}
</style>
