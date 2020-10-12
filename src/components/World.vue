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

var demoData = [
  {
    url: "https://triedeti.pt/data_geojson/terrain.geo.json",
    props: terrainProperties,
  },
  {
    url: "https://triedeti.pt/data_geojson/buildings.geo.json",
    props: buildingsProperties,
  },
  {
    url: "https://triedeti.pt/data_geojson/roads.geo.json",
    props: roadsProperties,
  },
];

export default {
  name: "World",
  data: function () {
    return {
      threedigitaltwin: null,
    };
  },
  methods: {
    loadDemoData() {
      var that = this;

      demoData.forEach((demo) => {
        fetch(demo.url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            that.threedigitaltwin.loadLayer(null, data, demo.props);
          })
          .catch((err) => {
            // Do something for an error here
            console.log("Fetch Error", err);
          });
      });
    },
  },
  mounted() {
    var that = this;

    //Init 3DigitalTwin
    that.threedigitaltwin = new ThreeDigitalTwin();
    var canvas = document.getElementById("world");
    that.threedigitaltwin.init(canvas, true);

    //Enable Ocean
    that.threedigitaltwin.on("oceanLoaded", () => {
      //Enable Ocean
      that.threedigitaltwin.toggleOcean(true);

      that.loadDemoData();

      //that.threedigitaltwin.toggle3DTile(true);
    });
  },
};
</script>
