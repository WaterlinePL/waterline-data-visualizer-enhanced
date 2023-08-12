import { defineStore } from 'pinia';
import stationsData from '../data/point/stations.json'

export const useStationsStore = defineStore('stations', {
    state: () => ({
        stations: [stationsData],
        stationsMap: new Map(),
    }),
    actions: {
        initialize() {
            this.stations.forEach(station => {
               this.stationsMap.set(station.id, station);
            });
        }
    }
});