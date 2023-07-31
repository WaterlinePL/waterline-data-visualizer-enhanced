<template>
  <main class="container">
    <header class="header">
      <Menubar :model="items">
        <template #start>
          <img alt="logo" src="../assets/logo.png" height="55" class="mr-2" />
          <div class="header__text">
            <p class="header__title">Waterline project</p>
            <p class="header__description">New solutions for data assimilation and communication to improve hydrological modelling and forecasting</p>
          </div>
        </template>
      </Menubar>
      <Dialog v-model:visible="data_models_dialog_visible" modal header="Data Models" :style="{ width: '50vw' }">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="data_models_dialog_visible = false" text />
          <Button label="Yes" icon="pi pi-check" @click="data_models_dialog_visible = false" autofocus />
        </template>
      </Dialog>
      <Dialog v-model:visible="stations_dialog_visible" modal header="Stations" :style="{ width: '50vw' }">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="stations_dialog_visible = false" text />
          <Button label="Yes" icon="pi pi-check" @click="stations_dialog_visible = false" autofocus />
        </template>
      </Dialog>
      <Dialog v-model:visible="customize_ui_dialog_visible" modal header="Customize UI" :style="{ width: '50vw' }">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="customize_ui_dialog_visible = false" text />
          <Button label="Yes" icon="pi pi-check" @click="customize_ui_dialog_visible = false" autofocus />
        </template>
      </Dialog>
    </header>
    <section class="section">
      <aside class="aside">
        <TabView class="panel">
          <TabPanel class="panel__tab" header="Animation">
            <Panel class="panel__item panel-item" header="Animation">
            <span class="panel__calendar p-float-label">
                <Calendar v-model="start_datetime24h" inputId="start_date" showTime hourFormat="24" show-icon />
                <label for="start_date">Start Date</label>
            </span>
              <span class="panel__calendar p-float-label">
                <Calendar v-model="end_datetime24h" inputId="end_date" showTime hourFormat="24" show-icon />
                <label for="end_date">End Date</label>
            </span>
              <div class="panel__animation">
                <label for="animation-interval" class="panel__animation-label">Animation interval</label>
                <InputNumber v-model="animation_interval" inputId="animation-interval" showButtons mode="decimal" :step="100" :min="0" :max="10000" suffix=" ms" />
              </div>
            </Panel>
          </TabPanel>
          <TabPanel class="panel__tab" header="Details">
            <Panel class="panel-item" header="Time Series"></Panel>
            <Panel class="panel-item" header="Details">
              <div class="panel__details">
                <div class="details__info">
                  <div class="info__parameter">
                    <p class="parameter__label">Name</p>
                    <p class="parameter__value">LIPINY</p>
                  </div>
                  <div class="info__parameter">
                    <p class="parameter__label">Latitude</p>
                    <p class="parameter__value">51.3136</p>
                  </div>
                  <div class="info__parameter">
                    <p class="parameter__label">Longitute</p>
                    <p class="parameter__value">21.7283</p>
                  </div>
                  <div class="info__parameter">
                    <p class="parameter__label">Value</p>
                    <p class="parameter__value">0.3 [mm]</p>
                  </div>
                  <div class="info__parameter">
                    <p class="parameter__label">Date</p>
                    <p class="parameter__value">Aug 10, 2021, 12:00:00 AM</p>
                  </div>
                </div>
                <Divider class="details__divider"></Divider>
                <div class="details__chart">
                  <Chart type="bar" :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </Panel>
          </TabPanel>
        </TabView>
      </aside>
      <section class="content">
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
            <ProgressBar :value="50"></ProgressBar>
          </div>
          <div class="controllers__controls">
            <Button class="controls__button controls__button--play" icon="pi pi-play" rounded aria-label="Play" />
            <Button class="controls__button controls__button--pause" icon="pi pi-pause" rounded aria-label="Pause" />
            <Button class="controls__button  controls__button--stop" icon="pi pi-stop" severity="danger" rounded aria-label="Stop" />
          </div>
        </div>
      </section>
    </section>
    <footer class="footer">
      <p class="footer-text">Copyright © 2023 Waterline Project</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const zoom = 15;
const center = [51.505, -0.159];
const markerLatLng = [51.504, -0.159];

const start_datetime24h = ref();
const end_datetime24h = ref();

const progress_value = ref(50);

const animation_interval = ref(100);

const data_models_dialog_visible = ref(false);
const stations_dialog_visible = ref(false);
const customize_ui_dialog_visible = ref(false);

const items = ref([
  {
    label: 'Data Models',
    icon: 'pi pi-fw pi-database',
    command: () => {
      data_models_dialog_visible.value = true;
    }
  },
  {
    label: 'Stations',
    icon: 'pi pi-fw pi-map-marker',
    command: () => {
      stations_dialog_visible.value = true;
    }
  },
  {
    label: 'Customize UI',
    icon: 'pi pi-fw pi-palette',
    command: () => {
      customize_ui_dialog_visible.value = true;
    }
  }
]);

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
  .container {
    display: flex;
    flex-direction: column;
  }

  .header {
    margin: 1rem;
  }

  .header .p-menubar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .p-menubar-start {
    display: flex;
    align-items: center;
  }

  .header__text {
    flex-direction: row;
    max-width: 330px;
    padding: 0 1rem;
    margin-left: 0.5rem;
  }

  .header__title {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: left;
    margin-bottom: 0.25rem;
  }

  .header__description {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.7);
    text-align: justify;
  }

  .section {
    display: flex;
    flex-direction: row;
    margin: 1rem;
  }

  .aside {
    flex: 1;
    margin-right: 1rem;
    overflow: scroll !important;
    max-width: 350px;
  }

  .panel {
    padding: 1rem;
    border: 1px solid #e5e5e5;
    min-height: 800px;
  }

  .panel .p-tabview-panels {
    padding: 1rem 0 !important;
  }

  .panel .panel-item {
    box-shadow: none;
  }

  .p-panel:first-child {
    margin-top: 0;
  }

  .p-panel {
    margin-top: 1rem;
  }

  .p-panel-title {
    font-size: 1rem !important;
  }

  .p-panel .p-panel-header {
    border: 1px solid #dee2e6 !important;
    background: #f8f9fa !important;
  }

  .p-panel.p-panel-toggleable .p-panel-header {
    padding: 0.125rem 1rem !important;
  }

  .p-panel .p-panel-content {
    padding-top: 1rem !important;
    border: 1px solid #e0e0e0 !important;
    border-top: 0 none !important;
  }

  .panel__calendar {
    margin-bottom: 1rem;
  }

  .panel__animation-label {
    float: left;
    font-weight: bold;
    margin-bottom: 0.375rem;
  }

  .panel__animation .p-inputnumber .p-inputtext {
    width: 100%;
  }

  .panel .p-tabview-nav-link {
    padding: 1rem !important;
  }

  .content {
    display: flex;
    flex: 1;
    margin-left: 1rem;
    flex-grow: 3;
    flex-direction: column;
  }

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
  .details__info {
    margin-bottom: 2rem;
  }

  .details__divider {
    margin: 2rem 0;
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

  .info__parameter {
    text-align: left;
    margin-bottom: .75rem;
  }

  .info__parameter .parameter__label {
    font-size: 0.875rem;
    color: slategray;
    margin-bottom: .25rem;
  }

  .info__parameter .parameter__value {
  }

  .details__chart {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .footer {
    margin: 1rem;
  }

  .footer-text {
    color: rgba(0, 0, 0, 0.87);
    border: 1px solid #e5e5e5;
    padding: 2rem;
  }
</style>
