import MarketplaceService from "../../_services/MarketplaceService";

const state = {
    products: [],
    categories: [],
    subCategories: [],
    countries: [],
};

const getters = {
    getProducts: (state) => state.products?.items || [],
    getCategories: (state) => state.categories || [],
    getSubCategories: (state) => state.subCategories || [],
    getCountries: (state) => state.countries,
};

const actions = {
    async fetchProducts({ commit }) {
        const response = await MarketplaceService.getProducts();
        commit('SET_PRODUCTS', response);
    },
    async fetchCategories({ commit }) {
        const response = await MarketplaceService.getCategoriesWithoutPagination();
        commit('SET_CATEGORIES', response);
    },
    async fetchCountries({ commit }) {
        const response = await MarketplaceService.getCountries();
        commit('SET_COUNTRIES', response);
    },
    async fetchgetCategoriesSubCategories({ commit }, payload) {
        const response = await MarketplaceService.getCategoriesSubCategories(payload);
        commit('SET_SUB_CATEGORIES', response?.data);
    },
};

const mutations = {
    SET_PRODUCTS: (state, products) => (state.products = products),
    SET_CATEGORIES: (state, categories) => (state.categories = categories),
    SET_COUNTRIES: (state, countries) => (state.countries = countries),
    SET_SUB_CATEGORIES: (state, subCategories) => (state.subCategories = subCategories),
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
