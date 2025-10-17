import axios  from "axios"

export default {
    async addUser(data) {
        return await axios.post('register', data)
            .then(result => result.data)
            .catch( error => Promise.reject(error));
    },
    async getDDSUsers(role='producer',filter = {}) {
        const cleanObj = Object.fromEntries(
            Object.entries(filter).filter(([key, value]) => key && value !== null && value !== undefined)
        );
        const searchParams = new URLSearchParams(cleanObj);
        const qString = searchParams.toString();
        return await axios.get(`/dds_users/${role}?${qString}`)
            .then(result => result.data)
            .catch( error => Promise.reject(error));
    },
    async addDdsUser(data) {
        return await axios.post('dds_register', data)
            .then(result => result.data)
            .catch( error => Promise.reject(error));
    },
    async updateDdsUser(id,data) {
        return await axios.put(`dds_update/${id}`, data)
            .then(result => result.data)
            .catch( error => Promise.reject(error));
    },
    async toggleDdsUserStatus(userId,status) {
        return await axios.put(`/toggleDdsUserStatus/${userId}`,{
            status
        })
        .then(({data}) => data)
        .catch( error => Promise.reject(error.response));
    },

    async getOfflineUser(searchPhrase) {
      const param = {
        searchPhrase,
      }
      return await axios.get(`/coffee/farmers/offline`, {
        params: param
      })
      .then(({data}) => data)
      .catch(err => Promise.reject(err))
    },
    async addOfflineUser(data) {
      return await axios.post('/coffee/farmers', data)
      .then(result => result.data)
      .catch(error => Promise.reject(error))
    },
    async getUsers(dataOptions, userType, search='', fData) {
        var url = `/userList/${userType}`//?page=${dataOptions.page}&limit=${dataOptions.itemsPerPage}`
        // if(search != '')
        //     url = `${url}&searchPhrase=${search}`
        // if(dataOptions.sortBy.length)
            // url = `${url}&orderField=${dataOptions.sortBy[0]}&order=${dataOptions.sortDesc[0]? 'DESC': 'ASC'}`
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            searchPhrase: search,
            membershipRemainingDays: fData.membershipRemainingDays,
            membershipType: fData.membership_type,
            membershipValidity: fData.membership_validity
        }
        if(dataOptions.sortBy.length){
            requestParams.orderField = dataOptions.sortBy[0]
            requestParams.order = dataOptions.sortDesc[0]? 'DESC': 'ASC'
        }

        return await axios.get(url, {
            params: requestParams
        })
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async updateAppUser(userId, data) {
        return await axios.put(`/app-user/${userId}`, data)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async updateUser(userId, data) {
        return await axios.put(`/updateUser/${userId}`, data)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async uploadUsers(data) {
        return await axios.post('user/import', data)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async getFilesData(options, search = '') {
        const { page, itemsPerPage } = options;
        var url = `user/import?page=${page}&limit=${itemsPerPage}`
        if(search != '')
            url = `${url}&search=${search}`
        return await axios.get(url)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async searchUsers(search="") {
        var url = "/option/user?page=1&limit=1000"
        if(search.length > 0)
            url = `${url}&name=${search}`
        return await axios.get(url)
            .then(({data}) => data)
            .catch( error => Promise.reject(error));
    },
    async toggleUserStatus(userId) {
        return await axios.put(`/toggleUserActiveStatus/${userId}`)
        .then(({data}) => data)
        .catch( error => Promise.reject(error.response));
    },

    async getUsersConunt(userType) {
        var url = `/userCount/${userType}`
        try {
            const resp = await axios.get(url);
            // console.log('resp',resp)
            return resp.data.data.userCount
        } catch (err) {
            // console.log(err)
            return 0
        }
    },

    async getAppUsersRoles(plan = null) {
        var url = '';
        if(plan !== null){
            url = `/user/membership/getUserRoles/${plan}`;
        }else{
            url = `/user/userRole`;
        }
        try {
            const resp = await axios.get(url);
            return resp.data.data
        } catch (err) {
            return []
        }
    },

    async getKeyDetail(key) {
        return await axios.get(`/app-user/key/${key}`)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },
    async addAppUser(data) {
        return await axios.post('app-user', data, {
            headers: { 
              "Content-Type": "multipart/form-data"
            }
        }
      )
      .then(result => result.data)
      .catch( error => Promise.reject(error));
    },
    async addAppUserBuyingStation(data) {
        return await axios.post('app-user/buying-station', data, {
            headers: { 
                "Content-Type": "multipart/form-data"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },

    async getBulkUploadOptions() {
        try {
            var url = '/v2/user/bulk-upload/options';
            const {data} = await axios.get(url)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },
    async stageUserBulkUpload(data) {
        return await axios.post('/v2/user/bulk-upload/stage-user-bulk-upload', data, {
            headers: { 
                "Content-Type": "multipart/form-data"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
    async getEnterprises(params) {
        const { page, limit, searchParams, sortBy, sortType } = params;

        let url = `super-admin/enterprise?page=${page}&limit=${limit}`;

        if (searchParams.length > 2) {
            url = `${url}&search=${searchParams}`;
        }

        if (sortBy) {
            url = `${url}&sortBy=${sortBy}&sortType=${sortType ?? 'ASC'}`;
        }

        return await axios.get(encodeURI(url), {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch(error => Promise.reject(error));
    },
    async getEnterprise(id) {
        return await axios.get(encodeURI(`super-admin/enterprise/${id}`), {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch(error => Promise.reject(error));
    },
    async exportEnterprises(type = 'csv') {
        return await axios.get(encodeURI(`super-admin/enterprise/export?type=${type}`), {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch(error => Promise.reject(error));
    },
    async getEnterpriseUsers(id, status = null, params) {
        const { page, limit, searchParams, sortBy, sortType, country } = params;
        let url = `super-admin/enterprise/${id}/users?page=${page}&limit=${limit}`;

        if (status) {
            url = `${url}&status=${status}`
        }

        if (searchParams.length > 2) {
            url = `${url}&search=${searchParams}`;
        }

        if (sortBy) {
            url = `${url}&sortBy=${sortBy}&sortType=${sortType ?? 'ASC'}`;
        }

        if (country) {
            url = `${url}&country=${country}`;
        }

        return await axios.get(encodeURI(url), {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch(error => Promise.reject(error));
    },
    async getModules() {
        return await axios.get(encodeURI(`super-admin/enterprise/modules`), {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch(error => Promise.reject(error));
    },
    async saveEnterprise(data) {
        return await axios.post('super-admin/enterprise', data, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
    async saveEnterpriseModule(data) {
        return await axios.post('super-admin/enterprise/sidebar-menu', data, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
    async activateEnterprise(id, data) {
        return await axios.patch(`super-admin/enterprise/${id}/activate`, data, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
    async queueEnterpriseActivations(data) {
        return await axios.post(`super-admin/enterprise/activate`, data, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
    async deactivateUser(userId, roleId, data) {
        return await axios.post(`/user/role-exclusion/deactivate/${userId}/${roleId}`, data)
        .then(result => result)
        .catch( error => Promise.reject(error));
    },
    async reactivateUser(userId, roleId) {
        return await axios.post(`/user/role-exclusion/reactivate/${userId}/${roleId}`)
        .then(result => result)
        .catch( error => Promise.reject(error));
    },

    async getUserDetails(userId) {
        return await axios.get(`/user/${userId}`, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },
    
    async getExporterDetails(email) {
        return await axios.get(`/exporter/${email}`, {
            baseURL: process.env.VUE_APP_BASE_URL || 'https://sass-api-pre-prod.dimitra.dev/api/admin'
        })
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    async registerSocietyCompanyEstate(data) {
        return await axios.post('/register/society-company-estate-creation', data, {
            baseURL: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL.replace('/api/admin', '/api/public') : 'https://sass-api-pre-prod.dimitra.dev/api/public',
            headers: { 
                "Content-Type": "multipart/form-data"
            }
        })
        .then(result => result.data)
        .catch( error => Promise.reject(error));
    },
}