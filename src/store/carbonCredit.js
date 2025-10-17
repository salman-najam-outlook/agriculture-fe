const state = {
  farmLocation: null,
};

const getters = {
  getFarmLocation: (state) => state.farmLocation,
};

const mutations = {
  SET_FARM_LOCATION(state, payload) {
    state.farmLocation = payload;
  },
  CLEAR_FARM_LOCATION(state) {
    state.farmLocation = null;
  },
};

const actions = {
  setFarmLocation({ commit }, location) {
    commit('SET_FARM_LOCATION', location);
  },
  clearFarmLocation({ commit }) {
    commit('CLEAR_FARM_LOCATION');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}; 