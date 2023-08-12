<template>
  <div class="map__leaflet-container" ref="mapLeaflet">
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { ref, onMounted, watch, defineProps } from 'vue';
import L from 'leaflet';

const mapLeaflet = ref(null);

const props = defineProps({
  points: Array,
});

const map = ref(null);
const center = [51.19066, 18.6592];
const zoom = 10;
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

onMounted(() => {
  initMap();
  addTileLayer();
  addMarkers();
});

watch(props.points, () => {
  clearMarkers();
  addMarkers();
});

function initMap() {
  map.value = L.map(mapLeaflet.value).setView(center, zoom);
}

function addTileLayer() {
  L.tileLayer(url).addTo(map.value);
}

function addMarkers() {
  // props.points.forEach((point) => {
  //   L.marker(point.latlng, { icon: getCustomIcon() }).addTo(map.value);
  //   // You can customize the marker behavior here if needed
  // });
}

function clearMarkers() {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });
}

// function getCustomIcon() {
//   const iconHTML = `
//     <div style="width: 20px; height: 20px; display: flex;">
//       <div style="flex: 1; background-color: red"></div>
//       <div style="flex: 1; background-color: green"></div>
//     </div>
//   `;
//   return L.divIcon({
//     html: iconHTML,
//     iconSize: [20, 20],
//     iconAnchor: [20, 20]
//   });
// }
</script>

<style>
.map__leaflet-container {
  width: 100%;
  height: 100%;
}
</style>