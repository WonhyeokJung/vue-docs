# Slots

다른 컴포넌트를 사용할 때 해당 컴포넌트의 마크업을 재정의하거나 확장할 때 사용한다. 흔히 자주 사용하는 컴포넌트의 `layout`을 짜두고자 할 때 slot을 이용한 컴포넌트를 작성하게 된다.

디자인의 통일성을 유지하면서, 컴포넌트의 컨텐츠만 상황에 맞게 쓸 수 있는 장점이 있다.

Modal처럼 여러 화면에서 자주 사용하게 되는 컴포넌트를 Slot을 적용하게 된다.



## 목차

---

1. [Default Slot](#Default-Slot)
2. [중복 슬롯과 Default](#중복-슬롯과-Default)
3. [기본값 설정](#기본값-설정)
4. [Render Scope](#Render-Scope)
5. [Named Slot](#Named-Slot)
6. [Dynamic Slot Names](#Dynamic-Slot-Names)
7. [Scoped Slots](#Scoped-SLots)
   1. Named Scoped Slots
   2. Renderless Components
   3. Slot Props Usage

8. [에러 발생 케이스](#에러-발생-케이스)

---

## Default Slot

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



## 중복 슬롯과 Default

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



## 기본값 설정

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

## Render Scope

Slot 컨텐츠는 부모 컴포넌트의 데이터 범위에 접근할 수 있는데, 그 이유는 슬롯 컨텐츠가 부모 컴포넌트에서 정의되기 때문이다. 예시를 보자.

```vue
<template>
	<span>{{ message }}</span>
	<!-- import한 컴포넌트의 컨텐츠는 부모 컴포넌트에서 적용된다. -->
	<Component>{{ message }}</Component>
</template>
```

두 `{{ message }}` 보간법(interpolations)는 같은 내용을 렌더할 것이다.

Slot 컨텐츠는 자식 컴포넌트(즉, 슬롯이 정의된 컴포넌트)에 접근하지 못한다. 이 규칙을 기억해두자.

> 부모 템플릿에 있는 모든 것은 부모 스코프에 컴파일된다. 자식 템플릿에 있는 템플릿은 자식 스코프에 컴파일된다.

## Named Slot

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



## Dynamic Slot Names

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



## Scoped Slots

[Render Scope](#Render-Scope)에서 이야기했던 것처럼, Slot 컨텐츠는 자식 컴포넌트의 상태(state)에 접근하지 못한다. 

하지만, Slot 컨텐츠가 부모 스코프와 자식 스코프 양쪽에서 데이터를 사용할 수 있는 유용한 방법들이 있다. 이를 위해, 렌더링을 할 때 자식 컴포넌트의 Slot에서 데이터를 전달하는 방법이 필요하다.

사실은, 컴포넌트에 Props를 전달하는 것처럼, slot outlet(element, tag)에 속성을 전달하는 것으로 할 수 있다.

```vue
<!-- MyComponent template -->
<div>
  <!-- Scoped slot outlet -->
  <slot :text="greetingMessage" :count="1"></slot>
  <!---->
</div>
<script>
 export default {
   setup() {
     const greetingMessage = 'hello'
     return {
       greetingMessage
     }
   }
 }
</script>
```

Slot Props를 전달 받는 것은 단일(single) default slot을 사용할 때와 named slot 사용할 때에 따라 조금 다르다. 먼저 자식 컴포넌트 tag에 직접 `v-slot`을 선언해서, 단순 default slot을 사용할 때 slot props를 전달 받는 방법을 먼저 보자.

Vue 2.6 이전

```vue
<MyComponent slot-scope="slotProps">
  <!-- Scoped slot content -->
	{{ slotProps.text }} {{ slotProps.count }}
  <!---->
</MyComponent>
```

Vue 2.6 이전에는 slot-scope라는 속성을 정의하여 Slot props를 전달받을 수 있었다. 하지만 의미적으로 뜻하는 바가 정확하지 않으며 혼동을 줄 수 있는 속성명이라고 판단되어 v-slot, 즉 directive처럼 명칭을 변경한다.(하지만 공식문서 항목명은 여전히 Scoped Slots이다.)

현재(Vue2.6~)

```vue
<MyComponent v-slot="slotProps">
	&#123;&#123; slotProps.text &#125;&#125; {{ slotProps.count }}
</MyComponent>
```

위에서 본 것처럼 자식 컴포넌트(MyComponent)에서 부모 컴포넌트로 props가 전달된다. 기존에 사용하던 일반적인 Props는 **부모 컴포넌트로부터 자식 컴포넌트**로 데이터가 전달되던 것에 반해, slot Props는 **자식 컴포넌트에서 부모 컴포넌트**로 데이터가 전달되는 마치 **emit**처럼 작동하고 있다. 이는 **v-slot**이라는 **속성명(Property Name)**을 통해 데이터를 전달받아 Slot Props(Scoped Slots)롬 명명되었다고 보면 된다. 하지만 설명한 것처럼 자식 컴포넌트(슬롯이 정의된 컴포넌트)로부터 부모 컴포넌트(슬롯을 불러온 컴포넌트)의 구조임에 주의하자.

 자식 컴포넌트에 의해 Slot에 전달된 Props는 `v-slot`directive의 값(value)로서 사용이 가능하다. 

자식 컴포넌트에서 함수로써 scoped slot을 전달하는 것도 생각해볼 수 있는데, 자식 컴포넌트를 호출하면서, 인수(arguments)로서 props를 전달할 수 있다.

```javascript
MyComponent({
  // passing the default slot, but as a function
  default: (slotProps) => {
    return `${slotProps.text} ${slotProps.count}`
  }
})

function MyComponent(slots) {
  const greetingMessage = 'hello'
  return (
    `<div>${
    	// call the slot function with props!
    	slots.default({ text: greetingMessage, count: 1 })
    }</div>`
  )
}
```

이는 scoped slots이 컴파일되는 방식과 아주 유사하며, render function을 사용할 때 scoped slot(slot props)를 사용하는 방식이다.

어떻게 `v-slot="slotProps"`가 slot 함수의 특징과 매칭되는 지도 알아보자. 함수 인자(function arguments)처럼,  v-slot`에서 구조 분해(destructuring)를 사용할 수 있다.

```vue
<MyComponent v-slot="{ text, count }">
	{{ text }} {{ count }}
</MyComponent>
```

### Named Scoped Slots

Named scoped slots는 유사하게 작동한다 - slot props는 `v-slot`directive의 값(value)으로서 접근할 수 있다

```vue
<Component v-slot:slotName="slotProps"></Component>
```

단축표기(shorthand)를 사용할 때는, 이처럼 구성된다.

```vue
<MyComponent>
	<template #header="headerProps">
  	{{ headerProps }}
  </template>
	<template #default="defaultProps">
  	{{ defaultProps }}
  </template>
	<template #footer="footerProps">
  	{{ footerProps }}
  </template>
</MyComponent>
```

그리고, named slot에 props를 전달할 때는 이와 같다.

```vue
<slot name="header" message="hello" :something="variable"></slot>
```


### Fancy List Example

Scoped Slots의 좋은 케이스가 뭐가 있을 지 궁금할 수도 있다. 여기 예시가 있다: 여러 아이템 리스트를 렌더링하는 `<FancyList>`컴포넌트를 상상해보자. 데이터를 리모트(remote)할 때 보여줄 로딩 페이지를 만들고, 아이템 리스트를 보여주기 위해 데이터를 사용하고, 심지어 페이지네이션이나 무한 스크롤링(infinite scrolling) 등까지도 포함된 논리(logic)를 캡슐화해야 할 것이다. 하지만, 각 아이템을 어떻게 배치하고 디자인할 지에 대해선 부모 컴포넌트에게 맡겨 유연성을 주고 싶다. 결과는 아래와 비슷할 것이다.

```vue
<FancyList :api-url="url" :per-page="10">
	<template #item="{ body, username, likes }">
  	<div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

자식 컴포넌트인(Slot이 정의된 컴포넌트) `<FancyList>` 내부에, 다른 아이템 데이터들을 넣은 같은 `<slot>`을 여러 번 렌더링할 수도 있다.(`v-bind`로 객체 자체를 slot props로서 전달하고 있다. )

```vue
<ul>
  <li v-for="item in items">
  	<slot name="item" v-bind="item"></slot>
  </li>
</ul>
```


### Renderless Components

말그대로 마크업을 렌더링하지 않는 컴포넌트를 지칭하지만, 기능적인 의미에 가까우며 실제로는 `<slot>`을 통해 레이아웃(혹은 프레임)을 구성한 컴포넌트로, 다른 컴포넌트에 의해 사용되면서 렌더링하는 컴포넌트를 칭한다.(결국 렌더링이 완전히 일어나지 않는 컴포넌트가 아닌(Template이 없는!), 자기 스스로 렌더링하지 않는 컴포넌트에 가까운 뜻이라고 볼 수 있다. 물론, 정말로 template이나 render()자체가 없는 컴포넌트도 구현이 가능은 하겠지만, 이런 경우 [Composables](#Mixins-&-Composables)를 사용하는 것을 추천한다.)

이어서 위의 `<FancyList>`에 대해 이야기해 보자면, `<FancyList>`는 재사용가능한 로직(data fetching, pagination 등)과 시각적 출력(visual output) 둘 다 캡슐화한 사례다(scoped slot을 이용하여 자신을 호출한 컴포넌트에게 visual output 일부를 위임하긴 했지만)

만약 이 개념을 조금 더 확장해서, 스스로는 아무것도 렌더링하지 않고, 논리(logic)만을 캡슐화하는 컴포넌트를 사용하면 어떨까? - visual output은 scoped slots와 함께 완전히 부모 컴포넌트에게 위임하고 말이다! Vue에서는 이를 **Renderless Component**라고 부른다.

렌더리스 컴포넌트의 예시로는 현재 마우스 커서의 위치를 추적하는 논리를 캡슐화한 것을 들 수 있다.

```vue
<!-- MouseTracker.vue -->
<template>
  <slot :x="x" :y="y"/>
</template>
<script>
export default {
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  }
}
</script>
```

```vue
<!-- Parent -->
<MouseTracker v-slot="{x, y}">
	Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

이 흥미로운 패턴, Renderless Components의 최대 장점은 추가적인 컴포넌트 중첩 없이 Composition API와 함께 이용하여 더 효율적인 컴포넌트를 만들 수 있단 것이다. [Composables](#Mixins-&-Composables)챕터를 확인하면서 위 마우스 추적기 로직을 어떻게 기능적으로 이용하는 지 확인할 것이다.

어쨌거나, scoped slots은 여전히 논리와 visual output을 동시에 캡슐화해야 할 때 아주 유용하다. `<FancyList>`예제 처럼 말이다.



### Slot Props Usage

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

혹은 객체 구조 분해 할당(Object Destructuring)을 사용해서 이와 같이 불러올 수도 있다.

Parent.vue

```vue
<child>
	<template v-slot:container="{ userData, fruitsData }">
		{{ userData }}
		{{ typeof(userData) }}
  </template>
</child>
```



`#slotName="slotPropsName"`을 할당해주면 자식 컴포넌트가 `v-bind`를 이용해 보낸 데이터 값을 참조할 수 있게 된다.

`slotPropsName`은 자식 컴포넌트의 Slot에서 바인딩된 데이터들 값을 가지는 **Object**이다.



## 에러 발생 케이스

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

