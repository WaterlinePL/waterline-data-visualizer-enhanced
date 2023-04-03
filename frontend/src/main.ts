import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'

// create new Vue app
const app = createApp(App)

// register PrimeVue
app.use(PrimeVue)

// register components
app.component('Button', Button)

// mount the app
app.mount("#app");


