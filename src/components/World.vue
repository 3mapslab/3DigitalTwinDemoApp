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
import Stats from "stats.js";
import * as THREE from "three";

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
  fog: true,
};

const terrainProperties = {
  depth: 0.1,
  altitude: -0.7,
  material: {
    colorTop: "#cbd2d3",
    colorSide: "#cbd2d3",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
};

const buildingsProperties = {
  depth: 10,
  altitude: 0.1,
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
  },
  model: "models/lowpolytreegltf.glb",
};

const treesProperties = {
  altitude: 2,
  material: {
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
  model: "models/lowpolytreegltf.glb",
};

/*
const roadsProperties = {
  depth: 0.01,
  altitude: 0.01 + terrainProperties.depth,
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
  },
};
*/

const gardensProperties = {
  depth: 0.01,
  altitude:
    0.1,
  material: {
    colorTop: "#32CD32",
    colorSide: "#32CD32",
    textureTop: "textures/garden2.jpg",
    textureSizeTop: 225,
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
};

const parksProperties = {
  depth: 0.01,
  altitude:
    0.1,
  material: {
    colorTop: "#6B6B6B",
    colorSide: "#6B6B6B",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
};

const oceanProperties = {
  depth: 0.1,
  altitude: 0,
  material: {
    colorTop: "#005493",
    colorSide: "#005493",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
};

const containersProperties = {
  depth: 1.03,
  altitude: 0,
  material: {
    colorTop: "#005493",
    colorSide: "#005493",
    opacityTop: 1,
    opacitySide: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
};

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
  /*
  {
    url: "https://triedeti.pt/data_geojson/roads_v2.geojson",
    props: roadsProperties,
    type: "EXTRUDE",
  },
  */
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
    type: "EXTRUDE",
  },
  {
    // place trees in mooring bitts location
    url: "https://triedeti.pt/data_geojson/mooring_bitt.geo.json",
    props: treesProperties,
    type: "GLTF",
  },
  {
    url: "containers_xyz.geojson",
    props: containersProperties,
    type: "CONTAINERS",
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
    async loadDemoData() {
      var that = this;

      demoData.forEach((demo) => {
        fetch(demo.url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            that.threedigitaltwin.loadLayer(data, demo.props, demo.type);
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
    loadContainers(url) {
      var that = this;
      let positions = [];
      fetch(url)
        .then((res) => res.json())
        .then((out) => {
          var boxWidth = 6.06;
          var boxHeight = 2.6;
          var boxDepth = 2.44;

          let geometry = new THREE.BoxBufferGeometry(
            boxWidth,
            boxHeight,
            boxDepth
          );

          let material = new THREE.MeshStandardMaterial({ color: "blue" });

          // OK, add object to data
          for (let i = 1; i < out.features.length; i++) {
            let lng = out.features[i].geometry.coordinates[0];
            let lat = out.features[i].geometry.coordinates[1];
            let z_fromGeoJson = out.features[i].properties.Z;
            z_fromGeoJson = z_fromGeoJson * 5;
            positions.push({ x: lng, y: z_fromGeoJson, z: lat });
          }

          that.threedigitaltwin.loadInstancedMesh(
            geometry,
            material,
            positions
          );
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
    var canvas = document.getElementById(configs.containerId);
    that.threedigitaltwin = new ThreeDigitalTwin(canvas, configs);

    that.loadDemoData();

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

    that.loadContainers("containers_xyz.geojson");

    // that.loadMooringBitts();
  },
};
</script>
