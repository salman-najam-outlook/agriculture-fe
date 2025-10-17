import axios from "axios";

export default {
  async getCurrencies() {
    const baseUrl = process.env.VUE_APP_BASE_URL.substring(
      0,
      process.env.VUE_APP_BASE_URL.length - 6
    );

    return await axios
      .get(`${baseUrl}/currency`)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },

  async getDropdownData(data) {
    return await axios
      .post("/option", data)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },

  async getAreaUnitList() {
    return await axios
      .get(`/areaUnits`)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },

  async getWeightUnitList() {
    return await axios
      .get(`/weightUnits`)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },

  async getYieldUnitList() {
    return await axios
      .get(`/yieldUnits`)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },

  async getHarvestCropList() {
    return await axios
      .get(`/crop/list`)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.response);
      });
  },
  
  async createHarvestAlert(data) {
    return await axios.post('/harvest/alert', data)
    .then(({ data }) => data)
    .catch(err => err)
  },

  async getHarvestAlert(data) {
    return await axios.get('/harvest/alert', data)
    .then(({ data }) => data)
    .catch(err => err)
  },

  async updateHarvestAlert(id, data) {
    return await axios.put(`/harvest/alert/${id}`, data)
    .then(({ data }) => data)
    .catch(err => err)
  },

  async deleteHarvestAlert(id) {
    return await axios.delete(`/harvest/alert/${id}`)
    .then(({ data }) => data)
    .catch(err => err)
  }
};
