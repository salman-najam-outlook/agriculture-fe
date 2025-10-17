import axios from "axios";

export default {
  async getReportData(reportType, filters) {
    try {
      const d = axios.get(`/coffee/reports/${reportType}`, {
        params: filters,
      });
      return Promise.resolve(d);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getPdfData(reportType, filters) {
    try {
      const d = axios.get(`/coffee/reports/pdf/${reportType}`, {
        params: filters,
        responseType: "blob",
      });
      return Promise.resolve(d);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getReportDataa(reportType, id, filters) {
    try {
      const d = axios.get(`/coffee/reports/${reportType}/${id}`, {
        params: filters,
      });
      return Promise.resolve(d);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getPdfDataa(reportType, id, filters) {
    try {
      const d = axios.get(`/coffee/reports/pdf/${reportType}/${id}`, {
        params: filters,
      });
      return Promise.resolve(d);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getSatelliteReport(params) {
    try {
      const res = axios.get(`reports/crop-health-reports`, {
        params,
      });
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async exportSatelliteReport(reportType) {
    try {
      const { data } = await axios.get(
        `reports/crop-health-reports/export/${reportType}`,
        {
          responseType: "blob",
        }
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async generateSatelliteReport(payload) {
    try {
      const { data } = await axios.post(
        `/reports/crop-health-reports`,
        payload
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getSatelliteReportDetail(reportId) {
    try {
      const res = await axios.get(`reports/crop-health-reports/${reportId}`);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async downloadReport(payload, reportID) {
    try {
      const data = await axios.post(
        `/reports/crop-health-reports/${reportID}/download-pdf`,
        payload,
        {
          responseType: "blob",
        }
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async fetchFarmersFilterOptions() {
    try {
      const { data } = await axios.get(`/reports/farmers-options`);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
};
