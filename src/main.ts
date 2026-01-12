import { createApp } from "vue";
import { router } from "@/router/index";
import App from "./App.vue";

//pinia
import {createPinia} from "pinia"
import piniaPersist from "pinia-plugin-persistedstate";

//default css
import "@/ui/styles/default.css";
import "@/ui/styles/variables.css";
import 'primeicons/primeicons.css'


import PrimeVue from "primevue/config";
import { BluePreset } from "@/ui/styles/BluePreset.ts";

//primeVUE components
import { Dialog,Button,FloatLabel,InputText,InputNumber,Password,Menu,Calendar,IconField,InputIcon,TreeTable,Column,Message,
  Toast,DatePicker,FileUpload,Select,ConfirmDialog} from "primevue";
import { ToastService } from "primevue";
import ConfirmationService from 'primevue/confirmationservice'
//theme
import { useThemeStore } from "./stores";


//router
const app = createApp(App);
app.use(router);

//pinia
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);

const themeStore = useThemeStore();
themeStore.initTheme();

//primeVUE components
app.use(PrimeVue, {
  theme: {
    preset: BluePreset,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
  locale: {
    dayNames: ['domingo','segunda','terça','quarta','quinta','sexta','sábado'],
    dayNamesShort: ['dom','seg','ter','qua','qui','sex','sab'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    monthNames: [
      'janeiro','fevereiro','março','abril','maio','junho',
      'julho','agosto','setembro','outubro','novembro','dezembro'
    ],
    monthNamesShort: [
      'jan','fev','mar','abr','mai','jun',
      'jul','ago','set','out','nov','dez'
    ],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy',
    firstDayOfWeek: 0
  }
});

app.use(ToastService);
app.use(ConfirmationService)
 
app.component("Menu", Menu);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("FloatLabel", FloatLabel);
app.component("InputText", InputText);
app.component("InputIcon", InputIcon);
app.component("Password", Password);
app.component("Calendar", Calendar);
app.component("IconField", IconField);
app.component("TreeTable", TreeTable);
app.component("Column", Column);
app.component("Message", Message);
app.component("Toast", Toast);
app.component("DatePicker", DatePicker);
app.component("InputNumber", InputNumber);
app.component("FileUpload", FileUpload);
app.component("Select", Select);
app.component("ConfirmDialog", ConfirmDialog);

app.mount("#app");
