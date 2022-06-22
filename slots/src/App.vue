<template>
  <div>
    <h1 class="main-title"><span>Slots</span></h1>
    <div class="app-container">
      <nav>
        <h2>목록</h2>
        <ul>
          <li><router-link to="/">슬롯이란?</router-link></li>
          <li><router-link to="/default">기본 슬롯</router-link></li>
          <li><router-link to="/dupl">중복 슬롯</router-link></li>
          <li><router-link to="/defvalue">슬롯 기본값</router-link></li>
          <li><router-link to="/namedslot">네임드 슬롯</router-link></li>
          <li><router-link to="/dynamicname">동적 슬롯명</router-link></li>
          <li><router-link to="/slotprops">스코프드 슬롯(Slot Props)</router-link></li>
          <li><router-link to="/renderless">렌더리스 컴포넌트</router-link></li>
        </ul>
      </nav>
      <router-view/>
    </div>
  </div>
</template>

<style lang="text/css" src="./assets/css/app.css">

</style>
