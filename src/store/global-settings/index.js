import GeneralService from "../../_services/GeneralService";
import PermissionsService from "../../_services/PermissionsService";

const state = {
  weightUnits: [
    {
      name: "Kilogram",
      abbvr: "",
      factor: 1,
    },
    {
      name: "Gram",
      abbvr: "g",
      factor: 0.001,
    },
    {
      name: "Pound",
      abbvr: "lbs",
      factor: 0.453592,
    },
  ],
  areaUnits: [
    {
      name: "Acre",
      abbvr: "ac",
      factor: 1,
    },
    {
      name: "Hectare",
      abbvr: "ha",
      factor: 2.47105,
    },
    {
      name: "Manzana",
      abbvr: "manzana",
      factor: 1.72974,
    },
    {
      name: "Square Meter",
      abbvr: "m²",
      factor: 4046.86,
    },
    {
      name: "Square Kilometer",
      abbvr: "km²",
      factor: 0.00404686,
    },
    {
      name: "Square Mile",
      abbvr: "mi²",
      factor: 0.0015625,
    },
  ],
  yeildUnits: [],
  globalSettings: {},
  globalSettingsLoadingStates: {
    loadingWeightUnits: false,
    weightUnitsPromise: null,
    loadingYieldUnits: false,
    yieldUnitsPromise: null,
    loadingAreaUnits: false,
    areaUnitsPromise: null,
    loadingGlobalSettings: false,
    globalSettingsPromise: null,
  },
};

const mutations = {
  SET_WEIGHT_UNITS(state, weightUnits) {
    state.weightUnits = weightUnits;
  },
  SET_AREA_UNITS(state, areaUnits) {
    state.areaUnits = areaUnits;
  },
  SET_YIELD_UNITS(state, yieldUnits) {
    state.yieldUnits = yieldUnits;
  },
  SET_GLOBAL_SETTINGS(state, globalSettings) {
    state.globalSettings = globalSettings;
  },
  SET_LOADING_STATE(state, { key, loading }) {
    state.globalSettingsLoadingStates[key] = loading;
  },
  SET_PROMISE(state, { key, promise }) {
    state.globalSettingsLoadingStates[key] = promise;
  },
};

const actions = {
  async fetchWeightUnits({ state, commit }) {
    if (state.weightUnits.length > 0) {
      return Promise.resolve(state.weightUnits);
    }

    if (state.globalSettingsLoadingStates.loadingWeightUnits) {
      return state.globalSettingsLoadingStates.weightUnitsPromise;
    }

    commit("SET_LOADING_STATE", { key: "loadingWeightUnits", loading: true });

    const promise = GeneralService.getYieldUnitList()
      .then((response) => {
        if (response.success) {
          commit("SET_WEIGHT_UNITS", response.data);
        } else {
          console.error("Error fetching weight units:", response.data.error);
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching weight units:", error);
        return [];
      })
      .finally(() => {
        commit("SET_LOADING_STATE", {
          key: "loadingWeightUnits",
          loading: false,
        });
      });

    commit("SET_PROMISE", { key: "weightUnitsPromise", promise });
    return promise;
  },
  async fetchAreaUnits({ state, commit }) {
    if (state.areaUnits.length > 0) {
      return Promise.resolve(state.areaUnits);
    }

    if (state.globalSettingsLoadingStates.loadingAreaUnits) {
      return state.globalSettingsLoadingStates.areaUnitsPromise;
    }

    commit("SET_LOADING_STATE", { key: "loadingAreaUnits", loading: true });

    const promise = GeneralService.getAreaUnitList()
      .then((response) => {
        if (response.success) {
          commit("SET_AREA_UNITS", response.data);
        } else {
          console.error("Error fetching area units:", response.data.error);
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching area units:", error);
        return [];
      })
      .finally(() => {
        commit("SET_LOADING_STATE", {
          key: "loadingAreaUnits",
          loading: false,
        });
      });

    commit("SET_PROMISE", { key: "areaUnitsPromise", promise });
    return promise;
  },
  async fetchYieldUnits({ state, commit }) {
    if (state.yieldUnits.length > 0) {
      return Promise.resolve(state.yieldUnits);
    }

    if (state.globalSettingsLoadingStates.loadingYieldUnits) {
      return state.globalSettingsLoadingStates.yieldUnitsPromise;
    }

    commit("SET_LOADING_STATE", { key: "loadingYieldUnits", loading: true });

    const promise = GeneralService.getYieldUnitList()
      .then((response) => {
        if (response.success) {
          commit("SET_YIELD_UNITS", response.data);
        } else {
          console.error("Error fetching yield units:", response.data.error);
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching yield units:", error);
        return [];
      })
      .finally(() => {
        commit("SET_LOADING_STATE", {
          key: "loadingYieldUnits",
          loading: false,
        });
      });

    commit("SET_PROMISE", { key: "yieldUnitsPromise", promise });
    return promise;
  },
  async fetchGlobalSettings({ state, commit }) {
    if (Object.keys(state.globalSettings).length > 0) {
      return Promise.resolve(state.globalSettings);
    }

    if (state.globalSettingsLoadingStates.loadingGlobalSettings) {
      return state.globalSettingsLoadingStates.globalSettingsPromise;
    }

    commit("SET_LOADING_STATE", {
      key: "loadingGlobalSettings",
      loading: true,
    });

    const promise = PermissionsService.getGlobalSettings()
      .then((response) => {
        if (response.success) {
          commit("SET_GLOBAL_SETTINGS", response.data);
        } else {
          console.error("Error fetching global settings:", response.data.error);
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching global settings:", error);
        return {};
      })
      .finally(() => {
        commit("SET_LOADING_STATE", {
          key: "loadingGlobalSettings",
          loading: false,
        });
      });

    commit("SET_PROMISE", { key: "globalSettingsPromise", promise });
    return promise;
  },
};

const getters = {
  getWeightUnits: (state) => state.weightUnits,
  getAreaUnits: (state) => state.areaUnits,
  getYieldUnits: (state) => state.yieldUnits,
  getGlobalSettings: (state) => state.globalSettings,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
