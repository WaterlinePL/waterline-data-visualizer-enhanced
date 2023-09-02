<template>
  <div class="content__map">
    <LeafletMap :points="points" />
  </div>
  <div class="content__controllers">
    <div class="controllers__dates">
      <div class="dates__date">
        <p class="date__label date__label--left">Animation Start</p>
        <p class="date__time">{{ timeSeriesStore.animationStart }}</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--center">Now</p>
        <p class="date__time">{{ timeSeriesStore.animationNow }}</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--right">Animation End</p>
        <p class="date__time">{{ timeSeriesStore.animationEnd }}</p>
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

let animationIntervalId = null;

let startAnimationIndex = null;
let currentAnimationIndex = null;
let endAnimationIndex = null;

watch(() => timeSeriesStore.selectedMinTimeSeriesDataDate, selectedMinTimeSeriesDataDate => {
  if (!selectedMinTimeSeriesDataDate) return;

  timeSeriesStore.animationStart = selectedMinTimeSeriesDataDate.toLocaleString();
  timeSeriesStore.animationNow = selectedMinTimeSeriesDataDate.toLocaleString();
  startAnimationIndex = findAnimationIndex(selectedMinTimeSeriesDataDate);
  currentAnimationIndex = startAnimationIndex;
  // eslint-disable-next-line no-unused-vars
  const [key, data] = timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped[startAnimationIndex];
  points.value = data;
});

watch(() => timeSeriesStore.selectedMaxTimeSeriesDataDate, selectedMaxTimeSeriesDataDate => {
  if (!selectedMaxTimeSeriesDataDate) return;

  timeSeriesStore.animationEnd = selectedMaxTimeSeriesDataDate.toLocaleString();
  endAnimationIndex = findAnimationIndex(selectedMaxTimeSeriesDataDate);
});

function findAnimationIndex(date) {
  return timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped.findIndex(
      // eslint-disable-next-line no-unused-vars
      ([key, value]) => new Date(key).getTime() === date.getTime()
  );
}
const animate = () => {
  const timeSeriesData = ref(timeSeriesStore.selectedTimeSeriesDataMergedAndGrouped);
  if (currentAnimationIndex > endAnimationIndex) {
    stopAnimation();
    return;
  }

  const [key, data] = timeSeriesData.value[currentAnimationIndex];
  points.value = data;
  timeSeriesStore.animationNow = new Date(key).toLocaleString();
  progressValue.value = ((currentAnimationIndex - startAnimationIndex) / (endAnimationIndex - startAnimationIndex)) * 100;
  currentAnimationIndex++;
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
  currentAnimationIndex = startAnimationIndex;
  progressValue.value = 0;
  timeSeriesStore.animationNow = timeSeriesStore.animationStart;
  timeSeriesStore.clearLeafletMap = true;
}

</script>


<style>
.content__map {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.content__controllers {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.content__map-scales {
  margin: 1rem;
}

.controllers__progress-bar .p-progressbar {
  height: 15px;
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
