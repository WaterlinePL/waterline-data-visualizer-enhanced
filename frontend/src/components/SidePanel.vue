<template>
  <TabView class="panel" v-model:activeIndex="detailsStore.activePanelIndex">
    <div class="panel__tab">
      <TabPanel header="Animation">
        <Panel class="panel__item panel-item" header="Animation">
            <span class="panel__calendar p-float-label">
                <Calendar v-model="timeSeriesStore.selectedMinTimeSeriesDataDate" inputId="start_date" showTime hourFormat="24" dateFormat="dd/mm/yy"
                          show-icon :minDate="timeSeriesStore.minTimeSeriesDataDate" :maxDate="timeSeriesStore.maxTimeSeriesDataDate" />
                <label>Start Date</label>
            </span>
          <span class="panel__calendar p-float-label">
                <Calendar v-model="timeSeriesStore.selectedMaxTimeSeriesDataDate" inputId="end_date" showTime hourFormat="24" dateFormat="dd/mm/yy"
                          show-icon :minDate="timeSeriesStore.minTimeSeriesDataDate" :maxDate="timeSeriesStore.maxTimeSeriesDataDate" />
                <label>End Date</label>
            </span>
          <div class="panel__animation">
            <label class="panel__animation-label">Animation interval</label>
            <InputNumber v-model="timeSeriesStore.animationInterval" inputId="animation-interval" showButtons
                         mode="decimal" :step="100" :min="0" :max="10000" suffix=" ms" :disabled="!timeSeriesStore.selectedMinTimeSeriesDataDate || !timeSeriesStore.selectedMaxTimeSeriesDataDate" />
          </div>
        </Panel>
      </TabPanel>
    </div>
    <div class="panel__tab">
      <TabPanel header="Details" :disabled="timeSeriesStore.selectedTimeSeriesIds.length === 0 && !detailsStore.selectedStation">
        <Panel class="panel-item" header="Time Series" v-if="timeSeriesStore.selectedTimeSeriesIds.length > 0">
          <div class="panel__timeseries">
            <div class="timeseries__value" v-for="timeSeriesId in timeSeriesStore.selectedTimeSeriesIds" :key="timeSeriesId">
              <Checkbox v-model="visibleTimeSeriesIds" :inputId="'timeSeries-' + timeSeriesId" :value="timeSeriesId" />
              <label :for="'timeSeries-' + timeSeriesId">{{ getTimeSeriesName(timeSeriesId) }}</label>
            </div>
          </div>
        </Panel>
        <Panel class="panel-item" header="Details" v-if="detailsStore.selectedStation">
          <div class="panel__details">
            <div class="details__info">
              <div class="info__parameter">
                <p class="parameter__label">Name</p>
                <p class="parameter__value">{{ detailsStore.selectedStationName }}</p>
              </div>
              <div class="info__parameter">
                <p class="parameter__label">Latitude</p>
                <p class="parameter__value">{{ detailsStore.selectedCoordinatesLatitude }}</p>
              </div>
              <div class="info__parameter">
                <p class="parameter__label">Longitude</p>
                <p class="parameter__value">{{ detailsStore.selectedCoordinatesLongitude }}</p>
              </div>
              <div class="info__parameter" v-for="selectedValue in detailsStore.selectedValues" :key="selectedValue.title">
                <p class="parameter__label">{{ selectedValue.title }}
                  <span class="parameter__annotation">({{ selectedValue.from }})</span>
                </p>
                <p class="parameter__value">{{ selectedValue.value }}</p>
              </div>
              <div class="info__parameter">
                <p class="parameter__label">Date</p>
                <p class="parameter__value">{{ detailsStore.selectedDate }}</p>
              </div>
            </div>
            <Divider class="details__divider"></Divider>
            <div class="details__chart">
              <Chart type="bar" :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </Panel>
      </TabPanel>
    </div>
  </TabView>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import { useTimeSeriesStore } from '@/state/timeseries.state';
import { useDetailsStore } from '@/state/details.state';

const timeSeriesStore = useTimeSeriesStore();
const detailsStore = useDetailsStore();

const visibleTimeSeriesIds = ref([...timeSeriesStore.selectedTimeSeriesIds]);

watch(() => timeSeriesStore.selectedTimeSeriesIds, (newIDs) => {
  visibleTimeSeriesIds.value =  newIDs;
});

watch(() => visibleTimeSeriesIds.value, (newIDs, oldIDs) => {
  if (newIDs.length === 0) {
    document.querySelectorAll('.map__marker').forEach(element => element.style.display = 'none');
  } else {
    document.querySelectorAll('.map__marker').forEach(element => element.style.display = 'flex');
  }

  if (newIDs.length > oldIDs.length) {
    newIDs.filter(item => !oldIDs.includes(item))
      .forEach(item => document.querySelectorAll(`.marker__content-part-${item}`)
      .forEach(element => element.style.display = 'flex'));
  } else if (newIDs.length < oldIDs.length) {
    oldIDs.filter(item => !newIDs.includes(item))
      .forEach(item => document.querySelectorAll(`.marker__content-part-${item}`)
      .forEach(element => element.style.display = 'none'));
  }
});

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
  // const textColor = documentStyle.getPropertyValue('--text-color');
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

function getTimeSeriesName(timeSeriesId) {
  const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(timeSeriesId);
  return timeSeriesInfo.name;
}
</script>

<style>
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

.panel__timeseries {
  display: flex;
  flex-direction: column;
}

.panel__timeseries .p-checkbox {
  margin-right: 0.5rem;
}

.timeseries__value {
  display: flex;
  justify-content: left;
  margin: .5rem 0;
}

.details__info {
  margin-bottom: 2rem;
}

.details__divider {
  margin: 2rem 0;
}

.info__parameter {
  text-align: left;
  margin-bottom: 1rem;
}

.info__parameter .parameter__label {
  font-size: 0.875rem;
  color: slategray;
  margin-bottom: .5rem;
  text-transform: capitalize;
}

.parameter__annotation {
  color: #70809080;
  text-transform: none;
}

.details__chart {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
