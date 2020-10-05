<template>
  <div id="app">
    <World />
  </div>
</template>

<script>
import World from "./components/World.vue";

export default {
  name: "App",
  components: {
    World,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
