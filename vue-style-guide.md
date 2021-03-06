# Vue.js Style Guide

πμ°Έκ³ 

[μ€νμΌ κ°μ΄λ | Vue.js](https://v3.ko.vuejs.org/style-guide/)

[Style Guide - Vue.js](https://v2.vuejs.org/v2/style-guide/?redirect=true)

## λͺ©μ°¨

------

## κ°μ

------

- μ₯κΈ°μ μΌλ‘ μ μ§ λ° λ³΄μλ₯Ό μ©μ΄νκ² νκΈ° μν¨
- μ½λ λ΄μμ μΌμ΄λλ μλ¬λ₯Ό μ΅λν λ°©μ§νκ³ , λ°μ μ μλ¬ μμΉλ₯Ό μ©μ΄νκ² νμνκΈ° μν¨
- κ·μΉμ μ°Ύμλ³΄κΈ° μ½λλ‘ κ·μΉλ§ μ λ¦¬ν΄λμμΌλ©°, μμΈν μ€λͺμ μμ μ£Όμλ₯Ό μ°Έκ³ νμ¬ νμΈνλ€.
- κΈ°ν ν·κ°λ¦¬κΈ° μ¬μ΄ μ©μ΄λ ν κΈ νΉμ λκΈμ μΆκ°νμ¬ μ€λͺμ μΆκ°ν΄λλ€.

## μ°μ μμ A κ·μΉ: νμμ μΈ(μλ¬ λ°©μ§)

------

### μ»΄ν¬λνΈλͺ λ λ¨μ΄ μ΄μ μ¬μ©νκΈ°

HTML μμμμ μΆ©λ λ°©μ§λ₯Ό μν΄(λͺ¨λ  HTML μμλ ν λ¨μ΄μ΄λ€.) Rootμ `App` μ»΄ν¬λνΈ μΈμ λͺ¨λ  μ»΄ν¬λνΈλ λ λ¨μ΄ μ΄μμ μ‘°ν©μ΄μ΄μΌ νλ€.

 π‘ **BAD**

```jsx
export default {
	name: 'Todo'
}
<Todo />
<todo></todo>
```

 π‘ **GOOD**

```jsx
export default {
	name: 'TodoItem'
}
<TodoItem />
<todo-item></todo-item>
```

### μμΈν Prop μ μ μ¬μ©νκΈ°

νλ‘­μ€μ μ μλ κ°λ₯ν ν μμΈν΄μΌ νλ©°, μ΅μν νμμ μ μν΄μΌ νλ€.

 π‘ **BAD**

```jsx
props: ['status']
```

 π‘ **GOOD**

```jsx
props: {
	status: String
}
props: {
	status: {
		type: String
		default: 'Statusμλλ€.'
	}
}
```

### `v-for`μ Key μ¬μ©νκΈ°

 π‘ **BAD**

```html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

 π‘ **GOOD**

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

### `v-if`μ `v-for`μ λμ μ¬μ© νΌνκΈ°

**μ λλ‘ `v-if`κ³Ό `v-for` μ ν μμμ μ¬μ©νμ§ λ§ κ²**

λͺ κ°μ§ μν©μ λν λμμ μλμ κ°λ€.

- μμ΄νμ νν°λ§νκΈ° μν΄μ μ¬μ©ν  λ(μμ: `v-for="user in users" v-if="user.isActive`) `computed`λ‘ `users`μμ νν°λ§λ λ¦¬μ€νΈλ₯Ό λ°ννλ€.(μμ: `activeUsers`)
- μ¨κ²¨μΌ νλ μμκ° μμ΄ λ λλ§μ νΌνμκ³  ν  λ(μμ: `v-for="user in users" v-if="shouldShowUsers"`) `v-if`λ₯Ό μ»¨νμ΄λ μμλ‘ μ?κΈ΄λ€.(μμ: `ul`, `ol`)

 π‘ **BAD**

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

 π‘ **GOOD**

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

### Scoped Stylingμ μ¬μ©ν  κ²

Top-levelμ μμΉν `App`μ»΄ν¬λνΈμ `layout` μ»΄ν¬λνΈλ μ μ­μ μ¬μ©ν΄λ μ’μΌλ, μ΄μΈ μ»΄ν¬λνΈλ `scoped`λ₯Ό μ¬μ©νλ€.

π‘ **BAD**

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

 π‘ **GOOD**

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

<!-- BEM μ»¨λ²€μμ μ¬μ©ν  κ²½μ° -->
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

Pluginμ΄λ Mixin λ±μ μ»€μ€ν νλΌμ΄λΉ μμ±μ μ¬μ©νκΈ° μν΄μλ `$_`λ₯Ό μ¬μ©νλ€. λ€λ₯Έ νλ‘κ·Έλλ¨Έμ μ½λμμ μΆ©λ λ°©μ§λ₯Ό μν΄ named scopeλ μΆκ°νλ€.(μμ: `$_yourPluginName_`)

- μΆκ° μ λ³΄

  `_` Prefixλ₯Ό private μμ± μ μΈμ μν΄ μ¬μ©νλ κ²μ λ€λ₯Έ μ½λλ₯Ό λ?μ΄μΈ μ μλ λ¦¬μ€ν¬λ₯Ό κ°μ§κ³  μλ€. λͺ¨λ  μ½λλ₯Ό νμΈνκ³ , νμ¬ μ¬μ©νκ³ μ νλ νΉμ± μμ±λͺμ μ¬μ©νλ κ³³μ΄ μλλΌλ, μμΌλ‘ μΆ©λμ΄ λ°μνμ§ μλλ€λ μ μ λ³΄μ₯λμ§ μλλ€. `$` Prefixλ Vue.jsμμ  μ¬μ©μλ€μκ² νΉλ³ν μμ±μ μ κ³΅νκΈ° μν΄ μ¬μ©λλ€.(`$store, $router`λ±) κ·Έλ¬λ―λ‘ private μμ± μ μΈμ μν΄ `$`λ₯Ό μ¬μ©νλ κ²μ μ μ μΉ λͺ»νλ€.

π‘ **BAD**

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

 π‘ **GOOD**

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

## μ°μ μμ B κ·μΉ: μ κ·Ή κΆμ₯

------

### Component files

κ° μ»΄ν¬λνΈλ λ°λμ μμ²΄ νμΌμ μν΄μΌ νλ€.(.vue νμΌ)

 π‘ **BAD**

```jsx
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

π‘ **GOOD**

```jsx
components/
|- TodoList.js
|- TodoItem.js
components/
|- TodoList.vue
|- TodoItem.vue
```

### μ±κΈ νμΌ μ»΄ν¬λνΈ νμΌ λͺλͺ

**μ±κΈ νμΌ μ»΄ν¬λνΈμ νμΌλͺμ `PascalCase` νΉμ `kebab-case`μ¬μΌ νλ€**

- μ±κΈ νμΌ μ»΄ν¬λνΈ ?

  μ±κΈ νμΌ μ»΄ν¬λνΈλ `.vue``νμΌλ‘ μμ±λ μ»΄ν¬λνΈ(μΌλ°μ μΈ μ»΄ν¬λνΈλ€)μ λ»νλ©°, Vueμλ λ³κ°μ μ»΄ν¬λνΈ μ μΈ λ°©μμΌλ‘ `render()`λ₯Ό μ¬μ©νλ ν¨μν μ»΄ν¬λνΈκ° μλ€.

π‘ **BAD**

```jsx
components/
|- mycomponent.vue
components/
|- myComponent.vue
```

 π‘ **GOOD**

```jsx
components/
|- MyComponent.vue
components/
|- my-component.vue
```

### λ² μ΄μ€ μ»΄ν¬λνΈλͺ

λ² μ΄μ€ μ»΄ν¬λνΈλ `Base`, `App`νΉμ `V`μ κ°μ νΉμ  Prefixλ‘ μμν΄μΌ νλ€.

νλ‘μ νΈ λ΄μμ μ¬μ©νλ μ»΄ν¬λνΈμ κΈ°λ³Ένμ λ³΄ν΅ λ² μ΄μ€ μ»΄ν¬λνΈλΌκ³  λΆλ₯Έλ€.(e.g. BaseInput)

π‘ **BAD**

```jsx
components/
|- MyInput.vue
```

π‘ **GOOD**

```jsx
components/
|- BaseInput.vue
components/
|- VInput.vue
```

## μ°μ μμ C κ·μΉ: κΆμ₯

### Options API μμ Snippet

```jsx
{
	"Generate Basic Vue Code": {
		"prefix": "μνλ_PREFIX_λͺ",
		"body": [
			"<template>\\n<div>\\n\\t$0\\n</div>\\n</template>\\n<script>\\nexport default {\\n\\tname: '',\\n\\tcomponents: {},\\n\\tdirectives: {},\\n\\tprovide() {\\n\\t\\treturn {\\n\\t\\t}\\n\\t},\\n\\tinject() {\\n\\t\\treturn {\\n\\t\\t}\\n\\t},\\n\\tprops: {},\\n\\tsetup() {},\\n\\tdata() {\\n\\t\\treturn {\\n\\t\\t\\tsampleData: ''\\n\\t\\t}\\n\\t},\\n\\tcomputed: {},\\n\\twatch: {},\\n\\tbeforeCreate() {},\\n\\tcreated() {},\\n\\tbeforeMount() {},\\n\\tmounted() {},\\n\\tbeforeUpdate() {},\\n\\tupdated() {},\\n\\tbeforeUnmount() {},\\n\\tunmounted() {},\\n\\tmethods: {}\\n}\\n</script>\\n"
		],
		"description": "Generate Basic Vue Code"
	}
}
```

## κ·Έ μ΄μΈ

------

### νμΌ κ΅¬μ‘° κ΄λ¦¬

νμΌ κ΅¬μ‘°λ μλμ κ°μ΄ κ΄λ¦¬νλ€.

```jsx
Public
βΏ assets/
βΏ index.html
src
βΏ api/
βΏ assets/
	βΏ images/
	βΏ icons/
	βΏ js/
	βΏ css/
βΏ components/
	βΏ header/(νλ‘μ νΈ ν° κ²½μ°, TheHeader μ μ© μ»΄ν¬λνΈ)
	βΏ TheHeader.vue
	βΏ BaseButton.vue
	βΏ TheHeaderProfile.vue(ν΄λ κ΅¬λΆ νμμμ κ²½μ°)
βΏ layouts/
	βΏ AppLayout.vue
	βΏ AppLayoutDefault.vue
	βΏ AppLayoutLeft.vue
βΏ utils/
	βΏ permission.js
	βΏ request.js
	βΏ auth.js
βΏ router/(routes/)
	βΏ modules/
		βΏ user.js
	βΏ index.js(λͺμΉ­ λ³κ²½μ, importμμ λ¬Έμ  μκΈ°λ―λ‘ κΈμ§)
βΏ store/(state/)
	βΏ index.js(λͺμΉ­ λ³κ²½μ, import store from './store' μμ λ¬Έμ  μκΈ°λ―λ‘ κΈμ§)
		(νλ€μμ λ€ μμ±ν΄μΌ importκ° κ°λ₯ν΄μ§λ€. κΈ°μ‘΄μλ ν΄λ λ΄μμ index.jsλ₯Ό μΈμ)
	βΏ modules/
		βΏ article.js
		βΏ newsdesk.js
```

1. Public 
   νμν κ²½μ°, Publicμ `index.html`μμ μ€ν¬λ¦½νΈ, CSS λ±μ λΆλ¬μ¬ μ μλ€. μ΄ κ²½μ° μ μ  νμΌμ Public ν΄λ λ΄μ `assets`μ λ³΄κ΄νλ€.(κΈ°λ³Έμ μΌλ‘ `App.vue`μ μ μ­ νμΌλ€μ λΆλ¬μ€λ κ²μ μΆμ²νλ€.)
2. Api 
   API κ΄λ ¨ ν¨μλ€μ λ³΄κ΄νλ€.

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
   μ¬μ¬μ© κ°λ₯ν μ»΄ν¬λνΈλ€μ λ³΄κ΄νλ€.(Base, The λ±) νλ‘μ νΈμ ν¬κΈ°κ° μ»€μ§ κ²½μ° ν΄λλͺμΌλ‘ κ°κ° λλ μ λ³΄κ΄νλ κ²μ μΆμ²νμ§λ§, νλ‘μ νΈκ° κ·Έλ κ² ν¬μ§ μμ κ²½μ° κ° μμ μ»΄ν¬λνΈλ λΆλͺ¨ μ»΄ν¬λνΈμ μ΄λ¦μ Prefixλ‘ μ¬μ©νμ¬ κ°μ ν΄λ λ΄μ νμΌμ λ°°μΉμν¨λ€. μ΄λ μ½λνΈμ§κΈ°μ μ±λ₯, κ·Έλ¦¬κ³  IDEμμμ λΈλΌμ°μ§ μλμ μν₯μ μ£ΌκΈ° λλ¬Έμ ν΄λ κ΅¬μ‘°μ λμ€λ₯Ό μ΅λν μκ² νλ κ²μ΄ μ’λ€.
2. Assets
   JS, css, images λ±μ λ³΄κ΄νμ§λ§ μμμ μ€λͺν μ΄μ λ‘ ν΄λ κ΅¬μ‘°λ₯Ό μκ² νκΈ° μν΄ imagesλ styles/λ λλ ν λ¦¬λ₯Ό λ£¨νΈ λλ ν λ¦¬μ μμ±νκ³ , JS νμΌμ μ λΆ utilsμ ν΅μΌνμ¬ λ£μ μ μλ€. λλΆμ΄
3. Layouts
   νλ©΄μ λ°°μΉλ₯Ό κ΅¬μ±ν  λ μ΄μμ νμΌμ μ μ₯νλ€.(μλ₯Ό λ€λ©΄, μ’μΈ‘μ μ¬μ΄λλ° / μ°μΈ‘μ μ¬μ΄λλ°μ κ°μ λ μ΄μμμ μ±κΈ νμΌ μ»΄ν¬λνΈλ‘ λλμ΄ μ¬κΈ°μ μ μ₯νλ€.)
4. Views Router
   μ£Όμλ₯Ό κ°κ³  μλ `Router Page`λ€μ μ΄κ³³μ λ°°μΉνλ€. κ° μ£Όμλ₯Ό κ°λ νλμ κ±°λν μ»΄ν¬λνΈμ΄λ€. μ¬μ¬μ© κ°λ₯ν κ³΅μ© μ»΄ν¬λνΈκ° μλ, λ‘μ»¬ μμ μ»΄ν¬λνΈλ₯Ό κ°μ§λ κ²½μ°μλ `λΆλͺ¨ μ»΄ν¬λνΈ λͺμ Prefix`λ‘ μ¬μ©νμ¬ κ°μ λλ ν λ¦¬(Views/)μ λ°°μΉνκ±°λ, `λΆλͺ¨ μ»΄ν¬λνΈλͺ λλ ν λ¦¬` νμμ λ°°μΉν  μ μλ€.(μμ κ·μΉμ κ³ λ €νμ¬ νλ‘μ νΈμ ν¬κΈ°κ° μ»€μ§ λ λλ ν λ¦¬λ₯Ό λ°°μΉν  κ².)
5. Router(Routes)
   λΌμ°ν° νμΌλ€μ λ³΄κ΄νλ€. λ³΄ν΅ vue-router μμ±μ μλ μμ±λλ€.
6. Store(State)
   μν κ΄λ¦¬ νμΌλ€μ μ μ₯νλ€. λ³΄ν΅ Vuex, Pinia μ¬μ©μ μλ μμ±λλ€.
7. Utils
   JS λΌλ¦¬(Logic), Composables, Directives, Mixins, Traslations λ±μ μ¬κΈ°μ κ΄λ¦¬νκ±°λ, λ°λ‘ λΆλ¦¬ν΄μ λλ ν λ¦¬ μ μ©μ ν  μ μλ€. Componentsκ° νλ©΄μ νμν μ¬μ¬μ© κΈ°λ₯λ€μ μΆκ°νλ€λ©΄, utilsλ JS λ± μ¬μ¬μ©νλ κΈ°λ₯λ€μ μ μνλ κ³³μ΄λ€.



## Vue-router

- router pathμ name: μ μ
  - camelCaseλ₯Ό μ¬μ©νλ€.