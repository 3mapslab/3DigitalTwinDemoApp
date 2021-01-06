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
import { Twin } from "@triedeti/threedigitaltwin";
import Stats from "stats.js";

const configs = {
  containerId: "world", //canvas id,
  width: 15000, // meters
  height: 15000, // meters
  zoom: {
    start: 1000,
    min: 10,
    max: 1000,
  },
  center: {
    lng: -8.7016652234108349,
    lat: 41.185523935676713,
  },
  pitchAngle: {
    start: 0, // radians
    min: 0,
    max: Math.PI,
  },
  bearingAngle: {
    start: 0, // radians
    min: 0,
    max: Math.PI / 2,
  },
  oceanVisible: false, // boolean,
  leixoesOceanVisible: true, //boolean
  axisHelper: false, // boolean,
  providerMapTile: null,
  modeMapTile: null,
};

const terrainProperties = {
  depth: 1,
  altitude: 2,
  material: {
    colorTop: "#cbd2d3",
    colorSide: "#cbd2d3",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const buildingsProperties = {
  depth: 10,
  altitude: 0.01 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    colorTop: "#cbd2d3",
    colorSide: "#cbd2d3",
    textureTop: "textures/roof.jpg",
    textureSide: "textures/building1.png",
    textureSizeTop: 256,
    textureSizeSide: 256,
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const roadsProperties = {
  depth: 0.01,
  altitude: 0.04 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    colorTop: "#FFFFFF",
    colorSide: "#FFFFFF",
    textureTop: "textures/asphalt.jpg",
    opacityTop: 1,
    textureSizeTop: 256,
    textureSizeSide: 256,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const gardensProperties = {
  depth: 0.01,
  altitude: 0.02 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    colorTop: "#32CD32",
    colorSide: "#32CD32",
    textureTop: "textures/garden2.jpg",
    textureSizeTop: 225,
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const parksProperties = {
  depth: 0.01,
  altitude: 0.03 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    colorTop: "#6B6B6B",
    colorSide: "#6B6B6B",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const oceanProperties = {
  depth: 0.01,
  altitude: 0 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    colorTop: "#005493",
    colorSide: "#005493",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: 0,
  },
}

const stats = new Stats();

const demoData = [
  {
    url: "https://triedeti.pt/data_geojson/terrain_v2.geojson",
    props: terrainProperties,
    type: "EXTRUDE",
  },
  {
    url: "https://triedeti.pt/data_geojson/parks_v2.geojson",
    props: parksProperties,
    type: "EXTRUDE",
  },
  {
    url: "https://triedeti.pt/data_geojson/gardens_v2.geojson",
    props: gardensProperties,
    type: "EXTRUDE",
  },
  {
    url: "https://triedeti.pt/data_geojson/roads_v2.geojson",
    props: roadsProperties,
    type: "EXTRUDE",
  },
  {
    url: "https://triedeti.pt/data_geojson/buildings_v2.geojson",
    props: buildingsProperties,
    type: "EXTRUDE",
  },
  {
    url: "https://triedeti.pt/data_geojson/hydro.geojson",
    props: null,
    type: "DEM",
  },
  {
    url: "leixoes_mar.geojson",
    props: oceanProperties,
    type: "OCEAN",
  }
];

export default {
  name: "World",
  data: function () {
    return {
      threedigitaltwin: null,
    };
  },
  methods: {
    async loadDemoData() {
      var that = this;

      demoData.forEach((demo) => {
        fetch(demo.url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            that.threedigitaltwin.loadLayer(null, data, demo.props, demo.type);
          })
          .catch((err) => {
            // Do something for an error here
            console.log("Fetch Error", err);
          });
      });
    },
    loadMooringBitts() {
      const url = "https://triedeti.pt/data_geojson/mooring_bitt.geo.json";
      var that = this;
      fetch(url)
        .then((res) => res.json())
        .then((out) => {
          // OK, add object to data
          for (let i = 1; i < out.features.length; i++) {
            let lng = out.features[i].geometry.coordinates[0];
            let lat = out.features[i].geometry.coordinates[1];
            that.threedigitaltwin._loadModel(
              "models/bollard_simple.dae",
              [lng, lat],
              undefined,
              0.07,
              3,
              "low"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    animateStats() {
      stats.begin();
      stats.end();
      requestAnimationFrame(this.animateStats);
    },
  },
  async mounted() {
    var that = this;

    //Init FPS counter
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    requestAnimationFrame(that.animateStats);

    //Init 3DigitalTwin
    // that.threedigitaltwin = new ThreeDigitalTwin(configs);
    // var canvas = document.getElementById(configs.containerId);

    //Enable Ocean
    /*
    that.threedigitaltwin.on("worldloaded", () => {

      //Enable Ocean
      if(configs.oceanVisible==true) that.threedigitaltwin.toggleOcean(true);
          // load geojsons
      that.loadDemoData();

      //that.threedigitaltwin.toggle3DTile(true);
      that.threedigitaltwin._loadModel("models/ponte_leca.kmz", [
        -8.6942530416699988,
        41.18882222465502,
      ]);
      that.threedigitaltwin._loadModel("models/Titan.kmz", [
        -8.71081747271464,
        41.18437848352964,
      ]);
      that.threedigitaltwin._loadModel(
        "models/Forte+de+Nossa+Senhora+das+Neves.dae/f992b15e-5308-4e65-88d8-815e29936824.dae",
        [-8.702219, 41.1876],
        undefined,
        undefined,
        2
      );

      let containers = that.threedigitaltwin.loadContainers([2,2,3], [50,100,5],0.5);
      that.threedigitaltwin.moveObjectToCoordinates(containers, -8.700553, 41.186596);
      that.threedigitaltwin.rotateObject(containers, "y", -0.9);
      that.threedigitaltwin.setAltitude(containers, 4);

    });

    that.threedigitaltwin.init(canvas, configs.axisHelper);

    //that.loadMooringBitts();
    */
  },
};
</script>
