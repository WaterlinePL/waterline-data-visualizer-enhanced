<template>
  <header class="header">
    <Menubar :model="items">
      <template #start>
        <div class="header__logo">
          <img alt="logo" src="../assets/logo.png" height="55" class="mr-2" />
          <div class="header__text">
            <p class="header__title">Waterline project</p>
            <p class="header__description">New solutions for data assimilation and communication to improve hydrological modelling and forecasting</p>
          </div>
        </div>
        <MultiSelect class="header__multiselect" v-model="timeSeriesStore.selectedTimeSeriesData" :options="timeSeriesStore.timeSeries" filter :maxSelectedLabels="1"
                     optionLabel="name" optionValue="data" placeholder="Select Time Series" />
      </template>
    </Menubar>
    <Dialog v-model:visible="stationsDialogVisible" modal header="Stations" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="stationsDialogVisible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="stationsDialogVisible = false" autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="customizeUIDialogVisible" modal header="Customize UI" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="customizeUIDialogVisible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="customizeUIDialogVisible = false" autofocus />
      </template>
    </Dialog>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';

import { useTimeseriesStore } from '@/state/timeseries.state';

const timeSeriesStore = useTimeseriesStore();
watch(() => timeSeriesStore.selectedTimeSeriesData, selectedTimeSeriesData => {
  timeSeriesStore.updateTimeSeriesData(selectedTimeSeriesData);
})

const stationsDialogVisible = ref(false);
const customizeUIDialogVisible = ref(false);

const items = ref([
  {
    label: 'Stations',
    icon: 'pi pi-fw pi-map-marker',
    command: () => {
      stationsDialogVisible.value = true;
    }
  },
  {
    label: 'Customize UI',
    icon: 'pi pi-fw pi-palette',
    command: () => {
      customizeUIDialogVisible.value = true;
    }
  }
]);
</script>

<style>
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

.header__logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__multiselect {
  margin-left: 5rem;
  min-width: 210px;
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
</style>
