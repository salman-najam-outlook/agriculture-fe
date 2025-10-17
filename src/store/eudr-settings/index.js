const state = {
    EUDR_Settings: null,
};

const getters = {
    get_EUDR_Settings: (state) => state.EUDR_Settings,
};

const actions = {
    async storeEUDRSetting({commit},EUDR_settings){
        commit('setEUDRSettings',EUDR_settings)
    },

    async loadEudrSetting(context){
        const eudrSetting = await JSON.parse(localStorage.getItem("EUDR_Settings"));

        if (eudrSetting){
            await context.commit("setEUDRSettings", eudrSetting);
        }
    }
};

const mutations = {
    setEUDRSettings: (state, EUDR_settings) => {
        state.EUDR_Settings = EUDR_settings;
        localStorage.setItem('EUDR_Settings', JSON.stringify(EUDR_settings));
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
