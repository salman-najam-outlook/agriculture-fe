import axios from "axios";

export default {
  async getAvgPriceFarmer(payload) {
    return await axios
      .get("/dashboard/avg-price/farmers", {
        params: {
          sDate: payload.sDate,
          eDate: payload.eDate,
          gender: payload.gender,
          farmer: payload.farmer,
          countryCode: payload.countryCode,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
  async getAvgPriceInterval(payload) {
    return await axios
      .get("/dashboard/avg-price/interval", {
        params: {
          sDate: payload.sDate,
          eDate: payload.eDate,
          filterType: payload.filterType,
          gender: payload.gender,
          countryCode: payload.countryCode,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
  async getGenderData(payload) {
    return await axios
      .get("/reports/farmers/byGender", {
        params: {
          sDate: payload.sDate,
          eDate: payload.eDate,
          country: payload.country,
          state: payload.state,
          countryCode: payload.countryCode,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
  async getCountryList() {
    return await axios
      .get("/dashboard/countriesByOrganization")
      .then(({ data }) => data.data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getReportData(country) {
    return await axios
      .get("/reports/dashboard", {
        params: {
          country: country,
          sDate: null,
          eDate: null,
          coordinateListLimit: 3,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getRegionsReport(queryParams = {}) {
    return await axios
      .get(`/reports/regions?`, {
        params: {
          ...queryParams,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getFarmersReport(queryParams = {}) {
    return await axios
      .get(`reports/farmers?`, {
        params: {
          ...queryParams,
          // limit: 2,
          page: 1,
          sortCol: "farmArea",
          sortOrder: "desc",
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getFarmsReport(queryParams = {}) {
    return await axios
      .get(`reports/farms?`, {
        params: {
          ...queryParams,
          // limit: 2,
          page: 1,
          sortCol: "farmArea",
          sortOrder: "desc",
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getFarmersList() {
    return await axios
      .get("farm/select-farmers")
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getCropsReport(queryParams = {}) {
    return await axios
      .get(`reports/crops?`, {
        params: {
          ...queryParams,
          limit: 2,
          page: 1,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
  async getEquipmentReport(data) {
    return await axios.get("reports/equipment", {
      params: {
        ...data,
        // limit: 2,
        page: 1,
        sortCol: "equipmentName",
        sortOrder: "desc",
      },
    });
  },

  async getPestReport(data) {
    return await axios.get("reports/pests", {
      params: {
        ...data,
        // limit: 2,
        page: 1,
      },
    });
  },

  async getCropTypes() {
    return await axios
      .get("reports/cropTypes")
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getYieldChart(params) {
    return await axios
      .get("reports/yield", {
        params: {
          country: params.country,
          cropType: params.cropTypeId,
          farm: params.farmIds,
          sDate: params.startDate,
          eDate: params.endDate,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
  async getGoalsReport(data) {
    return await axios.get("reports/goals", {
      params: {
        ...data,
        // limit: 2,
        page: 1,
        sortCol: "user.firstName",
        sortOrder: "desc",
      },
    });
  },

  async getSoilChart(params) {
    return await axios
      .get("reports/soil", {
        params: {
          country: params.country,
          soilValue: params.soilValue,
          farm: params.farmIds,
          sDate: params.startDate,
          eDate: params.endDate,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getMapRegion(data, page = 1, limit = 1000) {
    return await axios
      .get("reports/map-farms", {
        params: {
          ...data,
          page,
          limit,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getUserFarmData(page = 1, limit = 1000) {
    return await axios
      .get("reports/user-farm", {
        params: {
          page,
          limit,
        },
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },
};
