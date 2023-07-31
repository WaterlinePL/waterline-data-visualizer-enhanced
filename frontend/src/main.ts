import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Panel from 'primevue/panel'
import Calendar from 'primevue/calendar'
import ProgressBar from "primevue/progressbar";
import Chart from "primevue/chart";
import Divider from "primevue/divider";
import InputNumber from 'primevue/inputnumber';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';

// create new Vue app
const app = createApp(App)

// register PrimeVue
app.use(PrimeVue)

// register components
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Panel', Panel)
app.component('Calendar', Calendar)
app.component('ProgressBar', ProgressBar)
app.component('Chart', Chart)
app.component('Divider', Divider)
app.component('InputNumber', InputNumber)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Dialog', Dialog)

// mount the app
app.mount("#app");


