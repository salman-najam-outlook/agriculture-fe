import axios from "axios"
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL || 'http://localhost:3004/api'
export default {
    GET_LAND_SUITABILITY_LIST: '/reports/land-suitability',
    GET_WEATHER_ANALYSIS_LIST: '/reports/weather-analysis',
    GET_ALL_FARMS: '/reports/all-farms',
    GET_ALL_COUNTRIES:'/farm/countries/all',
    GET_ALL_REGIONS:'/farm/states',

    GENERATE_LAND_SUITABILITY_REPORT:'/reports/land-suitability/get-land-score',
    GET_LAND_SUITABILITY_REPORT_DETAILS:'/reports/land-suitability/details',
    DOWNLOAD_LAND_SUITABILITY_REPORT: '/reports/land-suitability/download-report',
    GENERATE_WEATHER_ANALYSIS_REPORT:'reports/weather-analysis/generate-report',
    GET_WEATHER_ANALYSIS_REPORT_DETAILS:'reports/weather-analysis/details',
    DOWNLOAD_WEATHER_ANALYSIS_REPORT: '/reports/weather-analysis/download-report',
    EXPORT_LAND_SUITABILITY_REPORT: '/reports/land-suitability/export',
    EXPORT_WEATHER_ANALYSIS_REPORT: '/reports/weather-analysis/export',
    GET_CROP_LIST: `/farm/croptype`,

    async getAllFarms(){
        try {
            const { data } = await axios.get(this.GET_ALL_FARMS)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async getCrops(farmId){
        try {
            const {data}= await axios.get(`${this.GET_CROP_LIST}/${farmId}`)
            return Promise.resolve(data)
        } catch (error) {
            console.log(error)
            return Promise.reject(error.response)
        }
    },

    async getAllCountries(){
        try {
            const { data } = await axios.get(this.GET_ALL_COUNTRIES)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async getAllRegions(countryCode){
        try {
            const { data } = await axios.get(`${this.GET_ALL_REGIONS}/${countryCode}`)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async getLandSuitabilityLists(params) {
        try {
            const { data } = await axios.get(this.GET_LAND_SUITABILITY_LIST, {
                params: params
            })
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async generateLandSuitabilityReport(payload) {
        try {
            const { data } = await axios.post(`${this.GENERATE_LAND_SUITABILITY_REPORT}`,payload)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async getLandSuitabilityDetail(suitabilityId) {
        try {
            const { data } = await axios.get(`${this.GET_LAND_SUITABILITY_REPORT_DETAILS}/${suitabilityId}`)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async getWeatherAnalysisLists(params) {
        try {
            const { data } = await axios.get(this.GET_WEATHER_ANALYSIS_LIST, {
                params: params
            })
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async downloadReport(payload,type){
        try {
            const data = await axios.post(type === 'land_suitability' ? this.DOWNLOAD_LAND_SUITABILITY_REPORT : this.DOWNLOAD_WEATHER_ANALYSIS_REPORT ,payload,{
                responseType: 'blob'
            })
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async generateWeatherAnalysisReport(payload) {
        try {
            const { data } = await axios.post(`${this.GENERATE_WEATHER_ANALYSIS_REPORT}`,payload)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async generateWeatherAnalysisDetail(analysisId) {
        try {
            const { data } = await axios.get(`${this.GET_WEATHER_ANALYSIS_REPORT_DETAILS}/${analysisId}`)
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async exportReport(type,exportType){
        try {
            const url = type === 'land_suitability' ? this.EXPORT_LAND_SUITABILITY_REPORT : this.EXPORT_WEATHER_ANALYSIS_REPORT;

            const data = await axios.get(`${url}/${exportType}`, {
                responseType: 'blob'
            });
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}