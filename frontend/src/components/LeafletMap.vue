<template>
  <div class="map__leaflet-container" ref="mapLeaflet">
  </div>
  <div class="content__map-scales">
    <div class="content__map-scale" v-for="timeSeriesId in timeSeriesStore.selectedTimeSeriesIds" :key="timeSeriesId">
      <p class="map-scale__title">{{ getValueLabelForScale(timeSeriesId) }}</p>
      <div class="map-scale__values">
        <div class="map-scale__scale-value">
          <p class="scale-value__value scale-value__value--low">{{ getMinValueForScale(timeSeriesId) }}</p>
          <p class="scale-value__unit scale-value__unit--low">{{ getMetricLabelForScale(timeSeriesId) }}</p>
        </div>
        <div class="map-scale__wrapper">
          <div class="map-scale__scale-bar" :style="getLinearGradientBackground(timeSeriesId)"></div>
        </div>
        <div class="map-scale__scale-value">
          <p class="scale-value__value scale-value__value--top">{{ getMaxValueForScale(timeSeriesId) }}</p>
          <p class="scale-value__unit scale-value__unit--top">{{ getMetricLabelForScale(timeSeriesId) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import chroma from 'chroma-js';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { ref, onMounted, watch, defineProps } from 'vue';
import L from 'leaflet';

import {useStationsStore} from '@/state/stations.state';
import {useTimeSeriesStore} from '@/state/timeseries.state';
import {useDetailsStore} from "@/state/details.state";

const stationsStore = useStationsStore();
stationsStore.initialize();

const timeSeriesStore = useTimeSeriesStore();
timeSeriesStore.initialize();

const detailsStore = useDetailsStore();

const mapLeaflet = ref(null);

const props = defineProps({
  points: Object,
});

const map = ref(null);
const center = [50.25504, 18.46524];
const zoom = 10;
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

onMounted(() => {
  initMap();
  addTileLayer();
});

watch(
    () => props.points,
    () => {
      clearMarkers();
      addMarkers();
    },
    { deep: true }
);

watch(() => timeSeriesStore.clearLeafletMap, () => {
  clearMarkers();
  timeSeriesStore.clearLeafletMap = false;
});

function initMap() {
  map.value = L.map(mapLeaflet.value).setView(center, zoom);
}

function addTileLayer() {
  L.tileLayer(url).addTo(map.value);
}

function addMarkers() {
  const coordinates = [];
  for (const [stationId, value] of Object.entries(props.points)) {
    let station = stationsStore.stationsMap.get(parseInt(stationId));
    addMarker(station, value);
    coordinates.push(station.coordinates);
  }
  const bounds = L.latLngBounds(coordinates);
  map.value.fitBounds(bounds);
}

function clearMarkers() {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });
}

function addMarker(station, values) {
  switch (station.type) {
    case 'POINT':
      addPointMarker(station, values);
      break;
    case 'LINE':
      console.log('Line support not implemented');
      break;
    case 'POLYGON':
      console.log('Polygon support not implemented');
      break;
  }
}

function addPointMarker(station, values) {
  const options = [];
  for (const [timeSeriesId, val] of Object.entries(values)) {
    const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(parseInt(timeSeriesId));
    const jsonObject = timeSeriesStore.minAndMaxValuesMap.get(parseInt(timeSeriesId));
    options.push({
      color: mapValueToThreeColorGradient(val, jsonObject.minValue, jsonObject.maxValue, timeSeriesInfo.minColor, timeSeriesInfo.midColor, timeSeriesInfo.maxColor),
      timeSeriesId: timeSeriesId
    });
  }
  const marker = L.marker(station.coordinates.flat(), { icon: getCustomIcon(options) }).addTo(map.value);
  marker.on('click', event => {
    const clickedMarker = event.target;
    const coords = clickedMarker.getLatLng();
    detailsStore.clickOnLeafletMap(station, coords, values)
  });
  if (station.id === detailsStore.selectedStationId) {
    detailsStore.updateSelectedStation(values);
  }
}

function getCustomIcon(options) {
  const iconHTML = `
    <div class="map__marker">
      <div class="marker__content">
          ${options.map(
              ({ color, timeSeriesId }) => `<div style="background-color: ${color};" class="marker__content-part marker__content-part-${timeSeriesId}"></div>`
          ).join('')}
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

function getMinValueForScale(timeSeriesId) {
  const jsonObject = timeSeriesStore.minAndMaxValuesMap.get(timeSeriesId);
  return jsonObject.minValue.toFixed(2);
}

function getMaxValueForScale(timeSeriesId) {
  const jsonObject = timeSeriesStore.minAndMaxValuesMap.get(timeSeriesId);
  return jsonObject.maxValue.toFixed(2);
}

function getMetricLabelForScale(timeSeriesId) {
  const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(timeSeriesId);
  return timeSeriesInfo.metricLabel;
}

function getValueLabelForScale(timeSeriesId) {
  const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(timeSeriesId);
  return timeSeriesInfo.valueLabel;
}

function getLinearGradientBackground(timeSeriesId) {
  const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(timeSeriesId);
  return `background: linear-gradient(to right, ${timeSeriesInfo.minColor}, ${timeSeriesInfo.midColor}, ${timeSeriesInfo.maxColor})`;
}

</script>

<style>

.map__leaflet-container {
  display: flex;
  flex-direction: column;
  min-height: 800px;
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
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

.content__map-scales {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.content__map-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0.5rem 0;
  width: 48%;
}

.map-scale__title {
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.map-scale__values {
  display: flex;
  flex-direction: row;
}

.map-scale__wrapper {
  display: flex;
  justify-content: space-around;
  height: 100%;
  width: 100%;
}

.map-scale__scale-bar {
  height: 100%;
  width: 90%;
}

.map-scale__scale-value {
  display: flex;
  flex-direction: row;
}

.scale-value__value,
.scale-value__unit {
  font-weight: bold;
  margin: 0 0.125rem;
}
</style>