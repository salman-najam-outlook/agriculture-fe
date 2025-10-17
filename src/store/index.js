import Vue from "vue";
import Vuex from "vuex";

import authModule from "./auth/index";
import memberData from "./member-data";
import filterParams from "./filter-params";
import i18n from "@/plugins/i18n";
import globalSettings from "./global-settings";
import eudrSettings  from "@/store/eudr-settings";
import eudrDds from "./eudr-dds";
import documentCodes from './document-codes';
import blendModule from './blends';
import marketPlaceModule from './marketplace';
import carbonCreditModule from './carbonCredit';
import organization from './organization';
import dimitraOffice from './dimitraOffice';
import project from './modules/project';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false,
    language: i18n.locale,
    activeTab:null,
    currentDBTab:1
  },
  getters:{
    getDDSLocalData(){
      const ddsTabData = JSON.parse(localStorage.getItem('DDS_TAB_DATA')) || {}
      return ddsTabData 
    },
    getDDSCurrentDBTab(stage){
      return stage.currentDBTab
    }
  },
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    SET_DDS_DB_CURRENT_TAB(stage, payload){
      localStorage.removeItem('DDS_TAB_DATA');
      const storeParams = {
        activeTab: payload,
      };
      localStorage.setItem('DDS_TAB_DATA', JSON.stringify(storeParams));
      stage.currentDBTab = payload
    },
    SET_LANGUAGE(state, payload) {
      state.language = payload;
      i18n.locale = payload;
      localStorage.setItem('LANGUAGE',payload);
    },
    SET_ACTIVE_TAB(state, tabNo){
      state.activeTab = tabNo;
    }
  },
  actions: {
    SET_DDS_TAB(context, payload) {
      return new Promise((resolve) => {
        localStorage.removeItem('DDS_TAB_DATA');
        const storeParams = {
          activeTab: payload.activeTab,
        };
        context.commit('SET_ACTIVE_TAB', payload.activeTab)
        localStorage.setItem('DDS_TAB_DATA', JSON.stringify(storeParams));
        setTimeout(() => resolve(payload.activeTab), 20)
      }); 
    },
    SET_DDS_CURRENT_TAB_TO_DB(context, payload) {
      const DeforestationService = require("@/_services/DeforestationService").default; 
      return new Promise((resolve, reject) => {
        DeforestationService.updateDiligenceReportStage({
          current_stage: parseInt(payload.step),
          reportId: parseInt(payload.reportId) 
        }).then(res => {
          resolve(res)
        }).catch(err => {
         reject(err)
        })
      })
    },
    GET_CURRENT_TAB_FROM_REPORT_ID(context, reportId) {
      return new Promise((resolve, reject) => {
        const DeforestationService = require("@/_services/DeforestationService").default;
        DeforestationService.getDiligenceReportCurrentStageInfo(reportId ).then(res => {
          context.commit('SET_DDS_DB_CURRENT_TAB', res.data.diligenceReportCurrentStageInfo.current_step || 1)
          resolve(res.data.diligenceReportCurrentStageInfo.current_step || null)
        }).catch(err => {
         reject(err)
        })
      })
    }
  },
  modules: {
    auth: authModule,
    memberData: memberData,
    filterParams: filterParams,
    globalSettings: globalSettings,
    eudrSettings: eudrSettings,
    eudrDDS: eudrDds,
    documentCodes: documentCodes,
    blends: blendModule,
    marektPlace: marketPlaceModule,
    carbonCredit: carbonCreditModule,
    organization: organization,
    dimitraOffice: dimitraOffice,
    project: project
  },
});
