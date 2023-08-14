<template>
  <div class="content__map">
    <LeafletMap :points="points" />
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
        <p class="date__time">{{ animationStart }}</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--center">Now</p>
        <p class="date__time">{{ animationNow }}</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--right">Animation End</p>
        <p class="date__time">{{ animationEnd }}</p>
      </div>
    </div>
    <div class="controllers__progress-bar">
      <ProgressBar :value="progressValue"></ProgressBar>
    </div>
    <div class="controllers__controls">
      <Button @click="startAnimation" class="controls__button controls__button--play" icon="pi pi-play" rounded aria-label="Play"
              v-if="!isAnimating" :disabled="!timeSeriesStore.minTimeSeriesDataDate || !timeSeriesStore.maxTimeSeriesDataDate" />
      <Button @click="pauseAnimation" class="controls__button controls__button--pause" icon="pi pi-pause" rounded aria-label="Pause" v-else />
      <Button @click="stopAnimation" class="controls__button  controls__button--stop" icon="pi pi-stop" severity="danger"
              rounded aria-label="Stop" :disabled="!progressValue" />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";

import {useTimeSeriesStore} from '@/state/timeseries.state';
import LeafletMap from "@/components/LeafletMap.vue";

const timeSeriesStore = useTimeSeriesStore();
timeSeriesStore.initialize();

const isAnimating = ref(timeSeriesStore.isAnimating);
const progressValue = ref(0);

const points = ref({});

const animationStart = ref();
const animationEnd = ref();
const animationNow = ref("Select animation start and end dates to run an animation");

watch(() => timeSeriesStore.selectedMinTimeSeriesDataDate, selectedMinTimeSeriesDataDate => {
  animationStart.value = selectedMinTimeSeriesDataDate.toLocaleString();
  animationNow.value = selectedMinTimeSeriesDataDate.toLocaleString();
});

watch(() => timeSeriesStore.selectedMaxTimeSeriesDataDate, selectedMaxTimeSeriesDataDate => {
  animationEnd.value = selectedMaxTimeSeriesDataDate.toLocaleString();
});

let animationIntervalId = null;
let animationIndex = 0;

const animate = () => {
  const timeSeriesData = ref(timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped);
  if (animationIndex >= timeSeriesData.value.length) {
    stopAnimation();
    return;
  }

  const [key, data] = timeSeriesData.value[animationIndex];
  points.value = data;
  animationNow.value = new Date(key).toLocaleString();
  progressValue.value = ((animationIndex + 1) / timeSeriesData.value.length) * 100;
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
  isAnimating.value = false;
  clearInterval(animationIntervalId);
  animationIndex = 0;
  progressValue.value = 0;
  animationNow.value = animationStart.value;
}

</script>


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
