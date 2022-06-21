# Render Functions

Vue의 경우 Template을 이용한 애플리케이션 구축을 권장하지만([Render Mechanism](#Render Mechanism) 참조), 라이브러리 등을 만드는 경우 가상 DOM을 활용하여 DOM을 렌더링 해야 하는 경우가 있다. 그런 경우를 위해 Vue는 Render Function을 제공한다.

## 목차

---

1. [Creating Vnodes](#Creating-Vnodes)
2. [Declaring Render Functions](#Declaring-Render-Functions)
3. [Vnodes Must Be Unique](#Vnodes-Must-Be-Unique)
4. [Render Function Recipes](#Render-Function-Recipes)
   1. v-if
   2. v-for
   3. v-on
   4. Event Modifiers
5. [Components](#Components)
6. [Rendering Slots](#Rendering-Slots)
7. [Passing Slots](#Passing-Slots)
8. [Usage](#Usage)
9. [Slots In Render Function](#Slots-in-render-function)
   1. Return from slots.default()
   2. Default Value of Slots
   3. Named Slot in render function
   4. Components in render function and Slots
   5. Slot Props

---

## Creating Vnodes

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

## Declaring Render Functions

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

## Vnodes Must Be Unique

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
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```



## Render Function Recipes

템플릿 구성을 심화하기 위한 몇가지 예시를 알아보자.

### v-if

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



### v-for

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



### v-on

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



### Event Modifiers

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



## Components

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



## Rendering Slots

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

## Passing Slots

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

## Usage

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
    		<!-- 원하는 ref명을 설정한다. -->   
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
       // ref와 동일한 이름 가진 변수 설정시, refs와 같이 작동
       const hexample = ref(null)
       const abc = ref('')
       const def = ref('')
       // ref onMounted 이후 읽기 가능.
       onMounted(() => {
         // refName.value로 보내준 값을 불러올 수 있다.
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



## Slots in render function

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



### Return from slots.default()

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



### Default Value of Slots

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



### Named Slot in render function

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



### Components in render function and Slots

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

### Slot Props

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



