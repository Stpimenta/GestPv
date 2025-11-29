import { createApp } from "vue";
import { router } from "@/router/index";
import App from "./App.vue";

//default css
import "@/styles/default.css";
import "@/styles/variables.css";
import 'primeicons/primeicons.css'

import PrimeVue from "primevue/config";
import { BluePreset } from "@/styles/BluePreset.ts";

//theme
import {toogleTheme} from "./composables/theme.ts";


import { Dialog,Button,FloatLabel,InputText,Password} from "primevue";

const app = createApp(App);

app.use(router);

const {isDark} = toogleTheme();

if(window.matchMedia("(prefers-color-scheme: dark)").matches)
{
  isDark.value = true;
}

else
{
  isDark.value = false;
}


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
