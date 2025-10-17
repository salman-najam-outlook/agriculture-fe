import CarbonCreditService from "@/_services/CarbonCreditService";

const state = {
    offices: [],
    loading: false,
};

const mutations = {
    SET_OFFICES(state, offices) {
        state.offices = offices;
    },
    ADD_OFFICE(state, office) {
        state.offices.unshift(office);
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
};

const actions = {
    async fetchDimitraOffices({ commit }, organizationId) {
        if (!organizationId) return;
        commit('SET_LOADING', true);
        try {
            const res = await CarbonCreditService.getDimitraOffices(organizationId);
            if (res.success) {
                commit('SET_OFFICES', res.data);
            }
        } finally {
            commit('SET_LOADING', false);
        }
    },
    async createDimitraOffice({ commit }, officeData) {
        const res = await CarbonCreditService.createDimitraOffice(officeData);
        if (res.success) {
            commit('ADD_OFFICE', res.data);
        }
        return res;
    },
};

const getters = {
    dimitraOffices: state => state.offices,
    loadingDimitraOffices: state => state.loading,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}; 