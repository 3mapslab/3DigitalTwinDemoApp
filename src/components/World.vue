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
  altitude: 2,
  material: {
    color: "rgb(248,249,250)",
    opacity: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const buildingsProperties = {
  depth: 10,
  altitude: 0 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#FF0000",
    opacity: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const roadsProperties = {
  depth: 0.01,
  altitude: 0 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#000000",
    opacity: 0.2,
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
    });

    //Load and Enable Terrain
    fetch("http://triedeti.pt/data_geojson/terrain.geojson", { mode: 'no-cors', })
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

    //Load and Enable Building
    fetch("http://triedeti.pt/data_geojson/buildings.geojson", { mode: 'no-cors', })
      .then(function (response) {
        if (response.status !== 200) {
          return;
        }

        response.json().then(function (data) {
          threedigitaltwin.loadLayer(null, data, buildingsProperties);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error", err);
      });

    //Load and Enable Building
    fetch("http://triedeti.pt/data_geojson/roads.geojson", { mode: 'no-cors', })
      .then(function (response) {
        if (response.status !== 200) {
          return;
        }

        response.json().then(function (data) {
          threedigitaltwin.loadLayer(null, data, roadsProperties);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error", err);
      });

    //threedigitaltwin.toggle3DTile(true);
  },
};
</script>
