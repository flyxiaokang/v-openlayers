<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-08-17 11:35:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-28 15:37:45
-->
<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Example from './VMap/example/ol/index.vue'
</script>

<template>
  <Example style="width:100%;height:800px;"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
