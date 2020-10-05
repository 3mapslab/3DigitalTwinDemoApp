<template>
  <v-container fluid>
    <canvas id="world" width="100%" height="100%"></canvas>
  </v-container>
</template>

<script>
import { ThreeDigitalTwin } from "@triedeti/threedigitaltwin";

export default {
  name: "World",
  created() {
    var threedigitaltwin = new ThreeDigitalTwin(this.models, this.textures);
    var canvas = document.getElementById("world");
    threedigitaltwin.init(canvas);
  },
};
</script>
