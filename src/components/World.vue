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

const configs = {
  containerId: 'world', //canvas id,
  width: 15000, // meters
  height: 15000, // meters
  zoom: {
    start: 1000,
    min: 10,
    max: 1000
  },
  center: {
    lng: -8.7016652234108349,
    lat: 41.185523935676713
  },
  pitchAngle: { 
    start: 0, // radians
    min: 0,
    max: Math.PI
  },
  bearingAngle: {
    start: 0, // radians
    min: 0,
    max: Math.PI / 2
  },
  oceanVisible: true, // boolean,
  axisHelper: false, // boolean,
  providerMapTile: null,
  modeMapTile: null,
}

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
  altitude: 0.04 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#000000",
    opacity: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const gardensProperties = {
  depth: 0.01,
  altitude: 0.01 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#228B22",
    opacity: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const parksProperties = {
  depth: 0.01,
  altitude: 0.02 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#696969",
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
  {
    url: "https://triedeti.pt/data_geojson/gardens.geo.json",
    props: gardensProperties,
  },
  {
    url: "https://triedeti.pt/data_geojson/parks.geo.json",
    props: parksProperties,
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
            that.threedigitaltwin._loadModel("ponte_leca.gltf",[-74.0066, 40.7135]);
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
    that.threedigitaltwin = new ThreeDigitalTwin(configs);
    var canvas = document.getElementById(configs.containerId);
    that.threedigitaltwin.init(canvas, configs.axisHelper);
    //Enable Ocean
    that.threedigitaltwin.on("oceanLoaded", () => {
      //Enable Ocean
      that.threedigitaltwin.toggleOcean(true);
      that.loadDemoData();
      //that.threedigitaltwin.toggle3DTile(true);
      that.threedigitaltwin.loadModel('models/ponte_leca.gltf', [-8.6942530416699988, 41.18882222465502]);
      //that.threedigitaltwin._loadKMZModel('models/ponte_leca.kmz', [-8.6942530416699988, 41.18882222465502]);
    });
  },
};
</script>
