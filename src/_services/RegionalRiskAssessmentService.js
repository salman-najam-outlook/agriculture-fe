import { postGraphqlQuery } from "./GraphQLService";

export default {
  async getAllRegionalRisk(opt) {
    const graphqlQuery = `
    query getAllRegionalRiskAssessments($filter: RegionalRiskAssessmentFilterInput!) {
        getAllRegionalRiskAssessments(filter: $filter) {
          rows {
            id
            country
            riskCriteriaIdWithLevels {
            id
            level
            description
          }
            reportDetails
            createdAt
          }
          totalCount
          count
        }
      }`;

    const filter = {
      page: opt.page || 1,
      limit: opt.limit || 10,
      search: opt.search || [],
      sortBy: opt.sortBy || "createdAt",
      sortOrder: opt.sortOrder || "DESC",
    };
    return await postGraphqlQuery(graphqlQuery, { filter });
  },

  getRegionalRiskById(id) {
    const graphqlQuery = `
    query getRegionalRiskAssessmentById($id: Int!) {
        getRegionalRiskAssessmentById(id: $id) {
          id
          country
          riskCriteriaIdWithLevels {
            id
            level
            description
          }
          reportDetails
          createdAt
        }
      }`;
    return postGraphqlQuery(graphqlQuery, { id });
  },

  async getRiskAssessmentCriteria(opt) {
    const graphqlQuery = `
            query {
                fetchAllRiskAssessmentCriteria {
                    id
                    description
                    }
                }`;
    return postGraphqlQuery(graphqlQuery, opt);
  },

  createRiskAssessmentCriteria(data) {
    const graphqlMutation = `
            mutation createRegionalRiskAssessment($data: CreateRegionalRiskAssessmentInput!) {
                createRegionalRiskAssessment(data: $data) {
                    id
                    country
                }
            }
        `;
    return postGraphqlQuery(graphqlMutation, { data });
  },

  updateRiskAssessmentCriteria(data) {
    const graphqlMutation = `
        mutation updateRegionalRiskAssessment($data: UpdateRegionalRiskAssessmentInput!) {
              updateRegionalRiskAssessment(data: $data) {
                id
                country
                riskCriteriaIdWithLevels
                reportDetails
                createdAt
              }
            }`;
    return postGraphqlQuery(graphqlMutation, { data });
  },

  async deleteRegionalRisk(id) {
    const graphqlMutation = `
      mutation deleteRegionalRiskAssessment($id: Int!) {
        deleteRegionalRiskAssessment(id: $id)
      }
    `;

    const variables = { id };

    return postGraphqlQuery(graphqlMutation, variables);
  },
};
