import axios  from "axios"

export default {


    async getPlantationData(dataOptions, plantationType, search, farmerId){
        let url = `/plantation`
        
        // Only add userId parameter if farmerId is provided and valid
        if (farmerId && farmerId !== 'undefined' && farmerId !== 'null') {
            url += `?userId=${farmerId}`
        }
        
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            searchPhrase: search,
            status: plantationType,
        }
        if(dataOptions.sortBy.length){
            requestParams.orderField = dataOptions.sortBy[0]
            requestParams.order = dataOptions.sortDesc[0]? 'DESC': 'ASC'
        }

        

        try{
            const {data} = await axios.get(url, {
                params: requestParams
            })
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async updatePlantation(id, pData){
        const url = `/plantation/${id}`;
        try {
            const {data} = await axios.put(url, pData)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }

    },

    async getPlantationSetting(){
        const url = `/plantation/get-setting`;
        try {
            const {data} = await axios.get(url)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async savePlantationSetting(plantationSetting){
        const url = `/plantation/save-setting`;
        try {
            const {data} = await axios.post(url, plantationSetting)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    /** Cacao Plantation Settings */

    async getCacaoPlantationData(dataOptions, plantationType, search, farmerId=null) {
        const url = `/cacao/plantation?userId=${farmerId}`
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            searchPhrase: search,
            status: plantationType,
        }
        if(dataOptions.sortBy.length){
            requestParams.orderField = dataOptions.sortBy[0]
            requestParams.order = dataOptions.sortDesc[0]? 'DESC': 'ASC'
        }

        try{
            const {data} = await axios.get(url, {
                params: requestParams
            })
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async updateCacaoPlantation(id, pData){
        const url = `/cacao/plantation/${id}`;
        try {
            const {data} = await axios.put(url, pData)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async getCacaoPlantationSetting(){
        const url = `/cacao/plantation/cacao-plantation-settings`;
        try {
            const {data} = await axios.get(url)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async saveCacaoPlantationSetting(plantationSetting){
        const url = `/cacao/plantation/save-cacao-plantation-settings`;
        try {
            const {data} = await axios.post(url, plantationSetting)
            return Promise.resolve(data) 
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}

