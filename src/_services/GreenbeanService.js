import axios from "axios";

export default {
  async getAllGreenBeans(dataOptions) {
    const requestParams = {
      page: dataOptions.page,
      limit: dataOptions.itemsPerPage,

    };
    return axios
      .get("/coffee/greenbeans/list", { params: requestParams })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },


    getGreenBeansById(greenBeanId) {
      return axios
        .get(`/coffee/greenbeans/${greenBeanId}`)
        .then(({ data }) => data)
        .catch((response) => Promise.reject(response));
    },
};
