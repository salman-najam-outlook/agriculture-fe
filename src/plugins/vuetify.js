import Vue from "vue";
import {
  VApp,
  VForm,
  VTextField,
  VSelect,
  VCheckbox,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VCard,
  transitions,
} from "vuetify";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import i18n from "./i18n";
import { isIndonesianClient, isKenyaClient } from "@/utils";

Vue.use(Vuetify);

// Centralized color schemes
const defaultColors = {
  primary: "#00BD73",
  secondary: "#117443",
  secondary2light: "#FFF7EC",
  green2: "#E5F8F1",
};

const indonesianColors = {
  primary: "#184980",
  secondary: "#184980",
  secondary2light: "#0470E6",
  green2: "#FFF4F0",
};

const kenyaColors = {
  primary: "#A75300",
  secondary: "#A75300",
  secondary2light: "#FFF7EC",
  green2: "#E5F8F1",
};

export function getCurrentColorScheme() {
  console.log("Checking if client is Indonesian...", isIndonesianClient());
  console.log("Checking if client is Kenya...", isKenyaClient());
  if (isIndonesianClient()) return indonesianColors;
  if (isKenyaClient()) return kenyaColors;
  return defaultColors;
}

const vuetify = new Vuetify({
  components: {
    VApp,
    VForm,
    VTextField,
    VSelect,
    VCheckbox,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VCard,
    transitions,
  },
  theme: {
    themes: {
      light: {
        white: "#fff",
        primary: getCurrentColorScheme().primary,
        themeGrey: "#EFEFEF",
        secondary: getCurrentColorScheme().secondary,
        secondary2light: getCurrentColorScheme().secondary2light,
        btnText: "#6A7784",
        gray: "#787878",
        green2: getCurrentColorScheme().green2,
        red: "#F03737",
        red2: "#FDEBEB",
        black: "#1E1E1E",
        black2: "#E8E8E8",
        lightBlack: "#494949",
        third: "#FFA030",
        bg: "#E8E8E8",
        yellow: "#FFB443",
        thiGray: "#979797",
        yellowIcon: "#FFA520",
        indonesiaBlue: "#00559F",
        kenyaGreen: "#117443",
        // Add SCSS color variables to theme
        primaryColor: getCurrentColorScheme().primary,
        secondaryColor: getCurrentColorScheme().secondary,
        green2Color: getCurrentColorScheme().green2,
      },
    },
  },
  iconfont: "md",
  lang: {
    t: (key, ...params) => i18n.t(key, params),
    current: i18n.locale,
  },
});

export default vuetify;
