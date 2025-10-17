// Vuex module for storing the current carbon credit project data
export default {
  namespaced: true,
  state: {
    currentProject: null,
  },
  mutations: {
    SET_CURRENT_PROJECT(state, project) {
      state.currentProject = project;
    },
    CLEAR_CURRENT_PROJECT(state) {
      state.currentProject = null;
    },
  },
  actions: {
    setCurrentProject({ commit }, project) {
      commit('SET_CURRENT_PROJECT', project);
    },
    clearCurrentProject({ commit }) {
      commit('CLEAR_CURRENT_PROJECT');
    },
  },
  getters: {
    currentProject: (state) => state.currentProject,
  },
}; 