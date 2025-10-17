import MemberDataService from "@/_services/MemberDataService.js";
export default {
  namespaced: true,
  state: {
    farms: {
      count: 0,
      data: [],
      userFarmInfo: {},
      viewOnMapDetails: {},
      userFarms: [],
      farmsActivities: {
        totalCost: 0,
        currency: {},
        data: [],
      },
    },
    farmers: {
      count: 0,
      data: [],
      farmerDetails: {},
      farmerViewAllFarms: {
        farms: [],
        count: 0,
        user: {},
      },
    },
    userFarmInfo: {},
    farmersOptions: [],
  },
  getters: {
    farms: (state) => state.farms.data,
    farmsActivities: (state) => state.farms.farmsActivities,
    userFarms: (state) => state.farms.userFarms,
    userFarmInfo: (state) => state.farms.userFarmInfo,
    farmViewOnMap: (state) => state.farms.viewOnMapDetails,
    farmers: (state) => state.farmers.data,
    farmerDetail: (state) => state.farmers.farmerDetails,
    farmsCount: (state) => state.farms.count,
    farmersCount: (state) => state.farmers.count,
    userAllFarms: (state) => state.farmers.farmerViewAllFarms.farms,
    userFarmCount: (state) => state.farmers.farmerViewAllFarms.count,
  },
  actions: {
    /** Farms Action */
    async getFarms({ commit }, payload = {}) {
      const farms = await MemberDataService.getFarms(payload);
      commit("SET_FARMS", farms.data);
    },
    async getUserFarms({ commit }, payload) {
      const { data } = await MemberDataService.getUserFarms(payload);
      commit("SET_USER_FARMS", data);
    },
    async getFarmsActivity({ commit }, payload = {}) {
      const activity = await MemberDataService.getFarmsActivity(payload);
      commit("SET_FARMS_ACTIVITY", activity.data);
    },
    async getFarmUserInfo({ commit }, payload) {
      const response = await MemberDataService.getFarmUserInfo(payload);
      commit("SET_FARM_USER_INFO", response);
    },
    async handleChangeFarmStatus(contex, payload) {
      const { farmId, ...rest } = payload;
      await MemberDataService.handleChangeFarmStatus(farmId, rest);
    },
    async handleChangeUserFarmLimit(contex, payload) {
      const { userId, ...rest } = payload;
      await MemberDataService.handleChangeUserFarmLimit(userId, rest);
    },
    async getFarmOnMapView({ commit }, payload) {
      const { data } = await MemberDataService.getFarmOnMapView(payload);
      commit("SET_FARM_VIEW_ON_MAP", data);
    },
    /** Farmers Action  */
    async getFarmers({ commit }, payload = {}) {
      const farmers = await MemberDataService.getFarmers(payload);
      commit("SET_FARMERS", farmers.data);
    },
    async getFarmerDetail({ commit }, payload) {
      const farmer = await MemberDataService.getFarmersDetails(payload);
      commit("SET_FARMER_DETAIL", farmer.data);
    },
    async getFarmersViewAllFarms({ commit }, payload) {
      const data = await MemberDataService.getFarmersViewAllFarms(payload);
      commit("SET_FARMERS_VIEW_ALL_FARMS", data.data);
    },
  },
  mutations: {
    /** Farms mutation */
    SET_FARMS(state, data) {
      state.farms.data = data.response;
      state.farms.count = data.count;
    },
    SET_USER_FARMS(state, data) {
      state.farms.userFarms = data;
    },
    SET_FARMS_ACTIVITY(state, data) {
      state.farms.farmsActivities.totalCost = data.totalCost;
      state.farms.farmsActivities.currency = data.currency;
      state.farms.farmsActivities.data = data.info;
    },
    SET_FARM_USER_INFO(state, data) {
      state.farms.userFarmInfo = data.data;
    },
    UPDATE_FARM_DATA_ROW(state, data) {
      const index = state.farms.data.findIndex((item) => data.id == item.id);
      state.farms.data[index] = data;
    },
    SET_FARM_VIEW_ON_MAP(state, data) {
      state.farms.viewOnMapDetails = data;
    },
    /** Farmers Mutation */
    SET_FARMERS(state, data) {
      state.farmers.count = data.count;
      state.farmers.data = data.response;
    },
    SET_FARMER_DETAIL(state, data) {
      state.farmers.farmerDetails = data;
    },
    SET_FARMERS_VIEW_ALL_FARMS(state, { farms, user }) {
      state.farmers.farmerViewAllFarms.farms = farms.rows;
      state.farmers.farmerViewAllFarms.count = farms.count;
      state.farmers.farmerViewAllFarms.user = user;
    },
  },
};
