// src/themes/BlueSky.ts
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

export const BluePreset = definePreset(Aura, {
  semantic: {
    /* ---------- PRIMARY (teal) ---------- */
    primary: {
      50: "{sky.50}", 
      100: "{sky.100}",
      200: "{sky.200}",
      300: "{sky.300}",
      400: "{sky.400}",
      500: "{sky.500}",
      600: "{sky.600}",
      700: "{tsky700}",
      800: "{sky.800}",
      900: "{sky.900}",
      950: "{sky.950}",
    },

    colorScheme: {
      /* ---------------------- LIGHT MODE ---------------------- */
      light: {
        surface: {
          0: "#FFFFFFFF", 
          50: "{zinc.50}",
          100: "{zinc.100}",
          200: "{zinc.200}",
          300: "{zinc.300}",
          400: "{zinc.400}",
          500: "{zinc.500}",
          600: "{zinc.600}",
          700: "{zinc.700}",
          800: "{zinc.800}",
          900: "{zinc.900}",
          950: "{zinc.950}",
        },

        semantic: {
          highlight: {
            background: "{primary.50}",
            color: "{primary.700}",
          },
        },
      },

      dark: {
        surface: {
          0: "#FFFFFF", 
          50: "{zinc.50}",
          100: "{zinc.100}",
          200: "{zinc.200}",
          300: "{zinc.300}",
          400: "{zinc.400}",
          500: "{zinc.500}",
          600: "{zinc.600}",
          700: "{zinc.700}",
          800: "{zinc.800}",
          900: "{zinc.900}",
          950: "{zinc.950}",
        },

        semantic: {
          highlight: {
            background: "{primary.200}",
            color: "{primary.900}",
          },
        },
      },
    },
  },

  components: {
    button: {
      colorScheme:{
        dark:{
          root:{
            primary:{
              color:"#FFFFFFFF",
              hoverColor:"#FFFFFFFF",
              activeColor:"#FFFFFFFF",

            },
            danger:{
              color:"#FFFFFFFF",
              hoverColor:"#FFFFFFFF",
              activeColor:"#FFFFFFFF",
            }
          }
        }
      }
    },
  },



});
