import {axiosConfig, postGraphqlQuery} from "./GraphQLService";
import store from "../store/index"
import { withRetry, currentRoles } from '../utils';
import axios from "axios";
const DEFORESTRATION_API_BASE_URL = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "https://cf-deforestation.dimitra.dev/api";
const DEFORESTRATION_REPORTING_API_BASE_URL = process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL || "http://localhost:4000/api";
const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL || "https://sass-api-dev.dimitra.dev/api/admin";

const responseBodies = {
    dispute: `
        id
        productionPlaceId
        createdBy
        title
        description
        s3Key
        status
        initialPlantationDate
        s3Location
        deforestationReportRequestId
        comments {
            id
            disputeId
            commentedBy
            comment
            s3Key
            s3Location
            commenting_user {
                id
                cf_userid
                firstName
                lastName
                role
            }
            createdAt
            updatedAt
        }
        geofence {
            geofenceName
            geofenceRadius
            geofenceCenterLat
            geofenceCenterLog
            geofenceArea
            geofenceCoordinates {
                lat
                log
            }
        }
        creating_user {
            id
            cf_userid
            firstName
            lastName
            role
        }
        production_place {
            id
            farm {
                id
                farmName
                address
                registrationNo
            }
        }
        createdAt
        updatedAt
    `
};

export default {
    async getOverallProbability(opt) {
        const graphqlQuery = `
                query OverallProb($getDeforestationInput: GetCertificateInputAdmin!) {
                    overAllProb(getDeforestationInput: $getDeforestationInput) {
                        percent
                        label
                        colorCode
                        type
                    }
                }`;
        const getDeforestationInput = {
            search: opt.searcPhrase,
            page: opt.page,
            limit: opt.limit,
            isCertified: true,
            organization: opt.organization,
            adminReportType: "certification",
        };

        return postGraphqlQuery(graphqlQuery, { getDeforestationInput });
    },

    async downloadAssessment(assessmentId) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en';
        let encodedUrl = `/assessment-builder/pdf/download/${assessmentId}?`;
        try {
            const { data } = await axios.get(DEFORESTRATION_API_BASE_URL + encodedUrl, {
                responseType: "blob",
                headers: {
                    lang,
                }
            });
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error.response);
        }
    },

    async getComplianceCertifications(opt) {
        const graphqlQuery = `
            query DeforestationPagination($getDeforestationInput: GetCertificateInputAdmin!) {
                deforestationAdmin(getDeforestationInput: $getDeforestationInput) {
                totalCount
                rows{
                    id
                    farmName
                    locationName
                    createdAt
                    country,
                    state,
                    etherScanLink,
                    overallProb,
                    originalOverallProb,
                    overallProbColorCode
                  }
            }
        }`;
        const getDeforestationInput = {
            search: opt.searcPhrase,
            page: opt.page,
            limit: opt.limit,
            isCertified: true,
            organization: opt.organization,
            adminReportType: "certification"
        };

        return postGraphqlQuery(graphqlQuery, { getDeforestationInput });
    },


    async getComplianceDetails(id) {
        const query = `
            query complianceDetails($id:Int!){
                deforestation(id: $id) {
                    id,
                    farmId,
                    modelVersion,
                    farm {
                        id,
                        farmName,
                        lat,
                        log,
                        address,
                        area,
                        country,
                        state,
                        city,
                        registrationNo,
                        farmOwner,
                        farmerRegId
                        userDdsAssoc{
                         id
                         firstName
                         lastName
                        }
                        FarmCoordinates{
                            lat,
                            log
                        },
                        GeoFences{
                            id,
                            geofenceName,
                            geofenceArea,
                            geofenceCoordinates{
                                lat,
                                log
                            }
                        }
                    },
                    userId,
                    locationName,
                    zoneName,
                    reportGuid,
            
                    etherScanLink,
                    country,
                    state,
                    centerLatitude,
                    centerLongitude,
                    geofenceArea,
                    deforestationPercent,
                    deforestationArea,
                    treeGainPercent,
                    treeGainArea,
                    forestArea2020,
                    forestArea2020Percent,
                    forestArea2022,
                    forestArea2022Percent,
                    coordinates {
                        createdAt,
                        latitude,
                        longitude,
                        updatedAt,
                        __typename
                    },
                    sateliteResponse {
                        reportName,
                        imageHash,
                        satelliteSource,
                        imageName,
                        imagePath,
                        imgS3Key,
                        status,
                        createdAt,
                        updatedAt,
                        isDeleted
                    },
                    isDeleted,
                    isCertified,
                    isCertificateReady,
                    status,
                    createdAt,
                    updatedAt,
                    farmUUID,
                    farmerUUID,
                    radius,
                    referenceStartDate,
                    referenceEndDate,
                    farmRegistrationId
                    farmerRegistrationId,
                    reportType,
                    farmName,
                    farmerName,
                    treeUnchanged,
                    treeUnchangedPercent,
                    mediumProb,
                    veryHighProb,
                    veryLowProb,
                    mediumProbPercent,
                    veryHighProbPercent,
                    veryLowProbPercent,
                    highProb,
                    highProbPercent,
                    veryHighProb,
                    veryHighProbPercent,
                    mediumProb,
                    mediumProbPercent,
                    lowProb,
                    lowProbPercent,
                    veryLowProb,
                    veryLowProbPercent,
                    totalArea,
                    zeroProb,
                    zeroProbPercent
                    overallProb
                    originalOverallProb
                    overallProbColorCode
                    metrics {
                        label
                        colorCode
                        percent
                        area
                        colorName
                    }
                }
            }
        `;

        return postGraphqlQuery(query, { id });
    },

    async getDeforestationAssessmentByFarm(farmId) {
        const query = `
            query getDeforestationAssessmentByFarm($farmId:Int!){
                deforestationByFarmid(farmId: $farmId) {
                    id,
                    farmId,
                    farm {
                        id,
                        farmName,
                        lat,
                        log,
                        address,
                        area,
                        country,
                        state,
                        city,
                        registrationNo,
                        farmOwner
                        farmerRegId
                        userDdsAssoc{
                         id
                         firstName
                         lastName
                        }
                        FarmCoordinates{
                            lat,
                            log
                        },
                        GeoFences{
                            id,
                            geofenceName,
                            geofenceArea,
                            geofenceCoordinates{
                                lat,
                                log
                            }
                        }
                    },
                    userId,
                    locationName,
                    zoneName,
                    reportGuid,
            
                    etherScanLink,
                    country,
                    state,
                    centerLatitude,
                    centerLongitude,
                    geofenceArea,
                    deforestationPercent,
                    deforestationArea,
                    treeGainPercent,
                    treeGainArea,
                    forestArea2020,
                    forestArea2020Percent,
                    forestArea2022,
                    forestArea2022Percent,
                    coordinates {
                        createdAt,
                        latitude,
                        longitude,
                        updatedAt,
                        __typename
                    },
                    sateliteResponse {
                        reportName,
                        imageHash,
                        satelliteSource,
                        imageName,
                        imagePath,
                        imgS3Key,
                        status,
                        createdAt,
                        updatedAt,
                        isDeleted
                    },
                    isDeleted,
                    isCertified,
                    isCertificateReady,
                    status,
                    createdAt,
                    updatedAt,
                    farmUUID,
                    farmerUUID,
                    radius,
                    referenceStartDate,
                    referenceEndDate,
                    farmRegistrationId
                    farmerRegistrationId,
                    reportType,
                    farmName,
                    farmerName,
                    treeUnchanged,
                    treeUnchangedPercent,

                    highProb,
                    highProbPercent,
                    lowProb,
                    lowProbPercent,
                    totalArea,
                    zeroProb,
                    zeroProbPercent
                    overallProb
                    overallProbColorCode
                    metrics {
                        label
                        colorCode
                        percent
                        area
                        colorName
                    }
                    originalOverallProb
                }
            }
        `;

        return postGraphqlQuery(query, { farmId });
    },

    async getDeforestationAssessmentByCfFarmId(cfFarmId) {
        const query = `
            query getDeforestationAssessmentByCfFarmId($cfFarmId:Int!){
                deforestationByCfFarmid(cfFarmId: $cfFarmId) {
                    id,
                    farmId,
                    farm {
                        id,
                        farmName,
                        lat,
                        log,
                        address,
                        area,
                        country,
                        state,
                        city,
                        registrationNo,
                        farmOwner
                        farmerRegId
                        userDdsAssoc{
                         id
                         firstName
                         lastName
                        }
                        FarmCoordinates{
                            lat,
                            log
                        },
                        GeoFences{
                            id,
                            geofenceName,
                            geofenceArea,
                            geofenceCoordinates{
                                lat,
                                log
                            }
                        }
                    },
                    userId,
                    locationName,
                    zoneName,
                    reportGuid,
            
                    etherScanLink,
                    country,
                    state,
                    centerLatitude,
                    centerLongitude,
                    geofenceArea,
                    deforestationPercent,
                    deforestationArea,
                    treeGainPercent,
                    treeGainArea,
                    forestArea2020,
                    forestArea2020Percent,
                    forestArea2022,
                    forestArea2022Percent,
                    coordinates {
                        createdAt,
                        latitude,
                        longitude,
                        updatedAt,
                        __typename
                    },
                    sateliteResponse {
                        reportName,
                        imageHash,
                        satelliteSource,
                        imageName,
                        imagePath,
                        imgS3Key,
                        status,
                        createdAt,
                        updatedAt,
                        isDeleted
                    },
                    isDeleted,
                    isCertified,
                    isCertificateReady,
                    status,
                    createdAt,
                    updatedAt,
                    farmUUID,
                    farmerUUID,
                    radius,
                    referenceStartDate,
                    referenceEndDate,
                    farmRegistrationId
                    farmerRegistrationId,
                    reportType,
                    farmName,
                    farmerName,
                    treeUnchanged,
                    treeUnchangedPercent,

                    highProb,
                    highProbPercent,
                    lowProb,
                    lowProbPercent,
                    totalArea,
                    zeroProb,
                    zeroProbPercent
                    overallProb
                    overallProbColorCode
                    metrics {
                        label
                        colorCode
                        percent
                        area
                        colorName
                    }
                    originalOverallProb
                }
            }
        `;

        return postGraphqlQuery(query, { cfFarmId });
    },

    async getProductionPlaceByCfFarmId(cfFarmId) {
        const query = `
            query getProductionPlaceByCfFarmId($cfFarmId:Int!){
                productionPlaceByCfFarmid(cfFarmId: $cfFarmId) {
                    id,
                    farmId,
                    farm {
                        id,
                        farmName,
                        lat,
                        log,
                        address,
                        area,
                        country,
                        state,
                        city,
                        registrationNo,
                        farmOwner,
                        farmerRegId,
                        userDdsAssoc{
                            id,
                            firstName,
                            lastName
                        },
                        FarmCoordinates{
                            lat,
                            log
                        },
                        GeoFences{
                            id,
                            geofenceName,
                            geofenceArea,
                            geofenceCoordinates{
                                lat,
                                log
                            }
                        }
                    },
                    farmType,
                    risk_assessment_status,
                    createdAt,
                    updatedAt,
                    diligenceReportProductionPlaceArray {
                        id,
                        diligenceReportId,
                        dueDiligenceProductionPlaceId,
                        removed,
                        isEdit,
                        isVerified,
                        productionPlaceDeforestationInfo {
                            id,
                            deforestationStatus,
                            deforestationReport {
                                id,
                                overallProb,
                                highProb,
                                highProbPercent,
                                lowProb,
                                lowProbPercent,
                                zeroProb,
                                zeroProbPercent,
                                totalArea,
                                deforestationPercent,
                                deforestationArea,
                                forestArea2020,
                                forestArea2020Percent,
                                forestArea2022,
                                forestArea2022Percent,
                                treeGainPercent,
                                treeGainArea,
                                treeUnchanged,
                                treeUnchangedPercent,
                                metrics {
                                    label,
                                    colorCode,
                                    percent,
                                    area,
                                    colorName
                                }
                            }
                        },
                        riskMitigationFiles {
                            id,
                            file_path
                        },
                        all_risk_assessments {
                            id,
                            riskAssessmentStatus,
                            assessmentId,
                            taggableId,
                            taggableType
                        }
                    },
                    diligenceReports {
                        id,
                        internalReferenceNumber,
                        supplierId,
                        product,
                        supplier {
                            id,
                            firstName,
                            lastName
                        },
                        product_detail {
                            id,
                            name
                        },
                        diligenceReportAssessment {
                            id,
                            assessment {
                                id,
                                title
                            }
                        }
                    },
                    risk_mitigation_files {
                        id,
                        file_path
                    },
                    all_risk_assessments {
                        id,
                        riskAssessmentStatus
                    },
                    dueDiligenceProductionPlacesPyData {
                        id,
                        indigenousArea,
                        protectedArea,
                        indigenousAreaTrans,
                        protectedAreaTrans,
                        dueDiligenceProductionManuallyMitigated {
                            id,
                            riskMitigationFile,
                            riskMitigationComment
                        }
                    },
                    productionPlaceDeforestationInfo {
                        id,
                        deforestationStatus,
                        deforestationReport {
                            id,
                            overallProb,
                            highProb,
                            highProbPercent,
                            lowProb,
                            lowProbPercent,
                            zeroProb,
                            zeroProbPercent,
                            totalArea,
                            deforestationPercent,
                            deforestationArea,
                            forestArea2020,
                            forestArea2020Percent,
                            forestArea2022,
                            forestArea2022Percent,
                            treeGainPercent,
                            treeGainArea,
                            treeUnchanged,
                            treeUnchangedPercent,
                            metrics {
                                label,
                                colorCode,
                                percent,
                                area,
                                colorName
                            }
                        }
                    }
                }
            }
        `;

        return postGraphqlQuery(query, { cfFarmId });
    },

    async getEUDRAssementReportsList(opt) {
        const graphqlQuery = `
            query DeforestationAssessmentReports($getDeforestationInput:GetCertificateInputAdmin!){
                deforestationAdmin(getDeforestationInput:$getDeforestationInput){
                    rows{
                        id,
                        farmName,
                        farmerName,
                        locationName,
                        geofenceArea,
                        createdAt,
                        status,
                        state,
                        country,
                        isCertified,
                        isCertificateReady,
                    }
                 totalCount
                }
            }
        `;
        const getDeforestationInput = {
            "search": opt.search,
            "page": opt.page,
            "limit": opt.limit,
            "organization": opt.organization,
            "adminReportType": "eudr-assessment"
        }
        return postGraphqlQuery(graphqlQuery, { getDeforestationInput });
    },

    async getDiligenceReports(opt) {

        const graphqlQuery = `
            query DiligenceReports($filter:DiligenceReportsFilterInput!){
                diligenceReports(filter:$filter){
                    rows{
                        id
                        status
                        statusLegends
                        supplierId
                        productionPlaceCount
                        statusLegends
                        whoAddPlaceData
                        countryOfProduction
                        requiredAssessment{
                            farm
                            id
                            type
                            assessment
                        }
                        companyID
                        EUDRReferenceNumber
                        internalReferenceNumber
                        activity
                        countryOfEntry
                        countryOfActivity
                        product
                        subProduct
                        productDescription
                        productNetMass
                        productVolume
                        productScientificName
                        productCommonName
                        productionPlaceCount
                        diligenceReportAssessment {
                            id @skip(if: false)
                        }
                        supplier{
                            id
                            firstName
                            lastName
                        }
                        dueDiligenceProductionPlaces{
                            farmId
                        }
                        operator {
                            id
                            firstName
                            lastName
                        }
                        product_detail {
                            id
                            name
                        }
                        requestAdditionalInformation{
                            id
                            description
                            selectedStep
                            shareAccess
                            cfUserId
                            dueDiligenceReportId
                            supplierId
                            userId
                            description
                        }
                        organizationId
                        createdAt
                        updatedAt
                        current_step
                        assignedTo
                        assignedToCfId
                        assignedToUser{
                            firstName
                            lastName
                        }
                        ddsReportExporter {
                          id
                          exporter_cf_id
                        }
                        shipment {
                          id
                          shipment_refrence_number
                          status
                        }
                    }
                 totalCount
                }
            }
        `;
        const filter = {
            page: opt.page,
            limit: opt.limit,
            country: opt.country,
            status: opt.status,
            searchPhrase: opt.searchPhrase,
            supplierId: opt?.supplierId,
            operatorId:opt?.operatorId,
            cfroles: opt?.cfroles,
            statuses: opt?.statuses,
            statusLegendsArray: opt?.statusLegendsArray,
            isPtsiApproval: opt?.isPtsiApproval,
            searchByReportId: opt?.searchByReportId,
            // Support for multiple selections
            exporterIds: opt?.exporterIds,
            supplierIds: opt?.supplierIds,
            assignedToIds: opt?.assignedToIds,
            // Keep backward compatibility with single selections
            exporterId: opt?.exporterId,
            assignedTo: opt?.assignedTo,
            assignedToMe: opt?.assignedToMe,
            cooperativeId: opt?.cooperativeId,
            // Dashboard filter parameters
            filterType: opt?.filterType,
            startDate: opt?.startDate,
            endDate: opt?.endDate,
            products: opt?.products,
            region: opt?.region,
        };

        return postGraphqlQuery(graphqlQuery, { filter });
    },


    async getEUDRAssessmentReportDetail(id) {
        return await this.getComplianceDetails(id);
    },

    async downloadCompliancePdf(formData) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en'
        return new Promise((resolve, reject) => {
            axios.post(DEFORESTRATION_API_BASE_URL + `/deforestation/compliance/pdf-download`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: axiosConfig.headers.authorization,
                    "lang": lang
                }
            }).then(async ({ data }) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    async downloadAssessmentReportPdf(formData) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en';
        return new Promise((resolve, reject) => {
            axios.post(DEFORESTRATION_API_BASE_URL + `/deforestation/assessment/pdf-download`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: axiosConfig.headers.authorization,
                    lang,
                }
            }).then(async ({ data }) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    async getProductList() {
        const graphqlQuery = `
                query DeforestationProductList {
                    deforestationProductList {
                        id,
                        name,
                        subproducts {
                            id,
                            name,
                        }
                    }
                }
            `;

        try {
            const result = await postGraphqlQuery(graphqlQuery);
            return result;
        } catch (error) {
            console.error('Error in getProductList:', error);
            throw error;
        }
    },

    async getSupplierList(role = 'supplier') {
        const graphqlQuery = `
            query GetSupplierList ($role: String!) {
                findAllSuppliersOrOperators(role:$role) {
                    id,
                    firstName,
                    lastName,
                    email,
                    countryCode,
                    countryId,
                    countryIsoCode,
                    mobile,
                    verified,
                    cf_userid,
                    role
                    eori_number
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { role });
    },

    async getAssessmentList() {
        const graphqlQuery = `
                query GetAssessmentList {
                    getAssessmentList {
                        id,
                        status,
                        title,
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery);
    },

    async concludeDiligenceReportByStatusWarnings(reportId){
        const qry = `
          query getConcludeDiligence($filter:DiligenceReportConcludeStatusInput!) {
                concludeDigilienceReportStatus(filter:$filter){
                    deforestationStatusOtherThanZeroCount,
                    riskAssessmentStatusOtherThanZeroCount,
                    graterThanFourHectorCount,
                    farmCreatedInOceanCount,
                    farmCreatedInDifferentLocationCount,
                    geofenceNotCheckYetCount,
                }
            }
        `
        return postGraphqlQuery(qry, { filter: { reportId } })
    },

    async getDiligenceDetail(id) {
        const graphqlQuery = `
        query GetDiligenceDetail($id:Int!){
            getDiligenceDetail(id:$id){
                        id
                        supplierId
                        userId
                        is_dds_status_update
                        is_report_concluded
                        operatorId
                        whoAddPlaceData
                        pointFarmDefaultArea
                        countryOfProduction
                        enableRegionalRiskAssessment
                        enableRiskAssessmentCriteria
                        containerIds
                        enableProtectedAndIndigenousAreas
                        blockchainPublishDate
                        requiredAssessment{
                            farm
                            id
                            type
                            assessment
                        }
                        companyID
                        EUDRReferenceNumber
                        internalReferenceNumber
                        activity
                        countryOfEntry
                        countryOfActivity
                        product
                        comments
                        eudrVerificationNo
                        isGeolocationPrivate
                        subProduct
                        productDescription
                        productNetMass
                        productVolume
                        productScientificName
                        productCommonName
                        status
                        statusLegends
                        productionPlaceSource
                        eudrAssessmentType
                        diligenceReportAssessment{
                            id
                              diligence_id
                              user_id
                              assessment_id
                              existing_survey
                              placement
                              assessment{
                                title
                              }
                        }
                        user{
                            firstName
                            lastName
                            email
                            mobile
                            countryId
                            cf_userid
                            countryIsoCode
                            eori_number
                        }
                        supplier {
                            id
                            firstName
                            lastName
                            email
                            mobile
                            countryId
                            cf_userid
                            countryIsoCode
                        }
                        operator {
                            id
                            firstName
                            lastName
                            email
                            mobile
                            countryId
                            countryIsoCode
                            eori_number
                            cf_userid
                        }
                        ddsReportExporter {
                          id
                          exporter_cf_id
                          exporter_id 
                          shared_by
                          shared_by_cf_id
                        }
                        polygonProductionPlaces
                        pointProductionPlaces
                        totalArea
                        totalProductionPlaces
                        totalHighDeforestationProductionPlaces
                        totalDeforestationAssessments
                        transaction {
                            transactionHash
                        }
                        product_detail {
                        id
                        name
                        }
                        encId
                        blockchainLink
                        current_step
                        riskWarnings {
                            id
                            count
                            assessmentName
                            currentStep
                        }
                        enableRiskWarningPopupNotifications
                        enableOnScreenRiskWarnings
                        assignedTo
                        assignedToCfId
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { id });
    },

    async disregardSummarySegment(id, enableRiskAssessmentCriteria, enableProtectedAndIndigenousAreas) {
        const graphqlQuery = `
            mutation DisregardSummarySegment(
                $id: Int!,
                $enableRiskAssessmentCriteria: Boolean!,
                $enableProtectedAndIndigenousAreas: Boolean!
            ) {
                disregardSummarySegment(
                    id: $id,
                    enableRiskAssessmentCriteria: $enableRiskAssessmentCriteria,
                    enableProtectedAndIndigenousAreas: $enableProtectedAndIndigenousAreas
                )
            }
        `;

        return postGraphqlQuery(graphqlQuery, {
            id,
            enableRiskAssessmentCriteria,
            enableProtectedAndIndigenousAreas,
        });
    },

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

    async createDiligenceReportBySupplier(createDiligenceReportInput) {
        const graphqlQuery = `
                mutation CreateDiligenceReportBySupplier($createDiligenceReportInput:DiligenceReportInputBySupplier!){
                    createDiligenceReportBySupplier(createDiligenceReportInput:$createDiligenceReportInput){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { createDiligenceReportInput });

    },

    async saveProductionPlaces(createProductionPlacesInput) {
        const graphqlQuery = `
            mutation CreateProductionPlaces($createProductionPlacesInput: CreateProductionPlacesInput!) {
                createProductionPlaces(createProductionPlacesInput: $createProductionPlacesInput){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { createProductionPlacesInput });
    },




    async updateDiligenceReport(updateDiligenceReportInput) {
        const graphqlQuery = `
                mutation UpdateDiligenceReport($updateDiligenceReportInput:DiligenceReportInput!){
                    updateDiligenceReport(updateDiligenceReportInput:$updateDiligenceReportInput){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { updateDiligenceReportInput });

    },

    async updateDueDiligenceReportBySupplier(updateDiligenceReportInput) {
        const graphqlQuery = `
                mutation UpdateDueDiligenceReportBySupplier($updateDiligenceReportInput:DiligenceReportInputBySupplier!){
                    updateDueDiligenceReportBySupplier(updateDiligenceReportInput:$updateDiligenceReportInput){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { updateDiligenceReportInput });

    },

    async deleteDiligenceReport(id) {
        const graphqlQuery = `
                mutation DeleteDiligenceReport($id:Int!){
                    deleteDiligenceReport(id:$id){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { id });

    },

    async removeRequestAdditionalInformationByDiligenceId(dueDiligenceReportId) {
        const graphqlQuery = `
            mutation RemoveRequestAdditionalInformation($dueDiligenceReportId: Int!) {
                removeRequestAdditionalInformationByDiligenceId(dueDiligenceReportId: $dueDiligenceReportId) {
                    success
                    message
                    deletedCount
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { dueDiligenceReportId });
    },

    shareReportToOperator(diligenceReportInput) {
        const graphqlQuery = `  
        mutation ShareReportToOperator($diligenceReportInput: ShareReportOperatorInput!) {
            shareReportToOperator(diligenceReportInput: $diligenceReportInput) {
            id
            operatorId
            }
        }
        `;
        return postGraphqlQuery(graphqlQuery, { diligenceReportInput });
    },

    async duplicateDiligenceReport(id) {
        const graphqlQuery = `
                mutation DuplicateDiligenceReport($id:Int!){
                    duplicateDiligenceReport(id:$id){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { id });

    },

    async changeStatusOfDiligenceReport(changeStatusOfDiligenceReportInput) {
        const graphqlQuery = `
                mutation ChangeStatusOfDiligenceReport($changeStatusOfDiligenceReportInput:ChangeStatusOfDiligenceReportInput!){
                    changeStatusOfDiligenceReport(changeStatusOfDiligenceReportInput:$changeStatusOfDiligenceReportInput){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { changeStatusOfDiligenceReportInput });

    },


    async updateWhoAddsPlaceDataInDiligenceReport(updateWhoAddPlaceDataInput) {
        const graphqlQuery = `
                mutation updateWhoAddsPlaceDataInDiligenceReport($updateWhoAddPlaceDataInput:UpdateWhoAddPlaceDataInput!){
                    updateWhoAddsPlaceDataInDiligenceReport(updateWhoAddPlaceDataInput:$updateWhoAddPlaceDataInput){
                        id
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { updateWhoAddPlaceDataInput });

    },

    async updateDDSUser(updateUserInput) {
        const graphqlQuery = `
            mutation updateUserDDS($updateUserInput: UpdateUserInput!) {
                updateUserDDS(updateUserInput: $updateUserInput) {
                    id
                    cf_userid
                    firstName
                    lastName
                    countryCode
                    mobile
                    email
                    unverifiedMobile
                    unverifiedEmail
                    password
                    language
                    countryId
                    stateId
                    district
                    village
                    otp
                    businessName
                    address
                    fax
                    website
                    localPremiseId
                    federalPremiseId
                    userType
                    registration_type
                    pushNotification
                    notificationSound
                    isLogin
                    verified
                    active
                    profilePicUrl
                    profilePicS3Key
                    profilePicName
                    organization
                    loginAttempts
                    lockedToken
                    role
                    eori_number
                    companyId
                    licenseNumber
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { updateUserInput });
    },

    async currentUserDeforestation() {
        const graphqlQuery = `
            query currentUserDDS {
                currentUserDDS {
                    userDetail {
                        id
                        cf_userid
                        firstName
                        lastName
                        countryCode
                        mobile
                        email
                        unverifiedMobile
                        unverifiedEmail
                        password
                        language
                        countryId
                        stateId
                        district
                        village
                        otp
                        businessName
                        address
                        fax
                        website
                        localPremiseId
                        federalPremiseId
                        userType
                        registration_type
                        pushNotification
                        notificationSound
                        isLogin
                        verified
                        active
                        profilePicUrl
                        profilePicS3Key
                        profilePicName
                        organization
                        loginAttempts
                        lockedToken
                        role
                        eori_number
                        companyId
                        licenseNumber
                    }
                }
            }
        `

        return postGraphqlQuery(graphqlQuery);
    },

    async addProducer(producerInput){
        const graphQl = `
            mutation addProducer($producerInput: ProducerAddInput!) {
                addProducer(producerInput:$producerInput){
                    success
                    message
                }
            }
        `
        return postGraphqlQuery(graphQl, { producerInput });
    },

    async deleteProducer(producerInput){
        const graphQl = `
         mutation deleteProducer($producerInput: ProducerEditInput!) {
            deleteProducer(producerInput:$producerInput){
                success
                message
                }
            }
        `
        return postGraphqlQuery(graphQl, { producerInput });
    },

    async editProducer(producerInput){
        const graphQl = `
         mutation editProducer($producerInput: ProducerEditInput!) {
            editProducer(producerInput:$producerInput){
              success
              message
           }
         }
        `
        return postGraphqlQuery(graphQl, { producerInput });
    },

    async getProducers(opt) {
        const graphqlQuery = `
            query getProducers($filter: ProducersFilterInput!) {
                getProducers(filter: $filter) {
                    count
                    totalCount
                    rows {
                        id
                        cf_userid
                        firstName
                        lastName
                        email
                        mobile
                        active
                        countryId
                        farms {
                            productionPlace {
                                id
                                dueDiligenceReportId
                                eudr_deforestation_status
                                risk_assessment_status
                                all_risk_assessments{
                                    id
                                    riskAssessmentStatus
                                }
                                updatedAt
                            }
                        }
                    }
                }
            }
        `;

        const filter = {
            page: opt.page,
            limit: opt.limit,
            country: opt.country,
            search: opt.search,
            supplierId: opt.supplierId,
            operatorId: opt.operatorId,
        }

        return postGraphqlQuery(graphqlQuery, { filter });
    },

    async getProductionPlaces(opt) {
        const graphqlQuery = `
            query ProductionPlaces($filter: ProductionPlaceFilterInput!) {
                productionPlaces(filter: $filter) {
                    count
                    totalCount
                    rows {
                        id
                        farmId
                        copyOf
                        isEdit
                        dueDiligenceReportId
                        diligenceReports {
                            supplierId
                            id
                            internalReferenceNumber
                            diligenceReportAssessment {
                            assessment {
                                id
                                title
                                description
                                status
                            }
                            placement
                            createdAt
                            }
                            supplier{
                                firstName
                                lastName
                            }
                        }
                        dueDiligenceProductionPlacesPyData {
                            id
                            indigenousArea
                            protectedArea
                            indigenousAreaTrans
                            protectedAreaTrans
                            dueDiligenceProductionManuallyMitigated {
                                id
                                riskMitigationFile,
                                riskMitigationComment
                            }
                        }
                        eudr_deforestation_status
                        warnings {
                        is_ocean
                        country
                        }
                        eudr_s3_key
                        eudr_s3_location
                        eudr_comment
                        risk_mitigation_comment,
                        disregard_status,
                        risk_mitigation_files{
                            id
                            file_path
                        }
                        assessment_production_place{
                            id
                            riskAssessmentStatus
                        }
                        all_risk_assessments{
                            id
                            riskAssessmentStatus
                        }
                        risk_assessment_status
                        removed
                        createdAt
                        farmType
                        farm {
                            id
                            cf_farmid
                            farmName
                            goal
                            registrationNo
                            lat
                            log
                            address
                            area
                            areaUomId
                            parameter
                            parameterUomId
                            farmOwnershipType
                            farmType
                            productionSystem
                            farmOwner
                            userId
                            country
                            state
                            city
                            govRegistrationNum
                            contractMating
                            cooperativeId
                            cooperativeName
                            licenceNum
                            licenceExpiryDate
                            regulatorName
                            houseNum
                            street
                            farmNumber
                            communityName
                            regulatorRepresentiveName
                            isDeleted
                            farmingActivity
                            clientId
                            createdAt
                            FarmCoordinates {
                                id
                                lat
                                log
                                farmId
                                userId
                            }
                            GeoFences {
                                id
                                userId
                                farmId
                                geofenceName
                                geofenceArea
                                geofenceAreaUOMId
                                geofenceParameter
                                geofenceParameterUOMId
                                walkAndMeasure
                                is_deleted
                                geofenceRadius
                                geofenceCenterLat
                                geofenceCenterLog
                                isPrimary
                                geofenceCoordinates {
                                    id
                                    lat
                                    log
                                }
                                generateMethod
                            }
                            userDdsAssoc {
                                id
                                cf_userid
                                firstName
                                lastName
                                countryCode
                                mobile
                                email
                                unverifiedMobile
                                unverifiedEmail
                                password
                                language
                                countryId
                                stateId
                                district
                                village
                                otp
                                businessName
                                address
                                fax
                                website
                                localPremiseId
                                federalPremiseId
                                userType
                                registration_type
                                pushNotification
                                notificationSound
                                isLogin
                                verified
                                active
                                profilePicUrl
                                profilePicS3Key
                                profilePicName
                                organization
                                loginAttempts
                                lockedToken
                                role
                            }
                        }
                        diligenceReportProductionPlaceArray {
                            id
                            isDisregarded
                            warnings
                            removed
                            isEdit
                            productionPlaceDeforestationInfo {
                                deforestationStatusDate
                                deforestationMitigationComment
                                deforestationStatus
                                lastDeforestationMitigationDate
                                lastDisputeResolvedDate
                                riskAssessmentStatus
                                deforestationReportRequestId
                                originalDeforestationStatusForTemporaryApproval
                                deforestationReport {
                                    id
                                    overallProb
                                    transactionHash
                                    errorStatus
                                }
                            }
                            riskMitigationFiles {
                                id
                                file_path
                            }
                            all_risk_assessments {
                                id
                                riskAssessmentStatus
                            }
                        }
                        productionPlaceDeforestationInfo {
                            deforestationStatusDate
                            deforestationMitigationComment
                            deforestationStatus
                            lastDeforestationMitigationDate
                            lastDisputeResolvedDate
                            riskAssessmentStatus
                            deforestationReportRequestId
                        }
                    }
                }
            }`;
        const filter = {
            page: opt.page,
            limit: opt.limit,
            diligenceReportId: opt.diligenceReportId,
            internalRefNum: opt.internalRefNum,
            supplierId: opt.supplierId,
            farmOwner: opt.farmOwner == 'All Producers' ? null : opt.farmOwner,
            eudrDeforestationStatus: opt.eudrDeforestationStatus == 'All Status' ? null : opt.eudrDeforestationStatus,
            riskAssessmentStatus: opt.riskAssessmentStatus,
            searchPhrase: opt.searchPhrase,
            farmCountry: opt.farmCountry == "All Countries" ? null : opt.farmCountry,
            farmerCountry:  opt.farmerCountry == "All Countries" ? null : opt.farmerCountry,
            removed: opt.removed,
            isEdit: opt.isEdit,
            isVerified: opt.isVerified,
            assessmentId: opt.assessmentId,
            cfRoles:currentRoles().join(','),
        };
        return postGraphqlQuery(graphqlQuery, { filter });
    },

    async removeFarmFromProductionPlaceListByStatus(opt) {
        const graphqlMutation = `
        mutation RemoveFarmFromProductionPlaceList($diligenceReportId: Int!,$eudrDeforestationStatus: String) {
            removeFarmFromProductionPlaceList(
                diligence_report_id: $diligenceReportId
                eudr_deforestation_status: $eudrDeforestationStatus
            ){
                success
                message
            }
        }
    `;

        const variables = {
            diligenceReportId: opt.diligenceReportId,
            eudrDeforestationStatus: opt.eudrDeforestationStatus
        };


        return postGraphqlQuery(graphqlMutation, variables);
    },

    async removeUnapprovedFarmFromProductionPlaceList(opt) {
        const graphqlMutation = `
        mutation removeUnapprovedFarmFromProductionPlaceList($diligenceReportId: Int!,  $assessmentId: Int!) {
            removeUnapprovedFarmFromProductionPlaceList(
                diligence_report_id: $diligenceReportId,
                assessment_id: $assessmentId
            ){
                success
                message
            }
        }
    `;

        const variables = {
            diligenceReportId: opt.diligenceReportId,
            assessmentId: opt.assessmentId
        };


        return postGraphqlQuery(graphqlMutation, variables);
    },

    async updateDisregardStatusForAssessmentProductionPlace(opt) {
        const graphqlMutation = `
        mutation updateDisregardStatusForAssessmentProductionPlace($dueDiligenceReportId: Int!, $assessmentId: Int!) {
            updateDisregardStatusForAssessmentProductionPlace(
                dueDiligenceReportId: $dueDiligenceReportId,
                assessmentId: $assessmentId
            ) {
                success
                message
            }
        }
    `;
    
        const variables = {
            dueDiligenceReportId: opt.dueDiligenceReportId,
            assessmentId: opt.assessmentId
        };
    
        return postGraphqlQuery(graphqlMutation, variables);
    },

    async removeFarmFromProductionPlaceListById(opt) {
        const graphqlMutation = `
        mutation RemoveFarmFromProductionPlaceList($diligenceReportId: Int!,$farmId: Int) {
            removeFarmFromProductionPlaceList(
                diligence_report_id: $diligenceReportId
                farm_id: $farmId
            ){
                success
                message    
            }
        }
    `;

        const variables = {
            diligenceReportId: opt.diligenceReportId,
            farmId: opt.farmId
        };


        return postGraphqlQuery(graphqlMutation, variables);
    },

    async removeFarmFromProductionPlaceListByProductionPlaceId(opt) {
        const graphqlMutation = `
        mutation RemoveFarmFromProductionPlaceList($productionPlaceId: Int!) {
            removeFarmFromProductionPlaceList(
                production_place_id: $productionPlaceId
            ){
                success
                message    
            }
        }
    `;

        const variables = {
            productionPlaceId: opt.production_place_id,
        };


        return postGraphqlQuery(graphqlMutation, variables);
    },


    async removeProductionPlaceByFarmId(opt) {
        const graphqlMutation = `
        mutation RemoveFarmFromProductionPlaceList($farmId: Int) {
            removeFarmFromProductionPlaceList(
                farm_id: $farmId
            ){
            success,
            message
            }
        }
    `;
        const variables = {
            farmId: opt.farmId
        };

        return postGraphqlQuery(graphqlMutation, variables);
    },

    async restoreProductionPlaceFarmById(opt) {
        const graphqlMutation = `
        mutation RestoreFarmToProductionPlaceList($diligenceReportId: Int!,$farmId: Int) {
            restoreFarmToProductionPlaceList(
                diligence_report_id: $diligenceReportId
                farm_id: $farmId
            )
        }
    `;

        const variables = {
            diligenceReportId: opt.diligenceReportId,
            farmId: opt.farmId
        };


        return postGraphqlQuery(graphqlMutation, variables);
    },

    async productionPlaceRiskMitigation(op) {
        const graphqlMutation = `
       mutation ProductionPlaceRiskMitigation($input: UpdateRiskMitigationInput!) {
            productionPlaceRiskMitigation(input: $input)
        }
    `;
        return postGraphqlQuery(graphqlMutation, { input: { ...op, id: Number(op.id) } });
    },

    async productionPlaceManuallyMitigated(op) {
        const graphqlMutation = `
            mutation ProductionPlaceManuallyMitigated($input: [UpdateManuallyMitigationInput!]!) {
                productionPlaceManuallyMitigated(input: $input)
            }
        `;
        return postGraphqlQuery(graphqlMutation, { input: op });
    },

    async removeRiskMitigationFile({ productionPlaceId, fileId }) {
    const graphqlMutation = `
        mutation removeRiskMitigationFile($productionPlaceId: Int!, $fileId: Int!) {
        removeRiskMitigationFile(productionPlaceId: $productionPlaceId, fileId: $fileId)
        }
    `;
    return postGraphqlQuery(graphqlMutation, { productionPlaceId, fileId });
    },

    async removeManuallyMitigatedFile({ fileId }) {
        const graphqlMutation = `
            mutation removeManuallyMitigatedFile($id: Int!) {
                removeManuallyMitigatedFile(id: $id)
            }
        `;
        return postGraphqlQuery(graphqlMutation, { id: fileId });
    },

    

    async findDisputesByQuery(opt) {
        const graphqlQuery = `
            query findProductionPlaceDisputes($filter:ProductionPlaceDisputeFilterInput!) {
                findProductionPlaceDisputes(filter:$filter) {
                    count
                    totalCount
                    rows {
                        ${responseBodies.dispute}
                    }
                }
            }`;
        const filter = { ...opt };

        return postGraphqlQuery(graphqlQuery, { filter });
    },

    async findDisputeById(id) {
        const graphqlMutation = `
            query findDisputeById($id:Int!) {
                findOneDispute(id:$id) {
                    ${responseBodies.dispute}
                }
            }
        `;

        id = parseInt(id);
        return postGraphqlQuery(graphqlMutation, { id });
    },


    async createDispute(createDisputeInput) {
        const graphqlMutation = `
            mutation createDispute($input:ProductionPlaceDisputeInput!) {
                createDispute(input:$input) {
                    ${responseBodies.dispute}
                }
            }
        `;
        return postGraphqlQuery(graphqlMutation, { input: createDisputeInput });
    },

    async updateDispute(id, updateDisputeInput) {
        const graphqlMutation = `
            mutation updateDispute($id:Int!,$input:UpdateProductionPlaceDisputeInput!) {
                updateDispute(id:$id,input:$input) {
                    ${responseBodies.dispute}
                }
            }
        `;
        id = parseInt(id);
        return postGraphqlQuery(graphqlMutation, {
            id,
            input: updateDisputeInput
        });
    },


    async createDisputeComment(op) {
        const graphqlMutation = `
            mutation CreateDisputeComment($input: DisputeCommentInput!) {
                createDisputeComment(input: $input){
                    id
                    disputeId
                    commentedBy
                    comment
                    s3Key
                    s3Location
                    commenting_user {
                        id
                        cf_userid
                        firstName
                        lastName
                        role
                    }
                }
            }
        `;
        const input = {
            disputeId: op.disputeId,
            commentedBy: op.commentedBy,
            comment: op.comment,
            s3Key: op.s3Key,
            s3Location: op.s3Location
        };
        return postGraphqlQuery(graphqlMutation, { input });
    },

    async deleteDisputeHistory(id) {
        id = parseInt(id);
        const graphqlMutation = `
            mutation deleteDispute($id:Int!) {
                deleteDispute(id:$id) {
                    id
                } 
            }
        `;
        console.log('DeforestationService -> deleteDisputeHistory -> id', id);
        return postGraphqlQuery(graphqlMutation, { id });
    },
    async importProductionPlace(formData, reportId) {
        return withRetry(() =>
            axios
                .post(`${DEFORESTRATION_API_BASE_URL}/production-place/import?dueDiligenceReportId=${reportId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: axiosConfig.headers.authorization,
                    },
                })
                .then((res) => {
                    return res.data;
                })
                .catch((error) => {
                    return error
                })
        );
    },

    async importCsvProductionPlace(formData, reportId) {
        return withRetry(() =>
            axios
                .post(`${DEFORESTRATION_API_BASE_URL}/production-place/import-csv?dueDiligenceReportId=${reportId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: axiosConfig.headers.authorization,
                    },
                })
                .then((res) => {
                    return res.data;
                })
                .catch((error) => {
                    return error
                })
        );
    },

    async importExcelProductionPlace(formData, reportId) {
        return withRetry(() =>
            axios
                .post(`${DEFORESTRATION_API_BASE_URL}/production-place/import-excel?dueDiligenceReportId=${reportId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: axiosConfig.headers.authorization,
                    },
                })
                .then((res) => {
                    return res.data;
                })
                .catch((error) => {
                    return error
                })
        );
    },

    async downloadDueDeligenceFinalReport(payload = { type: 'pdf' }) {
        return new Promise((resolve, reject) => {
            axios.post(`${DEFORESTRATION_API_BASE_URL}/due-diligence-final-report/download`, payload, {
                headers: {
                    authorization: axiosConfig.headers.authorization,
                },
                responseType: 'blob',
            })
                .then(res => {
                    console.log(res)
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'eudr-final-report-pdf.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }).catch((err) => {
                    reject(err);
                });
        });
    },

    async removeFarmFromProductionPlace(digligenceReportId, farmId) {
        const graphqlQuery = `
             mutation removeFarmFromProduction($digligenceReportId:Int!,$farmId:Int){
                removeFarmFromProductionPlaceList(diligence_report_id:$digligenceReportId, farm_id:$farmId){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { digligenceReportId, farmId });
    },

    async getUsesLimit(input) {
        const graphqlQuery = `
             query UsageLimits($input:UsesLimitInput!){
                usageLimits(input:$input){
                    id
                    organization_id
                    limit
                    report_type_id
                    report_type {
                        id
                        name
                    }
                    used
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },

    async updateDueDiligenceReport(updateProductionPlacesInput) {
        const graphqlQuery = `
               mutation updateDueDiligenceReport($updateProductionPlacesInput:UpdateProductionPlacesInput!){
                    updateDueDiligenceReport(updateProductionPlacesInput:$updateProductionPlacesInput){
                        success
                        message
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { updateProductionPlacesInput });

    },

    async fetchDDSFarms(payload) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en'
        return new Promise((resolve, reject) => {
            const { page, limit, search } = payload
            axios.get(DEFORESTRATION_API_BASE_URL + `/production-place/dds-farms?page=${page}&limit=${limit}&search=${search}`, {
                headers: {
                    "Content-Type": "application/json",                
                    authorization: axiosConfig.headers.authorization,
                    //salman
                    // 'oauth-token': axiosConfig.headers.authorization,
                    //salman
                    "lang": lang
                }
            }).then(async ({ data }) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    async fetchPublicReport(encId) {
        return new Promise((resolve, reject) => {
            axios.get(DEFORESTRATION_REPORTING_API_BASE_URL + '/diligence-report/public-report/' + encId, {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(async ({ data }) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    },

    async getBulkReport(input) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en'
        return new Promise((resolve, reject) => {
            axios.post(DEFORESTRATION_API_BASE_URL + `/deforestation/bulk-report`, input, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: axiosConfig.headers.authorization,
                    "lang": lang
                }
            }).then(async ({ data }) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    async getBulkReportByDiligenceId(id) {
        const lang = localStorage.getItem("LANGUAGE") ?? 'en';
        return withRetry(() => axios.post(DEFORESTRATION_API_BASE_URL + `/deforestation/bulk-report/diligence-reports/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                authorization: axiosConfig.headers.authorization,
                "lang": lang
            }
        }));
    },

    async getBulkReportStatusByRequestId(id) {
        return withRetry(() =>
            axios.get(DEFORESTRATION_API_BASE_URL + `/deforestation/bulk-report/${id}/status`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: axiosConfig.headers.authorization,
                },
            }),
            {
                retryDelay: 2000,
                retryTimes: 5,
            }
        );
    },

    async highRiskFarmRiskMitigation(op) {
        const graphqlMutation = `
       mutation HighRiskFarmsRiskMitigation($input: HighRiskFarmMitigationInput!) {
            highRiskFarmsRiskMitigation(input: $input){
                success
                message    
            }
        }`
        const input = {
            due_diligence_report_id: op.due_diligence_report_id,
            risk_mitigation_comment: op.risk_mitigation_comment,
            eudr_deforestation_status: op.eudr_deforestation_status,
            file: op.file,
        };
        return postGraphqlQuery(graphqlMutation, { input });

    },

    async getAllAssessment(getAllAssessmentListInput) {
        const graphqlQuery = `
        query FindAllAssessmentList($getAllAssessmentListInput: GetAllAssessmentListInput!) {
          findAllAssessmentList (getAllAssessmentListInput: $getAllAssessmentListInput) {
            count
            totalCount
            rows {
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
                isDefault
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
        }
      `
        return postGraphqlQuery(graphqlQuery, { getAllAssessmentListInput })
    },

    async getDefaultDimitraAssessments(getDefaultDimitraAssessmentsInput) {
        const graphqlQuery = `
          query GetDefaultDimitraAssessments($countries: [String!]) {
            getDefaultDimitraAssessments (countries: $countries) {
                  id
                  title
                  description
                  noOfQuestions
                  noOfResponse
                  status
                  countries
                  isApplicableToSelectedUsersOnly
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
        `
        return postGraphqlQuery(graphqlQuery, { countries: getDefaultDimitraAssessmentsInput.countries })
    },

    async removeAssessment(id) {
        const graphqlMutation = `
        mutation RemoveAssessment($id: Int!){
            removeAssessment(
                id: $id
            )
        }

    `;

        const variables = {
            id,
        };

        return postGraphqlQuery(graphqlMutation, variables);
    },

    async createNewAssessment(createAssessmentInput) {
        const graphqlQuery = `
      mutation CreateNewAssessment ($createAssessmentInput: CreateAssessmentInput!) {
        createNewAssessment (createAssessmentInput: $createAssessmentInput) {
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
            scheduledEndDate
            isMultiStep
            multiStepType
            noOfQuestion
            allowMultipleEntries
          }
        }
      }
      `
        return postGraphqlQuery(graphqlQuery, { createAssessmentInput })
    },

    async createFromDefaultAssessment(createFromDefaultAssessmentInput) {
        const graphqlQuery = `
        mutation CreateFromDefaultAssessment (
        $userId: Int!,
        $orgId: Int!,
        $defaultAssessmentIds: [Int!]!,
        ) {
          createFromDefaultAssessment (
          userId: $userId,
          orgId: $orgId,
          defaultAssessmentIds: $defaultAssessmentIds
          ) {
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
              scheduledEndDate
              isMultiStep
              multiStepType
              noOfQuestion
              allowMultipleEntries
            }
          }
        }
        `
        return postGraphqlQuery(graphqlQuery, { ...createFromDefaultAssessmentInput })
    },


    async updateAssessment(updateAssessmentInput) {
        const graphqlQuery = `
        mutation UpdateAssessment ($updateAssessmentInput: UpdateAssessmentInput!) {
          updateAssessment (updateAssessmentInput: $updateAssessmentInput) {
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
              scheduledEndDate
              isMultiStep
              multiStepType
              noOfQuestion
              allowMultipleEntries
            }
          }
        }
        `
        return postGraphqlQuery(graphqlQuery, { updateAssessmentInput })
    },
    async createEudrSettings(createEudrSettingInput) {
        const graphqlQuery = `
        mutation createEudrSettings($createEudrSettingInput: CreateEudrSettingInput!) {
          createEudrSetting(createEudrSettingInput: $createEudrSettingInput) {
            id
            org_id
            radius_unit
            radius_max_limit
            isDefault
            product_mass_unit
            volume_unit
            user_type
            eudr_api_key
            eudr_api_secret
            dynamicExpiryTime
            dynamicExpiryTimePeriod
            toggleAutoRenewWhenReportAdded
            declarationStatementCountry
            public_geofence_download
            public_deforestation_summary
            riskLevel {
              id
              eudr_settings_id
              very_high
              high
              medium
              low
              very_low
              zero
              createdAt
              updatedAt
            }
            riskToleranceLevels {
            id
            very_high
            high
            medium
            low
            very_low
            eudr_settings_id
            createdAt
            updatedAt
            }
            declarations {
              id
              eudr_settings_id
              title
              country
              description
              isEnabled
              createdAt
              updatedAt
            }
          }
        }
      `
        const data = await postGraphqlQuery(graphqlQuery, { createEudrSettingInput })
        store.dispatch('eudrSettings/storeEUDRSetting', data.data.eudrSetting)
        return data
    },
    
    async updateEudrSettings(id,updateEudrSettingInput) {
        const graphqlQuery = `
          mutation updateEudrSettings($id: Int!,$updateEudrSettingInput: UpdateEudrSettingInput!) {
            updateEudrSetting(id: $id, updateEudrSettingInput: $updateEudrSettingInput) {
              id
              org_id
              radius_unit
              radius_max_limit
              isDefault
              product_mass_unit
              volume_unit
              user_type
              eudr_api_key
              eudr_api_secret
              dynamicExpiryTime
              dynamicExpiryTimePeriod
              toggleAutoRenewWhenReportAdded
              declarationStatementCountry
              public_geofence_download
              public_deforestation_summary
              riskLevel {
                id
                eudr_settings_id
                very_high
                high
                medium
                low
                very_low
                zero
                createdAt
                updatedAt
              }
              riskToleranceLevels {
                id
                very_high
                high
                medium
                low
                very_low
                eudr_settings_id
                createdAt
                updatedAt
              }
              declarations {
                id
                eudr_settings_id
                title
                country
                description
                isEnabled
                createdAt
                updatedAt
              }
            }
          }
        `;
      
        const data = await postGraphqlQuery(graphqlQuery, { id, updateEudrSettingInput }); 
        
        // Dispatch to Vuex store after successful update
        store.dispatch('eudrSettings/storeEUDRSetting', data.data.updateEudrSetting);
        
        return data;
      },
      
    
    async getEudrSettings() {
        const graphqlQuery = `
        query eudrSetting {
          eudrSetting {
            id
            org_id
            radius_unit
            radius_max_limit
            isDefault
            product_mass_unit
            volume_unit
            user_type
            eudr_api_key
            eudr_api_secret
            dynamicExpiryTime
            dynamicExpiryTimePeriod
            toggleAutoRenewWhenReportAdded
            declarationStatementCountry
            public_geofence_download
            public_deforestation_summary
            riskLevel {
              id
              eudr_settings_id
              very_high
              high
              medium
              low
              very_low
              zero
              createdAt
              updatedAt
            }
            riskToleranceLevels {
            id
            very_high
            high
            medium
            low
            very_low
            eudr_settings_id
            createdAt
            updatedAt
        }
            declarations {
              title
              country
              description
              isEnabled
            }
          }
        }
      `
        const data = await postGraphqlQuery(graphqlQuery)
        store.dispatch('eudrSettings/storeEUDRSetting', data.data.eudrSetting)
        return data
    },
    
    async getShipments(input) {
        const graphqlQuery = `
             query Shipments($input:GetAllShipmentListInput!){
                getShipmentList(getAllShipmentListInput:$input) {
    							 count,
    							 rows {
                                    id,
                                    status,
                                    statusLegends,
                                    isTemporaryApproval,
                                    temporaryExpirationDate,
                                    temporaryExpirationValue,
                                    temporaryExpirationUnit,
                                    assignedTo,
                                    assignedToCfId,
                                    assignedDate,
                                    rejectionReason,
                                    assignedToUser {
                                        id
                                        firstName
                                        lastName
                                        email
                                        cf_userid
                                    },
                                    shipmentReports {
                                        id,
                                        dueDeligenceReport{
                                            id,
                                            product,
                                            productNetMass
                                            dueDiligenceProductionPlaces {
                                                id
                                                farmId
                                                removed
                                            }
                                        }
                                    }
                                }
    								
                            }
                    }
        `;
        
        return postGraphqlQuery(graphqlQuery, { input });
    },



    /**
     *
     * Operator Owner Shipments
     * shipments
     *
     */
    async createShipment(input) {
        const graphqlMutation = `
       mutation createShipmentInput($input:CreateShipmentInput!){
            createShipment(createShipmentInput:$input){
                importer,
                exporter,
                container_id,
                container_type,
                container_type
            }
        }
        `;
        return postGraphqlQuery(graphqlMutation, { input });
    },


    async getDiligenceActivityLog(id) {
        const graphqlQuery = `
            query DiligenceActivityLog($id:Int!) {
            diligenceActivityLog(id: $id) {
                id
                diligence_id
                user_id
                activity
                description
                ip_address
                createdAt
                updatedAt
                user {
                    id
                    cf_userid
                    firstName
                    lastName
                    role
                }
            }
        }`;


        return postGraphqlQuery(graphqlQuery, { id });
    },

    async getDiligenceActivityLogPaginated(id, filter = {}) {
        // TEMPORARY: Using existing API with client-side pagination until backend pagination is deployed
        // TODO: Switch to server-side pagination when backend is ready
        const response = await this.getDiligenceActivityLog(id);
        
        if (response.data?.diligenceActivityLog) {
            let allLogs = response.data.diligenceActivityLog;
            
            // Apply client-side filtering
            if (filter.searchPhrase) {
                const searchTerm = filter.searchPhrase.toLowerCase();
                allLogs = allLogs.filter(log => 
                    `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.toLowerCase().includes(searchTerm) ||
                    (log.activity || '').toLowerCase().includes(searchTerm) ||
                    (log.description || '').toLowerCase().includes(searchTerm) ||
                    (log.user?.role || '').toLowerCase().includes(searchTerm)
                );
            }
            
            if (filter.userRole) {
                allLogs = allLogs.filter(log => log.user?.role === filter.userRole);
            }
            
            if (filter.activity) {
                allLogs = allLogs.filter(log => log.activity === filter.activity);
            }
            
            // Sort by createdAt DESC
            allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            const totalCount = allLogs.length;
            
            // Apply client-side pagination
            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const rows = allLogs.slice(startIndex, endIndex);
            
            return {
                data: {
                    diligenceActivityLogPaginated: {
                        count: rows.length,
                        totalCount,
                        rows
                    }
                }
            };
        }
        
        return {
            data: {
                diligenceActivityLogPaginated: {
                    count: 0,
                    totalCount: 0,
                    rows: []
                }
            }
        };
    },

    async createDiligenceActivityLog(input) {
        const graphqlMutation = `
            mutation CreateDiligenceActivityLog($input: CreateDiligenceActivityLogInput!) {
                createDiligenceActivityLog(createDiligenceActivityLogInput: $input) {
                    id
                    diligence_id
                    user_id
                    activity
                    description
                    ip_address
                    createdAt
                    updatedAt
                }
            }
        `;
        return postGraphqlQuery(graphqlMutation, { input });
    },

    async getRoleListData(requestParams, roleType) {
        try {
            const { data } = await axios.get(VUE_APP_BASE_URL + `/adminuserListByRole/` + roleType, {
                params: requestParams
            })
            return Promise.resolve(data);
        }
        catch (err) {
            return Promise.reject(err.response);
        }
    },

    async getUserListByMultipleRoles(requestParams) {
        try {
            const { data } = await axios.get(VUE_APP_BASE_URL + `/adminuserListByMultipleRoles`, {
                params: requestParams
            })
            return Promise.resolve(data);
        }
        catch (err) {
            return Promise.reject(err.response);
        }
    },

    async requestAdditionalInformation(requestAdditionalInformationInput) {
        const graphqlQuery = `
            mutation RequestAdditionalInformation($requestAdditionalInformationInput: RequestAdditionalInformationInput!) {
                requestAdditionalInformation(requestAdditionalInformationInput: $requestAdditionalInformationInput){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { requestAdditionalInformationInput });
    },

    async addSupplier(supplierDataInput) {
        const graphqlQuery = `
            mutation AddSupplier($supplierDataInput: SupplierDataInput!) {
                addSupplier(supplierDataInput: $supplierDataInput){
                    id
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { supplierDataInput });
    },
    async updateStatus(updateShipment) {
        const graphqlQuery = `
        mutation UpdateShipmentStatus($updateShipment: UpdateShipment!) {
          updateStatus(updateShipment: $updateShipment) {
            exporter
            shipment_refrence_number
            ownership_type
            status
          }
        }
      `;
        return postGraphqlQuery(graphqlQuery, { updateShipment })
    },
    async shipmentDetail(getShipmentInput) {
        const graphqlQuery = `
        query ShipmentDetail ($getShipmentInput:GetShipmentInput!){
        shipmentDetail(getShipmentInput:$getShipmentInput) {
        id
        exporter
        importer
        shipment_refrence_number
        ownership_type
        buyer
        part_of_origin
        part_of_destination
        shipping_line
        expected_arrival_date
        container_id
        container_type
        container_size
        container_capacity
        status
        statusLegends
        assignedTo
        assignedToCfId
        assignedDate
        createdAt
        shipment_stops {
            id
            shipment_id
            title
            createdAt
        }
        due_diligences {
            id
            supplierId
            operatorId
            userId
            whoAddPlaceData
            assessmentCountries
            internalReferenceNumber
            EUDRReferenceNumber
            companyID
            activity
            countryOfActivity
            countryOfEntry
            product
            subProduct
            productDescription
            productNetMass
            productVolume
            productScientificName
            productCommonName
            status
            dueDiligenceProductionPlaces {
                id
                farmId
            }
        }
    }
}
`;

        return postGraphqlQuery(graphqlQuery, { getShipmentInput });
    },


    async getDiligenceReportsByShipment(opt) {
        const graphqlQuery = `
            query getDiligenceReportsByShipment($filter:ShipmentDiligenceReportsFilterInput!){
                diligenceReportsByShipment(filter:$filter){
                    rows{
                        id
                        status
                        supplierId
                        status
                        statusLegends
                        whoAddPlaceData
                        assignedTo
                        assignedToCfId
                        assignedToUser {
                            firstName
                            lastName
                        }
                        createdAt
                        updatedAt
                        assessmentCountries
                        requiredAssessment{
                            farm
                            id
                            type
                            assessment
                        }
                        companyID
                        EUDRReferenceNumber
                        internalReferenceNumber
                        activity
                        countryOfEntry
                        countryOfActivity
                        product
                        subProduct
                        productDescription
                        productNetMass
                        productVolume
                        productScientificName
                        productCommonName
                        dueDiligenceProductionPlaces {
                            id
                            farmId
                        }
                        supplier{
                            id
                            firstName
                            lastName
                        }
                        dueDiligenceProductionPlaces{
                            farmId
                        }
                        operator {
                            id
                            firstName
                            lastName
                        }
                    }
                 totalCount
                }
            }
        `;
        const filter = {
            page: opt.page,
            limit: opt.limit,
            country: opt.country,
            status: opt.status,
            searchPhrase: opt.searchPhrase,
            supplierId: opt.supplierId,
            shipment_id: opt.shipment_id,
            order: opt.order,
            orderField: opt.orderField
        };



        return postGraphqlQuery(graphqlQuery, { filter });
    },

    async updateEUDRStatus(EUDRStatusPayload) {
        const graphqlQuery = `
             mutation updateEUDRDeforestationStatus($EUDRStatusPayload: [EUDRDeforestationStatusInput!]!) {
                updateEUDRDeforestationStatus(eudrDeforestationStatusInput:$EUDRStatusPayload){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { EUDRStatusPayload });
    },


    async sendEmailToSupplierOrOperator(supplierId, operatorId) {
        const graphqlQuery = `
            mutation SendEmailToSupplierOperator($supplierId: Int, $operatorId: Int) {
                sendEmailToSupplierOperator(supplierId: $supplierId, operatorId: $operatorId){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { supplierId, operatorId });
    },

    async updateRiskAssessmentStatus(data) {
        const graphqlQuery = `
             mutation updateRiskAssessment($data: RiskAssessmentStatusInput!) {
                updateRiskAssessmentStatus(riskAssessmentStatusInput:$data){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { data });
    },

    async uploadRiskAssessmentFile(createAssessmentUploadInput) {
        const graphqlQuery = `
            mutation createNewAssessmentUpload($createAssessmentUploadInput:CreateAssessmentUploadInput! ){
                createNewAssessmentUpload(createAssessmentUploadInput: $createAssessmentUploadInput){
                   message,
                   status
                }
        }
        `;
        return postGraphqlQuery(graphqlQuery, { createAssessmentUploadInput });
    },

    async updateDeforestationStatus(updateEudrDeforestationStatusInput) {
        const graphqlQuery = `
             mutation updateDeforestationStatus($updateEudrDeforestationStatusInput:UpdateEUDRDeforestationStatusInput!){
                updateManualEUDRDeforestationStatus(updateEudrDeforestationStatusInput:$updateEudrDeforestationStatusInput){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { updateEudrDeforestationStatusInput });
    },

    async checkProductionPlacesFromDueDiligenceRport(id) {
        const qr = `
         query checkProductionPlaceFromReportId($id:Int!){
                checkProductionPlaceFromReportId(id:$id){
                    count
                }
            }
        `
        const parseId = parseInt(id)
        return postGraphqlQuery(qr, { id: parseId });
    },

    async getAllUsersByOrganization() {
        const graphqlQuery = `
            query findAllUsersByOrganization {
                findAllUsersByOrganization {
                    id
                    firstName
                    lastName
                    organization
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery);
    },

    async getAssessmentMitigationDetail(id) {
        //dueDiligenceId
        //productionPlaceId
        const graphqlQuery = `
            query assessmentMitigation($id:Int!) {
                assessmentMitigation(id:$id) {
                    id
                    assessmentId
                    assessmentQuestionId
                    assessmentQuestionOptionId
                    mitigationStatus
                    assignedUserId
                    createdAt
                    assessment {
                        id
                        title
                    }
                    productionPlace {
                        farm {
                            farmName,
                            farmOwner
                        }
                    }
                    assessmentQuestion {
                        id
                        title
                    }
                    assessmentQuestionOption {
                        id
                        label
                        checklists
                    }
                    checkLists {
                        checklistTitle
                        isChecked
                    }
                    assessmentMitigationDiscussions {
                        id
                        comment
                        user {
                            id
                            firstName
                            lastName
                        }
                        attachments {
                            filePath
                            fileMetadata {
                                key
                                s3Location
                                mimeType
                                size
                            }
                            createdAt
                        }
                    }
                }
            }
        `;
        id = parseInt(id);
        return postGraphqlQuery(graphqlQuery, { id });
    },

    async updateMitigation(id, status, assignedUserId) {
        const graphqlQuery = `
            mutation updateAssessmentMitigation($updateAssessmentMitigationInput:UpdateAssessmentMitigationInput!) {
                updateAssessmentMitigation(updateAssessmentMitigationInput:$updateAssessmentMitigationInput) {
                    id
                    mitigationStatus
                    assignedUserId
                }
            }
        `;
        id = parseInt(id);
        assignedUserId = parseInt(assignedUserId);
        return postGraphqlQuery(graphqlQuery, {
            updateAssessmentMitigationInput: {
                id,
                mitigationStatus: status,
                assignedUserId
            }
        });
    },

    async updateChecklist(id, checklist) {
        const graphqlQuery = `
            mutation updateAssessmentMitigation($updateAssessmentMitigationInput:UpdateAssessmentMitigationInput!) {
                updateAssessmentMitigation(updateAssessmentMitigationInput:$updateAssessmentMitigationInput) {
                    id
                    checkLists {
                        checklistTitle
                        isChecked
                    }
                }
            }
        `;
        id = parseInt(id);
        return postGraphqlQuery(graphqlQuery, {
            updateAssessmentMitigationInput: {
                id,
                checkLists: checklist
            }
        });
    },

    async createAssessmentMitigationDiscussion(createAssessmentMitigationDiscussionInput) {
        const graphqlQuery = `
            mutation addMitigationDiscussion($createAssessmentMitigationDiscussionInput:CreateAssessmentMitigationDiscussionInput!) {
                addMitigationDiscussion(createAssessmentMitigationDiscussionInput:$createAssessmentMitigationDiscussionInput) {
                    id
                    comment
                    user {
                        id
                        firstName
                        lastName
                    }
                    attachments {
                        filePath
                        fileMetadata {
                            key
                            s3Location
                            mimeType
                            size
                        }
                    }
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, {
            createAssessmentMitigationDiscussionInput
        });
    },

    async getAllAssessmentMitigationAttachments(assessmentMitigationId) {
        const graphqlQuery = `
            query assessmentMitigationAttachments($assessmentMitigationId: Int!) {
                assessmentMitigationAttachments(assessmentMitigationId: $assessmentMitigationId) {
                    id
                    filePath
                    fileMetadata {
                        key
                        s3Location
                        mimeType
                        size
                    }
                }
            }
        `;
        assessmentMitigationId = parseInt(assessmentMitigationId);
        return postGraphqlQuery(graphqlQuery, {
            assessmentMitigationId
        });
    },

    async highRiskAssessmentMitigation(opt) {
        const graphqlMutation = `
          mutation HighRiskAssessmentMitigation($input: MitigateProductionPlaceInput!) {
            highRiskAssessmentMitigation(
              input: $input,
            ) {
              success
              message
            }
          }
        `;
      
        const variables = {
          input: {
            dueDiligenceReportId: opt.dueDiligenceReportId,
            assessmentId: opt.assessmentId,
            mitigationComment: opt.mitigationComment,
            file: opt.file,
          }        
        };
      
        return postGraphqlQuery(graphqlMutation, variables);
    },

    async updateDiligenceReportStage(inputPayload) {
        const graphqlQuery = `
            mutation updateDiligenceReportStage($diligenceCurrentStageInput:DiligenceCurrentStageInput!){
                    updateDiligenceCurrentStage(diligenceCurrentStageInput:$diligenceCurrentStageInput){
                    message 
                    }
                }
        `;
        return postGraphqlQuery(graphqlQuery, {
            diligenceCurrentStageInput: {
                current_stage: inputPayload.current_stage,
                reportId: inputPayload.reportId
            }
        });
    },

    async updateBlockchainPublishDate(reportId) {
        const graphqlQuery = `
            mutation updateBlockchainPublishDate($digilenceId:DiligenceReportIdInput!){
                    updateBlockchainPublishDate(digilenceId:$digilenceId){
                        message,
                        blockchainPublishDate 
                    }
                }
        `;
        return postGraphqlQuery(graphqlQuery, {
            digilenceId: {
                reportId: reportId
            }
        });
    },




    async getDiligenceReportCurrentStageInfo(reportId) {
        const graphqlQuery = `
            query getDiligenceReportStage($id:Int!){
                    diligenceReportCurrentStageInfo(id:$id){
                    current_step
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, {
            id: reportId
        });

        /**
         * response
         * {
            "data": {
                "diligenceReportCurrentStageInfo": {
                "current_step": 3
                }
             }
            }
         */
    },



    async createAssessmentMitigation(createAssessmentMitigationInput) {
        const graphqlQuery = `
        mutation createAssessmentMitigation($createAssessmentMitigationInput: CreateAssessmentMitigationInput!)
        {
            createAssessmentMitigation(createAssessmentMitigationInput: $createAssessmentMitigationInput){
                    id
                }

            }
        `;
        return postGraphqlQuery(graphqlQuery, {
            createAssessmentMitigationInput
        });
    },

    async requestComplianceCertificate(reportId, userId) {
        if (!reportId) return;
        reportId = Number(reportId);
        userId = Number(userId);
        const graphqlQuery = `
            mutation requestComplianceCertificateForUser($input: RequestCertificateForUserInput!) {
                requestComplianceCertificateForUser(requestCertificateForUserInput: $input)
            }
        `;
        return postGraphqlQuery(graphqlQuery, {
            input: {
                reportId,
                userId,
            }
        });
    },

    async getSummaryDDS(reportId) {
        return new Promise((resolve, reject) => {
            axios.get(`${DEFORESTRATION_API_BASE_URL}/diligence-report/final-report-dump/${reportId}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: axiosConfig.headers.authorization,
                }
            }).then(async ({ data }) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    async downloadForSelectedFarms(farms) {
        return new Promise((resolve, reject) => {
            const farmIdsParam = farms.map(farm => farm.farmId).join(',');
            const apiURL = `${DEFORESTRATION_API_BASE_URL}/production-place/geoJsons?farm_id=${farmIdsParam}`
            axios.get(apiURL, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: axiosConfig.headers.authorization,
                },
                responseType: 'blob'
            }).then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;

                const fileName = 'farms.geojson';

                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);

                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    },

    async downloadForAllFarms(orgId) {
        const apiURL = `${DEFORESTRATION_API_BASE_URL}/production-place/geoJsons?farm_id=all`
        return await axios.get(apiURL, {
            headers: {
                "Content-Type": "application/json",
                authorization: axiosConfig.headers.authorization,
                organizationid: orgId
            },
        })
    },

    async getProductionPlaceWarning(payload){
        const apiURL = `${DEFORESTRATION_API_BASE_URL}/production-place/dds-fmi`
        return new Promise((resolve,reject) => {
            axios.post(apiURL, {farms:payload}).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        }) 
    },

    async updatePointFarmDefaultArea(updatePointFarmDefaultAreaInput) {
        const graphqlQuery = `
                mutation UpdatePointFarmDefaultArea($updatePointFarmDefaultAreaInput:UpdatePointFarmDefaultAreaInput!){
                    updatePointFarmDefaultArea(updatePointFarmDefaultAreaInput:$updatePointFarmDefaultAreaInput){
                        id
                        pointFarmDefaultArea
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { updatePointFarmDefaultAreaInput });

    },

    async getJob(jobId) {
        const graphqlQuery = `
            query job($id: Int!) {
                job(id: $id) {
                    id
                    status
                }
            }
        `;
        return withRetry(() => postGraphqlQuery(graphqlQuery, { id: jobId }));
    },

   async getJobs(jobIds) {
    const graphqlQuery = `
        mutation getJobs($jobIds: JobIdsInput!) {
        getJobs(jobIds: $jobIds) {
            id
            status
        }
        }
    `;
    return withRetry(() => postGraphqlQuery(graphqlQuery, { jobIds: { jobIds: jobIds } }));
    },

    async generateBlockchainData(diligenceReportId) {
        const graphqlQuery = `
                mutation generateComplianceByDiligenceReportId($id:Int!){
                    generateComplianceByDiligenceReportId(id:$id){
                        success
                        job {
                            id
                        }
                    }
                }
            `;

        return postGraphqlQuery(graphqlQuery, { id: diligenceReportId });
    },

    async checkPolygonOverlap(diligenceReportID){
        const graphqlQuery = `
            mutation CheckPolygonOverlap($id:Int!){
                checkPolygonOverlap(id:$id){
                    success
                    message
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { id: diligenceReportID });
    },

    async downloadGeojsonForFarms(farms=[], orgId=null) {
        return new Promise((resolve, reject) => {
            let apiURL= undefined
            console.dir(farms)
            if(farms.length>0){
                const farmIdsParam = farms.map(farm => farm.farmId).join(',');
                console.log(farmIdsParam)
                apiURL = `${DEFORESTRATION_API_BASE_URL}/production-place/geoJsons?farm_id=${farmIdsParam}`
            }else if (orgId) {
                apiURL = `${DEFORESTRATION_API_BASE_URL}/production-place/geoJsons?org_id=${orgId}`
            }else {
                return reject("Farms not selected");
            }
            // /api/production-place/geoJsons?farm_id=7105,7106,7107
            axios.get(apiURL, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: axiosConfig.headers.authorization,
                },
                responseType: 'blob'
            }).then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;

                const fileName = 'farms.geojson';

                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);

                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    async getDDSAdditionalInformationByID(id) {
        const graphqlQuery = `
            query getAdditionalInformation($id: Int!) { 
                getAdditionalInformation(id: $id) { 
                        id 
                        dueDiligenceReportId 
                        supplierId 
                        userId description 
                        status 
                        selectedStep 
                        attachAllHighRiskFarms
                        shareAccess
                    } 
                }
            `;
        return postGraphqlQuery(graphqlQuery, { id });
    },
    async detectDeforestationBulk(data) {
        const graphqlQuery = `
            query detectDeforestationBulk($detectDeforestationBulkInput:[DetectDeforestationBulkInput!]!){
                    detectDeforestationBulk(detectDeforestationBulkInput:$detectDeforestationBulkInput){
                    indigenousArea
                    protectedArea
                    productionPlaceId
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { detectDeforestationBulkInput: data });
    },

    async getPdfDownloadHistory(paginationOptions) {
        const graphqlQuery = `
            query getHistory($paginationOptions: PdfDownloadHistoryPaginationDTO!) {
                getHistory(paginationOptions: $paginationOptions) {
                    totalCount
                    count
                    rows {
                        id
                        dueDiligenceReportId
                        fileUrl
                        fileName
                        orgId
                        estimatedTime
                        pdfType
                        status
                        createdAt
                        }
                    }
                }
        `;
        return postGraphqlQuery(graphqlQuery, {
            paginationOptions
        });
    },

    async deleteDownloadHistory(id) {
        const graphqlQuery = `
                mutation removeDownloadHistory($id:Int!){
                    removeDownloadHistory(id:$id)
                }
            `;

        return postGraphqlQuery(graphqlQuery, { id });

    },

    async getDDSAdditionalInformationByDiligenceId(diligenceId) {
            const graphqlQuery = `
                query getAllRequestAdditionalInformationByDiligenceId($diligenceId: Int!) { 
                    getAllRequestAdditionalInformationByDiligenceId(id: $diligenceId) { 
                            id 
                            dueDiligenceReportId 
                            supplierId 
                            userId description 
                            status 
                            selectedStep 
                            attachAllHighRiskFarms
                            shareAccess
                        }
        }`;
        return postGraphqlQuery(graphqlQuery, { diligenceId });
    },

    async updateGeolocationPrivacy(isGeolocationPrivate, diligenceReportId) {
        const graphqlQuery = `
     mutation updateGeolocationPrivacy(
            $diligenceReportId: Int!,
            $isGeolocationPrivate: Boolean!
            ) {
            updateGeolocationPrivacy(
                diligenceReportId: $diligenceReportId,
                isGeolocationPrivate: $isGeolocationPrivate
            ) {
                id
            }
        }
    `;

    return postGraphqlQuery(graphqlQuery, { diligenceReportId,  isGeolocationPrivate});
    },

    async bulkApproveReports(input) {
        const graphqlQuery = `
            mutation BulkApproveReports($input: BulkApproveReportsInput!) {
                bulkApproveReports(input: $input) {
                    success
                    jobs {
                        id
                        status
                    }
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },

    async bulkRejectReports(input) {
        const graphqlQuery = `
            mutation BulkRejectReports($input: BulkRejectReportsInput!) {
                bulkRejectReports(input: $input) {
                    success
                    message
                    processedCount
                    failedReportIds
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },

    async bulkAssignReports(input) {
        const graphqlQuery = `
            mutation BulkAssignReports($input: BulkAssignReportsInput!) {
                bulkAssignReports(input: $input) {
                    success
                    message
                    processedCount
                    failedReportIds
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },


    async getData() {
        return await axios
          .get("/dashboard")
          .then((result) => result.data)
          .catch((error) => Promise.reject(error));
      },
    
    async updateApprovalFlowSettingByOrgId(updateApprovalFlowSettingInput) {
        const graphqlQuery = `
                mutation UpdateApprovalFlowSettingByOrgId($updateApprovalFlowSettingInput: UpdateApprovalFlowSettingInput!) {
                    updateApprovalFlowSettingByOrgId(updateApprovalFlowSettingInput: $updateApprovalFlowSettingInput) {
                        id
                        org_id
                        approval_expiration_period
                        approval_expiration_unit
                        document_visibility
                        is_default
                        created_at
                        updated_at
                    }
                }
            `;  

    return postGraphqlQuery(graphqlQuery, { updateApprovalFlowSettingInput });
        
    },
    
    async getApprovalFlowSettingByOrgId() {
        const graphqlQuery = `query GetApprovalFlowSettingByOrgId {
            approvalFlowSettingByOrgId {
                id
                org_id
                approval_expiration_period
                approval_expiration_unit
                document_visibility
                is_default
                created_at
                updated_at
                formattedExpirationPeriod
                documentVisibilityDescription
            }
            }`

        return postGraphqlQuery(graphqlQuery);
    },

    async getDashboardStatistics(input) {
        const graphqlQuery = `
            query DashboardStatistics($input: DashboardStatisticsDto!) {
                dashboardStatistics(input: $input) {
                    activeExporters
                    registeredFarms
                    ddsCompliant
                    ddsApproved
                    ddsNonCompliant
                    ddsAssignedToMe
                    ddsOverdue
                    activeCooperatives
                    ddsCompliantChange
                    ddsNonCompliantChange
                    ddsApprovedChange
                    ddsOverdueChange
                    ddsAssignedToMeChange
                    registeredFarmsChange
                    activeExportersChange
                    activeCooperativesChange
                }
            }
        `;
        
        return postGraphqlQuery(graphqlQuery, { input });
    },

    async bulkApproveShipments(input) {
        const graphqlQuery = `
            mutation BulkApproveShipments($input: BulkApproveShipmentsInput!) {
                bulkApproveShipments(input: $input) {
                    success
                    jobs {
                        id 
                        status
                    }
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { input });
    },

    async bulkRejectShipments(input) {
        const graphqlQuery = `
            mutation BulkRejectShipments($input: BulkRejectShipmentsInput!) {
                bulkRejectShipments(input: $input) {
                    success
                    message
                    processedCount
                    failedReportIds
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },

    async bulkAssignShipments(input) {
        const graphqlQuery = `
            mutation BulkAssignShipments($input: BulkAssignShipmentsInput!) {
                bulkAssignShipments(input: $input) {
                    success
                    message
                    processedCount
                    failedReportIds
                }
            }
        `;

        return postGraphqlQuery(graphqlQuery, { input });
    },

    async getDdsReportSubmissionCounts(input) {
        const graphqlQuery = `
            query GetDdsReportSubmissionCounts($input: DdsReportSubmissionCountInput!) {
                ddsReportSubmissionCounts(input: $input) {
                    totalCount
                    statusCounts {
                        status
                        count
                    }
                    monthlyStatusCounts {
                        month
                        statusCounts {
                            status
                            count
                        }
                    }
                }
            }
        `;
        return postGraphqlQuery(graphqlQuery, { input });
    },
    async getDDSReportByStatusLegends(input) {
        let dateFilter = input.dateFilter || input.period || 'all';
        let startDate = input.startDate;
        let endDate = input.endDate;
        let productId = input.productId;
        
        // Build the input object for the GraphQL query
        let inputParams = `dateFilter: "${dateFilter}"`;
        
        if (startDate && endDate) {
            inputParams += `, startDate: "${startDate}", endDate: "${endDate}"`;
        }
        
        if (productId) {
            inputParams += `, productId: ${productId}`;
        }
        
        const graphqlQuery = `
            query {
            diligenceReportsByDateFilter(input: {${inputParams}}) {
                statusLegend
                count
                percentage
            }
            }`;
        return postGraphqlQuery(graphqlQuery, { input });
    },

    async getDDSReportByProducts(input) {
        let dateFilter = input.dateFilter || input.period || 'all';
        let startDate = input.startDate;
        let endDate = input.endDate;
        let productId = input.productId;
        
        // Build the input object for the GraphQL query
        let inputParams = `dateFilter: "${dateFilter}"`;
        
        if (startDate && endDate) {
            inputParams += `, startDate: "${startDate}", endDate: "${endDate}"`;
        }
        
        if (productId) {
            inputParams += `, productId: ${productId}`;
        }
        
        const graphqlQuery = `
            query {
            diligenceReportsByProductAndDate(input: {${inputParams}}) {
                productName
                count
            }
            }`;
        return postGraphqlQuery(graphqlQuery, { input });
    },

    async averageProcessingTimeByEmployee(input) {
        const graphqlQuery = `
            query GetAverageProcessingTimeByEmployee($input: DateFilterInput!) {
                averageProcessingTimeByEmployee(input: $input) {
                    employees {
                        employeeName
                        averageProcessingTimeInDays
                        totalReportsProcessed
                    }
                    overallAverageProcessingTimeInDays
                    totalReportsProcessed
                }
            }`;
        return postGraphqlQuery(graphqlQuery, { input });
    },
}
