<template>
  <div>
    <h1 class="main-title">Composables</h1>
    <div class="app-container">
      <nav>
        <h2>목록</h2>
        <ul>
          <li><router-link to="/">useMouse</router-link></li>
          <li><router-link to="/about">useFetch</router-link></li>
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

#app {
  height: calc(100vh - 100px);
  margin: 50px;
  font-family: 'GangwonEdu_OTFBoldA';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

@media screen and (min-height: 100vh) {
  #app {
    height: 100%
  }
}
</style>
