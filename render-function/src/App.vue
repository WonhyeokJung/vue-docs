<template>
  <div>
      <h1 class="main-title" @click="toHome" style="cursor: pointer;">렌더 함수</h1>
      <div class="app-container">
        <nav>
          <h2>목록</h2>
          <ul>
            <li><router-link to="/">Render Function</router-link></li>
            <li><router-link to="/h">h()</router-link></li>
            <li><router-link to="/render">render()</router-link></li>
            <li><router-link to="/slots">슬롯 유무차이</router-link></li>
            <li><router-link to="/components">컴포넌트로 슬롯 Default 값 설정</router-link></li>
            <li><router-link to="/slotprops">슬롯 프롭스의 사용</router-link></li>
          </ul>
        </nav>
        <router-view />
      </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router'
export default {
  setup () {
    const router = useRouter()
    const toHome = () => router.push('/')
    return {
      toHome
    }
  }
}
</script>

<style>
@font-face {
    font-family: 'GangwonEdu_OTFBoldA';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFBoldA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

body {
  margin: 0;
}

#app {
  height: calc(100vh - 100px);
  /* box-sizing: content-box; */
  margin: 50px;
  font-family: 'GangwonEdu_OTFBoldA';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.1em;
  text-align: center;
  color: #2c3e50;
}

.main-title {
  /* margin-bottom: 0; */
  padding-bottom: 10px;
  border-bottom: 2px solid #2c3e50;
}
.main-title span {
  font-size: 2em;
}

.app-container {
  display: grid;
  grid-template-columns: 200px auto;
}

nav {
  /* position: fixed; */
  padding: 10px;
  border-right: 2px solid #2c3e50;
  text-align: start;
}

nav ul {
  list-style-type: none;
  margin: 0 auto;
  padding: 0;
  /* width: 120px; */
}

nav li {
  margin: 8px 3px;
}

/* nav li a:not(.router-link-active) {
  display: none;
}

nav:hover li a {
  display: block;
} */

nav a:hover:not(.router-link-active) {
  color: rgb(10, 144, 206);
}

nav a {
  display: block;
  font-size: 1em;
  text-decoration: none;
  color: black;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: orangered;
}

@media screen and (max-width: 900px) {
  .app-container {
    grid-template-columns: 150px auto;
  }
}

@media screen and (max-width: 750px) {
  #app {
    margin: 10px;
    /* min-width: 250px; */
  }

  .app-container {
    display: grid;
    grid-template-columns: auto;
  }

  nav {
    border-right: none;
    border-bottom: 2px solid #2c3e50;
    margin-bottom: 20px;
  }

  nav ul {
    margin-left: 0;
  }

  nav h2 {
    font-size: 1.3em;
  }

  nav a {
    font-size: 1em;
  }
}
</style>
