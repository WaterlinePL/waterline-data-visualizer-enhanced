import { createApp } from 'vue';
import App from "./App.vue";
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Panel from 'primevue/panel'
import Calendar from 'primevue/calendar'
import ColorPicker from 'primevue/colorpicker';
import ProgressBar from "primevue/progressbar";
import Chart from "primevue/chart";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import FileUpload from 'primevue/fileupload';
import { createPinia } from 'pinia';

// create new Vue app
const app = createApp(App)

// register PrimeVue
app.use(PrimeVue)

// register Pinia
const pinia = createPinia()
app.use(pinia)

// register components
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Panel', Panel)
app.component('Calendar', Calendar)
app.component('ColorPicker', ColorPicker)
app.component('ProgressBar', ProgressBar)
app.component('Chart', Chart)
app.component('Checkbox', Checkbox)
app.component('Divider', Divider)
app.component('InputNumber', InputNumber)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Dialog', Dialog)
app.component('MultiSelect', MultiSelect)
app.component('FileUpload', FileUpload)
app.component('InputText', InputText)
app.component('Textarea', Textarea)

// mount the app
app.mount("#app");



