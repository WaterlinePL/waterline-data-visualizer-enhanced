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
              <div class="chart__value">
                <Chart type="line" :data="chartData" :options="chartOptions" />
              </div>
              <div class="chart__button">
                <Button icon="pi pi-window-maximize" @click="maximizeChart = true" size="small" text />
                <Dialog v-model:visible="maximizeChart" :header="'Station Data - ' + detailsStore.selectedStationName" :style="{ width: '60vw' }">
                  <div class="dialog__chart">
                    <Chart type="line" :data="chartData" :options="chartOptionsMaximized" />
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
        </Panel>
      </TabPanel>
    </div>
  </TabView>
</template>

<script setup>
import {ref, watch} from 'vue';
import { useTimeSeriesStore } from '@/state/timeseries.state';
import { useDetailsStore } from '@/state/details.state';
import {useCustomizeStore} from "@/state/customize.state";

const timeSeriesStore = useTimeSeriesStore();
timeSeriesStore.initialize();

const detailsStore = useDetailsStore();

const customizeStore = useCustomizeStore();

const sidebarBorderColor = ref(customizeStore.sidebarBorderColor);
watch(() => customizeStore.sidebarBorderColor, newColor => {
  sidebarBorderColor.value = '#' + newColor;
})

const sidebarBackgroundColor = ref(customizeStore.sidebarBackgroundColor);
watch(() => customizeStore.sidebarBackgroundColor, newColor => {
  sidebarBackgroundColor.value = '#' + newColor;
})

const visibleTimeSeriesIds = ref([...timeSeriesStore.selectedTimeSeriesIds]);

watch(() => timeSeriesStore.selectedTimeSeriesIds, (newIDs) => {
  visibleTimeSeriesIds.value =  newIDs;
});

watch(() => visibleTimeSeriesIds.value, (newIDs, oldIDs) => {
  const pointsTimeSeries = newIDs.map(id => timeSeriesStore.timeSeriesInfoMap.get(id))
      .reduce((n, timeSeriesInfo) => timeSeriesInfo.type === "POINT" ? n + 1: n, 0);
  if (pointsTimeSeries === 0) {
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

watch(() => detailsStore.selectedStationId, () => {
  updateChartData();
});

watch(() => timeSeriesStore.selectedTimeSeriesData, () => {
  updateChartData();
});

function updateChartData() {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  chartOptionsMaximized.value = setChartOptionsMaximized();
}

const maximizeChart = ref(false);
const chartData = ref();
const chartOptions = ref();
const chartOptionsMaximized = ref();

const setChartData = () => {
  const chartData = timeSeriesStore.getChartDataForStation(detailsStore.selectedStationId);

  return {
    labels: chartData.labels,
    datasets: Object.entries(chartData.data).map(([key, data]) => ({
      label: key,
      fill: false,
      borderColor: data['color'],
      tension: 0.4,
      data: data['values'],
    })),
  };
};

const setChartOptions = () => {
  const textColor = "black";
  const textColorSecondary = "slategray";
  const surfaceBorder = "lightgray";

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        display: false
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

const setChartOptionsMaximized = () => {
  const textColor = "black";
  const textColorSecondary = "slategray";
  const surfaceBorder = "lightgray";

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
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
  return timeSeriesInfo.name + " (" + timeSeriesInfo.type + ")";
}
</script>

<style>
.panel {
  padding: 1rem;
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
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.details__chart .chart__button {
  position: absolute;
  top: 0;
  right: 0;
}

.details__chart .chart__button .p-button {
  padding: .5rem .75rem;
  width: 100%;
  height: 100%;
}

.dialog__chart {
  padding: 1rem;
}

.p-dialog .p-dialog-content .dialog__chart .p-chart {
  height: 100%;
  min-height: 60vh;
}

</style>
