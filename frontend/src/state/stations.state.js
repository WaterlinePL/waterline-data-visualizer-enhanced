import { defineStore } from 'pinia';
import pointStationsData from '../data/point/stations.json'
import lineStationsData from '../data/line/stations.json'

export const useStationsStore = defineStore('stations', {
    state: () => ({
        stations: [...pointStationsData, lineStationsData].flat(),
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