import axios from "axios";

export default {
  async getAllSurveys(requestParams) {
    return axios
      .get("/surveys/list", { params: requestParams })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getSurvey(id) {
    return axios
      .get(`/surveys/${id}`)
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
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

  async getResponse(survey_id, params) {
    return axios
      .get(`/surveys/response/${survey_id}`, {
        params,
      })
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
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getSurveyResponse(survey_id, requestParams) {
    return axios
      .get(`/surveys/question/response/${survey_id}`, { params: requestParams })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async getSurveyResponseSummary(survey_id, requestParams) {
    return axios
      .get(`/surveys/question/responses-summary/${survey_id}`, {
        params: requestParams,
      })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
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
      startDate: fData.startDate,
      endDate: fData.endDate,
    };
    return axios
      .get(url, { params: requestParams })
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
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
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
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
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async publishSurvey(surveyId, status) {
    const data = {
      status: status,
    };
    return await axios
      .post(`/surveys/publish/${surveyId}`, data)
      .then(({ data }) => data)
      .catch(
        () =>
          ({ response }) =>
            Promise.reject(response)
      );
  },

  async downloadSurvey(params) {
    let encodedUrl =
      `/surveys/download/${params.surveyId}?` +
      `download=${params.download}&` +
      "type=" +
      params.type;
    try {
      const { data } = await axios.get(encodedUrl, {
        responseType: "blob",
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async downloadResponseSurvey(id) {
    let encodedUrl = `/surveys/single/download/${id}?`;
    try {
      const { data } = await axios.get(encodedUrl, {
        responseType: "blob",
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getDownloadSurveyHistories(params) {
    const { id } = params;
    let encodedUrl = `/surveys/download-survey-histories/${id}?`;
    try {
      const { data } = await axios.get(encodedUrl, {
        params: params,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  //   getSurveyUsingSurveyId() {
  //     return axios
  //       .get("surveys/response/10")
  //       .then(({ data }) => data)
  //       .catch((response) => Promise.reject(response));
  //   },


  async createQuestionHeading(data) {
    return axios
      .post("/surveys/question", data)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
};
