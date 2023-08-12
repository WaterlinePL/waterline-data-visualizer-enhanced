import { defineStore } from 'pinia';
import timeseriesDataPrecipitation from '../data/point/timeseries_precipitation.json'
import timeseriesDataTemperature from '../data/point/timeseries_temperature.json'

function prepareData(data) {
    return data
        .flat()
        .map(item => ({
            id: item.id,
            timeSeriesId: item.timeSeriesId,
            stationId: item.stationId,
            value: item.value,
            date: new Date(item.date)
        }))
        .sort((a, b) => a.date - b.date);
}

function prepareTimeSeriesInfo(data) {
    return data
        .map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            valueLabel: item.valueLabel,
            metricLabel: item.metricLabel,
            minColor: item.minColor,
            maxColor: item.maxColor
        }));
}

function groupByDateStationIdAndTimeSeriesId(mergedAndSortedData) {
    return mergedAndSortedData.reduce((obj, item) => {
            const { date, timeSeriesId, stationId, value } = item;
            if (!obj[date]) obj[date] = {};
            if (!obj[date][stationId]) obj[date][stationId] = {};

            obj[date][stationId][timeSeriesId] = value;

            return obj;
        }, {});
}

export const useTimeSeriesStore = defineStore('timeseries', {
    state: () => ({
        timeSeries: [timeseriesDataPrecipitation, timeseriesDataTemperature],
        timeSeriesInfoMap: new Map(),
        selectedTimeSeriesData: [],
        selectedTimeSeriesDataDates: [],
        selectedTimeSeriesDataMergedAndGrouped: null,
        minTimeSeriesDataDate: null,
        selectedMinTimeSeriesDataDate: null,
        maxTimeSeriesDataDate: null,
        selectedMaxTimeSeriesDataDate: null,
        isAnimating: false,
        animationInterval: 1000
    }),
    actions: {
        initialize() {
          this.timeSeries.forEach(jsonObject => {
              let timeSeriesInfo = prepareTimeSeriesInfo(jsonObject);
             this.timeSeriesInfoMap.set(timeSeriesInfo.id, timeSeriesInfo);
          });
        },
        updateTimeSeriesData(newSelectedTimeSeriesData) {
            const mergedAndSortedData = prepareData(newSelectedTimeSeriesData);
            this.selectedTimeSeriesDataDates = [...new Set(mergedAndSortedData.map(item => item.date))];
            this.minTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.selectedMinTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.maxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.selectedMaxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.selectedTimeSeriesDataMergedAndGrouped = Object.entries(groupByDateStationIdAndTimeSeriesId(mergedAndSortedData));
        }
    }
});