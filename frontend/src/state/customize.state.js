import {defineStore} from "pinia";

export const useCustomizeStore = defineStore('customization', {
    state: () => ({
        // General
        generalBackgroundColor: "#FFFFFF",
        generalComponentsBackgroundColor: "#FFFFFF",
        generalBorderColor: "#E5E5E5",
        generalBorderWidth: 1,

        // Header
        headerTitle: "Waterline project",
        headerTitleColor: "#000000",
        headerDescription: "New solutions for data assimilation and communication to improve hydrological modelling and forecasting",
        headerDescriptionColor: "#737373",
        headerBorderColor: "#E5E5E5",

        // Footer
        footerDescription: "Copyright © 2023 Waterline Project",
        footerDescriptionColor: "#000000"
    })
});