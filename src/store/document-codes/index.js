import BlendService from "@/_services/BlendService";

const state = {
    documentCodes: [],
};

const getters = {
    getDocumentCodes: (state) => state.documentCodes,
};

const actions = {
    async fetchDocumentCodes({ commit, state }) {
        if (state.documentCodes.length > 0) return;
        try {
            const response = await BlendService.getDocumentCodes();
            commit("setDocumentCodes", response.data.documentCodes);
        } catch (error) {
            console.error("Error fetching document codes:", error);
        }
    },
    async addDocumentCode({ commit }, documentCodeData) {
        try {
            const resp = await BlendService.createDocumentCode(documentCodeData);
            if (resp.errors) {
                return resp
            } else {
                commit("addDocumentCode", documentCodeData);
            }
        } catch (error) {
            console.error("Error saving document code:", error);
        }
    },
};

const mutations = {
    setDocumentCodes(state, documentCodes) {
        state.documentCodes = documentCodes;
    },
    addDocumentCode(state, documentCodeData) {
        state.documentCodes.push(documentCodeData);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
