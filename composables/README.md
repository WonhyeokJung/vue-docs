# Composables

---

## 목차

1. [Mixins & Composables](#Mixins & Composables)
   1. [Mixins](#mixins)
   2. [What is a "Composable"?](#What is a "Composable"?)
   3. [Mouse Tracker Example](#Mouse Tracker Example)
   4. [Async State Example](#Async State Example)
   5. [No Reactivity](#No Reactivity)
   6. [Conventions and Best Practices](#Conventions and Best Practices)
      1. [Naming](#Naming)
      2. [Input Arguments](#Input Arguments)
      3. [Return Values](#Return Values)
   7. [Extracting Composables for Code Organization](#Extracting Composables for Code Organization)
   8. [Using Composables in Options API](#Using Composables in Options API)

---

## Mixins & Composables

### mixins

자주 사용하는 methods를 한 곳에 모아두고 필요할 때 import해서 불러와 사용할 수 있게 한 것이 mixins의 역할이다.

Vue2의 Mixins는 이렇게 사용했었다.

1. 생성

   ```javascript
   // mixins.js
   export default {
     mounted () {
       console.log('Mixin Mounted!')
     },
     methods: {
       async $api (url, data) {
         return (await axios({
           method: 'post',
           url,
           data
         }).catch(e => {
           console.log(e)
         })).data
       }
     }
   }
	```
	
2. 사용

   ```javascript
   // global
   // main.js
   import { createApp } from 'vue'
   import App from './App.vue'
   import mixins from './mixins.js'
   import router from './router'
   import store from './store'
   
   createApp(App).use(store).use(router).mixin(mixins).mount('#app')
   ```

   ```vue
   <script>
   	import ApiMixin from '${MIXINS_PATH}/mixins.js'  // local
     export default {
       mixins: [ApiMixin], // Not nessasary, local 전역에 등록 안된 경우 local에 사용하고자 할 때..
       mounted () {
         console.log('Component Mounted')
         // 'Mixin Mounted' then,
         // 'Component Mounted'
       },
       methods: {
         foo () {
           this.$api(...)
         }
       }
     }
   </script>
   ```

이처럼 기존에는 this.${METHOD_NAME}으로 사용할 수 있었던 mixins의 methods에 정의된 메서드들이 Vue3의 setup() 내에선 this의 사용이 불가능해지면서 다른 방식을 이용해야 한다.

Vue3의 Setup()에서는 다른 컴포넌트 혹은 라이브러리를 불러오게 되는 경우 import를 사용해서 불러온다. 위에서 봤던 예제를 아래처럼 바꿀 수 있다.

api.js

```javascript
export async function useApi (url, data) {
  return (await axios({ method: 'post', url, data })
    .then(res => res.data)
    .catch(e => { console.log(e) }))
}
```

somewhere.vue

```vue
<script>
	import { useApi } from '@/composables/api.js'
  export default {
    setup () {
      async function foo () {
        await useApi(...)
      }
    	return {
    		foo
  		}
  	}
  }
</script>
```

그렇다면 기존의 mixins.js를 그대로 사용하는 것도 가능할까? 결론은 가능은 하다.(**하지만 이렇게 불러오면 안된다. Composition API의 이점을 모두 없애는 방식이다.**)

```vue
<script>
	import { mixins } from '${PATH}/mixins.js'
  export default {
    setup () {
      async function foo () {
        // mixins.js의 export default를 하나의 객체로 인식한다.
        await mixins.methods.$api(...)
      }
    }
  }
</script>
```

이처럼 개별적으로 사용할 함수를 import 해줘야 하는 불편함이 있고, 함수를 개별적으로 export 해줘야 하는 불편함에도 불구하고 Composables를 사용해야 하는 이유는 무엇일까? 이 이유를 알아보자.

### What is a "Composable"?

Composable은 **상태 저장 논리(Stateful Logic)**를 캡슐화하고 재사용하는 Composition API 기능이다.

Frontend 앱을 설계할 때, 자주 반복해서 사용되는 몇 가지 기능들이 있다. 예를 들면, 여러 곳에 날짜를 지정해야 하는 경우가 있고 이 과정에 재사용하는 함수들을 추출한다. 이 포맷터 함수(Fommater function)는 상태 비저장 논리(stateless logic)을 캡슐화한다. 포맷터 함수는 몇 가지 인풋을 받고 즉시 예상되는 아웃풋을 반환하다. 이렇게 상태 비저장 논리(비반응형 함수라고 생각하시면 편합니다.)를 재사용하기 위한 수많은 라이브러리가 있다(예를 들면 lodash, date-fns 등등)

이에 비해 상태 저장 논리는 변화하는 상태를 관리하는 것을 포함한다. 간단한 예로 현재 페이지의 마우스 위치를 추적하는 것을 들 수 있다. 물론 실제 프로젝트에선, 터치 제스쳐나 데이터와의 연결 속성같은 더욱 복잡한 논리(Logic) 예도 있을 수 있다.

---

### Mouse Tracker Example

만약 마우스 위치를 추척하는 기능을 Composition API 안에 직접 구현한다면, 이와 같을 것이다.

```vue
<template>
	<div>
  	Mouse position is at: {{ x }}, {{ y }}
  </div>
</template>
<script setup>
	import { ref, onMounted, onUnmounted } from 'vue'
  
  const x = ref(0)
  const y = ref(0)
  
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
</script>
```

하지만 만약에 여러 컴포넌트에 같은 논리(Logic)를 재사용하고 싶다면 어떨까? 마우스의 위치를 반환하는 하나의 논리를 **Composable function**으로서 외부 파일에 추출할 수 있다.

```javascript
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'
// by convention, composable function names start with 'use'
// vue 네이밍 컨벤션에 의하면, composable function의 명칭은 'use'로 시작한다.
// 재사용 가능한 함수의 독립성을 위해 mixins.js에서 $로 이름을 명명하던 것과 비슷한 구조이다.
export function useMouse () {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)
  
  // a composable can update its managed state over time
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  
  // expose managed state as return value
  return { x, y }
}
```

그리고 컴포넌트에선 이렇게 사용된다.

```vue
<script setup>
	import { useMouse } from './mouse.js'
  const { x, y } = useMouse()
</script>
<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

보이는 것처럼, 핵심 논리는 정확히 똑같다. - 해야 할 일은 외부 함수에 논리를 옮기고 노출되어야 하는 상태를 return하는 것 뿐이다. 컴포넌트 내부와 마찬가지로, Composable에서도 모든 **Composition API functions**를 전부 사용할 수 있다. 이제 모든 컴포넌트에서 동일한 `useMouse()` 함수를 사용할 수 있다.

Composable의 더 끝내주는 점은, 중첩 또한 가능하다는 점이다. Composable 함수는 하나 혹은 그 이상의 다른 Composable 함수를 불러올 수 있다. 이건 독립적으로 세분화된 객체들로 복잡한 로직을 구현할 수 있다는 것을 뜻한다. -Vue 애플리케이션에서 컴포넌트를 이용하는 방식과 유사하게 말이다.

예제로, DOM event listener를 추가/삭제하는 논리를 추출하여 분리할 수 있다.

```javascript
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

그리고, 이제 `useMouse()`함수는 아래처럼 간략화할 수 있다.

```javascript
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })
  
  return { x, y }
}
```

*TIP* : `useMouse()`를 호출한 각 컴포넌트 인스턴스는 각자 고유의 `x`와 `y`상태(state)를 생성하므로, 서로에게 영향을 끼치지 않는 독립적인 상태가 된다. 만약 컴포넌트 간 공유되는 상태를 활용하고 싶다면, [State Management](#State Management)챕터를 참고하자.

---

### Async State Example

`usaMouse()` Composable은 어떤 매개변수(arguments)도 받지 않으니, 매개변수를 활용하는 예제를 한번 보자. 동기적인 데이터 페칭을 할 때, 흔히 로딩/성공/에러 별 상태를 조정해야 한다.

```vue
<script setup>
	import { ref } from 'vue'
  
  const data = ref(null)
  const error = ref(null)
  
  fetch('...')
  	.then(res => res.json())
  	.then(json => data.value = json)
  	.catch(err => error.value = err)
</script>

<template>
	<div v-if="error">Oops! Error encountered: {{ error.message }}</div>
	<div v-else-if="data">
  	Data loaded:
    <pre>{{ data }}</pre>
  </div>
	<div v-else>Loading...</div>
</template>
```

다시 말하지만, 각각 컴포넌트에서 필요할 때마다 데이터 페칭 패턴을 반복 작성하는 일은 매우 번거로울 것이다. Composable로 추출해보자.

```javascript
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  
  fetch(url)
  	.then(res => res.json())
  	.then(json => data.value = json)
  	.catch(err => error.value = err)
  
  return { data, error }
}
```

이제 컴포넌트에서 할 일이라곤...

```vue
<script setup>
	import { useFetch } from '${JS_PATH}/fetch.js'
  
  const { data, error } = useFetch('...')
</script>
```

`useFetch()`함수는 정적 URL 문자열을 입력으로 받는다. - 그러므로, **오직 한 번 동작**한다. 만약 URL이 바뀔 때마다 다시 페치하길 원한다면 어떨까? 매개변수를 **refs**로 받아오면 된다.

```javascript
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  
  function doFetch() {
    // reset state before fetching
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(unref(url))
    	.then(res => res.json())
      .then(json => data.value = json)
      .catch(err => error.value = err)
  }
  
  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }
  
  return { data, error }
}
```

수정된 `useFetch()`에선 정적 URL 문자열 그리고 URL 문자열의 refs 두 가지를 다 인자로 받는다. `isRef()`를 사용하여 URL이 동적 ref임을 탐지한 경우, `watchEffect()`를 통해 반응형 효과(reactive effect)를 적용한다. 이 효과는 즉시 실행되어 URL ref를 추적한다. 언제든지 URL ref가 변경되면, 데이터는 리셋되고 다시 페치될 것이다.

좀 더 자세히 알아보고 싶은 경우를 대비하여, 추가 [예제](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiLFxuICAgIFwidnVlL3NlcnZlci1yZW5kZXJlclwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy9zZXJ2ZXItcmVuZGVyZXIuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwidXNlRmV0Y2guanMiOiJpbXBvcnQgeyByZWYsIGlzUmVmLCB1bnJlZiwgd2F0Y2hFZmZlY3QgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VGZXRjaCh1cmwpIHtcbiAgY29uc3QgZGF0YSA9IHJlZihudWxsKVxuICBjb25zdCBlcnJvciA9IHJlZihudWxsKVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRvRmV0Y2goKSB7XG4gICAgLy8gcmVzZXQgc3RhdGUgYmVmb3JlIGZldGNoaW5nLi5cbiAgICBkYXRhLnZhbHVlID0gbnVsbFxuICAgIGVycm9yLnZhbHVlID0gbnVsbFxuICAgIFxuICAgIC8vIHJlc29sdmUgdGhlIHVybCB2YWx1ZSBzeW5jaHJvbm91c2x5IHNvIGl0J3MgdHJhY2tlZCBhcyBhXG4gICAgLy8gZGVwZW5kZW5jeSBieSB3YXRjaEVmZmVjdCgpXG4gICAgY29uc3QgdXJsVmFsdWUgPSB1bnJlZih1cmwpXG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIGFydGlmaWNpYWwgZGVsYXkgLyByYW5kb20gZXJyb3JcbiAgXHQgIGF3YWl0IHRpbWVvdXQoKVxuICBcdCAgLy8gdW5yZWYoKSB3aWxsIHJldHVybiB0aGUgcmVmIHZhbHVlIGlmIGl0J3MgYSByZWZcblx0ICAgIC8vIG90aGVyd2lzZSB0aGUgdmFsdWUgd2lsbCBiZSByZXR1cm5lZCBhcy1pc1xuICAgIFx0Y29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsVmFsdWUpXG5cdCAgICBkYXRhLnZhbHVlID0gYXdhaXQgcmVzLmpzb24oKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yLnZhbHVlID0gZVxuICAgIH1cbiAgfVxuXG4gIGlmIChpc1JlZih1cmwpKSB7XG4gICAgLy8gc2V0dXAgcmVhY3RpdmUgcmUtZmV0Y2ggaWYgaW5wdXQgVVJMIGlzIGEgcmVmXG4gICAgd2F0Y2hFZmZlY3QoZG9GZXRjaClcbiAgfSBlbHNlIHtcbiAgICAvLyBvdGhlcndpc2UsIGp1c3QgZmV0Y2ggb25jZVxuICAgIGRvRmV0Y2goKVxuICB9XG5cbiAgcmV0dXJuIHsgZGF0YSwgZXJyb3IsIHJldHJ5OiBkb0ZldGNoIH1cbn1cblxuLy8gYXJ0aWZpY2lhbCBkZWxheVxuZnVuY3Rpb24gdGltZW91dCgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC4zKSB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUmFuZG9tIEVycm9yJykpXG4gICAgICB9XG4gICAgfSwgMzAwKVxuICB9KVxufSJ9)[^1]를 아래에 남겨둔다. 

```javascript
// useFetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  async function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    
    // resolve the url value synchronously so it's tracked as a
    // dependency by watchEffect()
    const urlValue = unref(url)
    
    try {
      // artificial delay / random error
  	  await timeout()
  	  // unref() will return the ref value if it's a ref
	    // otherwise the value will be returned as-is
    	const res = await fetch(urlValue)
	    data.value = await res.json()
    } catch (e) {
      error.value = e
    }
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    doFetch()
  }

  return { data, error, retry: doFetch }
}

// artificial delay
function timeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(new Error('Random Error'))
      }
    }, 300)
  })
}
```

```vue
<!-- vue -->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from './useFetch.js'

const baseUrl = 'https://jsonplaceholder.typicode.com/todos/'
const id = ref('1')
const url = computed(() => baseUrl + id.value)

const { data, error, retry } = useFetch(url)
</script>

<template>
  Load post id:
  <button v-for="i in 5" @click="id = i">{{ i }}</button>

	<div v-if="error">
    <p>Oops! Error encountered: {{ error.message }}</p>
    <button @click="retry">Retry</button>
  </div>
  <div v-else-if="data">Data loaded: <pre>{{ data }}</pre></div>
  <div v-else>Loading...</div>
</template>
```

---

### No Reactivity

> 활용을 비추천함.

만약 반응성이 아예 필요없고, mixins 처럼 원하는 값만 return 받고 싶다면 어떻게 할까? 예를 들면 다양한 url을 통해 데이터를 받아오는 axios 함수를 에제로 만들어보자.

```javascript
export async function useApi (url, data) {
  return (await axios({ method: 'post', url, data })
    .then(res => res.data)
    .catch(e => { console.log(e) }))
}
```

```vue
<script>
import { reactive, computed, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useApi } from '@/mixins.js'
import Swal from 'sweetalert2'
export default {
  components: {},
  data () {
    return {}
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      product: {
        product_name: '',
        product_price: 0,
        delivery_price: 0,
        add_delivery_price: 0,
        tags: '',
        outbound_days: 0,
        category_id: 1,
        seller_id: 1
      },
      categoryList: [],
      category1: [],
      category2: [],
      category3: [],
      cate1: '',
      cate2: '',
      cate3: ''
    })

    async function getCategoryList () {
      // 받아온 res.data 값을 그대로 대입한다.
      state.categoryList = await useApi('/api/categoryList', {})
      const oCategory = {}
      state.categoryList.forEach(item => {
        oCategory[item.category1] = item.id
      })
      for (const key in oCategory) {
        state.category1.push(key)
      }
    }

    // created
    getCategoryList()
    const user = computed(() => store.state.user)
    onMounted(() => {
      if (user.value.email === undefined) {
        alert('로그인을 해야 이용할 수 있습니다.')
        router.push({ path: '/sales' })
      }
    })
    return {
      ...toRefs(state),
      user,
      getCategoryList,
    }
  }
}
</script>
```

반응형을 잃는다는 것은 Composable의 장점을 없애버리는 선택이 될 수 있으므로 가능하면 사용을 비추천한다.

---

### Conventions and Best Practices

#### Naming

Composable 함수명은 camelCase이면서 'use'라는 단어로 시작해야 한다.

#### Input Arguments

Composable은 반응성에 의존하지 않는 경우라도 ref 매개변수를 받을 수 있다. 만약 다른 사람들이 사용할 가능성이 있는 Composable을 작성하고 있다면, 입력 매개변수를 일반 변수 대신 refs로 받는 것이 좋다. `unref()`함수를 통해 쉽게 사용 가능하기 때문이다.

```javascript
import { unref } from 'vue'
function useFeature(maybeRef) {
  // if maybeRef is indeed a ref, its .value will be returned(maybeRef.value)
  // otherwise, maybeRef is returned as-is(자기 자신)
  const value = unref(maybeRef)
}
```

만약 composable의 입력(input)이 ref면서 반응형 효과(reactive effects)를 생성한다면, `ref`를 `watch()`로 감싸거나 `watchEffect()` 내부에서 `unref()`를 호출해야 제대로 추적이 가능한 점을 잊지 말자.

#### Return Values

아마 의식적으로 계속 `reactive()` 대신에 `ref()`만을 사용한 걸 알아챘을 지 모른다. 추천하는 컨벤션은 항상 composable로부터 refs 객체를 반환하는 것으로,  반응성을 유지하면서 컴포넌트 안에서 구조 분해될 수 있게 하기 위함이다.

```javascript
// x and y are refs
const { x, y } = useMouse()
```

Composable에서 reactive 객체를 반환하는 것은 Composable 내부에서 상태로의 반응형 연결을 잃게 하는 원인이 된다. 

만약 Composable로부터 객체 속성으로 반환된 상태를 사용하는 걸 선호한다면, 반환된 객체를 `reactive()`로 감싸 사용할 수 있다.

```vue
<script>
	const mouse = reactive(useMouse())
  // mouse.x is linked to original ref
  console.log(mouse.x)
</script>
<template>
	Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
</template>
```

---

### Extracting Composables for Code Organization

Composables는 재사용을 위해서만 사용하는 것이 아니라, 코드 구성을 위해서도 사용한다. 컴포넌트의 복잡성이 증가하면서, 코드 탐색과 분석이 너무 방대해져 포기하게 되는 경우가 있다. Composition API는 컴포넌트를 논리적인 문제를 기반으로 더 작은 기능별로 구성할 유연성을 준다.

```vue
<script setup>
	import { useFeatureA } from './featureA.js'
  import { useFeatureB } from './featureB.js'
  import { useFeatureC } from './featureC.js'
  
  const { foo, bar } = useFeatureA()
  const { baz } = useFeatureB(foo)
  const { qux } = useFeatureC(baz)
</script>
```

위와 같은 방식으로 Composable간 스코프 구성을 고려해볼 수 있다.

---

### Using Composables in Options API

만약 Options API를 사용하고 있다면, composables는 반드시 `setup()` 안에서 호출되어야 하며, 반환된 데이터 묶음(bindings)은 반드시 `setup()`에서 반환되어야 한다. 그래야 Composable이 `this`안에 노출될 수 있다.

```javascript
import { useMouse } from  './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() exposed properties can be accessed on 'this'
    console.log(this.x)
  }
  // ...other options
}
```

