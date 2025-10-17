import CarbonCreditService from "@/_services/CarbonCreditService";

const state = {
    organizations: [],
    organizationSearch: '',
    organizationCountry: '',
    loading: false,
};

const mutations = {
    SET_ORGANIZATIONS(state, organizations) {
        state.organizations = organizations;
    },
    SET_SEARCH(state, search) {
        state.organizationSearch = search;
    },
    SET_COUNTRY(state, country) {
        state.organizationCountry = country;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    UPDATE_ORGANIZATION(state, organization) {
        const index = state.organizations.findIndex(o => o.id === organization.id);
        if (index !== -1) {
            state.organizations.splice(index, 1, organization);
        }
    }
};

const actions = {
    async fetchOrganizations({ commit, state }) {
        if (state.loading) return;
        commit('SET_LOADING', true);

        try {
            const filters = {
                country: state.organizationCountry,
                search: state.organizationSearch,
            };

            const res = await CarbonCreditService.searchOrganizations(filters);

            if (res.success) {
                const newOrgs = res.data.map(org => ({ ...org, expanded: false }));
                commit('SET_ORGANIZATIONS', newOrgs);
            }
        } finally {
            commit('SET_LOADING', false);
        }
    },
    setSearch({ commit, dispatch }, search) {
        commit('SET_SEARCH', search);
        dispatch('fetchOrganizations');
    },
    setCountry({ commit, dispatch }, country) {
        commit('SET_COUNTRY', country);
        dispatch('fetchOrganizations');
    },
    toggleOrgExpanded({ commit, state }, org) {
        const organization = state.organizations.find(o => o.id === org.id);
        if (organization) {
            commit('UPDATE_ORGANIZATION', { ...organization, expanded: !organization.expanded });
        }
    },
};

const getters = {
    organizations: state => state.organizations,
    loadingOrganizations: state => state.loading,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}; 