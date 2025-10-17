export default{
    getDdsUserRole(state){
        return state.ddsUserRole;
    },

    getDiligenceDetails(state){
        return state.diligenceDetails;
    },

    getDetailWarnings(state){
        return state?.diligenceData?.riskWarnings || [];
    },

    getDdsAdditionalInformationData(state){
        return state.ddsAdditionalInformationData;
    },

    ddsAdditionalInformationByDiligenceId(state){
        return state.ddsAdditionalInformationByDiligenceId;
    },
    
    ddsAdditionalInformationByDiligenceIdLatest(state){
        return state.ddsAdditionalInformationByDiligenceId[0];
    }
}