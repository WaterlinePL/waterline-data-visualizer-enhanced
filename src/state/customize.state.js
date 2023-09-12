import {defineStore} from "pinia";

export const useCustomizeStore = defineStore('customization', {
    state: () => ({
        // General
        generalBackgroundColor: "#FFFFFF",
        generalComponentsBackgroundColor: "#FFFFFF",
        generalBorderColor: "#E5E5E5",
        generalBorderWidth: 1,

        // Header
        headerTitle: `<p>Waterline project</p>`,
        headerTitleColor: "#000000",
        headerDescription: `<p>New solutions for data assimilation and communication to improve hydrological modelling and forecasting</p>`,
        headerDescriptionColor: "#737373",
        headerBorderColor: "#E5E5E5",

        // Footer
        footerDescription: `<p>Copyright © 2023 Waterline Project</p>`,
        footerDescriptionColor: "#000000"
    })
});