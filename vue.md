# Vue.js

## 목차

---

1. [컴포넌트 재활용](#컴포넌트 재활용)
   1. [Slots](#Slots)
      1. [Default Slot](#Default-Slot)

---
## Reusability
### Slots

다른 컴포넌트를 사용할 때 해당 컴포넌트의 마크업을 재정의하거나 확장할 때 사용한다.

디자인의 통일성을 유지하면서, 컴포넌트의 컨텐츠만 상황에 맞게 쓸 수 있는 장점이 있다.

Modal처럼 여러 화면에서 자주 사용하게 되는 컴포넌트에 Slot을 적용하게 된다.



#### Default Slot

간단한 슬롯을 만들어보자.

Child.vue

```vue
<div>
  <slot></slot>
</div>
```



Parent.vue

```vue
<child>
	결과는?
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: {Child}
  }
</script>
```

result

```vue
<div>
  결과는?
</div>
```



#### 중복 슬롯과 Default

만약 익명 슬롯이 두개라면 어떻게 될까?

Child.vue

```vue
<div>
  <slot></slot>
  <h2>
    <slot></slot>
  </h2>
</div>
```

Parent.vue

```vue
<child>
	<p>결과는?</p>
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: {Child}
  }
</script>
```

result

```vue
<div>
  <p>결과는?</p> <!-- HTML 같은 템플릿 코드를 포함시킬 수 있어 innerHTML처럼 작동한다. -->
  <h2><p>결과는?<p></h2>
</div>
```



Slot에 name 속성을 설정하지 않으면 **default**로 기본적으로 설정되고, 자식 컴포넌트의 Tag 안에서 Slot name을 명시하지 않고 값을 전달하게 되면 자동으로 `<slot></slot>` 혹은 ` <slot name="default"></slot>`에 값이 들어가게 된다. 위에서는 unnamed slot이 2개 존재했으므로, **두 군데에 모두** `<p>결과는</p>`가 적용되었다.

Child.vue

```vue
<div>
  <slot name="default"></slot>  <!-- unnamed Tag와 같은 것으로 인식된다. -->
</div>
```

Parent.vue

```vue
<child>
	Hello
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: {Child}
  }
</script>
```

result

```html
<div>
  Hello
</div>
```



#### 기본값 설정

만약 Slot에 아무 값도 보내지 않았다면 어떻게 될까? Slot이 있어야 할 자리에 아무 값도 출력되지 않을 것이다. 그럴 때를 대비하여 Slot에 기본값을 줄 수 있다.

Child.vue

```vue
<div>
  <slot>기본 Slot 값입니다.</slot>
</div>
```

Parent.vue

```vue
<child></child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: {Child}
  }
</script>
```

result

```vue
<div>
  기본 Slot 값입니다.
</div>
```



#### Named Slot

그렇다면 Named slot은 어떻게 사용해야 할까? `<template v-slot:slotName>` Tag를 사용하여 각 Slot과 매칭시킨다.

Child.vue

```vue
<div>
  <slot name="container"></slot>
  <div>
    <slot></slot>
  </div>
</div>
```

Parent.vue

```vue
<child>
  <template #default>  <!-- v-slot의 축약어는 #이다. -->
		이곳은 default
  </template>
	<teamplate v-slot:container>
    <p>
      이곳은 Container
    </p>
  </teamplate>
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: {Child}
  }
</script>
```

↑ 위처럼 순서를 달리 Child.vue와 컴포넌트 구조를 다르게 구성하더라도 결과는,

result

```vue
<div>
  <p>이곳은 Container</p>
  <div>
    이곳은 Default
  </div>
</div>
```

Child.vue에 정의했던 순서대로 제대로 출력된다. 하지만 컴포넌트 구조를 헷갈리게 하고 유지보수에 혼란을 줄 수 있어 Slot이 작성된 vue 페이지의 구성을 따라 코딩하는 것을 추천한다.



#### Dynamic Slot Names

동적으로 슬롯명을 할당하고 싶은 경우에는 `[]`를 사용한다.

Child.vue

```vue
<div>
  <slot name="container"></slot>
  <div>
    <slot></slot>
  </div>
</div>
```

Parent.vue

```vue
<child>
	<teamplate v-slot:[dynamicSlotName]>
    <p>이곳은 Container</p>
  </teamplate>
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: { Child },
    setup(props) {
      const dynamicSlotName = 'container'
      return {
        dynamicSlotName
      }
    }
  }
</script>
```

result

```vue
<div>
  <p>이곳은 Container</p>
</div>
```



#### Slot Props

`<slot></slot>`이 선언되어 있는 자식 컴포넌트의 데이터 값을 부모 컴포넌트에서 사용하고 싶은 경우가 있을 것이다. 그런 경우 사용하는 것이 **Slot Props(슬롯 속성)**이다.

Child.vue

```vue
<div>
  <slot name="container" v-bind:userData="user" :fruitsData="fruits"></slot>
</div>

<script>
export default {
  data () {
    return {
      user: {
        lastName: 'Doe',
        firstName: 'Jane'
      }
    }
  },
  setup () {  // setup도 정상적으로 작동된다.
    const fruits = ['apple', 'banana']
    return {
      fruits
    }
  }
}
</script>
```

Parent.vue

```vue
<child>
	<teamplate v-slot:container="slotProps">
		{{ slotProps }}
    {{ typeof(SlotProps) }}
  </teamplate>
</child>

<script>
  import Child from 'CHILD_VUE_PATH/child.vue'
  export default {
    component: { Child }
  }
</script>
```

result

```html
<div>
  {"userData": { "lastName": "Doe", "firstName": "Jane" }, "fruitsData": [ "apple", "banana" ]}
  object
</div>
```

`#slotName="slotPropsName"`을 할당해주면 자식 컴포넌트가 `v-bind`를 이용해 보낸 데이터 값을 참조할 수 있게 된다.

`slotPropsName`은 자식 컴포넌트의 Slot에서 바인딩된 데이터들 값을 가지는 **Object**이다.



#### 에러 발생 케이스

Parent.vue에서 같은 Slot을 두번 이상 호출하면 에러가 발생한다.

```vue
<!--Parent.vue-->
<div>
  <child>
    안녕  <!-- 암묵적인 #default 호출 -->
  	<template #default>안녕</template>
  </child>
</div>
```



중첩 Slot은 불가능하다. Template의 상위 Tag는 Template이 아니어야 한다.

```vue
<!--Child.vue-->
<div>
  <slot>
  	<slot></slot>
  </slot>
</div>
```

```vue
<!--Parent.vue-->
<child>
  <template>
		Hello
		<template></template>  <!-- Error 발생 -->
  </template>
</child>
```

그렇다면 중첩 Slot에 값을 보내면 어떻게 될까? **Slot이 중첩되지 않았을 때**는 **각 Slot에 값**이 전달됐었다.

```vue
<!--Parent.vue-->
<child>
	Hello
</child>
```

하지만 중첩 Slot에는 name이 같더라도 값이 전달되지 않는다.

```vue
<!--result-->
<div>
  Hello
</div>
```



### Render Mechanism

Vue는 어떻게 템플릿을 실제 DOM으로 변경하고 효과적으로 업데이트할까? 이를 아래에 소개할 Vue의 내부적인 렌더링 매커니즘을 통해 알아보자.

---

#### Virtual DOM

**VDOM**(virtual DOM)은 메모리에 저장된 가상 UI로 "real" DOM에 동기화된다.

아래의 예제를 보자.

```javascript
const vnode = {
  type: 'div',
  props: {
    id: 'foo'
  },
  children: [
    /* more vnodes */
  ]
```

위에 정의한 vnode는 순수 자바스크립트 객체로 `<div>` element를 구현하기 위해 필요한 모든 정보가 포함되어 있다. 또한 자식 vnode들을 포함하고 있어, virtual DOM tree(가상 돔 트리)의 root node역할을 한다.

Vue는 우리가 생성한 virtual DOM tree를 바탕으로 real DOM tree를 형성한다. 이를 `mount`라고 한다.

만약 둘 이상의 virtual DOM tree가 있다면 Vue는 두 tree를 비교해서 차이점을 찾아내고 actual DOM에 그 차이점을 적용한다. 이 과정을 `patch(혹은 diffing/reconciliation)`라고 한다.

virtual DOM의 주요 이점은 개발자에게 선언적인 방식으로 원하는 UI 구조를 생성하고 구현할 수 있게 한다는 것이다.



---

#### Render Pipeline

1. **Compile**: Vue 템플릿은 **render functions(렌더 함수)**에 컴파일되고, 함수는 virtual DOM trees를 반환한다.
2. **Mount**: The runtime renderer(실행환경 렌더러)는 render functions로부터 반환된 virtual DOM tree를 토대로 actual DOM nodes를 생성한다. 이 과정은 reactive effect(반응형)으로서 실행되며, reactive dependencies(반응형 의존성, reactive state 등)을 계속 감지한다.
3. **PATCH**: mount 도중에 dependency(의존성)에 변화가 감지되면(즉, 컴포넌트의 reactive state에 변화가 일어나면) re-rendering을 시작한다. 이 때 새로 업데이트된 virtual DOM tree가 생성되고, runtime renderer는 새로운 트리를 기존 트리와 비교하여 변경된 점을 actual DOM에 업데이트 한다.



---

#### Templates vs. Render Functions

Vue Templates는 virtual DOM render functions 안에 컴파일된다. Vue에선 template 생성을 생략하고 직접 render functions를 사용하는 것도 허용한다. Render functions는 자바스크립트를 이용해 vnode를 구현할 수 있어 동적인 logic을 구현할 때 template보다 훨씬 유연한 코드를 구성할 수 있다.

그런데도 왜 Vue는 template를 default로 추천할까? 여기엔 이러한 이유가 있다.

1. Templates는 진짜 HTML에 더욱 가깝다. 이는 HTML Snippets를 사용하기 더 쉽게 하고, CSS 디자이너들이 더 이해하기 쉬운 코드를 제공한다.
2. Templates는 더 정의적인(deterministic) 구문으로 이뤄져 정적으로 분석하기 더욱 쉽다. 이는 Vue의 템플릿 컴파일러가 virtual DOM의 퍼포먼스를 향상시키기 위해 더 많은 컴파일 최적화 과정을 수행하도록 한다.

따라서 대부분의 경우에 Templates를 사용하는 것이 훨씬 유용하다. Render functions는 오직 재사용 가능한 컴포넌트에서, 아주 높은 수준의 동적 렌더링 로직이 필요한 경우에만 사용한다.



---

#### Compiler-Informed Virtual DOM

React와 그 외 대다수에서 가상 돔(Virtual DOM)의 실행은 순수하게 runtime에서 일어난다. 재조정 알고리즘은 virtual DOM tree의 어떤 추정도 불가능하며, 동일성을 확인하기 위해 트리 전체를 가로지르며 모든 노드의 속성을 비교해야 한다.게다가 트리에 변화가 없더라도 새 가상노드는 항상 리-렌더링을 위해 생성되어 불필요한 메모리 누수를 발생시킨다. 이것이 virtual DOM의 가장 큰 단점 중 하나이다.

하지만 꼭 그럴 필요는 없다. Vue에서는 프레임워크가 컴파일러와 런타임 양쪽을 전부 통제한다. 이건 컴파일 최적화 향상에 이점을 주는데, 컴파일러는 템플릿을 정적으로 분석할 수 있고 이를 통해 언제든지 런타임에 지름길을 제공한다. 동시에, 우리는 여전히 특정 상황에서 개발자가 직접적인 DOM 제어를 위해 render function을 사용할 때를 대비해 성능을 보존한다. 우리는 이것을 hybrid approach Compiler-Informed Virtual DOM이라고 정의한다.



##### static hoisting

분명히 어떤 동적 바인딩도 포함하지 않는 템플릿이 애플리케이션 내에 있을 것이다.

```vue
<div>
  <div>foo</div> <!-- hoisted -->
  <div>bar</div> <!-- hoisted -->
  <div>dynamic</div>
</div>
```

`foo`와 `bar` divs는 정적이다 - 각 리-렌더링에서 vnode를 재생성하고 그들을 비교하는 것은 불필요하다. Vue 컴파일러는 자동적으로 render function에서 vnode 생성을 호이스팅하고, 매 렌더링시 같은 vnode를 재사용한다. 렌더러는 또한 기존 노드와 새 노드가 동일한 것을 감지했을 때 노드 비교를 완벽하게 생략할 수 있다.



### Render Functions

Vue의 경우 Template을 이용한 애플리케이션 구축을 권장하지만([Render Mechanism](#Render Mechanism) 참조), 라이브러리 등을 만드는 경우 가상 DOM을 활용하여 DOM을 렌더링 해야 하는 경우가 있다. 그런 경우를 위해 Vue는 Render Function을 제공한다.



#### Creating Vnodes

Vue의 Render Function은 `h()`함수를 이용해 사용할 수 있다. `h()`함수는 **hyperscript**의 줄임말로, "HTML을 생성하는 JavaScript"를 의미한다. 명확한 의미를 담은 함수명은 `createVnode()`가 될 수 있으나 간단한 함수명으로 코딩에 편의성을 주었다.

기본적인 구조는 아래와 같다.

```javascript
function h(Type(타입, 태그), { ...Props(프로퍼티, 태그 속성) }, [ ...Children(자식, 자식 태그) ]) {
  return `<${Type} ${...Props}>${Children}</${Tag}>`
}
```

JavaScript

```javascript
import { h } from 'vue'

const Foo = {
  setup () {
    const msg = 'hello'
    return () => {
      return h('div', msg)
    }
  }
}

export { Foo }
```

Vue

```vue
<template>
	<div>
    <Foo></Foo>
  </div>
</template>

<script>
import { Foo } from 'FOO_JS_PATH'
export default {
  components: { Foo }
}
</script>
```

result

```html
<div>
  <div>
    hello
  </div>
</div>
```

Vnode는 기본적으로 이와 같은 형태를 반환한다.

```javascript
const vnode = h('div', { id: 'foo' }, [])
vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

#### Declaring Render Functions

`render()` 함수를 선언해서 생성할 수도 있다.

JavaScript

```javascript
import { h } from 'vue'
const Example = {
  setup(props, _ref) {
  	const { slots } = _ref
		const msg = 'hello guys'
    return {
      msg
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Vue

```vue
<template>
	<div>
  	<Example></Example>
  </div>
</template>

<script>
import { Example } from 'EXAMPLE_JS_PATH'
export default {
  components: { Example }
}
</script>
```

result

```html
<div>
  <div>hello guys</div>
</div>
```

`render()`함수는 setup에 정의된 Component instance에 `this`를 통해 접근이 가능하다.

Array를 이용하면 여러 개의 vnodes를 전달할 수 있다.

```javascript
render() {
  return [h('div', this.msg), h('span', this.msg), 'hello world']
}
```

result

```html
<div>
  <div>hello guys</div>
  <span>hello guys</span>
  hello world
</div>
```

#### Vnodes Must Be Unique

컴포넌트 내의 모든 Vnodes는 반드시 **독립적**이고 **유일해야** 한다. 이는 아래의 예제는 틀렸음을 의미한다.

```javascript
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Yikes - duplicate vnodes !
    p,
    p
  ])
}
```

만약 *정말로* 같은 요소(element)/컴포넌트(component)를 중복해서 사용하고 싶다면, **factory function**을 사용할 수 있다.

```javascript
function render() {
  return h(
    'div',
    Array.from({ length: 20}).map(() => {
      return h('p', 'hi')
    })
  )
}
```



#### Render Function Recipes

템플릿 구성을 심화하기 위한 몇가지 예시를 알아보자.

##### v-if

Template

```html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Render Function

```javascript
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```



##### v-for

Template

```html
<ul>
  <li v-for="{ id, text } in items" :key="id">
  	{{ text }}
  </li>
</ul>
```

Render Function

```javascript
h(
	'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```



##### v-on

```javascript
h(
	'button',
  {
    onClick(event) {
      /*...*/
    }
  },
  'click me!'
)
```



##### Event Modifiers

`passive`, `capture`, `once` 같은 이벤트 옵션들은, 카멜 케이스로 이벤트명에 뒤이어 작성하여 줄 수 있다.

```javascript
h('input', {
  onClickCapture() {
    /* listner in capture mode */
  },
  onKeyupOnce() {
    /* triggers only once */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

다른 이벤트나 키 옵션을 위해선, `withModifiers`헬퍼를 사용할 수 있다.

```javascript
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```



#### Components

컴포넌트로 vnode를 생성하기 위해선, `h()` 함수의 첫 매개인자로 컴포넌트 정의가 주어져야 한다. 이것은 렌더 함수를 사용할 때 컴포넌트 등록이 필수적이 아님을 뜻하며, 필요한 경우 그냥 import하여 사용할 수 있다.

```javascript
import Foo from './Foo.vue'
import Bar from './Bar.vue'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

예제를 통해 결과를 알아보자.

JavaScript

```javascript
import { h } from 'vue'
import FooView from './FooView'
const Example = {
  setup (props, _ref) {
    const {
      slots
    } = _ref
    const msg = 'hello guys'
    const vnode = h(
      'div',
      { class: 'foo' }, msg
    )
    return {
      msg,
      slots,
      vnode
    }
  },
  render () {
    // 'hello world'는 text로 태그없이 그냥 들어오게 된다.
    return this.msg === 'hello world' ? [this.vnode, h('span', {}, this.msg), 'hello world!', h('div', {}, this.$slots.default && this.$slots.default()), h('div', [h(FooView)])] : h(FooView)
  }
}

export { Example }

```

Vue

```vue
<template>
	<div>
    <Example></Example>
  </div>
</template>
<script>
  import Example from 'EXAMPLE_JS_PATH'
  export default {
    components: { Example }
  }
</script>
<!-- FooView.vue -->
<template>
<div>
  이곳은 Foo View 입니다.
</div>
</template>
<script>
export default {
  name: 'FooView'
  ...
}
</script>
```

result

```html
<div>
  <div>이곳은 Foo View 입니다.</div>
</div>
```



#### Rendering Slots

Render Function 내에서 slots은 `this.$slots`로 불러올 수 있다.

```javascript
export default {
  // props from parentComponent
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),
      
      // <div><slot name="footer" :text="message" /></div>
      h(
      	'div',
        this.$slots.footer({
          // slotProps
          text: this.message
        })
      )
    ]
  }
}
```

#### Passing Slots

컴포넌트에 자식 요소/컴포넌트를 전달하는 것은 요소(element)에 자식 요소/컴포넌트를 전달하는 것과 조금 다르게 동작한다. Array가 아닌 slot 함수 혹은 slot 함수들의 객체를 전달해야 한다. Slot functions은 일반적인 렌더 함수가 반환할 수 있는 모든 것을 반환할 수 있다. 

```javascript
// single default slot
h(MyComponent, () => 'hello')

// named slots
// notice the 'null' is required to avoid
// the slots object being treated as props
h(MyComponent, null ,{
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span','one'), h('span', 'two')]
})
```

#### Usage

이 챕터에서는 직접적인 사용 방법을 예시로 간단하게 알아볼 것이다. 위에서 보았듯이 가상돔을 렌더링하는 방식은 `h()`함수를 이용하는 방식과 `render()`함수를 이용하는 방식이 있다.

1. `h()`의 경우

   ```javascript
   // h-example.js
   import { h } from 'vue'
   
   export const HExample = {
     // 부모 컴포넌트로부터 전달받은 props
     props: {
       tag: {
         type: String,
         default: 'div'
       },
       color: {
         type: String,
         default: 'red'
       }
     },
     setup (props, context) {
       const {
         attrs,
         slots,
         emit,
         expose
       } = context
       // h를 직접 return시, 다른 변수들은 return이 불가능한데, 
       // 이 경우 expose와 ref를 통해 부모 컴포넌트에 값을 전달할 수 있다.
       const abc = () => `현재 props로 전달받은 태그 값은 ${props.tag}`
       const def = 'expose를 통해 값이 전달됩니다.'
       // expose 통한 return
       expose({
         abc,
         def
       })
       // context의 properties
       console.log(attrs, slots, emit, expose)
       return () => {
         // h 직접 return
         return h(props.tag,
           { style: [`color: ${props.color}`] },
           // [] 내 순서대로 rendering 된다.
           [
             'Children 1번입니다.', h('div', 'Children 2번 입니다.'), slots.default && slots.default()
           ])
       }
     }
   }
   
   
   ```

   

   ```vue
   <!-- Vue -->
   <template>
     <div class="h">
       <HExample color="black" ref="hexample">
         <template #default>
           <br />
           <div>{{ def }}</div>
           <div>{{ abc }}</div>
         </template>
       </HExample>
     </div>
   </template>
   
   <script>
   import { HExample } from '@/assets/js/h-example.js'
   import { ref, onMounted } from 'vue'
   export default {
     name: 'HyperScriptView',
     components: {
       HExample
     },
     setup () {
       // setup의 경우 this의 사용이 불가능하므로 this.$refs가 불가능.
       // ref와 동일한 이름 가진 변수 설정시, ref와 같이 작동
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
   ```

   ```html
   <!-- result -->
   <div class="h">
     <div style="color: black">
       "Children 1번입니다."
       <div>Children 2번 입니다.</div>
       <br />
       <div>expose를 통해 값이 전달됩니다.</div>
       <div>현재 props로 전달받은 태그 값은 div</div>
     </div>
   </div>
   ```

2. render의 경우
   위의 결과를 `render()`함수로 똑같이 만들어보자.
   ```javascript
   // render-example.js
   import { h } from 'vue'
   
   export const RenderExample = {
     props: {
       tag: {
         type: String,
         default: 'div'
       },
       color: {
         type: String,
         default: 'red'
       }
     },
     data () {
       return {
         abc: `현재 props로 전달받은 태그 값은 ${this.tag}`,
         def: 'this.$refs를 통해 값이 전달됩니다.'
       }
     },
     render ($setup) {
       return h(this.tag,
         { style: [`color: ${this.color}`] },
         [
           'Children 1번입니다.', h('div', 'Children 2번 입니다.'),
         	// default()에 slotProps 전달
           this.$slots.default && this.$slots.default({ abc: this.abc, def: this.def })
         ]
       )
     }
   }
   ```

   ```vue
   <!-- Vue -->
   <template>
     <div class="render">
       <RenderExample color="blue" ref="child_comp">
         <template #default="props" v-if="def">
           <!-- slot Props 이용 -->
           {{ props.abc }}
           <!-- refs 이용 -->
           <div>{{ def }}</div>
         </template>
       </RenderExample>
     </div>
   </template>
   <script>
   import { RenderExample } from '@/assets/js/render-example.js'
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
     },
     // mounted가 완료된 이후 $refs 조회가 가능하다.
     mounted () {
       this.def = this.$refs.child_comp.def
     }
   }
   </script>
   
   ```
   
   ```html
   <!-- Result -->
   <div class="render">
     <div style="color: blue;">
       "Children 1번입니다."
       <div>Children 2번 입니다.</div>
   		"현재 props로 전달받은 태그 값은 div"
       <div>this.$refs를 통해 값이 전달됩니다.</div>
     </div>
   </div>
   ```
   
   `render()`를 이용한 구현은 좀 더 Vue2의 Options API를 적극적으로 활용한 코드에 가깝게 보인다.

---



#### Slots in render function

컴포넌트 내에 render function으로 만들어진 DOM을 반환하는 컴포넌트를 불러온다고 가정해보자. 우리는 이와 같이 코드를 짤 수 있을 것이다.

```javascript
// javascript
import { h } from 'vue'
export const WithoutSlots = {
  setup () {
    return () => {
      return h('div', [], {})
    }
  }
}
```

```vue
<template>
<div>
  <without-slots>컨텐츠를 넣고 싶어요.</without-slots>
</div>
</template>
<script>
import { WithoutSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithoutSlots
  }
}
</script>
```

```html
<!-- Result -->
<div>
  <!-- 아무것도 들어오지 않는다. -->
  <div></div>
</div>
```

하지만 부모 컴포넌트에서 보낸 값을 자식 컴포넌트에서 읽지 못한다. 위와 같은 경우 사용했던 것이 [Slots](#Slots)인데, Render function에도 Slots를 줄 수 있다.

```javascript
// js
export const WithSlots = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // slots.default로 slot에 들어온 값이 있는 지 체크 후, default() 함수를 실행해 리스트를 읽어온다.
      return h('div', {}, [slots.default && slots.default()])
    }
  }
}
```

```vue
<!-- vue -->
<template>
<div>
  <without-slots>컨텐츠를 넣고 싶어요.</without-slots>
  <with-slots>슬롯을 선언한 경우에요.</with-slots>
</div>
</template>
<script>
import { WithoutSlots, WithSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithoutSlots,
    WithSlots
  }
}
</script>
```

```html
<div>
  <div></div>
  <div>슬롯을 선언한 경우에요.</div>
</div>
```

---



##### Return from slots.default()

`h()`함수 내 Slots의 동작 원리에 대해 조금 더 알아보자. `slots.default()`는 무엇을 반환할까?

```javascript
// javascript
export const WithSlots = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // default 슬롯을 부모 컴포넌트가 사용했는 지 확인 후(slots.default)
      // 사용한 경우 default() 함수를 통해 리스트를 반환받는다.
      return h('div', {}, [console.log(slots.default()), slots.default && slots.default()])
    }
  }
}
```

```vue
<!-- vue -->
<template>
<div>
  <with-slots>
    <div ref="hello">안녕하세요.</div>
  </with-slots>
</div>
</template>
<script>
import { WithSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithoutSlots
  }
}
</script>
```

```javascript
// slots.default() 반환 객체
// Slot이 상위 컴포넌트에 선언된 경우, 그 값을 포함한 List를 반환한다.
[{…}]
[
  0:
	{
    anchor: null
    appContext: null
    children: "안녕하세요."
    component: null
    dirs: null
    dynamicChildren: null
    dynamicProps: null
    el: null
    key: null
    patchFlag: 512
    props: {ref: 'hello'}
    ref: {i: {…}, r: 'hello', k: undefined, f: false}
    scopeId: null
    shapeFlag: 9
    slotScopeIds: null
    ssContent: null
    ssFallback: null
    staticCount: 0
    suspense: null
    target: null
    targetAnchor: null
    transition: null
    type: "div"
    __v_isVNode: true
    __v_skip: true
    [[Prototype]]: Object
    length: 1
    [[Prototype]]: Array(0)
  }
]
```

```vue
<!-- vue -->
<template>
<div>
  <with-slots>
    <template #default>안녕</template>
  </with-slots>
</div>
</template>
<script>
import {  WithSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithSlots
  }
}
</script>
```

```html
<!-- result -->
<div>
  <div>안녕</div>
</div>
```

만약 그렇다면, Slots을 선언은 했지만 비워서 보낸다면 어떻게 될까? 비어있는 List를 반환한다.

```vue
<!-- vue -->
<template>
<div>
  <with-slots>
    <!-- 값이 없다. -->
    <template #default></template>
  </with-slots>
</div>
</template>
<script>
import {  WithSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithSlots
  }
}
</script>
```

```javascript
// slots.default() 반환 객체
// 빈 list를 반환한다.
[]
```

하지만 template 내 주석이 있는 경우, **children**으로 인식하므로 주의할 것!

```vue
<template #foo>
	<!-- 반갑습니다. Foo slot입니다. -->
</template>
```

```javascript
[{...}]
	{ 0:
  	[
  	anchor: null,
  	appContext: null,
	  children: " 반갑습니다. Foo slot입니다. "
  	...
  	]
	}
```

---



##### Default Value of Slots

위의 결과를 응용하면, Slots에 Default 값을 줄 수 있다.

```javascript
// js
export const WithSlots = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // list[0] != null인 경우, children이 있음을 의미
      return h('div', {}, [slots.default && slots.default()[0] ? slots.default() : 'Default 값입니다.'])
    }
  }
}
```

```vue
<!-- vue -->
<template>
<div>
  <with-slots>
    <template #default></template>
  </with-slots>
</div>
</template>
<script>
import {  WithSlots } from '@/assets/js/render-function/without-slots.js'
export default {
  components: {
    WithSlots
  }
}
</script>
```

```html
<!-- result -->
<div>
  <div>Default 값입니다.</div>
</div>
```

---



##### Named Slot in render function

`setup(props, context)`의 매개변수(Parameter) context내 Slots은 **하나의 객체(Object)**이다. 따라서 Named Slot은 `Slots[PropertyName]`혹은 `SlotsName.PropertyName`의 형태로 불러올 수 있다.(eslint에선 Dot notation (.PropertyName)을 더 좋은 방식으로 추천한다.)

```javascript
// js
export const NamedSlot = {
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // default, foo 순서로 children 컴포넌트를 구성했다.
      return h('div', {}, [slots.default && slots.default()[0] ? slots.default() : h('div', {}, ['Default 값입니다.']), slots.foo && slots.foo[0] ? slots.foo() : 'Foo Slot default'])
    }
  }
}
```

```vue
<!-- vue -->
<component>
  <!-- foo, default 순서로 보내도.. -->
  <template #foo>
		반갑습니다. Foo slot입니다.
  </template>
  <div>Named Slot 내부입니다.</div>
</component>
```

```html
<!-- result -->
<!-- 순서는 h() 내에 정의한 순서를 따라서 배치된다. -->
<div>
  <div>Named Slot 내부입니다.</div>
  " 반갑습니다. Foo Slot 입니다."
</div>
```



##### Components in render function and Slots

render function의 *type* 매개변수에 html tag를 넣지 않고 컴포넌트를 불러오는 경우, 컴포넌트 내부에 Slot의 Default 값을 지정해줄 수 있다. 하지만 불러오는 방식을 다르게 해야 한다. 기존의 불러오는 방식대로 불러와 보자.

```javascript
function h(Component, {...Props}, [...Children])
```



```vue
<!-- Child.vue -->
<template>
  <div>
    <div>Child.vue입니다.</div>
    <!-- default, bar의 순서이다. -->
    <slot>
      Child Default에용
    </slot>
    <slot name="bar">
      <div> Child Bar에용</div>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'ChildComponent',
  setup () {}
}
</script>
```

```vue
<!-- ParentView.vue -->
<template>
<div>
  <CompSlot>
    <!-- default, bar의 순서이다. -->
    <template #default>
      안녕하세요? Parent의 Default입니다.
    </template>
    <template #bar>
      <div>
        네, Parent의 bar입니다. 반갑습니다.
      </div>
    </template>
  </CompSlot>
</div>
</template>
<script>
import { CompSlot } from '@/assets/js/render-function/slots.js'
export default {
  components: {
    CompSlot
  }
}
</script>

```

```javascript
// js
import Child from '${PATH}/Child.vue'
export const CompSlot = {
  components: {
    Child
  },
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // bar, default의 순서이다.
      return h(Child, {}, [slots.bar && slots.bar(), context.slots.default && context.slots.default()])
    }
  }
}
```

```html
<!-- result -->
<div>
  <div>Child.vue입니다.</div>
  <!-- 부모의 #bar -->
  <div>네, Parent의 bar입니다. 반갑습니다.</div>
  <!-- 부모의 #default -->
  "안녕하세요? Parent의 default입니다."
  <!-- Child의 slot name="bar" Default값이 여기에? -->
  <div>Child Bar에용</div>
</div>
```

두 가지 점을 알 수 있다.

- `Child.vue`의 구조가 아닌 `h()`function의 Children 순서에 맞추어 출력된다.
- 출력되지 말았어야 할 `<div>Childe Bar에용</div>`가 출력되었다.

위에서 발생한 문제를 방지하려면 *Children* Arguments를 전달할 때, Object 형태로 보내주어야 한다.

```javascript
// js
import Child from '${PATH}/Child.vue'
export const CompSlot = {
  components: {
    Child
  },
  setup (props, context) {
    const {
      slots
    } = context
    return () => {
      // bar, default의 순서이다.
      // Object 형태로 Children을 보내준다.
      return h(Child, {}, {
        default: context.slots.bar && context.slots.bar(), 
        bar: () => context.slots.default && context.slots.default()])
    	}
    }
  }
}
```

```html
<!-- result -->
<div>
  <div>Child.vue입니다.</div>
  <!-- Child.vue에 정의된 순서에 따라 slot이 제대로 배치되었다. -->
  "안녕하세요? Parent의 default입니다."
  <div>네, Parent의 bar입니다. 반갑습니다.</div>
</div>
```

의도했던 대로 결과가 들어온다.

- Child.vue의 구성에 맞게 컴포넌트가 출력이 된다.
- Parent에서 값을 주었을 때, Child에 설정한 Default 값이 출력되지 않고 있다.

##### Slot Props

Slot Props 이런 형태로 줄 수 있다.

`return h(..., [slots.default({ PROPS_NAME: PROPS_VALUE })])`

 Slots에서도 언급했지만, 일반적인 Props가 부모 컴포넌트로부터 자식 컴포넌트에 데이터를 전달하는 것과 달리, Slot Props는 Slot이 정의된 컴포넌트에서 Slot이 정의된 컴포넌트를 호출한 컴포넌트에 데이터를 전달한다.(자식에서 부모로 데이터가 전달되는 것처럼 느껴질 수 있다.)

```javascript
// js
export const SlotProps = {
  setup (props, context) {
    const state = reactive({
      food: ['burger', 'chicken', 'ramyeon'],
      beverage: ['powerade', 'coke', 'cider']
    })
    const {
      slots
    } = context
    return () => {
      // props 전달
      return h('div', {}, [slots.default && slots.default({ state: toRefs(state) })])
    }
  }
}
```

```vue
<!-- vue -->
<template>
<div>
  Render function의 Slot Props Test
  <slot-props>
    <!-- #SLOT_NAME="PROPS_NAME" 형태로 호출. PROPS_NAME은 자유롭게 줄 수 있다.-->
    <template #default="props">
      {{ props }}
    </template>
  </slot-props>
</div>
</template>
<script>
import { SlotProps } from '@/assets/js/render-function/slots.js'
export default {
  components: {
    SlotProps
  }
}
</script>
```

```html
<!-- result -->
<div>
  " Render function의 Slot Props Test "
  <div>
    { "state": { "food": ["burger", "chicken", "ramyeon"], "beverage": ["powerade", "coke", "cider"] } }
  </div>
</div>
```



### Building SLIDER LIbrary

Test.vue

```vue
<template>
  <div>
    <div id="components-demo">
      <render-test tag="span"><img src="../assets/images/skyblue.jpg" alt="">
      </render-test>
    </div>
  </div>
</template>
<script>
import { RenderTest } from '../assets/js/render-test'
import '../assets/css/test.css'
export default {
  name: 'TestView',
  components: {
    RenderTest
  },
  setup () {
  }
}
</script>

```

render-test.js

```javascript
import { h, ref } from 'vue'

// Define a new global component called button-counter
const ButtonCounter = {
  name: 'button-counter',
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup (props, _ref) {
    console.log(props, _ref)
    const {
      slots
    } = _ref
    const sliderClass = ref('slider-slide')
    return () => {
      // return h('div', {}, h('img'))
      return h(props.tag, {
        class: sliderClass.value
        // 외부 컴포넌트 렌더링
      }, slots['container-start'])
    }
  }
}

export { ButtonCounter }

```



### Mixins & Composables

#### mixins

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

#### What is a "Composable"?

Composable은 **상태 저장 논리(Stateful Logic)**를 캡슐화하고 재사용하는 Composition API 기능이다.

Frontend 앱을 설계할 때, 자주 반복해서 사용되는 몇 가지 기능들이 있다. 예를 들면, 여러 곳에 날짜를 지정해야 하는 경우가 있고 이 과정에 재사용하는 함수들을 추출한다. 이 포맷터 함수(Fommater function)는 상태 비저장 논리(stateless logic)을 캡슐화한다. 포맷터 함수는 몇 가지 인풋을 받고 즉시 예상되는 아웃풋을 반환하다. 이렇게 상태 비저장 논리(비반응형 함수라고 생각하시면 편합니다.)를 재사용하기 위한 수많은 라이브러리가 있다(예를 들면 lodash, date-fns 등등)

이에 비해 상태 저장 논리는 변화하는 상태를 관리하는 것을 포함한다. 간단한 예로 현재 페이지의 마우스 위치를 추적하는 것을 들 수 있다. 물론 실제 프로젝트에선, 터치 제스쳐나 데이터와의 연결 속성같은 더욱 복잡한 논리(Logic) 예도 있을 수 있다.

---

#### Mouse Tracker Example

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

#### Async State Example

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

#### No Reactivity

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

#### Conventions and Best Practices

##### Naming

Composable 함수명은 camelCase이면서 'use'라는 단어로 시작해야 한다.

##### Input Arguments

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

##### Return Values

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

#### Extracting Composables for Code Organization

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

#### Using Composables in Options API

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

---

##### Comparison with Other Techniques

**vs. Mixins**

Vue 2 사용자는 아마도 재사용 가능한 유닛 안에서  컴포넌트 논리를 추출하는 mixins 옵션과 친숙할 것이다. mixins에는 3가지의 주요한 문제점이 있다.

1. **불분명한 속성의 출처**: 많은 mixins를 사용할 때, 어떤 인스턴스 프로퍼티가 어느 mixin에서 주입되었는 지 불분명해지며, 컴포넌트의 실행과정을 추적하고 이해하는 것을 어렵게 만든다. 이것이 Composables에서 refs와 구조분해 패턴의 사용을 추천하는 이유기도 하다. refs와 구조분해 패턴은 컴포넌트 내의 프로퍼티 출처를 명확하게 한다.
2. **이름공간 충돌(Namespace collisions)**: 

## Reactivity

reactive



## 참고

https://velog.io/@soulee__/Vue.js-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C-%EB%9C%AF%EC%96%B4%EB%B3%B4%EA%B8%B0-Refs

https://joshua1988.github.io/vue3-composition-api/

https://vuejs.org/api/composition-api-setup.html#usage-with-render-functions

https://www.vuemastery.com/blog/understanding-vue-3-expose/

expose : ref처럼 부모에서 컴포넌트 사용이 가능하도록 자식 컴포넌트 방출 / 렌더 펑션 return할 때 다른 변수 return이 불가능하므로 다른 변수 사용을 원할 때 효율 있음.

https://vuejs.org/guide/essentials/template-refs.html

https://stackoverflow.com/questions/71440230/how-to-use-axios-with-vue-3-composition-api

https://v3.ko.vuejs.org/guide/reactivity-fundamentals.html#%E1%84%87%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%BC%E1%84%92%E1%85%A7%E1%86%BC-%E1%84%89%E1%85%A1%E1%86%BC%E1%84%90%E1%85%A2-%E1%84%80%E1%85%AE%E1%84%8C%E1%85%A9-%E1%84%87%E1%85%AE%E1%86%AB%E1%84%92%E1%85%A2%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5-destructuring

mixins

https://vuejs.org/api/options-composition.html#mixins

https://vuejs.org/guide/reusability/composables.html#mouse-tracker-example

swal

https://stackoverflow.com/questions/68452269/calling-sweetalert2-inside-async-method-in-vue-3

sweetalert2

https://sweetalert2.github.io/#download

## ESLint 설정

no-trailing-space 설정 끄기

https://docs.w3cub.com/

## 정리할 것

eslint 설정 / Slots 마무리 / reactivity(reactive 및 ref) /  export default와 export const-function간 import 방식 차이

---



[^1]: 출처 https://vuejs.org/guide/reusability/composables.html#async-state-example
