import { defineStore } from 'pinia';
import {useTimeSeriesStore} from "@/state/timeseries.state";


function getSelectedDate() {
    const timeSeriesStore = useTimeSeriesStore();
    return timeSeriesStore.animationNow;
}
function prepareSelectedValues(values) {
    const timeSeriesStore = useTimeSeriesStore();
    const selectedValues = [];
    for (const [timeSeriesId, value] of Object.entries(values)) {
        const timeSeriesInfo = timeSeriesStore.timeSeriesInfoMap.get(parseInt(timeSeriesId));
        selectedValues.push({
            title: timeSeriesInfo.valueLabel,
            from: timeSeriesInfo.name,
            value: `${value} ${timeSeriesInfo.metricLabel}`
        });
    }
    return selectedValues;
}

export const useDetailsStore = defineStore('details', {
    state: () => ({
        activePanelIndex: 0,
        selectedStation: false,
        selectedStationId: null,
        selectedStationName: null,
        selectedCoordinatesLatitude: null,
        selectedCoordinatesLongitude: null,
        selectedValues: [],
        selectedDate: null
    }),
    actions: {
        clickOnLeafletMap(station, coords, values) {
            this.activePanelIndex = 1;
            this.selectedStation = true;
            this.selectedStationId = station.id;
            this.selectedStationName = station.name;
            this.selectedCoordinatesLatitude = coords.lat;
            this.selectedCoordinatesLongitude = coords.lng;
            this.selectedValues = prepareSelectedValues(values);
            this.selectedDate = getSelectedDate();
        },
        updateSelectedStation(values) {
            this.selectedValues = prepareSelectedValues(values);
            this.selectedDate = getSelectedDate();
        }
    }
});