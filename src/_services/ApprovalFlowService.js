import axios from "axios";

export default {
    async getCoorporativeLists(params = {}) {
        var url = `adminuserListByMultipleRoles`;
        return await axios
          .get(url, {
            params: {
              ...params
            },
          })
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },
      async getCooperativeDetails(id) {
        return await axios.get(`user/${id}/detail`)
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },

      async deactivateCooperative(id, status) {
        return await axios.patch(`user/${id}/status/${status}`)
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },
      
      async deleteCooperative(id) {
        return await axios.delete(`user/${id}`)
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },

      async addCooperative(data) {
        return await axios.post(`user`, data)
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },
      
      async updateCooperative(id, data) {
        return await axios.put(`user/${id}`, data)
          .then(({ data }) => data)
          .catch((error) => Promise.reject(error));
      },
}