import axios  from "axios"

export default {
    async getRoleRequestData(roleId, status, search, dataOptions) {
        const url = "role-req";
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            userRoleFilter: roleId,
            statusFilter: status,
            searchPhrase: search
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

    async getRoleList(){
        const url = "role-req/user-role";
        try{
            const {data} = await axios.get(url)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async updateRoleRequest(id, roleData) {
        const url = `role-req/${id}`;

        try{
            const {data} = await axios.put(url, roleData)
            return Promise.resolve(data);
        }catch(e){
            return Promise.reject(e.response)
        }
    }
}