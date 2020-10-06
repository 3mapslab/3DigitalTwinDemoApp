<template>
  <v-main>
    <v-container fill-height class="ma-0 pa-0">
      <v-layout>
        <canvas id="world"></canvas>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import { ThreeDigitalTwin } from "@triedeti/threedigitaltwin";

const terrainProperties = {
  depth: 1,
  altitude: 0,
  material: {
    color: "rgb(248,249,250)",
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

export default {
  name: "World",
  mounted() {
    //Init 3DigitalTwin
    var threedigitaltwin = new ThreeDigitalTwin();
    var canvas = document.getElementById("world");
    threedigitaltwin.init(canvas, true);

    //Enable Ocean
    threedigitaltwin.on("oceanLoaded", () => {
      //Enable Ocean
      threedigitaltwin.toggleOcean(true);

      //Load and Enable Terrain
      fetch("https://pastebin.com/raw/MPWvdkmL")
        .then(function (response) {
          if (response.status !== 200) {
            return;
          }

          response.json().then(function (data) {
            threedigitaltwin.loadLayer(null, data, terrainProperties);
          });
        })
        .catch(function (err) {
          console.log("Fetch Error", err);
        });
    });
  },
};
</script>
