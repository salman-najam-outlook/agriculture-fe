import { postGraphqlQuery } from "./GraphQLService";

export default {
  async createDiligenceReport(createDiligenceReportInput) {
    const graphqlQuery = `
                mutation CreateDiligenceReport($createDiligenceReportInput:DiligenceReportInput!){
                    createDiligenceReport(createDiligenceReportInput:$createDiligenceReportInput){
                        id
                        
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, { createDiligenceReportInput });
  },

  async createQuestionHeading(createAssessmentQuestionHeadingInput) {
    const graphqlQuery = `
                mutation CreateQuestionHeading($createAssessmentQuestionHeadingInput:CreateAssessmentQuestionHeadingInput!){
                    createQuestionHeading(createAssessmentQuestionHeadingInput:$createAssessmentQuestionHeadingInput){
                        id
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, {
      createAssessmentQuestionHeadingInput,
    });
  },

  async updateQuestionHeading(updateQuestionHeading) {
    const graphqlQuery = `
                mutation UpdateQuestionHeading($headingId:Int!, $assessmentHeadingTitle:String!){
                    updateHeading(headingId:$headingId,assessmentHeadingTitle:$assessmentHeadingTitle ){
                        id
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, {
      headingId: updateQuestionHeading.headingId,
      assessmentHeadingTitle: updateQuestionHeading.title
    });
  },

  async findQuestionDetail(assessmentId, questionId) {
    const graphqlQuery = `
      query FindQuestionDetail($assessmentId:Int!,$questionId:Int!){
        findQuestionDetail(assessmentId:$assessmentId,questionId:$questionId){
          id
          userId
          headingId
          title
          assessmentQuestionType
          isMandatory
          isEnabled
          hasOptions
          isFileType
          fileTypeAdditionalSettings {
            allowedFileTypes
            allowMultipleAttachments
            allowComments
          }
          isDigitalSignatureType
          digitalSignatureTypeAdditionalSettings {
            uploadSignatureFile
            drawSignature
          }
          options {
            id
            label
            value
            checklists
            subQuestions {
              id
              userId
              title
              assessmentQuestionType
              isMandatory
              isEnabled
              hasOptions
              isFileType
              fileTypeAdditionalSettings {
                allowedFileTypes
                allowMultipleAttachments
                allowComments
              }
              isDigitalSignatureType
              digitalSignatureTypeAdditionalSettings {
                uploadSignatureFile
                drawSignature
              }
              options {
                label
                value
                checklists
              }
            }
          }
        }
      }
    `;

    assessmentId = parseInt(assessmentId);
    questionId = parseInt(questionId);

    return postGraphqlQuery(graphqlQuery, {
      assessmentId,
      questionId
    });
  },

  async findAllQuestionsOfAssessment(getAllQuestionListInput) {
    //  assessmentId
    // headingId
    const graphqlQuery = `
      query FindAllQuestionsOfAssessment($getAllQuestionListInput:GetAllQuestionListInput!){
          findAllQuestionsOfAssessment(getAllQuestionListInput:$getAllQuestionListInput){
              count
              totalCount
              rows{
                  id
                      order
                      userId
                      title
                      assessmentQuestionType
                      isMandatory
                      isEnabled
                      hasOptions
                      isFileType
                      fileTypeAdditionalSettings{
                          allowedFileTypes
                          allowMultipleAttachments
                          allowComments
                      }
                      isDigitalSignatureType
                      digitalSignatureTypeAdditionalSettings{
                          uploadSignatureFile
                      }
                      options{
                          id
                      }
              }
              
          }
      }
    `;

    return postGraphqlQuery(graphqlQuery, { getAllQuestionListInput });
  },

  async findAllQuestionsOfAssessmentByHeading(getAllQuestionListInput) {
    // assessmentId
    // headingId
    const graphqlQuery = `
        query FindAllQuestionsOfAssessmentByHeading($getAllQuestionListInput:GetAllQuestionListInput!){
            findAllQuestionsOfAssessmentByHeading(getAllQuestionListInput:$getAllQuestionListInput){
                count
                totalCount
                rows{
                    id
                    assessmentId
                    title
                    order
                    assessmentQuestions{
                        id
                        order
                        userId
                        title
                        assessmentQuestionType
                        isMandatory
                        isEnabled
                        hasOptions
                        isFileType
                        fileTypeAdditionalSettings{
                            allowedFileTypes
                            allowMultipleAttachments
                            allowComments
                        }
                        isDigitalSignatureType
                        digitalSignatureTypeAdditionalSettings{
                            uploadSignatureFile
                        }
                        options{
                            id
                        }
                    }
                }
                
            }
        }
    `;

    return postGraphqlQuery(graphqlQuery, { getAllQuestionListInput });
  },

  async assessmentDetail(id) {
    const graphqlQuery = `
                query AssessmentDetail($id:Int!){
                    assessmentDetail(id:$id){
                          id
                          title
                          description
                          noOfQuestions
                          noOfResponse
                          status
                          countries
                          isApplicableToSelectedUsersOnly
                          totalHeadings
                          totalQuestions
                          assessmentQuestions {
                            id
                          }
                          assessmentQuestionHeading {
                            id
                          }
                          assessmentSelectedUsers{
                              userId
                          }
                          assessmentSettings {
                              expiryDate
                              isScheduled
                              scheduleDate
                              scheduledEndDate
                              isMultiStep
                              multiStepType
                              noOfQuestion
                              allowMultipleEntries
                          }
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, { id });
  },

  async createAssessmentQuestion(createAssessmentQuestionInput) {
    const graphqlQuery = `
      mutation CreateNewAssessmentQuestions ($createAssessmentQuestionInput: CreateAssessmentQuestionInput!) {
      createNewAssessmentQuestions (createAssessmentQuestionInput: $createAssessmentQuestionInput) {
        id
        assessmentId {
            id
            orgId
            userId
            title
            countries
            description
            status
            isApplicableToSelectedUsersOnly
            assessmentSelectedUsers {
              id
            }
            assessmentSettings {
              expiryDate
              isScheduled
              scheduleDate
              isMultiStep
              multiStepType
              noOfQuestion
              allowMultipleEntries
            }
        }
        order
        userId
        title
        assessmentQuestionType
        isMandatory
        isEnabled
        hasOptions
        isFileType
        fileTypeAdditionalSettings {
          allowedFileTypes
          allowMultipleAttachments
          allowComments
          
        }
        isDigitalSignatureType
        digitalSignatureTypeAdditionalSettings {
          uploadSignatureFile
          drawSignature
        }
        options {
          id
          label
          value
          checklists
          assessmentQuestionId
          subQuestions {
            id
            assessmentId {
              id
            }
            order
            userId
          }
        }
      }
    }
    `
    return postGraphqlQuery( graphqlQuery, {createAssessmentQuestionInput})
  },
  async updateAssessmentQuestion(id, createAssessmentQuestionInput) {
    const graphqlQuery = `
      mutation UpdateAssessmentQuestions ($id: Int!, $createAssessmentQuestionInput: CreateAssessmentQuestionInput!) {
        updateAssessmentQuestion (id: $id, createAssessmentQuestionInput: $createAssessmentQuestionInput) {
          id
        }
      }
    `;
    return postGraphqlQuery( graphqlQuery, {id, createAssessmentQuestionInput});
  },
  async removeAssessmentQuestion(id) {
    const graphqlQuery = `
      mutation RemoveAssessmentQuestion($id:Int!) {
        removeAssessmentQuestion(id:$id)
      }
    `;

    return postGraphqlQuery(graphqlQuery, {
      id
    });
  },
  async removeAssessmentHeading(id) {
    const graphqlQuery = `
      mutation RemoveAssessmentHeading($id:Int!) {
        removeAssessmentHeading(id:$id)
      }
    `;

    return postGraphqlQuery(graphqlQuery, {
      id
    });
  },
  async reorderHeading(assessmentId, headingId, newOrder) {
    const graphqlQuery = `
                mutation ReorderHeading($assessmentId:Int!,$headingId:Int!,$newOrder:Int!){
                    reorderHeading(assessmentId:$assessmentId,headingId:$headingId,newOrder:$newOrder)
                }
            `;

    return postGraphqlQuery(graphqlQuery, {
      assessmentId,
      headingId,
      newOrder,
    });
  },

  async reorderQuestion(assessmentId, questionId, newOrder) {
    const graphqlQuery = `
                mutation ReorderQuestion($assessmentId:Int!,$questionId:Int!,$newOrder:Int!){
                    reorderQuestion(assessmentId:$assessmentId,questionId:$questionId,newOrder:$newOrder)
                }
            `;

    return postGraphqlQuery(graphqlQuery, {
      assessmentId,
      questionId,
      newOrder,
    });
  },

  async getAssessmentHeadingList(assessmentId, search) {
    const graphqlQuery = `
                query GetAssessmentHeadingList($assessmentId:Int!,$search:String){
                    getAssessmentHeadingList(assessmentId:$assessmentId,search:$search){
                        id
                        assessmentId
                        title
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, { assessmentId, search });
  },

  async findAllQuestionsOfAssessmentByHeadingId(assessmentId, headingId) {
    const graphqlQuery = `
                query FindAllQuestionsOfAssessmentByHeadingId($assessmentId:Int!,$headingId:Int!){
                    findAllQuestionsOfAssessmentByHeadingId(assessmentId:$assessmentId,headingId:$headingId){
                        count
                        totalCount
                        rows{
                            id
                            assessmentId
                            title
                            order
                            assessmentQuestions{
                                id
                               
                                order
                                userId
                                title
                                assessmentQuestionType
                                isMandatory
                                isEnabled
                                hasOptions
                                isFileType
                                fileTypeAdditionalSettings{
                                    allowedFileTypes
                                    allowMultipleAttachments
                                    allowComments
                                }
                                isDigitalSignatureType
                                digitalSignatureTypeAdditionalSettings{
                                    uploadSignatureFile
                                }
                                options{
                                    id
                                }
                            }
                        }
                    }
                }
            `;

    return postGraphqlQuery(graphqlQuery, { assessmentId, headingId });
  },

  async findQuestionForSurvey(assessmentId) {
    const graphqlQuery = `query findQuestionForSurvey($assessmentId: Int!) {
        findQuestionForSurvey(assessmentId: $assessmentId) {
          count
          totalCount
          rows {
            title
            assessmentQuestions {
              id
              userId
              title
              assessmentQuestionType
              isMandatory
              isEnabled
              hasOptions
              isFileType
              fileTypeAdditionalSettings {
                allowedFileTypes
                allowMultipleAttachments
                allowComments
              }
              isDigitalSignatureType
              digitalSignatureTypeAdditionalSettings {
                uploadSignatureFile
                drawSignature
              }
              options {
                id
                label
                value
                checklists
                subQuestions {
                  id
                  userId
                  title
                  assessmentQuestionType
                  isMandatory
                  isEnabled
                  hasOptions
                  isFileType
                  fileTypeAdditionalSettings {
                    allowedFileTypes
                    allowMultipleAttachments
                    allowComments
                  }
                  isDigitalSignatureType
                  digitalSignatureTypeAdditionalSettings {
                    uploadSignatureFile
                    drawSignature
                  }
                  options {
                    label
                    value
                    checklists
                  }
                }
              }
            }
          }
        }
      }
      `;

    return postGraphqlQuery(graphqlQuery, { assessmentId });
  },

  async saveSurveyResponse(createSurveyResponseInput) {
    const graphqlQuery = `
        mutation SaveSurveyResponse($createSurveyResponseInput:CreateSurveyResponseInput!){
            saveSurveyResponse(createSurveyResponseInput:$createSurveyResponseInput){
                id
            }
        }
    `;

    return postGraphqlQuery(graphqlQuery, {
        createSurveyResponseInput,
    });
  },

  async getAllSurveyResponse(dueDiligenceId, assessmentId, userId, farmId) {
    const graphqlQuery = `
      query getAllSurveyResponse($dueDiligenceId:Int, $assessmentId:Int!, $userId:Int, $farmId:Int){
        findAllSurveyResponse(dueDiligenceId:$dueDiligenceId,assessmentId:$assessmentId,userId:$userId, farmId:$farmId){
          signatureS3Location
          signatureS3Key
          surveyResponses{
            id
            surveyId
            questionId
            questionDetail{
              userId
              title
              assessmentQuestionType
              isMandatory
              isEnabled
              hasOptions
              isFileType
              fileTypeAdditionalSettings {
                allowedFileTypes
                allowMultipleAttachments
                allowComments
              }
              isDigitalSignatureType
              digitalSignatureTypeAdditionalSettings {
                uploadSignatureFile
                drawSignature
              }
              options {
                id
                label
                value
                checklists
                subQuestions {
                  userId
                  title
                  assessmentQuestionType
                  isMandatory
                  isEnabled
                  hasOptions
                  isFileType
                  fileTypeAdditionalSettings {
                    allowedFileTypes
                    allowMultipleAttachments
                    allowComments
                  }
                  isDigitalSignatureType
                  digitalSignatureTypeAdditionalSettings {
                    uploadSignatureFile
                    drawSignature
                  }
                  options {
                    id
                    label
                    value
                    checklists
                  }
                }
              }
            }
            response{
              questionId
              questionHasOptions
              assessmentQuestionType
              textFieldAnswer
              numberFieldAnswer
              fileAndDigitalSignatureFieldAnswer{
                attachmentLink
                s3key
                comment
                uuid
              }
              selectedOptions{
                selectedOptionId
                optionValue
                subQuestionAnswerDetail{
                  questionId
                  assessmentQuestionType
                  questionHasOptions
                  textFieldAnswer
                  numberFieldAnswer
                  
                }
              }
            }
          }
        }
      }
    `;

    return postGraphqlQuery(graphqlQuery, {
      dueDiligenceId,
      assessmentId,
      userId,
      farmId
    });
  },

  async getAllUploadFiles(assessment_id, diligence_report_id, production_place_id) {
    const graphqlQuery = `query getAllUploadFiles($assessmentId:Int!, $diligenceReportId:Int!, $productionPlaceId: Int){
      getAllAssessmentFiles(assessmentId:$assessmentId, diligenceReportId:$diligenceReportId, productionPlaceId: $productionPlaceId){
          totalCount
          rows{
            id
            s3Key
            s3Location
            comment
            expiry_date
            assessment_id
            diligence_report_id
            production_place_id
          }
        }
      }
      `;
    return postGraphqlQuery(graphqlQuery, { assessmentId: parseInt(assessment_id), diligenceReportId: parseInt(diligence_report_id), productionPlaceId: parseInt(production_place_id) });
  },

  async removeAssessmentFile(payload){
    const { id, assessmentId, diligenceReportId, productionPlaceId } = payload;
    const graphqlQuery = `
      mutation removeAssessmentFile($id:Int!, $assessmentId: Int!, $diligenceReportId: Int!, $productionPlaceId: Int) {
        removeAssessmentFile(id:$id, assessmentId: $assessmentId, diligenceReportId: $diligenceReportId, productionPlaceId: $productionPlaceId){
          status
          message
        }
      }
    `;

    return postGraphqlQuery(graphqlQuery, {
      id,
      assessmentId,
      diligenceReportId,
      ...(productionPlaceId !== null && { productionPlaceId })
    });
  },

  async getAssessmentSummary(diligenceId, assessmentId, farmsList) {
    const graphqlQuery =  `
      query getAssessmentSummary($diligenceId: Int, $assessmentId: Int!, $farmsList: [Int!]!) {
        getAssessmentSummary(diligenceId:$diligenceId,assessmentId:$assessmentId, farmsList: $farmsList) {
          totalNoOfFarms
          assessmentsCompleted
          assessmentsPending
          requiredMitigation
        }
      }
    `;

    return await postGraphqlQuery(graphqlQuery, {
      diligenceId,
      assessmentId,
      farmsList
    });
  },

    async deleteResponseAttachment(responseId, attachmentUuid) {
    const graphqlQuery = `
      mutation DeleteResponseAttachment($responseId: Int!, $attachmentUuid: String!) {
        deleteResponseAttachment(responseId: $responseId, attachmentUuid: $attachmentUuid) {
          id
          response {
            fileAndDigitalSignatureFieldAnswer {
              uuid
              s3key
              attachmentLink
              comment
            }
          }
        }
      }
    `;

    return postGraphqlQuery(graphqlQuery, {
      responseId,
      attachmentUuid,
    });
  },
};
