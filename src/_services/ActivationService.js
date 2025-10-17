import axios  from "axios"

export default {

    async getActivationKeyList() {
        return axios.get('/user/activation/activationKeys')
        .then(result => result.data)
        .catch((err) => Promise.reject(err.response))
    },

    async getSalesManagers() {
        try{
            const {data} = await axios.get('/user/activation/salesManager')
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async getAllMemberships(id = null) {
        try{
            var url = '';
            if(id){
                url = `/user/membership/all?roleId=${id}`;
            }else{
                url = `/user/membership/all`;
            }
            const {data} = await axios.get(url)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async getAllRoles() {
        try{
            const {data} = await axios.get('/user/membership/user-role ')
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

}