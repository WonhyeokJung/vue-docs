<template>
  <div>
    <h1 class="main-title">Slots</h1>
    <div class="app-container">
      <nav>
        <h2>목록</h2>
        <ul>
          <li><router-link to="/default">기본 슬롯</router-link></li>
          <li><router-link to="/dupl">중복 슬롯</router-link></li>
          <li><router-link to="/defvalue">슬롯 기본값</router-link></li>
          <li><router-link to="/namedslot">네임드 슬롯</router-link></li>
          <li><router-link to="/dynamicname">동적 슬롯명</router-link></li>
          <li><router-link to="/slotprops">슬롯 프롭스(Properties, 단일 객체)</router-link></li>
        </ul>
      </nav>
      <router-view/>
    </div>
  </div>
</template>

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

.app-container {
  display: grid;
  grid-template-columns: 150px auto;
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
