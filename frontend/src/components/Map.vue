<template>
  <div class="content__map">
    <l-map :zoom="zoom" :center="center" ref="map">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="(point, index) in points" :key="index" :lat-lng="point.latlng" :icon="getCustomIcon()"></l-marker>
    </l-map>
    <div class="content__map-scale">
      <div class="map-scale__scale-value">
        <p class="scale-value__value scale-value__value--top">143.20</p>
        <p class="scale-value__unit scale-value__unit--top">[mm]</p>
      </div>
      <div class="map-scale__wrapper">
        <div class="map-scale__scale-bar"></div>
      </div>
      <div class="map-scale__scale-value">
        <p class="scale-value__value scale-value__value--low">0.00</p>
        <p class="scale-value__unit scale-value__unit--low">[mm]</p>
      </div>
    </div>
  </div>
  <div class="content__controllers">
    <div class="controllers__dates">
      <div class="dates__date">
        <p class="date__label date__label--left">Animation Start</p>
        <p class="date__time">Aug 4, 2021, 12:00:00 AM</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--center">Now</p>
        <p class="date__time">Aug 11, 2021, 12:00:00 AM</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--right">Animation End</p>
        <p class="date__time">Aug 31, 2021, 12:00:00 AM</p>
      </div>
    </div>
    <div class="controllers__progress-bar">
      <ProgressBar :value="progress_value"></ProgressBar>
    </div>
    <div class="controllers__controls">
      <Button @click="startAnimation" class="controls__button controls__button--play" icon="pi pi-play" rounded aria-label="Play" v-if="!isAnimating" />
      <Button @click="pauseAnimation" class="controls__button controls__button--pause" icon="pi pi-pause" rounded aria-label="Pause" v-else />
      <Button @click="stopAnimation" class="controls__button  controls__button--stop" icon="pi pi-stop" severity="danger" rounded aria-label="Stop" :disabled="!isAnimating" />
    </div>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.js";
import {LMap, LMarker, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {ref} from "vue";
import * as L from "leaflet";

import {useTimeseriesStore} from '@/state/timeseries.state';

const timeSeriesStore = useTimeseriesStore();
const isAnimating = ref(timeSeriesStore.isAnimating);
let animationIntervalId = null;
let animationIndex = 0;

const animate = () => {
  if (animationIndex >= timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped.length) {
    stopAnimation();
    return;
  }

  const [key, dataArray] = timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped[animationIndex];
  console.log(`Index: ${animationIndex}`);
  console.log(`Key: ${key}`);
  console.log(`Data Array:`, dataArray);

  animationIndex++;
};

const startAnimation = () => {
  if (isAnimating.value) return;

  isAnimating.value = true;
  animate();
  animationIntervalId = setInterval(animate, timeSeriesStore.animationInterval);
};

const pauseAnimation = () => {
  if (!isAnimating.value) return;

  isAnimating.value = false;
  clearInterval(animationIntervalId);
}

const stopAnimation = () => {
  if (!isAnimating.value) return;

  isAnimating.value = false;
  clearInterval(animationIntervalId);
  animationIndex = 0;
}


const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let zoom = 6;
let center = [51.19066, 18.6592];

const progress_value = ref(35);

const points = ref([
  {
    "id": "250180460",
    "stationName": "ADAMOWICE",
    "value": "95414",
    "latlng": [51.94225, 20.45963]
  },
  {
    "id": "254230010",
    "stationName": "ALEKSANDRÓWKA",
    "value": "91908",
    "latlng": [51.19066, 18.6592]
  },
  {
    "id": "250180220",
    "stationName": "BORÓW",
    "value": "95403",
    "latlng": [52.52514, 20.95634]
  }
]);

function getCustomIcon() {
  const iconHTML = `
    <div style="width: 32px; height: 32px; display: flex;">
      <div style="flex: 1; background-color: red"></div>
      <div style="flex: 1; background-color: green"></div>
      <div style="flex: 1; background-color: blue"></div>
      <div style="flex: 1; background-color: pink"></div>
      <div style="flex: 1; background-color: yellow"></div>
    </div>
  `;
  return L.divIcon({
    html: iconHTML,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}
</script>

<!--<script setup>-->
<!--// Function to increment date and update the map-->
<!--const animate = () => {-->
<!--  const currentIndex = timeSeriesStore.selectedTimeSeriesDataDates.findIndex(-->
<!--      (date) => date.getTime() === timeSeriesStore.minSelectedTimeSeriesDataDate.getTime()-->
<!--  );-->

<!--  if (currentIndex >= 0 && currentIndex < timeSeriesStore.selectedTimeSeriesDataDates.length - 1) {-->
<!--    const nextDate = timeSeriesStore.selectedTimeSeriesDataDates[currentIndex + 1];-->
<!--    timeSeriesStore.minSelectedTimeSeriesDataDate = nextDate;-->
<!--  } else {-->
<!--    stopAnimation();-->
<!--  }-->
<!--};-->

<!--// Function to start the animation-->
<!--const startAnimation = () => {-->
<!--  if (!isAnimating.value) {-->
<!--    isAnimating.value = true;-->
<!--    animationTimer = setInterval(animate, timeSeriesStore.animationInterval);-->
<!--  }-->
<!--};-->

<!--// Function to pause the animation-->
<!--const pauseAnimation = () => {-->
<!--  if (isAnimating.value) {-->
<!--    isAnimating.value = false;-->
<!--    clearInterval(animationTimer);-->
<!--  }-->
<!--};-->

<!--// Function to stop the animation-->
<!--const stopAnimation = () => {-->
<!--  if (isAnimating.value) {-->
<!--    pauseAnimation();-->
<!--    isAnimating.value = false;-->
<!--    timeSeriesStore.minSelectedTimeSeriesDataDate = timeSeriesStore.selectedTimeSeriesDataDates[0];-->
<!--  }-->
<!--};-->
<!--</script>-->

<style>
.content__map {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.content__map-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1rem;

}
.map-scale__wrapper {
  display: flex;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: .75rem 0;
}

.map-scale__scale-bar {
  height: 100%;
  width: 70%;
  background: linear-gradient(#896DB8, #673AB7);
}

.map-scale__scale-value {
  display: flex;
  flex-direction: column;
}

.scale-value__value,
.scale-value__unit {
  font-weight: bold;
}

.content__controllers {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

.controllers__progress-bar .p-progressbar {
  height: 10px;
}

.controllers__dates {
  display: flex;
  flex-direction: row;
  margin: 0.5rem 0;
  justify-content: space-between;
}

.controls__button {
  margin: 1rem 0.25rem !important;
}

.date__label {
  font-size: 0.75rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0.25rem;
}

.date__label--left {
  text-align: left;
}

.date__label--center {
  text-align: center;
}

.date__label--right {
  text-align: right;
}
</style>
