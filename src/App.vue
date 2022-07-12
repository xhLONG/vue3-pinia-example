<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
    <nav class="txt-left">
       <router-link to="/home">home</router-link>
       <router-link to="/first">基本使用</router-link>
       <router-link to="/second">使用多个容器</router-link>
       <router-link to="/third">options api 使用map辅助函数</router-link>
       <router-link to="/four">pinia插件</router-link>
    </nav>
    <router-view></router-view>
</template>

<style>
@import url(./assets/base.css);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 36px;
}

button{
  font-size: 30px;
  margin: 0 10px;
  cursor: pointer;
}

nav{
    margin-bottom: 20px;
}
nav a{
    margin: 10px;
}

.router-link-active{
    background-color: rgb(246, 201, 223);
}


</style>
