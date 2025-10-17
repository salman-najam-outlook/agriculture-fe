import axios from "axios";

const API_BASE_URL =
  process.env.VUE_APP_BASE_URL.replace("/admin", "") ||
  "https://sass-api-pre-prod.dimitra.dev/api";

export default {
  async loadCountries() {
    return await axios
      .get("/farm/countries/all")
      .then((data) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async getProducts(requestParams) {
    return axios
      .get("/products", {
        params: requestParams,
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createProject(payload) {
    return axios
      .post("/products", payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getProductById(productId) {
    return axios
      .get(`/products/${productId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateProduct(productId, productData) {
    return axios
      .put(`/products/${productId}`, productData, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteProduct(productId) {
    return axios
      .delete(`/products/${productId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async saveSubEnterprise(payload) {
    return axios
      .post("/organization/sub-organization", payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Fetch sub-enterprise listing
  async getSubEnterprises({ page = 1, limit = 10, search = "" }) {
    return axios
      .get(`/organization/sub-organizations`, {
        baseURL: process.env.VUE_APP_BASE_URL,
        params: { page, limit, search },
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Fetch sub-enterprise mongo
  async getMongoSubEntepriseDetail({ page = 1, limit = 10, search = "" }) {
    return axios
      .get(`/organization/sub-organization-mongo`, {
        baseURL: process.env.VUE_APP_BASE_URL,
        params: { page, limit, search },
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Fetch sub-enterprise details
  async getSubEnterpriseDetails(id) {
    return axios
      .get(`/organization/sub-organizations/${id}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Delete an account
  async deleteAccount(accountId) {
    return axios
      .delete(`/organization/sub-organizations/${accountId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Deactivate an account
  async deactivateAccount(accountId) {
    return axios
      .put(`/organization/sub-organizations/${accountId}/deactivate`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async exportCsvSubOrg() {
    return axios
      .get("/organization/sub-organization/export", {
        baseURL: process.env.VUE_APP_BASE_URL,
        responseType: "blob",
      })
      .then((response) => response.data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Fetch ESG standards
  async getEsgStandards(type, filters = {}) {
    const params = new URLSearchParams({
      type: type || "Standard",
      ...(filters.standardId && { standardId: filters.standardId }),
      ...(filters.country?.length && { country: filters.country }),
      ...(filters.product?.length && { product: filters.product }),
      ...(filters.includeProgress && { includeProgress: filters.includeProgress }),
      ...(filters.isActive && { isActive: filters.isActive }),
      ...(filters.page && { page: filters.page }),
      ...(filters.limit && { limit: filters.limit }),
    });

    return axios
      .get(`/esg/protocols?${params.toString()}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Fetch ESG standard details
  async getEsgStandardDetails(standardId) {
    return axios
      .get(`/esg/protocols/${standardId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  // Create ESG standard
  async createEsgStandard(payload) {
    return axios
      .post("/esg/protocols", payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  // Update ESG standard or Protocol
  async updateEsgStandard(standardId, payload) {
    return axios
      .post(`/esg/protocols/${standardId}`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  // Update ESG standard Settings
  async updateEsgStandardSettings(standardId, payload) {
    return axios
      .post(`/esg/protocols/${standardId}/settings`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Update ESG standard status
  async updateEsgStandardStatus(standardId, payload) {
    return axios
      .post(`/esg/protocols/${standardId}/status`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Delete ESG standard
  async deleteEsgStandard(standardId) {
    return axios
      .delete(`/esg/protocols/${standardId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //create Esg issues
  async createEsgIssues(payload) {
    return axios
      .post("/esg/issues", payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //get one Esg issue
  async getEsgIssue(issueId) {
    return axios
      .get(`/esg/issues/${issueId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //update Esg issue
  async updateEsgIssue(issueId, data) {
    try {
      const { data: data_1 } = await axios.post(
        `/esg/issues/${issueId}`,
        data,
        {
          baseURL: process.env.VUE_APP_BASE_URL,
        }
      );
      return data_1;
    } catch ({ response }) {
      return await Promise.reject(response);
    }
  },

  //reorder Esg issue
  reorderEsgIssues(issues) {
    return axios.post("/esg/issues/reorder", {
      issues: issues,
    });
  },

  //delete Esg issue
  deleteEsgIssue(issueId) {
    return axios.delete(`/esg/issues/${issueId}`);
  },

  // get one Esg goal
  async getEsgGoal(goalId) {
    return axios
      .get(`/esg/goals/${goalId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //create Esg Goals
  async createEsgGoals(payload) {
    return axios
      .post("/esg/goals", payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //update Esg goal
  updateEsgGoal(goalId, updateData) {
    return axios
      .post(`/esg/goals/${goalId}`, updateData, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  //reorder Esg goal
  reorderEsgGoals(goals) {
    return axios.post("/esg/goals/reorder", {
      goals: goals,
    });
  },

  //delete Esg goal
  deleteEsgGoal(goalId) {
    return axios.delete(`/esg/goals/${goalId}`);
  },

  getAllAssessments() {
    return axios
      .get(`${API_BASE_URL}/esg/assessments`)
      .then((response) => response.data)
      .catch((error) => Promise.reject(error));
  },

  /**
   * ===============================
   *  CRUD Operations for Assessments
   * ===============================
   */
  async getAssessments(requestParams) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments`, { params: requestParams })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getSupplierServiceTypes() {
    return axios
      .get(`${API_BASE_URL}/esg/service-types`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getAssessmentById(assessmentId) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/${assessmentId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createAssessment(payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateAssessment(assessmentId, payload) {
    return axios
      .put(`${API_BASE_URL}/esg/assessments/${assessmentId}`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteAssessment(assessmentId) {
    return axios
      .delete(`${API_BASE_URL}/esg/assessments/${assessmentId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async duplicateSurvey(assessmentId, payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments/${assessmentId}/duplicate`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  CRUD Operations for Question Headings
   * ===============================
   */
  async getQuestionHeadings(requestParams) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/question-headings`, {
        params: requestParams,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getQuestionHeadingById(headingId) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/question-headings/${headingId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createQuestionHeading(payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments/question-headings`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateQuestionHeading(headingId, payload) {
    return axios
      .put(
        `${API_BASE_URL}/esg/assessments/question-headings/${headingId}`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteQuestionHeading(headingId) {
    return axios
      .delete(`${API_BASE_URL}/esg/assessments/question-headings/${headingId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  CRUD Operations for Assessment Questions
   * ===============================
   */
  async getAssessmentQuestions(requestParams) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/questions`, {
        params: requestParams,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getAssessmentQuestionById(questionId) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/questions/${questionId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createAssessmentQuestion(payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments/questions`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateAssessmentQuestion(questionId, payload) {
    return axios
      .put(`${API_BASE_URL}/esg/assessments/questions/${questionId}`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteAssessmentQuestion(questionId) {
    return axios
      .delete(`${API_BASE_URL}/esg/assessments/questions/${questionId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

   async submitAssessmentQuestion(payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments/questions/submit`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  /**
   * ===============================
   *  CRUD Operations for Assessment Question Options
   * ===============================
   */
  async getAssessmentQuestionOptions(questionId) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/questions/options`, {
        params: { questionId },
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createAssessmentQuestionOption(payload) {
    return axios
      .post(`${API_BASE_URL}/esg/assessments/questions/options`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateAssessmentQuestionOption(optionId, payload) {
    return axios
      .put(
        `${API_BASE_URL}/esg/assessments/questions/options/${optionId}`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteAssessmentQuestionOption(optionId) {
    return axios
      .delete(`${API_BASE_URL}/esg/assessments/questions/options/${optionId}`)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  CRUD Operations for Get Data Questions
   * ===============================
   */
  async getGetDataQuestions(requestParams) {
    return axios
      .get(
        `${API_BASE_URL}/esg/assessments/questions/options/get-question-data`,
        { params: requestParams }
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createGetDataQuestion(payload) {
    return axios
      .post(
        `${API_BASE_URL}/esg/assessments/questions/options/get-question-data`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateGetDataQuestion(getDataId, payload) {
    return axios
      .put(
        `${API_BASE_URL}/esg/assessments/questions/options/get-question-data/${getDataId}`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteGetDataQuestion(getDataId) {
    return axios
      .delete(
        `${API_BASE_URL}/esg/assessments/questions/options/get-question-data/${getDataId}`
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  CRUD Operations for Action Plans
   * ===============================
   */
  async getActionPlans(requestParams) {
    return axios
      .get(`${API_BASE_URL}/esg/assessments/questions/options/action-plans`, {
        params: requestParams,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async createActionPlan(payload) {
    return axios
      .post(
        `${API_BASE_URL}/esg/assessments/questions/options/action-plans`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async updateActionPlan(actionPlanId, payload) {
    return axios
      .put(
        `${API_BASE_URL}/esg/assessments/questions/options/action-plans/${actionPlanId}`,
        payload
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async deleteActionPlan(actionPlanId) {
    return axios
      .delete(
        `${API_BASE_URL}/esg/assessments/questions/options/action-plans/${actionPlanId}`
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  ESG Sub organization sync api
   * ===============================
   */
  async getSelectedSubOrganization(protocolId) {
    return axios
      .get(
        `${API_BASE_URL}/admin/esg/protocols/${protocolId}/sub-organizations`
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  async assignSubOrganizationToProtocol(protocolId, subOrganization = []) {
    return axios
      .post(
        `${API_BASE_URL}/admin/esg/protocols/${protocolId}/sub-organizations/add`,
        subOrganization
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async removeSubOrganizationFromProtocol(protocolId, subOrgIds = []) {
    return axios
      .put(
        `${API_BASE_URL}/admin/esg/protocols/${protocolId}/sub-organizations/remove`,
        subOrgIds
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getUserActivity(requestParams) {
    return axios
      .get(`/user-activity`, {
        params: requestParams,
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  /**
   * ===============================
   *  ESG Survey Response Services
   * ===============================
   */

  // Get survey responses for a specific assessment and goal
  async getSurveyResponsesByAssessmentAndGoal(assessmentId, goalId) {
    return axios
      .get(
        `${API_BASE_URL}/admin/esg/survey-response/questions-v2/${assessmentId}/${goalId}`
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async submitSurveyResponse(payload) {
 
    return axios
      .post(`esg/survey-response/save-response`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => data)
      .catch(({ response }) => {
        console.error("Survey response submission error:", response);
        return Promise.reject(response);
      });
  },

  async getSurveyResponseByGoalId(payload) {
    return axios
      .post(`esg/survey-response/sub-organization-response-view`, payload)
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getGoalProgressByProtocolId(protocolId, params = {}) {
    const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.goalId && { goalId: params.goalId })
    }).toString();

    return axios
      .get(`esg/protocols/${protocolId}/goals/progress?${queryString}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
 
  async getEsgProgressForRespondent(submittedByType, submittedById, protocolId) {
    return axios.get(`/esg/analytics/${protocolId}/${submittedByType}/${submittedById}`)
      .then(res => res.data);
  },

  async updateEsgProtocolStatusForRespondent(submittedByType, submittedById, protocolId,payload) {
    return axios
      .post(
        `/esg/analytics/${protocolId}/${submittedByType}/${submittedById}/updateStatus`,
        {...payload},
        {
          baseURL: process.env.VUE_APP_BASE_URL,
        }
      )
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getRecommendationsForRespondent(submittedByType, submittedById, protocolId) {
    return axios.get(`/esg/analytics/${protocolId}/${submittedByType}/${submittedById}/recommendations`)
      .then(res => res.data)
  },
    
  async getRecommendedUsersOfSubOrganizationForOption(protocolId, subOrganizationId, optionId, queryParams) {
    return axios.get(`/esg/analytics/${protocolId}/sub-organization/${subOrganizationId}/recommendations/${optionId}/users`, {
      params: queryParams,
    })
      .then(res => res.data)
  },

  async getProtocolProgress(protocolId, params = {}){
    return axios.get(`/esg/protocols/${protocolId}/progress`, { params })
      .then(res => res.data)
      .catch(({ response }) => {
        console.error("Error fetching protocol progress:", response);
        return Promise.reject(response);
      });
    },
  async getTypeWiseProgressBySubOrganizationId(body) {
    return axios.post(`esg/survey-response/sub-organization-wise-type-progress`, body)
      .then(res => res.data)
      .catch(({ response }) => {
        console.error("Error fetching type-wise progress:", response);
        return Promise.reject(response);
      });
  },
  async createDiscussion(protocolId, payload) {
    return axios
      .post(`/esg/discussions/${protocolId}`, {
        ...payload,
        protocolId: protocolId
      }, {
        baseURL: process.env.VUE_APP_BASE_URL
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  async getDiscussions(protocolId, params = {}) {
    return axios
      .get(`/esg/discussions/${protocolId}`, { params },{
        baseURL: process.env.VUE_APP_BASE_URL
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getAttachments(protocolId, params = {}) {
    return axios
      .get(`/esg/discussions/${protocolId}/attachments`, { params },{
        baseURL: process.env.VUE_APP_BASE_URL
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },
  async getEsgProgressChart(protocolId, queryParams) {
    return await axios.get(
      `${API_BASE_URL}/admin/esg/protocols/${protocolId}/progress/chart`,
      {
        params: queryParams,
      }
    );
  },

  async downloadProtocolReport(protocolId, queryParams) {
    return await axios.get(
      `${API_BASE_URL}/admin/esg/protocols/${protocolId}/report/download`,
      {
        params: queryParams,
        responseType: 'blob',
      } 
    );
  },

  // list Responses for validation for one protocol
  async getValidationData( protocolId, params ){

    const queryString = new URLSearchParams({
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit }),
      ...(params.searchTerm && { searchTerm: params.searchTerm }),
      ...(params.type && { type: params.type }),
    }).toString();
    return axios
      .get(`/esg/protocols/${protocolId}/responses?${queryString}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Validate a response with rejction reason
  async validateResponse( payload ){
    return axios
      .post(`/esg/survey-response/save-response-rejection`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  async getGoalWiseProgressByGoalIds(goalIds){
     return axios.post(`/esg/survey-response/assessment-progress-by-goal-ids`, goalIds, {
      baseURL:process.env.VUE_APP_BASE_URL
     }).then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },


  /**
   * ===============================
   *  ESG Report Services
   * ===============================
   */

  // Create ESG Report
  async createEsgReport(payload) {
    return axios
      .post(`${API_BASE_URL}/admin/esg-report`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Get ESG Reports
  async getEsgReports() {
    return axios
      .get(`${API_BASE_URL}/admin/esg-report`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Get ESG Report by ID
  async getEsgReportById(reportId) {
    return axios
      .get(`${API_BASE_URL}/admin/esg-report/${reportId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Update ESG Report
  async updateEsgReport(reportId, payload) {
    return axios
      .put(`${API_BASE_URL}/esg-report/${reportId}`, payload, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Delete ESG Report
  async deleteEsgReport(reportId) {
    return axios
      .delete(`${API_BASE_URL}/esg-report/${reportId}`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

  // Get ESG Report Templates
  async getEsgReportTemplates() {
    return axios
      .get(`${API_BASE_URL}/admin/esg-report-template`, {
        baseURL: process.env.VUE_APP_BASE_URL,
      })
      .then(({ data }) => data)
      .catch(({ response }) => Promise.reject(response));
  },

};


