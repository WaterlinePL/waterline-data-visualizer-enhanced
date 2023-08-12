<template>
  <div class="map__leaflet-container" ref="mapLeaflet">
  </div>
  <Button @click="testButton" class="" />

</template>

<script setup>
import chroma from 'chroma-js';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { ref, onMounted, watch, defineProps } from 'vue';
import L from 'leaflet';

import {useStationsStore} from '@/state/stations.state';
import {useTimeSeriesStore} from '@/state/timeseries.state';

const stationsStore = useStationsStore();
stationsStore.initialize();

const timeSeriesStore = useTimeSeriesStore();
timeSeriesStore.initialize();

const testButton = () => {
  props.points.forEach(dataObject => {
    for (const [key, value] of Object.entries(dataObject)) {
      let station = stationsStore.stationsMap.get(parseInt(key));
      addMarker(station.type, station.coordinates, value);
    }
  });
}

const mapLeaflet = ref(null);

const props = defineProps({
  points: Array,
});

const map = ref(null);
const center = [50.25504, 18.46524];
const zoom = 10;
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

onMounted(() => {
  initMap();
  addTileLayer();
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
  props.points.forEach(dataObject => {
    for (const [key, value] of Object.entries(dataObject)) {
      let station = stationsStore.stationsMap.get(parseInt(key));
      addMarker(station.type, station.coordinates, value);
    }
  });
}

function clearMarkers() {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });
}

function addMarker(type, coordinates, values) {
  switch (type) {
    case 'POINT':
      addPointMarker(coordinates, values);
      break;
    case 'LINE':
      console.log('Line support not implemented');
      break;
    case 'POLYGON':
      console.log('Polygon support not implemented');
      break;
  }
}

function addPointMarker(coordinates, values) {
  const options = [];
  for (const [timeSeriesId, val] of Object.entries(values)) {
    const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(parseInt(timeSeriesId));
    const jsonObject = timeSeriesStore.minAndMaxValuesMap.get(parseInt(timeSeriesId));
    options.push({
      color: mapValueToThreeColorGradient(val, jsonObject.minValue, jsonObject.maxValue, timeSeriesInfo.minColor, timeSeriesInfo.midColor, timeSeriesInfo.maxColor),
      timeSeriesId: timeSeriesId
    });
  }
  L.marker(coordinates.flat(), { icon: getCustomIcon(options) }).addTo(map.value);
}

function getCustomIcon(options) {
  const iconHTML = `
    <div class="map__marker">
      <div class="marker__content">
          ${options.map(({ color, timeSeriesId }) => `<div style="background-color: ${color};" class="marker__content-part marker__content-part-${timeSeriesId}"></div>`).join('')}
      </div>
      <div class="marker__footer"></div>
    </div>
  `;
  return L.divIcon({
    html: iconHTML,
    iconSize: [32, 42],
    iconAnchor: [16, 42]
  });
}

function mapValueToThreeColorGradient(value, minValue, maxValue, color1, color2, color3) {
  const clampedValue = Math.min(Math.max(value, minValue), maxValue);

  const t = (clampedValue - minValue) / (maxValue - minValue);
  const interpolatedColor = chroma.scale([color1, color2, color3])(t);

  return interpolatedColor.hex();
}
</script>

<style>
.map__leaflet-container {
  width: 100%;
  height: 100%;
}

.leaflet-div-icon {
  background: none !important;
  border: none !important;
}

.map__marker {
  display: flex;
  flex-direction: column;
}

.marker__content {
  width: 32px;
  height: 32px;
  display: flex;
  border: 1px solid black;
}

.marker__content-part {
  flex: 1;
}

.marker__footer {
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 10px solid black;
}
</style>