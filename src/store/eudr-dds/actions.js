import DeforestationService from "../../_services/DeforestationService"

export default {
    async setDdsAdditionalInformationData({ commit}, payload){
        const { ddrAdditionalInformationId } = payload
        const responeData = await DeforestationService.getDDSAdditionalInformationByID(ddrAdditionalInformationId)
        const result = { 
            ...responeData?.data?.getAdditionalInformation, 
        };
        if(result.shareAccess === "shareSpecificStep"){
            result.selectedStep = JSON.parse(result.selectedStep[0])
        }
        commit('SET_DDS_ADDITIONAL_INFORMATION_DATA', result)
    },
    async setDiligenceData({ commit}, payload){
        const { diligenceId } = payload
        const responeData = await DeforestationService.getDiligenceDetail(diligenceId)
        const result = { 
            ...responeData?.data?.getDiligenceDetail, 
        };
        commit('SET_DILIGENCE_DATA', result)
    },
    async setDDSAdditionalInformationByDiligenceId({commit}, payload){
        const { ddrId } = payload
        try {
            const responeData = await DeforestationService.getDDSAdditionalInformationByDiligenceId(ddrId)
            const result = responeData?.data?.getAllRequestAdditionalInformationByDiligenceId || [];
            commit('SET_DDS_ADDITIONAL_INFORMATION_BY_DILIGENCE_ID', result)
        } catch (error) {
            console.error('Error fetching additional information:', error);
            // Set empty array as fallback
            commit('SET_DDS_ADDITIONAL_INFORMATION_BY_DILIGENCE_ID', [])
        }
    }
}