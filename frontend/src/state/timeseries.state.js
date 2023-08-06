import { defineStore } from 'pinia';
import timeseriesDataPrecipitation from '../data/point/timeseries_precipitation.json'
import timeseriesDataTemperature from '../data/point/timeseries_temperature.json'

export const useTimeseriesStore = defineStore('timeseries', {
    state: () => ({
        timeSeries: [timeseriesDataPrecipitation, timeseriesDataTemperature],
        selectedTimeSeriesData: [],
        selectedTimeSeriesDataDates: [],
        selectedTimeSeriesDataMergedAndGrouped: null,
        minTimeSeriesDataDate: null,
        maxTimeSeriesDataDate: null,
        isAnimating: false,
        animationInterval: 1000
    }),
    actions: {
        updateTimeseriesData(newSelectedTimeSeriesData) {
            const mergedAndSortedData = newSelectedTimeSeriesData
                .flat()
                .map(item => ({
                    id: item.id,
                    stationId: item.stationId,
                    value: item.value,
                    date: new Date(item.date)
                }))
                .sort((a, b) => a.date - b.date);

            this.selectedTimeSeriesDataDates = [...new Set(mergedAndSortedData.map(item => item.date))];
            this.minTimeSeriesDataDate = this.selectedTimeSeriesDataDates[0];
            this.maxTimeSeriesDataDate = this.selectedTimeSeriesDataDates[this.selectedTimeSeriesDataDates.length - 1];

            this.selectedTimeSeriesDataMergedAndGrouped = Object.entries(
                mergedAndSortedData
                    .reduce((obj, item) => {
                        const dateKey = item.date;
                        if (!obj[dateKey]) {
                            obj[dateKey] = [];
                        }
                        obj[dateKey].push(item);
                        return obj;
                    }, {})
            );
        }
    }
});