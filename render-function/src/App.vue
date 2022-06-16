<template>
  <nav>
    <router-link to="/">h()</router-link> |
    <router-link to="/render">render()</router-link> |
    <router-link to="/slots">슬롯 유무차이</router-link> |
    <router-link to="/components">컴포넌트로 슬롯 Default 값 설정</router-link> |
    <router-link to="/slotprops">슬롯 프롭스의 사용</router-link> |
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
