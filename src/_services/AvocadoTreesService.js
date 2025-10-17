import axios from "axios";

const apiUrl = process.env.VUE_APP_BASE_URL.replace("/admin", "");
export default {
  async getAllTrees(requestParams) {
    return axios
      .get("/tree-management", {
        params: requestParams,
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async deleteTree(treeId) {
    const response = await axios.delete(`/tree-management/${treeId}`, {
      baseURL: process.env.VUE_APP_BASE_URL,
    });
    return response.data;
  },

  async getAllUploadedTrees(requestParams) {
    return axios
      .get(apiUrl + "/tree-management/get-uploaded-trees", {
        params: requestParams,
      })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async fetchUploadHistoryFile(requestParams) {
    try {
      const url = `${apiUrl}/tree-management/fetch-upload-history-file`

      const data = await axios.get(`${url}`, {
        params: requestParams,
        responseType: 'blob'
      });
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error.response)
    }
  },

  async getUploadedTreeHistoryById(historyId) {
    return axios
      .get(apiUrl + "/tree-management/get-upload-history/" + historyId, {
      })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },


  async getTreesUploadHistory(requestParams) {
    return axios
      .get(apiUrl + "/tree-management/get-upload-history",{ params: requestParams})
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },


  async addNewTree(data) {
    return axios
      .post(apiUrl + `/tree-management`, data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  async updateTree(data) {
    return axios
      .put(apiUrl + `/tree-management/${data.id}`, data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getSingleTree(id) {
    return axios
      .get(apiUrl + `/tree-management/${id}`)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async getTreeUpdateHistory(id) {
    return axios
      .get(apiUrl + `/tree-management/update-history/${id}`)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async updateTreeUpdateHistory(historyId, data) {
    return axios
      .put(`/tree-management/update-history/${historyId}`, data, { baseURL: apiUrl })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async deleteTreeUpdateHistory(historyId) {
    return axios
      .delete(`/tree-management/update-history/${historyId}`, { baseURL: apiUrl })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async uploadSingleTreeImage(formData) {
    return axios
      .post(apiUrl + `/tree-management/uploadSingleTreeImage`, formData)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async bulkUploadUploadTreeUpdateImage(payLoad) {
    return axios
      .post(apiUrl + `/tree-management/bulk-upload-add-images`, payLoad)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async uploadTreeUpdateImage(payLoad, treeId) {
    return axios
      .post(apiUrl + `/tree-management/add-images/${treeId}`, payLoad)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },
  async getFarmView(id) {
    return axios
      .get(apiUrl + `/tree-management/farm-view/${id}`)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async createNewSurvey(data) {
    return axios
      .post("/surveys", data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async copySurvey(data) {
    return axios
      .post("/surveys/copy", data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async futureSurvey(questionId, data) {
    return axios
      .post(`/surveys/question/${questionId}/future`, data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteSurvey(data) {
    return axios
      .delete(`/surveys/${data.id}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateSurvey(data) {
    return axios
      .put(`/surveys/${data.id}`, data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async addSurveyQuestion(data) {
    return axios
      .post("/surveys/question", data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getResponse(survey_id, requestParams) {
    return axios
      .get(`/surveys/response/${survey_id}`, { params: requestParams })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getResponseByUser(surveyUserResponseEntityId, surveyId) {
    return axios
      .get(`/surveys/response/${surveyUserResponseEntityId}/${surveyId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getSurveyQuestions(survey_id, requestParams) {
    return axios
      .get(`/surveys/questions/${survey_id}`, { params: requestParams })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async getSurveyResponse(survey_id) {
    return axios
      .get(`/surveys/question/response/${survey_id}`)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async getSurveyUsers(page, search = "", fData) {
    var url = `/surveys/users/list`;
    const requestParams = {
      page: page,
      limit: 10,
      searchPhrase: search,
      remainingDays: fData.membershipRemainingDays,
      membershipTypes: fData.membership_type,
      membershipValidity: fData.membership_validity,
      accountProgress: fData.account_progress,
      membershipRole: fData.membership_role,
      gender: fData.gender,
      country: fData.country?.name,
      region: fData.stateId,
    };
    return axios
      .get(url, { params: requestParams })
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async deleteSurveyQuestion(id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/surveys/question/${id}`)
        .then(({ data }) => resolve(data))
        .catch((err) => reject(err));
    });
  },

  async deleteSurveyQuestionOption(id) {
    return axios
      .delete(`/surveys/question/option/${id}`)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async updateSurveyQuestion(data) {
    return axios
      .put(`/surveys/question/${data.data.id}`, data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getSurveyUserAutoConditon() {
    return axios
      .get("/surveys/auto-condition/list")
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async publishSurvey(surveyId, status) {
    const data = {
      status: status,
    };
    return await axios
      .post(`/surveys/publish/${surveyId}`, data)
      .then(({ data }) => data)
      .catch(() => ({ response }) => Promise.reject(response));
  },

  async downloadSurvey(params) {
    let encodedUrl =
      `/surveys/download/${params.surveyId}?` +
      `download=${params.download}&` +
      "type=" +
      encodeURIComponent(params.type.join(","));
    try {
      const { data } = await axios.get(encodedUrl, {
        responseType: "blob",
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async exportReport(exportType) {
    try {
      const url = `tree-management/export/${exportType}?treeType=AVOCADO`

      const data = await axios.get(`${url}`, {
        responseType: 'blob'
      });
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error.response)
    }
  },

  //   getSurveyUsingSurveyId() {
  //     return axios
  //       .get("surveys/response/10")
  //       .then(({ data }) => data)
  //       .catch((response) => Promise.reject(response));
  //   },
};
