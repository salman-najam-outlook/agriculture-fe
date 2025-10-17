import ReportService from "../../_services/ReportService";
import GeneralService from "../../_services/GeneralService";
import DashboardReportService from "../../_services/DashboardReportService";
export default {
  namespaced: true,
  state: {
    filterParams: {
      limit: 10,
      page: 1,
      search: "",
      sort: "",
      sortDir: "",
      globalFilters: {
        gender: "",
        weightUnit: "", // Renamed from "unit"
        country: "",
        currency: "",
      },
    },
    farmersOptions: [],

    countriesOptions: [],
    currenciesOptions: [],
    weightUnitsOptions: [], // Renamed from "unitsOptions"
    filterOptionsLoadingState: {
      loadingFarmersOptions: false,
      farmersOptionsPromise: null,
      loadingCountriesOptions: false,
      countriesOptionsPromise: null,
      loadingCurrenciesOptions: false,
      currenciesOptionsPromise: null,
      loadingWeightUnitsOptions: false, // Renamed from "loadingUnitsOptions"
      weightUnitsOptionsPromise: null, // Renamed from "unitsOptionsPromise"
    },
  },
  mutations: {
    // SETTERS FOR GLOBAL FILTER PARAMS
    setGlobalFilter(state, { filter, value }) {
      state.filterParams.globalFilters[filter] = value;
    },

    // SETTERS FOR GLOBAL OPTIONS
    setFarmersOptions(state, farmersOptions) {
      state.farmersOptions = farmersOptions;
    },
    setCountriesOptions(state, countriesOptions) {
      state.countriesOptions = countriesOptions;
    },
    setCurrenciesOptions(state, currenciesOptions) {
      state.currenciesOptions = currenciesOptions;
    },
    setWeightUnitsOptions(state, weightUnitsOptions) {
      // Renamed from "setUnitsOptions"
      state.weightUnitsOptions = weightUnitsOptions;
    },

    // SETTERS FOR LOADING STATES
    setLoadingFarmersOptions(state, isLoading) {
      state.filterOptionsLoadingState.loadingFarmersOptions = isLoading;
    },
    setLoadingWeightUnitsOptions(state, isLoading) {
      // Renamed from "setLoadingUnitsOptions"
      state.filterOptionsLoadingState.loadingWeightUnitsOptions = isLoading;
    },
    setLoadingCountriesOptions(state, isLoading) {
      state.filterOptionsLoadingState.loadingCountriesOptions = isLoading;
    },
    setLoadingCurrenciesOptions(state, isLoading) {
      state.filterOptionsLoadingState.loadingCurrenciesOptions = isLoading;
    },

    //SETTERS FOR PROMISES
    setFarmersOptionsPromise(state, promise) {
      state.filterOptionsLoadingState.farmersOptionsPromise = promise;
    },
    setCountriesOptionsPromise(state, promise) {
      state.filterOptionsLoadingState.countriesOptionsPromise = promise;
    },
    setCurrenciesOptionsPromise(state, promise) {
      state.filterOptionsLoadingState.currenciesOptionsPromise = promise;
    },
    setWeightUnitsOptionsPromise(state, promise) {
      // Renamed from "setUnitsOptionsPromise"
      state.filterOptionsLoadingState.weightUnitsOptionsPromise = promise;
    },
  },
  actions: {
    updateGlobalWeightUnit({ commit }, weightUnit) {
      // Renamed from "updateGlobalUnit"
      commit("setGlobalWeightUnit", weightUnit);
    },

    updateGlobalFilter({ commit }, { filter, value }) {
      commit("setGlobalFilter", { filter, value });
    },
    async fetchFarmersFilterOptions({ state, commit }) {
      if (state.farmersOptions.length > 0) {
        return Promise.resolve(state.farmersOptions);
      }

      if (state.filterOptionsLoadingState.loadingFarmersOptions) {
        return state.filterOptionsLoadingState.farmersOptionsPromise;
      }

      commit("setLoadingFarmersOptions", true);

      const promise = ReportService.fetchFarmersFilterOptions()
        .then((response) => {
          if (response.success) {
            commit("setFarmersOptions", response.data);
          } else {
            console.error(
              "Error fetching farmers options:",
              response.data.error
            );
          }
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching farmers options:", error);
          return [];
        })
        .finally(() => {
          commit("setLoadingFarmersOptions", false);
        });

      commit("setFarmersOptionsPromise", promise);
      return promise;
    },
    async fetchCountriesFilterOptions({ state, commit }) {
      if (state.countriesOptions.length > 0) {
        return Promise.resolve(state.countriesOptions);
      }

      if (state.filterOptionsLoadingState.loadingCountriesOptions) {
        return state.filterOptionsLoadingState.countriesOptionsPromise;
      }

      commit("setLoadingCountriesOptions", true);

      const promise = DashboardReportService.getCountryList()
        .then((response) => {
          commit("setCountriesOptions", response);

          return response;
        })
        .catch((error) => {
          console.error("Error fetching countries options:", error);
          return [];
        })
        .finally(() => {
          commit("setLoadingCountriesOptions", false);
        });

      commit("setCountriesOptionsPromise", promise);
      return promise;
    },
    async fetchCurrenciesFilterOptions({ state, commit }) {
      if (state.currenciesOptions.length > 0) {
        return Promise.resolve(state.currenciesOptions);
      }

      if (state.filterOptionsLoadingState.loadingCurrenciesOptions) {
        return state.filterOptionsLoadingState.currenciesOptionsPromise;
      }

      commit("setLoadingCurrenciesOptions", true);

      const promise = GeneralService.getCurrencies()
        .then((response) => {
          if (response.success) {
            commit("setCurrenciesOptions", response.data);
          } else {
            console.error(
              "Error fetching currencies options:",
              response.data.error
            );
          }
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching currencies options:", error);
          return [];
        })
        .finally(() => {
          commit("setLoadingCurrenciesOptions", false);
        });

      commit("setCurrenciesOptionsPromise", promise);
      return promise;
    },
    async fetchWeightUnitsFilterOptions({ state, commit }) {
      // Renamed from "fetchUnitsFilterOptions"
      if (state.weightUnitsOptions.length > 0) {
        // Renamed from "unitsOptions"
        return Promise.resolve(state.weightUnitsOptions);
      }

      if (state.filterOptionsLoadingState.loadingWeightUnitsOptions) {
        // Renamed from "loadingUnitsOptions"
        return state.filterOptionsLoadingState.weightUnitsOptionsPromise; // Renamed from "unitsOptionsPromise"
      }

      commit("setLoadingWeightUnitsOptions", true); // Renamed from "setLoadingUnitsOptions"

      const promise = GeneralService.getWeightUnits() // Renamed from "getUnits"
        .then((response) => {
          if (response.success) {
            commit("setWeightUnitsOptions", response.data); // Renamed from "setUnitsOptions"
          } else {
            console.error(
              "Error fetching weight units options:", // Renamed from "units options"
              response.data.error
            );
          }
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching weight units options:", error); // Renamed from "units options"
          return [];
        })
        .finally(() => {
          commit("setLoadingWeightUnitsOptions", false); // Renamed from "setLoadingUnitsOptions"
        });

      commit("setWeightUnitsOptionsPromise", promise); // Renamed from "setUnitsOptionsPromise"
      return promise;
    },
  },
  getters: {
    globalFilters: (state) => state.filterParams.globalFilters,
    globalGender: (state) => state.filterParams.globalFilters.gender,
    globalWeightUnit: (state) => state.filterParams.globalFilters.weightUnit, // Renamed from "globalUnit"
    globalCountry: (state) => state.filterParams.globalFilters.country,
    globalCurrency: (state) => state.filterParams.globalFilters.currency,
    farmersFilterOptions: (state) => state.farmersOptions,
    countriesFilterOptions: (state) => state.countriesOptions,
    currenciesFilterOptions: (state) => state.currenciesOptions,
    weightUnitsFilterOptions: (state) => state.weightUnitsOptions, // Renamed from "unitsOptions"
  },
};
