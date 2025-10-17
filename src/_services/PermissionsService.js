import axios from "axios"
import isEmpty from 'lodash'
import store from "../store"
var departmentUrl = 'user/department'
var roleUrl = 'roles'
var permissionUrl = 'user/permissions'
export default {
    async getDepartments(data, search) {
        var url = `${departmentUrl}?page=${data.page}&limit=${data.itemsPerPage}`;
        if(data.sortBy.length === 1 && data.sortDesc.length === 1)
            url = `${url}&col=${data.sortBy[0]}&desc=${data.sortDesc[0]}`
        if(search.length)
            url = `${url}&search=${search}`
        return await axios.get(url)
        .then(({data}) => data)
        .catch( err => err)
    },
    async createDepartment(department){
        return await axios.post(departmentUrl, department)
        .then(({data}) => data)
        .catch( err => err)
    },
    async updateDepartment(department){
        return await axios.put(departmentUrl, department)
        .then(({data}) => data)
        .catch( err => err)
    },

    async getRoles(data, department, search) {
        var url = `${roleUrl}?page=${data.page}&limit=${data.itemsPerPage}&department=${department}`;
        if(search.length)
            url = `${url}&search=${search}`
        return await axios.get(url)
        .then(({data}) => data)
        .catch( err => err)
    },
    async createRole(role){
        return await axios.post(roleUrl, role)
        .then(({data}) => data)
        .catch( err => err)
    },
    async updateRole(id,role){
    return await axios.put(`${roleUrl}/${id}`, role)
        .then(({data}) => data)
        .catch( err => err)
    },
    async getDeptList(){
        // console.log(data)
        // var url = `departments?page=${data.page}&limit=${data.itemsPerPage}&col=${data.sortBy[0]}&desc=${data.sortDesc[0]}`;
        var url = `departments`;
        try {
            const resp = await axios.get(url);
            return resp.data.data.deptRows;
        } catch (err) {
            // console.log(err)
            return []
        }
    },
    async getRoleList(data){
        var url = `roles?page=${data.page}&limit=${data.itemsPerPage}&col=${data.sortBy[0]}&desc=${data.sortDesc[0]}`;
        try {
            const resp = await axios.get(url);
            // console.log('aaa', resp)
            return resp.data.data.listRes.rows;
        } catch (err) {
            // console.log(err)
            return []
        }
    },

    async getRolePermissions(role) {
        var url = `getAllModulesPermissions/${role}`
        try {
            const resp = await axios.get(url);
            if(isEmpty(resp.data.data)){
                return resp.data.data
            }
            else    
                return []
        } catch (err) {
            // console.log(err)
            return []
        }
    },

    async updateRolePermissions(permissions) {
        try {
            const resp = await axios.put(permissionUrl, permissions);
            return resp.data
        } catch (err) {
            // console.log(err.response.data)
            return []
        }
    },

    async getAppSettings(){
        try {
            const resp = await axios.get('getProfileAuthenticationSettings');
            return resp.data
        } catch (err) {
            // console.log(err.response.data)
            return []
        }
    },

    async getGlobalSettings(){
        try {
            const resp = await axios.get('global-setting');
            await store.dispatch('setGlobalSettings', resp.data.data.globalSetting)
            return resp.data
        } catch (err) {
            // console.log(err.response.data)
            return []
        }
    },

    async allModulesPermissions(role) {
        var url = `allModulesPermissions/${role}`
        try {
            const resp = await axios.get(url);
            if(isEmpty(resp.data.data)){
                return resp.data.data
            }
            else    
                return []
        } catch (err) {
            // console.log(err)
            return []
        }
    },

    async updateAppPermissions(data) {
        // return await axios.put('/changeModulePermission', data)
        return await axios.put('/user/membership/changeModulePermission', data)
        .then(({data}) => data)
        .catch( err => err)
    },

    async updateAdminPermissions(data) {
        // return await axios.put('/changeModulePermission', data)
        return await axios.put('/changeModulePermission', data)
        .then(({data}) => data)
        .catch( err => err)
    },

    async updateAppSettings(data) {
        return await axios.put('/updateProfileAuthenticationSettings', data)
        .then(({data}) => data)
        .catch( err => err)
    },

    async updateGlobalSettings(data) {
        return await axios.put('/global-setting', data)
        .then(({data}) => data)
        .catch( err => err)
    },

    async getAllMembershipType() {
        const res = await axios.get('/user/membership/all')
        if (res) {
            return res.data
        }
    },

    async getAllModulePermissionsByMembership (id, role) {
        const res = await axios.get(`/user/membership/allModulesPermissions/${id}?user_role_id=${role}`)
        if (res) {
            return res.data
        }
    },

    async searchModulePermission (type, query) {
        const res = await axios.get(`/user/membership/allModulesPermissions/${type}?searchPhrase=${query}`)
        if (res) {
            return res.data
        }
    },
    
    async changeDefaultMembershipType (id) {
        const res = await axios.put(`/user/membership/updateDefaultMembership/${id}`)
        if (res) {
            return res.data
        }
    }
    
}