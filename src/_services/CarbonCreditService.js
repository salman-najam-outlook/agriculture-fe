import axios from "axios";

const API_BASE_URL =
  process.env.VUE_APP_BASE_URL.replace("/admin", "") ||
  "https://sass-api-pre-prod.dimitra.dev/api";
  

export default {
  async getCarbonCreditProjects(payload) {
    try {
      if (!payload) {
        payload = {};
      }
      const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/projects`, {
        params: payload,
      });
      return data;
    } catch (error) {
      console.error('Error response:', error?.response || error);
      return Promise.reject(error?.response || error);
    }
  },

  async getCarbonCreditProjectById(id) {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/projects/${id}`);
      return data;
    } catch (error) {
      console.error('Error response:', error?.response || error);
      return Promise.reject(error?.response || error);
    }
  },

  async getAllSDGS() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/sdgs`);
      return data;
    } catch (error) {
      console.error('Error response:', error?.response || error);
      return Promise.reject(error?.response || error);
    }
  },
  
async deactivateProject(id) {
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/carbon-credit/projects/${id}/deactivate`);
      return data;
    } catch (error) {
      console.error('Error response:', error?.response || error);
      return Promise.reject(error?.response || error);
    }
  },

  async registerCarbonCreditProject(payload) {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/carbon-credit/projects`, payload);
      return data;
    } catch (error) {
      console.error('Error response:', error?.response || error);
      return Promise.reject(error?.response || error);
    }
  },



    // Plot Tree Mapping
    async addPlotTreeLocation(payload){
      try{
          const {data} = await axios.post(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots`, payload)
          return Promise.resolve(data);
      }catch(err){
          return Promise.reject(err.response)
      }
    },

    async getTreePlots(){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async editTreePlot(id, payload){
      try{
        const {data} = await axios.put(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots/${id}`, payload)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async deleteTreePlot(id){
      try{
        const {data} = await axios.delete(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots/${id}`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getTreePlotById(id){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots/${id}`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async updateTreePlot(id, payload){
      try{
        const {data} = await axios.put(`${API_BASE_URL}/carbon-credit/tree-mapping/tree-plots/${id}`, payload)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getFarmers(){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/farmers`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getFarmNames(){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/farm-names`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getAssignees(){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/assignees`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async createPlotTreeMapping(payload){
      try{
        const {data} = await axios.post(`${API_BASE_URL}/carbon-credit/tree-mapping/requests`, payload)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async updatePlotTreeMapping(id, payload){
      try{
        const {data} = await axios.put(`${API_BASE_URL}/carbon-credit/tree-mapping/requests/${id}`, payload)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getPlotTreeMappingRequests(payload){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/requests`, {params: payload})
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async getPlotTreeMappingRequestById(id){
      try{
        const {data} = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/requests/${id}`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

    async deletePlotTreeMappingRequest(id){
      try{
        const {data} = await axios.delete(`${API_BASE_URL}/carbon-credit/tree-mapping/requests/${id}`)
        return Promise.resolve(data);
      }catch(err){
        return Promise.reject(err.response)
      }
    },

async getModuleScoresAndApprovals() {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/projects/modules/score-approval`);
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async getDimitraOffices(organizationId) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/projects/dimitra-office`, {
      params: { organizationId }
    });
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async createDimitraOffice(payload) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/carbon-credit/projects/dimitra-office`, payload);
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async getOrganizationsWithSubs() {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/organization/list-with-subs`);
    return data;
  } catch (error) {
    return Promise.reject(error?.response || error);
  }
},

async searchOrganizations(filters = {}) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/admin/organization/search`, {
      params: filters
    });
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async getSubOrganizations(params = {}) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/admin/organization/sub-organizations`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || ''
      }
    });
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},



async updateCarbonCreditProject(id, formData) {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/carbon-credit/projects/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async exportProjectsAsCSV(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/carbon-credit/projects/export/csv`, {
      params,
      responseType: 'blob',
    });
    // Create a link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projects.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting projects as CSV:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async exportProjectsAsExcel(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/carbon-credit/projects/export/xlsx`, {
      params,
      responseType: 'blob',
    });
    // Create a link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projects.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting projects as Excel:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},

async downloadPlotTreeMappingPDF(requestId, plotId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/carbon-credit/tree-mapping/download/plot-details/${requestId}/${plotId}/pdf`, {
      responseType: 'blob',
      timeout: 60000,
    });
    return response;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    
    if (error.response?.status === 404) {
      return Promise.reject(new Error('PDF file not found - the plot mapping may not exist'));
    }
    
    return Promise.reject(error?.response || error);
  }
},

async downloadReportDetails(requestId, fileType = 'pdf') {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/carbon-credit/tree-mapping/download/request-details/${requestId}?fileType=${fileType}`,
      {
        responseType: 'blob',
        timeout: 60000,
      }
    );
    return response;
  } catch (error) {
    console.error('Error downloading report:', error?.response || error);
    throw error;
  }
},
async downloadPlotDetails(requestId, plotId, fileType = 'pdf') {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/carbon-credit/tree-mapping/download/plot-details/${requestId}/${plotId}?fileType=${fileType}`,
      {
        responseType: 'blob',
        timeout: 60000,
      }
    );
    return response;
  } catch (error) {
    console.error('Error downloading plot details:', error?.response || error);
    throw error;
  }
},

async getCarbonCreditUsers(payload = {}) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/carbon-credit/projects/users`, {
      params: payload
    });
    return data;
  } catch (error) {
    console.error('Error response:', error?.response || error);
    return Promise.reject(error?.response || error);
  }
},
};