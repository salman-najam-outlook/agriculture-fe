import axios from "axios";
const MARKETPLACE_ADMIN_URL = process.env.VUE_APP_MARKETPLACE_ADMIN_BASE_URL;
// const MARKETPLACE_GENERAL_URL = 'http://localhost:4001/api'
const axiosInstance = axios.create({
    baseURL: MARKETPLACE_ADMIN_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

export default {
  GET_DASHBOARD_COUNTS: "/admin/dashboard",
  GET_DASHBOARD_TOP_CHARTS: "/admin/dashboard/top-charts",
  GET_CATEGORIES_URL: "/admin/categories",
  GET_SUBCATEGORIES: "admin/categories/:id/subcategories",
  POST_CATEGORY: "admin/categories",
  CATEGORIES_WITHOUT_PAGINATION: "admin/categories/category-without-pagination",
  POST_SUB_CATEGORY: "admin/categories/subcategory",
  GET_PRODUCTS: "admin/products",
  GET_USERS: "users",
  GET_SELLER: "users/sellers",
  GET_CATEGORIES_SUBCATEGORIES: "admin/products/categories/subcategories",
  GET_ORDERS: "admin/orders",
  GET_ORDERS_BY_ID: "admin/orders/:id",

  async getDashboardCounts(){
    return await axiosInstance.get(this.GET_DASHBOARD_COUNTS);
  },

  async getCategories(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(this.GET_CATEGORIES_URL, {
        params: queryParam,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getDashboardTopChart(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(this.GET_DASHBOARD_TOP_CHARTS, {
        params: queryParam,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getProducts(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(this.GET_PRODUCTS, {
        params: queryParam,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getProduct(id, step) {
    try {
      const { data } = await axiosInstance.get(`${this.GET_PRODUCTS}/${id}`, {
        params: {
          step,
        },
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getCategoriesWithoutPagination(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(
        this.CATEGORIES_WITHOUT_PAGINATION,
        {
          params: queryParam,
        }
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getCategoriesSubCategories(payload) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(this.GET_CATEGORIES_SUBCATEGORIES, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getSubCategoriesByID(categoryId, queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(
        this.GET_SUBCATEGORIES.replace(":id", categoryId),
        {
          params: queryParam,
        }
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async postCategory(categoryData = {}) {
    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("description", categoryData.description);
      formData.append("created_by", categoryData.created_by.toString());
      formData.append("created_by_admin", "1");

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const { data } = await axiosInstance.post(this.POST_CATEGORY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async postSubCategory(categoryData = {}) {
    try {
      const formData = new FormData();
      formData.append("parent_category_id", categoryData.mainCategory);
      formData.append("name", categoryData.name);
      formData.append("description", categoryData.description);
      formData.append("created_by", categoryData.created_by);
      formData.append("created_by_admin", "1");

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const { data } = await axiosInstance.post(
        this.POST_SUB_CATEGORY,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getUsers(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(this.GET_USERS, {
        params: queryParam,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getSeller(queryParam = {}) {
    try {
      const { data } = await axiosInstance.get(this.GET_SELLER, {
        params: queryParam,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  getProductCategories() {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`admin/categories`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getProductSubCategories() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${MARKETPLACE_ADMIN_URL}/admin/products/subcategory`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getCountries() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${MARKETPLACE_ADMIN_URL}/options/countries`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getCurrencies() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${MARKETPLACE_ADMIN_URL}/options/currencies`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getUnits() {
    return await axiosInstance.get(`/admin/products/unit`);
  },

  getPackaging() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${MARKETPLACE_ADMIN_URL}/admin/products/packaging`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  addProduct(payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${MARKETPLACE_ADMIN_URL}/admin/products`, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async removeProduct(id) {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response;
  },

  async changeProductStatus(id) {
    const response = await axiosInstance.post(
      `/admin/products/change-status/${id}`
    );
    return response;
  },

  getOrders({ page, limit, search, specific_date }) {
    return new Promise((resolve, reject) => {
      const params = {
        page,
        limit,
        search,
      };

      // Only add specific_date if it has a value
      if (specific_date) {
        params.specific_date = specific_date;
      }

      axiosInstance
        .get(this.GET_ORDERS, { params })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getOrderById(id) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(this.GET_ORDERS_BY_ID.replace(":id", id))
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  cancelOrder(id, payload) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/admin/orders/${id}/cancel`, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  processOrder(id, payload) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/admin/orders/${id}/process`, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  
};

