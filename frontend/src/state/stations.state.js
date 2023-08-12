import { defineStore } from 'pinia';
import stationsData from '../data/point/stations.json'

export const useStationsStore = defineStore('stations', {
    state: () => ({
        stations: [...stationsData],
        stationsMap: new Map(),
    }),
    actions: {
        initialize() {
            if (this.stationsMap.size === 0) {
                this.stations.forEach(station => {
                    this.stationsMap.set(station.id, station);
                });
            }
        }
    }
});