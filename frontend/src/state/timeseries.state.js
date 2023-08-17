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

function prepareTimeSeriesInfo(jsonObject) {
    return {
        id: jsonObject.id,
        name: jsonObject.name,
        description: jsonObject.description,
        valueLabel: jsonObject.valueLabel,
        metricLabel: jsonObject.metricLabel,
        maxColor: jsonObject.maxColor,
        midColor: jsonObject.midColor,
        minColor: jsonObject.minColor
    };
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

function getMinAndMaxValuesForTimeSeries(selectedTimeSeriesData) {
    const minAndMaxValuesForTimeSeries = new Map();
    selectedTimeSeriesData.forEach(jsonObject => {
        const timeSeriesId = jsonObject[0].timeSeriesId;
        const min = jsonObject.reduce((min, obj) => (obj.value < min ? obj.value : min), Infinity);
        const max = jsonObject.reduce((max, obj) => (obj.value > max ? obj.value : max), -Infinity);
        minAndMaxValuesForTimeSeries.set(timeSeriesId, {
            id: timeSeriesId,
            minValue: min,
            maxValue: max
        });
    });
    return minAndMaxValuesForTimeSeries;
}

export const useTimeSeriesStore = defineStore('timeseries', {
    state: () => ({
        timeSeries: [timeseriesDataPrecipitation, timeseriesDataTemperature],
        timeSeriesInfoMap: new Map(),
        minAndMaxValuesMap: new Map(),
        selectedTimeSeriesData: [],
        selectedTimeSeriesDataDates: [],
        selectedTimeSeriesIds: [],
        selectedTimeSeriesDataMergedAndGrouped: null,
        minTimeSeriesDataDate: null,
        selectedMinTimeSeriesDataDate: null,
        maxTimeSeriesDataDate: null,
        selectedMaxTimeSeriesDataDate: null,
        isAnimating: false,
        clearLeafletMap: false,
        animationInterval: 2000,
        animationStart: null,
        animationEnd: null,
        animationNow: "Select animation start and end dates to run an animation"
    }),
    actions: {
        initialize() {
            if (this.timeSeriesInfoMap.size === 0) {
                this.timeSeries.forEach(jsonObject => {
                    let timeSeriesInfo = prepareTimeSeriesInfo(jsonObject);
                    this.timeSeriesInfoMap.set(timeSeriesInfo.id, timeSeriesInfo);
                });
            }
        },
        updateTimeSeriesData(newSelectedTimeSeriesData) {
            const mergedAndSortedData = prepareData(newSelectedTimeSeriesData);
            this.minAndMaxValuesMap = getMinAndMaxValuesForTimeSeries(newSelectedTimeSeriesData);
            this.selectedTimeSeriesDataDates = [...new Set(mergedAndSortedData.map(item => item.date))];
            this.minTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.selectedMinTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.maxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.selectedMaxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.selectedTimeSeriesDataMergedAndGrouped = Object.entries(groupByDateStationIdAndTimeSeriesId(mergedAndSortedData));
            this.selectedTimeSeriesIds = [...new Set(mergedAndSortedData.map(item => item.timeSeriesId))];
        }
    }
});