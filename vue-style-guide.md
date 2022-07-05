# Vue.js Style Guide

🎈참고

[스타일 가이드 | Vue.js](https://v3.ko.vuejs.org/style-guide/)

[Style Guide - Vue.js](https://v2.vuejs.org/v2/style-guide/?redirect=true)

## 목차

------

## 개요

------

- 장기적으로 유지 및 보수를 용이하게 하기 위함
- 코드 내에서 일어나는 에러를 최대한 방지하고, 발생 시 에러 위치를 용이하게 파악하기 위함
- 규칙을 찾아보기 쉽도록 규칙만 정리해두었으며, 자세한 설명은 위의 주소를 참고하여 확인한다.
- 기타 헷갈리기 쉬운 용어는 토글 혹은 댓글을 추가하여 설명을 추가해뒀다.

## 우선순위 A 규칙: 필수적인(에러 방지)

------

### 컴포넌트명 두 단어 이상 사용하기

HTML 요소와의 충돌 방지를 위해(모든 HTML 요소는 한 단어이다.) Root의 `App` 컴포넌트 외에 모든 컴포넌트는 두 단어 이상의 조합이어야 한다.

 💡 **BAD**

```jsx
export default {
	name: 'Todo'
}
<Todo />
<todo></todo>
```

 💡 **GOOD**

```jsx
export default {
	name: 'TodoItem'
}
<TodoItem />
<todo-item></todo-item>
```

### 자세한 Prop 정의 사용하기

프롭스의 정의는 가능한 한 자세해야 하며, 최소한 타입은 정의해야 한다.

 💡 **BAD**

```jsx
props: ['status']
```

 💡 **GOOD**

```jsx
props: {
	status: String
}
props: {
	status: {
		type: String
		default: 'Status입니다.'
	}
}
```

### `v-for`에 Key 사용하기

 💡 **BAD**

```html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

 💡 **GOOD**

```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

### `v-if`와 `v-for`의 동시 사용 피하기

**절대로 `v-if`과 `v-for` 을 한 요소에 사용하지 말 것**

몇 가지 상황에 대한 대안은 아래와 같다.

- 아이템을 필터링하기 위해서 사용할 때(예시: `v-for="user in users" v-if="user.isActive`) `computed`로 `users`에서 필터링된 리스트를 반환한다.(예시: `activeUsers`)
- 숨겨야 하는 요소가 있어 렌더링을 피하자고 할 때(예시: `v-for="user in users" v-if="shouldShowUsers"`) `v-if`를 컨테이너 요소로 옮긴다.(예시: `ul`, `ol`)

 💡 **BAD**

```html
<ul>
  <li v-for="user in users"
			v-if="user.isActive"
			:key="user.id"
	>
    {{ user.name }}
  </li>
</ul>
```

 💡 **GOOD**

```html
<ul>
  <li v-for="user in users"
			v-if="user.isActive"
			:key="user.id"
	>
    {{ user.name }}
  </li>
</ul>
<ul>
	<template v-for="user in users" :key="user.id">
  <li v-if="user.isActive">
    {{ user.name }}
  </li>
	</template>
</ul>
```

### Scoped Styling을 사용할 것

Top-level에 위치한 `App`컴포넌트와 `layout` 컴포넌트는 전역을 사용해도 좋으나, 이외 컴포넌트는 `scoped`를 사용한다.

💡 **BAD**

```html
<template>
	<button class="btn btn-close">X</button>
</template>

<style>
.btn-close {
	background-color: red;
}
</style>
```

 💡 **GOOD**

```html
<template>
	<button class="btn btn-close">X</button>
</template>

<style scoped>
.button {
	border: none;
	border-radius: 2px;
}

.btn-close {
	background-color: red;
}
</style>
<template>
	<button class="[$style.button, $style.buttonClose]">X</button>
</template>

<style module>
.button {
	border: none;
	border-radius: 2px;
}

.btn-close {
	background-color: red;
}
</style>
<template>
	<button class="c-Button c-Button--close">X</button>
</template>

<!-- BEM 컨벤션을 사용할 경우 -->
<style>
.c-Button {
	border: none;
	border-radius: 2px;
}

.c-Button--close {
	background-color: red;
}
</style>
```

### Avoid exposing private functions in mixins

Plugin이나 Mixin 등에 커스텀 프라이빗 속성을 사용하기 위해서는 `$_`를 사용한다. 다른 프로그래머의 코드와의 충돌 방지를 위해 named scope도 추가한다.(예시: `$_yourPluginName_`)

- 추가 정보

  `_` Prefix를 private 속성 선언을 위해 사용하는 것은 다른 코드를 덮어쓸 수 있는 리스크를 가지고 있다. 모든 코드를 확인했고, 현재 사용하고자 하는 특성 속성명을 사용하는 곳이 없더라도, 앞으로 충돌이 발생하지 않는다는 점은 보장되지 않는다. `$` Prefix는 Vue.js에선 사용자들에게 특별한 속성을 제공하기 위해 사용된다.(`$store, $router`등) 그러므로 private 속성 선언을 위해 `$`를 사용하는 것은 적절치 못하다.

💡 **BAD**

```jsx
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
const myGreatMixin = {
  // ...
  methods: {
    _update() {
      // ...
    }
  }
}
const myGreatMixin = {
  // ...
  methods: {
    $update() {
      // ...
    }
  }
}
const myGreatMixin = {
  // ...
  methods: {
    $_update() {
      // ...
    }
  }
}
```

 💡 **GOOD**

```jsx
const myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update() {
      // ...
    }
  }
}
// Even better!
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

function myPrivateFunction() {
  // ...
}

export default myGreatMixin
```

## 우선순위 B 규칙: 적극 권장

------

### Component files

각 컴포넌트는 반드시 자체 파일에 속해야 한다.(.vue 파일)

 💡 **BAD**

```jsx
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

💡 **GOOD**

```jsx
components/
|- TodoList.js
|- TodoItem.js
components/
|- TodoList.vue
|- TodoItem.vue
```

### 싱글 파일 컴포넌트 파일 명명

**싱글 파일 컴포넌트의 파일명은 `PascalCase` 혹은 `kebab-case`여야 한다**

- 싱글 파일 컴포넌트 ?

  싱글 파일 컴포넌트란 `.vue``파일로 생성된 컴포넌트(일반적인 컴포넌트들)을 뜻하며, Vue에는 별개의 컴포넌트 선언 방식으로 `render()`를 사용하는 함수형 컴포넌트가 있다.

💡 **BAD**

```jsx
components/
|- mycomponent.vue
components/
|- myComponent.vue
```

 💡 **GOOD**

```jsx
components/
|- MyComponent.vue
components/
|- my-component.vue
```

### 베이스 컴포넌트명

베이스 컴포넌트는 `Base`, `App`혹은 `V`와 같은 특정 Prefix로 시작해야 한다.

프로젝트 내에서 사용하는 컴포넌트의 기본형을 보통 베이스 컴포넌트라고 부른다.(e.g. BaseInput)

💡 **BAD**

```jsx
components/
|- MyInput.vue
```

💡 **GOOD**

```jsx
components/
|- BaseInput.vue
components/
|- VInput.vue
```

## 우선순위 C 규칙: 권장

### Options API 순서 Snippet

```jsx
{
	"Generate Basic Vue Code": {
		"prefix": "원하는_PREFIX_명",
		"body": [
			"<template>\\n<div>\\n\\t$0\\n</div>\\n</template>\\n<script>\\nexport default {\\n\\tname: '',\\n\\tcomponents: {},\\n\\tdirectives: {},\\n\\tprovide() {\\n\\t\\treturn {\\n\\t\\t}\\n\\t},\\n\\tinject() {\\n\\t\\treturn {\\n\\t\\t}\\n\\t},\\n\\tprops: {},\\n\\tsetup() {},\\n\\tdata() {\\n\\t\\treturn {\\n\\t\\t\\tsampleData: ''\\n\\t\\t}\\n\\t},\\n\\tcomputed: {},\\n\\twatch: {},\\n\\tbeforeCreate() {},\\n\\tcreated() {},\\n\\tbeforeMount() {},\\n\\tmounted() {},\\n\\tbeforeUpdate() {},\\n\\tupdated() {},\\n\\tbeforeUnmount() {},\\n\\tunmounted() {},\\n\\tmethods: {}\\n}\\n</script>\\n"
		],
		"description": "Generate Basic Vue Code"
	}
}
```

## 그 이외

------

### 파일 구조 관리

파일 구조는 아래와 같이 관리한다.

```jsx
Public
⎿ assets/
⎿ index.html
src
⎿ api/
⎿ assets/
	⎿ images/
	⎿ icons/
	⎿ js/
	⎿ css/
⎿ components/
	⎿ header/(프로젝트 큰 경우, TheHeader 전용 컴포넌트)
	⎿ TheHeader.vue
	⎿ BaseButton.vue
	⎿ TheHeaderProfile.vue(폴더 구분 필요없을 경우)
⎿ layouts/
	⎿ AppLayout.vue
	⎿ AppLayoutDefault.vue
	⎿ AppLayoutLeft.vue
⎿ utils/
	⎿ permission.js
	⎿ request.js
	⎿ auth.js
⎿ router/(routes/)
	⎿ modules/
		⎿ user.js
	⎿ index.js(명칭 변경시, import상에 문제 생기므로 금지)
⎿ store/(state/)
	⎿ index.js(명칭 변경시, import store from './store' 상에 문제 생기므로 금지)
		(풀네임을 다 작성해야 import가 가능해진다. 기존에는 폴더 내에서 index.js를 인식)
	⎿ modules/
		⎿ article.js
		⎿ newsdesk.js
```

1. Public 
   필요한 경우, Public의 `index.html`에서 스크립트, CSS 등을 불러올 수 있다. 이 경우 정적 파일은 Public 폴더 내의 `assets`에 보관한다.(기본적으로 `App.vue`에 전역 파일들을 불러오는 것을 추천한다.)
2. Api 
   API 관련 함수들을 보관한다.

```jsx
// utils/require.js
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

// ./api/article.js
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
```

1. Components
   재사용 가능한 컴포넌트들을 보관한다.(Base, The 등) 프로젝트의 크기가 커질 경우 폴더명으로 각각 나눠서 보관하는 것을 추천하지만, 프로젝트가 그렇게 크지 않을 경우 각 자식 컴포넌트는 부모 컴포넌트의 이름을 Prefix로 사용하여 같은 폴더 내에 파일을 배치시킨다. 이는 코드편집기의 성능, 그리고 IDE에서의 브라우징 속도에 영향을 주기 때문에 폴더 구조의 뎁스를 최대한 얕게 하는 것이 좋다.
2. Assets
   JS, css, images 등을 보관하지만 위에서 설명한 이유로 폴더 구조를 얕게 하기 위해 images는 styles/란 디렉토리를 루트 디렉토리에 생성하고, JS 파일은 전부 utils에 통일하여 넣을 수 있다. 더불어
3. Layouts
   화면의 배치를 구성할 레이아웃 파일을 저장한다.(예를 들면, 좌측에 사이드바 / 우측에 사이드바와 같은 레이아웃을 싱글 파일 컴포넌트로 나누어 여기에 저장한다.)
4. Views Router
   주소를 갖고 있는 `Router Page`들을 이곳에 배치한다. 각 주소를 갖는 하나의 거대한 컴포넌트이다. 재사용 가능한 공용 컴포넌트가 아닌, 로컬 자식 컴포넌트를 가지는 경우에는 `부모 컴포넌트 명을 Prefix`로 사용하여 같은 디렉토리(Views/)에 배치하거나, `부모 컴포넌트명 디렉토리` 하위에 배치할 수 있다.(상위 규칙을 고려하여 프로젝트의 크기가 커질 때 디렉토리를 배치할 것.)
5. Router(Routes)
   라우터 파일들을 보관한다. 보통 vue-router 생성시 자동 생성된다.
6. Store(State)
   상태 관리 파일들을 저장한다. 보통 Vuex, Pinia 사용시 자동 생성된다.
7. Utils
   JS 논리(Logic), Composables, Directives, Mixins, Traslations 등을 여기서 관리하거나, 따로 분리해서 디렉토리 적용을 할 수 있다. Components가 화면에 필요한 재사용 기능들을 추가했다면, utils는 JS 등 재사용하는 기능들을 정의하는 곳이다.



## Vue-router

- router path의 name: 정의
  - camelCase를 사용한다.