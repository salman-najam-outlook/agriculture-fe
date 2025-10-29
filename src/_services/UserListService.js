import axios from "axios";

export default {
  async getAssignedToList() {
    return axios
      .get("/adminuserListByRole/indonesia_ptsi_worker", {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getExporterList() {
    return axios
      .get("/adminuserListByRole/dds_exporter", {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getExporters() {
    return axios
      .get("/exporters", {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
};