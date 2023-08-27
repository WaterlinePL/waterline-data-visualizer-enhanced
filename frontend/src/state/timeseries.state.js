import { defineStore } from 'pinia';
import pointTimeSeriesData1 from '../data/point/timeseries_precipitation.json'
import pointTimeSeriesData2 from '../data/point/timeseries_temperature.json'
import lineTimeSeriesData from '../data/line/timeseries.json'

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

function getSelectedTimeSeriesDataDates(data) {
    const uniqueTimestamps = new Set(
        data.map(item => item.date.getTime())
    );
    return Array.from(uniqueTimestamps).map(timestamp => new Date(timestamp));
}

export const useTimeSeriesStore = defineStore('timeseries', {
    state: () => ({
        timeSeries: [pointTimeSeriesData1, pointTimeSeriesData2, lineTimeSeriesData],
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
        animationNow: "Select animation start and end dates to run an animation",
        chartData: null
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
            this.selectedTimeSeriesDataDates = getSelectedTimeSeriesDataDates(mergedAndSortedData);
            this.minTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.selectedMinTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.maxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.selectedMaxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];
            this.chartData = groupByDateStationIdAndTimeSeriesId(mergedAndSortedData);
            this.selectedTimeSeriesDataMergedAndGrouped = Object.entries(this.chartData);
            this.selectedTimeSeriesIds = [...new Set(mergedAndSortedData.map(item => item.timeSeriesId))];
        },
        getChartDataForStation(stationId) {
            const selectedDates = this.selectedTimeSeriesDataDates
                .map(item => item)
                .filter(date => date >= this.selectedMinTimeSeriesDataDate && date <= this.selectedMaxTimeSeriesDataDate);

            const results = {};
            for (let i = 0; i < selectedDates.length; i++) {
                const date = selectedDates[i];
                let stationDataInSelectedDay = this.chartData[date][stationId];

                if (stationDataInSelectedDay === undefined) continue;

                const valuesHeader = "values";
                const colorHeader = "color";
                for (const [timeSeriesId, value] of Object.entries(stationDataInSelectedDay)) {
                    let timeSeries = this.timeSeriesInfoMap.get(parseInt(timeSeriesId));

                    if (!results[timeSeries.name]) results[timeSeries.name] = {};
                    if (!results[timeSeries.name][valuesHeader]) results[timeSeries.name][valuesHeader] = new Array(selectedDates.length).fill(0);
                    if (!results[timeSeries.name][colorHeader]) results[timeSeries.name][colorHeader] = timeSeries.midColor;

                    results[timeSeries.name][valuesHeader][i] = value;
                }

            }
            return {
                labels: selectedDates.map(date => date.toLocaleString()),
                data: results
            };
        }
    }
});