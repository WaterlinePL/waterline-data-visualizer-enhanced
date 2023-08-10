<template>
  <TabView class="panel">
    <div class="panel__tab">
      <TabPanel header="Animation">
        <Panel class="panel__item panel-item" header="Animation">
            <span class="panel__calendar p-float-label">
                <Calendar v-model="selectedMinTimeSeriesDataDate" inputId="start_date" showTime hourFormat="24" show-icon :minDate="timeSeriesStore.minTimeSeriesDataDate" :maxDate="timeSeriesStore.maxTimeSeriesDataDate" />
                <label>Start Date</label>
            </span>
          <span class="panel__calendar p-float-label">
                <Calendar v-model="selectedMaxTimeSeriesDataDate" inputId="end_date" showTime hourFormat="24" show-icon :minDate="timeSeriesStore.minTimeSeriesDataDate" :maxDate="timeSeriesStore.maxTimeSeriesDataDate" />
                <label>End Date</label>
            </span>
          <div class="panel__animation">
            <label class="panel__animation-label">Animation interval</label>
            <InputNumber v-model="timeSeriesStore.animationInterval" inputId="animation-interval" showButtons
                         mode="decimal" :step="100" :min="0" :max="10000" suffix=" ms" :disabled="!selectedMinTimeSeriesDataDate || !selectedMaxTimeSeriesDataDate" />
          </div>
        </Panel>
      </TabPanel>
    </div>
    <div class="panel__tab">
      <TabPanel header="Details">
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
    </div>
  </TabView>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTimeseriesStore } from '@/state/timeseries.state';

const timeSeriesStore = useTimeseriesStore();

const selectedMinTimeSeriesDataDate = ref(timeSeriesStore.selectedMinTimeSeriesDataDate);
const selectedMaxTimeSeriesDataDate = ref(timeSeriesStore.selectedMaxTimeSeriesDataDate);

watch(() => timeSeriesStore.selectedMinTimeSeriesDataDate,
    (newDate) => selectedMinTimeSeriesDataDate.value = newDate
);

watch(() => timeSeriesStore.selectedMaxTimeSeriesDataDate,
    (newDate) => selectedMaxTimeSeriesDataDate.value = newDate
);

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

.details__info {
  margin-bottom: 2rem;
}

.details__divider {
  margin: 2rem 0;
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
</style>
