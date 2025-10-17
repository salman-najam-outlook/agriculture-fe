import '@mdi/font/css/materialdesignicons.css' 
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify, { getCurrentColorScheme } from "./plugins/vuetify";
import { isIndonesianClient, isKenyaClient, checkPermission } from '@/utils';
import { PERMISSIONS } from '@/constants/permissions';
import i18n from '@/plugins/i18n';
import VueApexCharts from "vue-apexcharts";
import VueQRCodeComponent from 'vue-qrcode-component';
// import * as firebase from "firebase";
 // Import component
import Loading from 'vue-loading-overlay';
 // Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios';
import * as VueGoogleMaps from 'vue2-google-maps'

import './assets/css/main.css';
import Notifications from 'vue-notification'
import moment from 'moment'
import Breadcrumb from "@/components/core/Breadcrumb";
import LanguageSelection from "@/components/LanguageSelection.vue"
import FlagIcon from "vue-flag-icon"
import VueSignaturePad from 'vue-signature-pad';
import Flatten from '@flatten-js/core';
import { getGoogleMapsLoader } from './mixins/GoogleMapLoaderSingleton';

const COMPARISION_TOLERANCE = 0.00000000000001;
Flatten.Utils.setTolerance(COMPARISION_TOLERANCE);

Vue.use(VueSignaturePad);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAP_KEY ,
    libraries: 'places',
  }
});



getGoogleMapsLoader({
  apiKey: process.env.VUE_APP_GOOGLE_MAP_KEY, 
  libraries: ["places", "map", "geometry"],
});

Vue.use(VueApexCharts);
Vue.use(Loading);
Vue.use(Notifications);
Vue.component('qrcode', VueQRCodeComponent);
Vue.component('breadcrumb', Breadcrumb)
Vue.component('LanguageSelection', LanguageSelection)
Vue.use(FlagIcon);



Vue.filter('formatDate', value => {
   if(!value) return 
    return moment(value).format('DD-MMM-YYYY')
})

// firebase.initializeApp(configOptions);
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL || `https://sass-api-dev.dimitra.dev/api/admin`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
var language = localStorage.getItem('LANGUAGE')
if( language == null){
  axios.defaults.headers.common['lang'] = 'en'
}else{
  axios.defaults.headers.common['lang'] = language
}
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function(config) {
  const token = store.getters.getAuthToken;
  if(token) {
    config.headers.common['oauth-token'] = `${token}`
  }
  return config;
}, function(err) {
  return Promise.reject(err);
});

axios.interceptors.response.use(function (response) {
  return response;
}, async function (error) {
    const token = store.getters.getAuthToken;
    if (axios.isAxiosError(error) && error.response?.status && error.response.status === 401 && token) {
      try{
        await store.dispatch('refreshToken');
        // console.log( error.response);
        const newTkn = store.getters.getAuthToken;
        error.response.config.headers['oauth-token'] = newTkn;
        return axios.request(error.response.config);
      }catch(err){
        // console.log('rf', err);
        await store.dispatch('logout');
        router.push('/login')
      }
    }

    if (axios.isAxiosError(error) && error.response?.status === 403 && token) {
      router.push({name: 'AdminDashboard'})
    }
    return Promise.reject(error);
});

Vue.component("apexchart", VueApexCharts);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$can = checkPermission;
Vue.prototype.$permissions = PERMISSIONS;

function setDynamicThemeColors() {
  const theme = getCurrentColorScheme();
  document.documentElement.style.setProperty('--primary-color', theme.primary);
  document.documentElement.style.setProperty('--secondary-color', theme.secondary);
  document.documentElement.style.setProperty('--green2-color', theme.green2);
  document.documentElement.style.setProperty('--secondary-color-light-2', theme.secondary2light);
  
  // Set data-theme attribute for Indonesian and Kenya clients to trigger specific CSS rules
  const isIndonesian = isIndonesianClient();
  const isKenya = isKenyaClient();
  
  if (isIndonesian) {
    document.documentElement.setAttribute('data-theme', 'indonesian');
  } else if (isKenya) {
    document.documentElement.setAttribute('data-theme', 'kenya');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Also update Vuetify theme directly if available
  if (window.$vuetify && window.$vuetify.theme) {
    window.$vuetify.theme.themes.light.primary = theme.primary;
    window.$vuetify.theme.themes.light.secondary = theme.secondary;
    window.$vuetify.theme.themes.light.secondary2light = theme.secondary2light;
    window.$vuetify.theme.themes.light.green2 = theme.green2;
    window.$vuetify.theme.themes.light.secondary2light = theme.secondary2light;
  }
  
  console.log('Theme updated:', theme, 'Indonesian client:', isIndonesian, 'Kenya client:', isKenya);
}

setDynamicThemeColors();

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");