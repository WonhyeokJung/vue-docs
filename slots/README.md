# Slots

다른 컴포넌트를 사용할 때 해당 컴포넌트의 마크업을 재정의하거나 확장할 때 사용한다. 흔히 자주 사용하는 컴포넌트의 `layout`을 짜두고자 할 때 slot을 이용한 컴포넌트를 작성하게 된다.

디자인의 통일성을 유지하면서, 컴포넌트의 컨텐츠만 상황에 맞게 쓸 수 있는 장점이 있다.

Modal처럼 여러 화면에서 자주 사용하게 되는 컴포넌트를 Slot을 적용하게 된다.



## 목차

---

1. [Default Slot](#Default-Slot)
2. [중복 슬롯과 Default](#중복-슬롯과-Default)
3. [기본값 설정](#기본값-설정)
4. [Named Slot](#Named-Slot)
5. [Dynamic Slot Names](#Dynamic-Slot-Names)
6. [Slot Props](#Slot-Props)
7. [에러 발생 케이스](#에러-발생-케이스)

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



## Slot Props

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



## [에러 발생 케이스](#목차)

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

