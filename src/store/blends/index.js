export default {
    namaspace: true,
    state: {
        exemptProductData: null
    },
    mutations: {
        setExemptProductData(state, payload) {
            state.exemptProductData = payload;
        },
        clearExemptProductData(state) {
            state.exemptProductData = null;
        }
    },
    actions: {
        saveExemptProductData({ commit }, payload) {
            commit('setExemptProductData', payload);
        },
        clearExemptProductData({ commit }) {
            commit('clearExemptProductData');
        }
    }
}