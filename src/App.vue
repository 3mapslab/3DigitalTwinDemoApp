<template>
  <v-app>
    <v-main>
      <World />
    </v-main>
  </v-app>
</template>

<script>
import World from "./components/World";

export default {
  name: "App",

  components: {
    World,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
</style>