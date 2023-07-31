<template>
  <div class="content__map">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="markerLatLng"></l-marker>
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
      <Button class="controls__button controls__button--play" icon="pi pi-play" rounded aria-label="Play" />
      <Button class="controls__button controls__button--pause" icon="pi pi-pause" rounded aria-label="Pause" />
      <Button class="controls__button  controls__button--stop" icon="pi pi-stop" severity="danger" rounded aria-label="Stop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const zoom = 15;
const center = [51.505, -0.159];
const markerLatLng = [51.504, -0.159];

const progress_value = ref(35);


onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        type: 'line',
        label: 'Dataset 1',
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: [50, 25, 12, 48, 56, 76, 42]
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: documentStyle.getPropertyValue('--green-500'),
        data: [21, 84, 24, 75, 37, 65, 34],
        borderColor: 'white',
        borderWidth: 2
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: documentStyle.getPropertyValue('--orange-500'),
        data: [41, 52, 24, 74, 23, 21, 32]
      }
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          display: false
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
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
