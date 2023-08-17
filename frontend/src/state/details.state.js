import { defineStore } from 'pinia';

export const useDetailsStore = defineStore('details', {
    state: () => ({
        activePanelIndex: 0
    }),
    actions: {
        initialize() {
        }
    }
});