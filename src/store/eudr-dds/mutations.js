export default {
    SET_DDS_USER_ROLE(state, role){
        state.ddsUserRole = role;
    },

    SET_DILIGENCE_DETAILS(state, details){
        state.diligenceDetails = details;
    },
    SET_DDS_ADDITIONAL_INFORMATION_DATA(state, data){
        state.ddsAdditionalInformationData = data;
    },
    SET_DILIGENCE_DATA(state, data){
        state.diligenceData = data;
    },
    SET_DDS_ADDITIONAL_INFORMATION_BY_DILIGENCE_ID(state, data){
        state.ddsAdditionalInformationByDiligenceId = data;
    }
}