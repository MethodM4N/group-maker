<template>
  <div id="app">
    <nav>
      <router-link to="/">About</router-link> |
      <router-link to="/main">Group page</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
#app {
  margin: 0 auto;
  max-width: 1620px;
  padding: 0 40px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;

  @media (max-width: 750px) {
    padding: 0 10px;
  }
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
