import { createApp } from "vue";
import { router } from "@/router/index";
import App from "./App.vue";

//pinia
import {createPinia} from "pinia"

//default css
import "@/ui/styles/default.css";
import "@/ui/styles/variables.css";
import 'primeicons/primeicons.css'

import PrimeVue from "primevue/config";
import { BluePreset } from "@/ui/styles/BluePreset.ts";

//primeVUE components
import { Dialog,Button,FloatLabel,InputText,Password} from "primevue";

//theme
import { useThemeStore } from "./stores";


//router
const app = createApp(App);
app.use(router);

//pinia
app.use(createPinia());

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
});

app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("FloatLabel", FloatLabel);
app.component("InputText", InputText);
app.component("Password", Password);

app.mount("#app");
