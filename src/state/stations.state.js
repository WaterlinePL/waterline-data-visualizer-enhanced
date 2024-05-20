import { defineStore } from 'pinia';

async function importStations() {
    const data = [];
    const urlBase = location;
    const stationsEntries = await fetch(`${urlBase}stations`).then(res => res.json());

    stationsEntries.datasets.forEach(async entry => {
        const entryId = entry.id;
        const stationsData = fetch(`${urlBase}stations/${entryId}`).then(res => res.json());
        data.push(stationsData);
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
                    stationDataModules.forEach((stationData) => {
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