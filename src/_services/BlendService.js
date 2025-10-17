const axios = require("axios");
import { postGraphqlQuery } from "./GraphQLService";

export default {
  async getExemptProducts(opt) {
    const graphqlQuery = `
            query getExemptProducts($exemptProductsFilterInput: ExemptProductsFilterInput!) {
                getExemptProducts(filter: $exemptProductsFilterInput) {
                    count
                    totalCount
                    rows {
                        id
                        internalReferenceNumber
                        product
                        productNetMass
                        productVolume
                        productDate
                        productDetail {
                            name
                        }
                        supplier {
                            firstName
                            lastName
                        }
                        containerIds {
                            containerId
                        }
                        availability
                    }
                }
            }
        `;

    const exemptProductsFilterInput = {
      page: opt.page,
      limit: opt.limit,
      searchPhrase: opt.searchPhrase,
      sortColumn: opt.sortColumn,
      sortOrder: opt.sortOrder,
    };

    return postGraphqlQuery(graphqlQuery, { exemptProductsFilterInput });
  },

  async deleteExemptProduct(id) {
    const graphqlMutation = `
      mutation($id: ID!) {
        softDeleteExemptProduct(id: $id)
      }
    `;

    const variables = { id };

    return postGraphqlQuery(graphqlMutation, variables);
  },

  async addExemptProduct(createExemptProductInput) {
    const graphQuery = `
            mutation createExemptProduct($dto: ExemptProductDto!) {
            createExemptProduct (dto:$dto)  {
                id
                internalReferenceNumber
                product
                productNetMass
                productDate
                }
            }
        `;
    return postGraphqlQuery(graphQuery, { dto: createExemptProductInput });
  },

  async getExemptProductById(id) {
    const graphqlQuery = `
                query exemptProduct($id: ID!) {
                    exemptProduct (id:$id)  {
                        id
                        internalReferenceNumber
                        product
                        productNetMass
                        productVolume
                        countryOfActivity
                        countryOfEntry
                        activity
                        productDate
                        productDetail {
                            id
                            name
                        }
                        subProductDetail {
                            id
                            name
                        }
                        supplier {
                            id
                            firstName
                            lastName
                            email
                            mobile
                            countryId
                            verified
                        }
                        containerIds {
                            containerId
                        }
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, { id });
  },

  async updateAvailabilityExemptProduct(id, availability) {
    const graphqlQuery = `
            mutation updateAvailabilityExemptProduct($id: ID!, $availability: Boolean!) { 
                updateAvailabilityExemptProduct (id:$id, availability: $availability)
            }
            `;
    return postGraphqlQuery(graphqlQuery, { id, availability });
  },

  async updateExemptProduct(UpdateExemptProductDto) {
    const graphQuery = `
            mutation updateExemptProduct($dto: UpdateExemptProductDto!) {
            updateExemptProduct (dto:$dto)  {
                id
                internalReferenceNumber
                product
                productNetMass
                productDate
                }
            }
        `;
    return postGraphqlQuery(graphQuery, { dto: UpdateExemptProductDto });
  },

  async listBlendSettings(paginationOptions) {
    const graphqlQuery = `
        query ListBlendSettings($paginationOptions: BlendSettingsPaginationDto!) {
            listBlendSettings(paginationOptions: $paginationOptions) { 
                count
                rows {
                  id    
                  blendTitle
                  blendCode
                  blendDescription
                  finalProductName
                  finalProductCode
                  createdAt
                  
                }   
            }
        }`;

    const variables = {
      paginationOptions: {
        limit: paginationOptions.limit,
        page: paginationOptions.page,
        blendTitle: paginationOptions.blendTitle,
        sortBy: paginationOptions.sortBy,
        order: paginationOptions.order,
      },
    };
    return postGraphqlQuery(graphqlQuery, variables);
  },

  async listBlendSettingsAll(paginationOptions) {
    const graphqlQuery = `
        query ListBlendSettingsByProductAndSubProduct($paginationOptions: BlendSettingsPaginationDto!) {
  listBlendSettingsByProductAndSubProduct(paginationOptions: $paginationOptions) {
    rows {
      id
                blendTitle
                blendCode
                blendDescription
                finalProductName
                finalProductCode
                processType
                orgId
                blendLotIDConfigurations{
                  lotId
                }
                blendSettingProducts {
                originCountry
                productId
                product{
                  name
                }
                subProductId
                subProduct{
                  name
                }
              }
  }
}
}`;

    const variables = {
      paginationOptions: {
        limit: paginationOptions.limit,
        page: paginationOptions.page
      },
    };
    return postGraphqlQuery(graphqlQuery, variables);
  },

  async listBlendSettingsById(id) {
    const graphqlQuery = `
        query GetBlendSettings($id: Float!) {
            getBlendSettings(id: $id) { 
                id    
                blendTitle
                blendCode
                blendDescription
                finalProductName
                finalProductCode
                processType
                blendSettingProducts {
                    productId
                    product{
                      id
                       name
                }
                    subProductId
                    subProduct{
                    id
                  name
                }
                    originCountry
                    percentage
                    }
                    blendLotIDConfigurations {
                    typeFirst
                    typeSecond
                    separator
                    startCount
                    reset
                    lotId
                    resetFrequency
                    staticText
                    }
                createdAt
            }
        }`;
    return postGraphqlQuery(graphqlQuery, { id });
  },

  async updateBlendSettings(id, updateBlendInput) {
    const graphqlQuery = `
        mutation UpdateBlendSettings($id:Int!, $input: UpdateBlendSettingsDto!) { 
            updateBlendSettings(id:$id, input: $input) { 
                id    
                blendTitle
                blendCode
                blendDescription
                finalProductName
                finalProductCode
                processType
                blendSettingProducts {
                    productId
                    subProductId
                    originCountry
                    percentage
                }
                blendLotIDConfigurations {
                    typeFirst
                    typeSecond
                    separator
                    startCount
                    reset
                    lotId
                    resetFrequency
                }
                createdAt
            }
        }`;
    return postGraphqlQuery(graphqlQuery, { id, input: updateBlendInput });
  },

  async createBlendSettings(createBlendInput) {
    const graphqlQuery = `
      mutation createBlendSettings($input: CreateBlendSettingsDto!) { 
        createBlendSettings(input: $input) { 
          id
          blendTitle
          blendCode
          finalProductName
          finalProductCode
          processType
          blendSettingProducts {
            productId
            subProductId
            originCountry
            percentage
          }
          blendLotIDConfigurations {
            typeFirst
            typeSecond
            separator
            startCount
            reset
            lotId
            resetFrequency
          }
        }
      }
    `;
    return postGraphqlQuery(graphqlQuery, { input: createBlendInput });
  },
  async deleteBlendSettings(id) {
    const graphqlMutation = `
        mutation DeleteBlendSettings($id: Int!) {
        deleteBlendSettings(id: $id)
        }
    `;
    return postGraphqlQuery(graphqlMutation, id);
  },

  async createProduct(createManageProductInput) {
    const graphqlQuery = `
            mutation createManageProduct($dto: CreateManageProductDto!) { 
                createManageProduct(createManageProductInput: $dto) { 
                    id 
                    name 
                    hsCode 
                    eudrDocumentCode 
                } 
            }
        `;
    return postGraphqlQuery(graphqlQuery, { dto: createManageProductInput });
  },
  async updateProduct(updateManageProductInput) {
    const graphqlQuery = `
            mutation updateManageProduct($dto: UpdateManageProductDto!) { 
            updateManageProduct(updateManageProductInput: $dto) { 
                id 
                name 
                hsCode 
                eudrDocumentCode 
                } 
            }
        `;
    return postGraphqlQuery(graphqlQuery, { dto: updateManageProductInput });
  },
  async getProducts(filter = {}) {
    const graphqlQuery = `
            query manageProduct($filter: ManageProductFilterInput!) {
                manageProduct(filter: $filter) {
                    totalCount
                    count
                    rows {
                        id
                        name
                        hsCode
                        eudrDocumentCode
                        s3Key
                        subproductCount
                        productType
                        subproducts {
                            id
                            hsCode
                            name
                        }
                        createdAt
                    }
                }
            }
        `;
    return postGraphqlQuery(graphqlQuery, { filter });
  },

  async deleteProduct(id) {
    const graphqlQuery = `
            mutation deleteManageProduct($id: ID!) {
                deleteManageProduct(id: $id)
            }
        `;

    return postGraphqlQuery(graphqlQuery, { id });
  },
  async createSubproduct(createManageSubProductInput) {
    const graphqlQuery = `
            mutation createManageSubproduct($createManageSubProductInput: CreateManageSubproductDto!) { 
                createManageSubproduct(createManageSubProductInput: $createManageSubProductInput) { 
                    id
                } 
            }
        `;

    return postGraphqlQuery(graphqlQuery, { createManageSubProductInput });
  },
  async updateSubproduct(updateManageSubProductInput) {
    const graphqlQuery = `
            mutation updateManageSubproduct($updateManageSubProductInput: UpdateManageSubproductDto!) { 
                updateManageSubproduct(updateManageSubProductInput: $updateManageSubProductInput) { 
                    id
                    hsCode
                } 
            }
        `;

    return postGraphqlQuery(graphqlQuery, { updateManageSubProductInput });
  },
  async deleteSubproduct(id) {
    const graphqlQuery = `
            mutation deleteManageSubproduct($id: ID!) {
                deleteManageSubproduct(id: $id)
            }
        `;

    return postGraphqlQuery(graphqlQuery, { id });
  },
  async getSubProduct(filter) {
    const graphqlQuery = `
            query manageSubProduct($filter: ManageSubProductFilterInput!) {
                manageSubProduct(filter: $filter) {
                    totalCount
                    count
                    rows {
                        id
                        name
                        hsCode
                        eudrDocumentCode
                        s3Key
                        productId
                        subProductType
                    }
                }
            }
        `;

    return postGraphqlQuery(graphqlQuery, { filter });
  },
  async createDocumentCode(createDocumentCodeInput) {
    const graphqlQuery = `
            mutation createDocumentCode($dto: CreateDocumentCodeDto!) { 
                createDocumentCode(createDocumentCodeInput: $dto) { 
                    id 
                } 
            }
        `;

    return postGraphqlQuery(graphqlQuery, { dto: createDocumentCodeInput });
  },
  async getDocumentCodes() {
    const graphqlQuery = `
            query {
                documentCodes {
                    id
                    title
                    documentCode
                    description
                }
            }
        `;

    return postGraphqlQuery(graphqlQuery, {});
  },
  async getProductById(id) {
    const graphqlQuery = `query manageProductById($id: ID!) {
        manageProductById(id: $id) {
            id
            name
            subproducts {
                id
            }
        }
    }`;
    return postGraphqlQuery(graphqlQuery, { id });
  },
  async createBlendDds(createBlendInput) {
    const graphqlQuery = `
      mutation createBlend($input: CreateBlendInput!) {
        createBlend(createBlendInput: $input) {
          id
          name
          blendCode
          blendLotId
          finishedProductLotId
          internalReferenceNumber
          netMass
          volume
          companyId
          countryOfEntry
          blendProducts {
            exemptProductId
            productType
          }
        }
      }
    `;
    return postGraphqlQuery(graphqlQuery, { input: createBlendInput });
  },

  async listBlends(paginationOptions) {
    const graphqlQuery = `
      query findAllBlends($paginationOptions: BlendListFilterInput!) {
          findAllBlends(filter: $paginationOptions) {
            rows {
              id
              name
              blendLotId
              totalNetMass
              totalVolume
              numberOfIngredients
              totalFarmCount
              internalReferenceNumber
              countryOfEntry
              eudrReferenceNumber
              blendStatus
            }
            totalCount
            count
          }
        }
      `;
    const variables = {
      paginationOptions: {
        limit: paginationOptions.limit,
        page: paginationOptions.page,
        search: paginationOptions.search,
        searchByCountry: paginationOptions.searchByCountry,
        blendStatus: paginationOptions.blendStatus,
        sortBy: paginationOptions.sortBy,
        order: paginationOptions.order,
      },
    };    
    return postGraphqlQuery(graphqlQuery, variables);
  },
  async getAllUploadHistory(filter = {}) {
    const graphqlQuery = `
        query getAllBulkUploadHistory($filter: BulkUploadHistoryInput!) {
            getAllBulkUploadHistory(filter: $filter) {
                totalCount
                rows {
                    id
                    location
                    originalFileName
                    createdAt
                    status
                }
            }
        }
    `;
    return postGraphqlQuery(graphqlQuery, { filter });
  },
  async postBlendsBulkUpload(file, data) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("organizationId", data.organizationId);
    formData.append("userId", data.userId);

    try {
      const URL = `${process.env.VUE_APP_DEFORESTRATION_API_BASE_URL}/admin/blends/bulk-upload`
      const response = await axios.post(
        URL,
        formData,
        {
          headers: {
            Authorization: data.token, 
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  
  async duplicateBlend(id) {
    const graphqlMutation = `
        mutation DuplicateBlend($id: Int!) {
        duplicateBlend(id: $id){
            id
          }
        }
    `;
    return postGraphqlQuery(graphqlMutation, { id });
    },

  async deleteBlend(id) {
    const graphqlMutation = `
        mutation DeleteBlend($id: Int!) {
          deleteBlend(id: $id)
        }
    `;
    return postGraphqlQuery(graphqlMutation, { id });
  },    
    
  async getBlendById(id) {
    const graphqlQuery = `
        query getBlend ($id: ID!) {
            blend(id: $id) {
            id
            netMass
            volume
            internalReferenceNumber
            eudrReferenceNumber
            countryOfActivity
            countryOfEntry
            blendLotId
            finishedProductLotId
            activity
            blendStatus
            companyId
            userId
            createdAt
            userData{
                id,
                firstName,
                lastName,
                address,
                district,
                village,
                countryIsoCode,
                eori_number,
                countryId
            }
            blendProducts {
              id
              index
              product {
                id
                name
              }
              subProduct {
                id
                name
              }
              exemptProduct {
                id
                internalReferenceNumber
                createdAt
                containerIds {
                  containerId
                }
                productDetail {
                  name
                }
                
              }
              ddr {
                id
                activity
                internalReferenceNumber
                status
                createdAt
                product_detail {
                  name
                }
              }
            }
            containerIds {
              containerId
            }
            blendSetting {
              id
              blendTitle
              blendCode
              blendDescription
              finalProductName
              finalProductCode
              processType
              
            }
          }
          
        }
    `;

    return postGraphqlQuery(graphqlQuery, { id });
  },

  async listBlendProducts({ filter }) {
    const graphqlQuery = `
      query blendProducts ($filter: BlendProductFilter!) {
        blendProducts(filter: $filter) {
          rows {
            id
            productName
            EUDRReferenceNumber
            internalReferenceNumber
            productNetMass
            containerId
            status
            productionPlaceCount
            productType
            createdAt
            availability
          }
          totalCount
          count
      }
    }
    `;

    return postGraphqlQuery(graphqlQuery, { filter });
  },
  async updatedBlendDds(updateBlendInput) {
    const graphqlQuery = `
      mutation updateBlend($id: Int!, $input: UpdateBlendInput!) {
        updateBlend(id: $id, input: $input) {
          id
          name
          blendCode
          blendLotId
          finishedProductLotId
          internalReferenceNumber
          netMass
          volume
          companyId
          countryOfEntry
          blendProducts {
            id
            exemptProductId
            productType
          }
        }
      }
    `;
    
    // Ensure `id` is included and the `updateBlendInput` has all required fields
    if (!updateBlendInput.id) {
      throw new Error("The 'id' field is required in the updateBlendInput.");
    }
  
    // Extract `id` from `updateBlendInput` for GraphQL variables
    const { id, ...input } = updateBlendInput;
  
    return postGraphqlQuery(graphqlQuery, { id, input });
  },

  async reportSummary(ddrId) {
    const graphqlQuery = `
      query findReport($ddrId: [Int!]!) {
        findReportByDdrId(ddrId: $ddrId) {
          totalFarmCount
          totalDDSReports
          totalPolygonProductionPlaces
          totalPointProductionPlaces
          totalArea
          totalDeforestationAssessments
          totalHighDeforestationProductionPlaces
          totalLowAndZeroRiskFarms
          totalAreaLowAndZeroRiskFarms
          totalUnknownDeforestationProductionPlaces
          totalRiskAssessments
          finalAverageGeofenceArea
          totalAreaHighRiskFarms
        }
      }
    `;
  
    return postGraphqlQuery(graphqlQuery, { ddrId });
  },
  async getProductionPlace({ filter }) {
    const graphqlQuery = `
      query productionPlace($filter: ProductionPlaceFilterInput!) {
        productionPlaces(filter: $filter) {
          rows {
            id
            eudr_deforestation_status
            all_risk_assessments {
                id
                riskAssessmentStatus
            }
            farmId
            diligenceReports {
              product_detail {
                name
              }
              product
              id
            }
            farm {
              farmName
              farmType
              address
              userDdsAssoc {
                firstName
                lastName
              }
            }
          }
          totalCount
        }
      }
    `;

    return postGraphqlQuery(graphqlQuery, { filter });
  },

  async getBlendFinalReportJson(blendId){
     const response = await axios.get(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/blend-report/json/blend/${blendId}`)
     return response.data
  }
  
  
};
