import { defineStore } from 'pinia';

function importStations() {
    const data = [];
    const dataContext = require.context('../data/stations', true, /\.json$/);
    dataContext.keys().forEach((key) => {
        const formattedKey = key.replace('./', '');
        const module = import((`../data/stations/${formattedKey}`));
        data.push(module);
    });
    return Promise.all(data);
}

export const useStationsStore = defineStore('stations', {
    state: () => ({
        stations: [],
        stationsMap: new Map(),
    }),
    actions: {
        async initialize() {
            if (this.stationsMap.size === 0) {
                try {
                    const stationDataModules = await importStations();
                    stationDataModules.forEach((module) => {
                        const stationData = module.default;
                        this.stations.push(stationData);
                        stationData.forEach((station) => {
                            this.stationsMap.set(station.id, station);
                        });
                    });
                } catch (error) {
                    console.error('Error loading data files:', error);
                }
            }
        },
        uploadStationsFile(stations) {
            this.stations.push(stations)
            stations.flat()
                .forEach(station => {
                this.stationsMap.set(station.id, station);
            });
        }
    }
});