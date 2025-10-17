import axios  from "axios"
export default {
     GET_FARMS_URL : '/member-data/farms',
     GET_USER_FARM: '/member-data/farms/user-farms',
     GET_FARMS_ACTIVITY: '/member-data/farms/activity',
     GET_FARM_USER_INFO_URL : '/member-data/farms/userInfo',
     CHANGE_FARM_STATUS_URL : '/member-data/farms/changeStatus/:farmId',
     CHANGE_FARM_LIMIT_URL : '/member-data/farms/changeFarmLimit/:userId',
     DOWNLOAD_FARMS_CSV_URL: '/member-data/farms/download-csv',
     DOWNLOAD_FARMERS_CSV_URL: '/member-data/farmers/download-csv',
     DOWNLOAD_FARMS_ACTIVITY_URL: '/member-data/farms/activity/export-report',
     GET_FARMERS_URL : '/member-data/farmers',
     GET_FARMER_DETAIL_URL : '/member-data/farmers/farm-detail-info',
     GET_FARMER_VIEW_ALL_FARMS: '/member-data/farmers/view-all-farms',
     GET_FARM_VIEW_ON_MAP : '/member-data/farmers/show-on-maps',
     GET_FARMS_BY_FARMERS: '/member-data/farms/by-farmers',

    /** Farms Services */
    async getFarms(queryParam = {}){
        try{
            const {data} = await axios.get(this.GET_FARMS_URL, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        }
    },

    async getFarmsActivity(queryParam = {}){
        try{
            const {data} = await axios.get(this.GET_FARMS_ACTIVITY, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        } 
    },

    async getUserFarms(queryParam = {}){
        try{
            const {data} = await axios.get(this.GET_USER_FARM, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        } 
    },
    
    async getFarmUserInfo(queryParam = {}){
        try{
            const {data} = await axios.get(this.GET_FARM_USER_INFO_URL,{
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        }
    },

    async handleChangeFarmStatus(farmId, options={}){
        try {
            const {data} = await axios.put(this.CHANGE_FARM_STATUS_URL.replace(':farmId', farmId), options)
            return Promise.resolve(data)
        } catch(error) {
            return Promise.reject(error.response)
        }
    },

    async handleChangeUserFarmLimit(userId, options={}) {
        try {
            const {data} = await axios.put(this.CHANGE_FARM_LIMIT_URL.replace(':userId', userId), options)
            return Promise.resolve(data)
        } catch(error) {
            return Promise.reject(error.response)
        }
    },

    /** Farmers Services */
    async getFarmers(queryParam = {}){
        try{
            const {data}  = await axios.get(this.GET_FARMERS_URL, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        }
    },

    async getFarmersDetails(queryParam) {
        try {
            const {data} = await axios.get(this.GET_FARMER_DETAIL_URL, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error){
            return Promise.reject(error.response)
        }
    },

    async getFarmOnMapView(queryParam){
        try{
            const {data} = await axios.get(this.GET_FARM_VIEW_ON_MAP, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error) {
            return Promise.reject(error.response)
        }
    },

    async getFarmersViewAllFarms(queryParam){
        try{
            const {data} = await axios.get(this.GET_FARMER_VIEW_ALL_FARMS, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error) {
            return Promise.reject(error.response)
        }
    },

    async getFarmsByFarmers(queryParam){
        try{
            const {data} = await axios.get(this.GET_FARMS_BY_FARMERS, {
                params:queryParam
            })
            return Promise.resolve(data)
        }catch(error) {
            return Promise.reject(error.response)
        }
    }
}
