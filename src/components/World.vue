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
import Stats from 'stats.js';


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
    color: "rgb(241, 243, 241)",
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const buildingsProperties = {
  depth: 10,
  altitude: 0 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "rgb(203, 210, 211)",
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const roadsProperties = {
  depth: 0.01,
  altitude: 0.04 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#6B6B6B",
    // texture: 'textures/road3.jpg',
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const gardensProperties = {
  depth: 0.01,
  altitude: 0.01 + terrainProperties.depth + terrainProperties.altitude,
  material: {
    color: "#32CD32",
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
    color: "#6B6B6B",
    opacity: 0.2,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -2,
  },
};

const stats = new Stats();

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
          })
          .catch((err) => {
            // Do something for an error here
            console.log("Fetch Error", err);
          });
      });
    },
    animateStats() {
      stats.begin();
      stats.end();
      requestAnimationFrame( this.animateStats );
    },
  },
  async mounted() {

    var that = this;

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    requestAnimationFrame(that.animateStats)

    
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
      
      //that.threedigitaltwin._loadModel("models/ponte_leca.gltf", [-8.6942530416699988, 41.18882222465502]);
      that.threedigitaltwin._loadModel('models/ponte_leca.kmz', [-8.6942530416699988, 41.18882222465502]);
      that.threedigitaltwin._loadModel('models/Titan.kmz', [-8.71081747271464, 41.18437848352964]);
      that.threedigitaltwin._loadModel('models/Forte+de+Nossa+Senhora+das+Neves.dae/f992b15e-5308-4e65-88d8-815e29936824.dae', [-8.702219, 41.187600])

    });

    // Load all Mooring Bits
    var request_url = "https://triedeti.pt/data_geojson/mooring_bitt.geo.json";
    await fetch(request_url)
      .then(res => res.json())
      .then((out) => { // OK, add object to data
        for(let i=1; i<392; i++) {
          let leftC = out.features[i].geometry.coordinates[0];
          let rightC = out.features[i].geometry.coordinates[1];
          that.threedigitaltwin._loadModel('models/bollard_simple.dae', [leftC, rightC], undefined, 0.07, 3);
          console.log(i);
        }
      })
      .catch(err => { // ERR, remove day from listDate because it has no value
        console.log(err);      
      });

  },

};
</script>
