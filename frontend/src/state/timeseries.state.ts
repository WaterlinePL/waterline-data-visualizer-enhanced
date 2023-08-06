import { defineStore } from 'pinia';
import timeseriesDataPrecipitation from '../data/point/timeseries_precipitation.json'
import timeseriesDataTemperature from '../data/point/timeseries_temperature.json'

interface TimeSeriesData {
    id: number,
    stationId: number,
    value: number,
    date: string
}

interface TimeSeries {
    id: number,
    name: string,
    description: string,
    metricLabel: string,
    minColor: string,
    maxColor: string,
    data: TimeSeriesData[]
}

interface TimeSeriesState {
    timeSeries: TimeSeries[],
    selectedTimeSeriesData: TimeSeriesData[],
    selectedTimeSeriesDataDates: Date[]
}

export const useTimeseriesStore = defineStore('timeseries', {
    state: (): TimeSeriesState => ({
        timeSeries: [timeseriesDataPrecipitation, timeseriesDataTemperature],
        selectedTimeSeriesData: [],
        selectedTimeSeriesDataDates: []
    }),
    actions: {
        setSelectedTimeSeriesData(newSelectedTimeSeriesData: TimeSeriesData[]) {
            this.selectedTimeSeriesData = newSelectedTimeSeriesData;
            this.selectedTimeSeriesDataDates = [...new Set(
                newSelectedTimeSeriesData
                    .flat()
                    .map(item => new Date(item.date))
                    .sort((a, b) => a.getTime() - b.getTime())
            )];
        }
    }
});