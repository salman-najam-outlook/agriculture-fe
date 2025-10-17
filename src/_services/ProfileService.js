import axios  from "axios"

export default {
    async getUserData(id) {
        return await axios.get(`/user/${id}`)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error); });
    },
    async getProfileData() {
        return await axios.get('/user/profile')
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error); });
    },

    async imageUpdate(data){
        return await axios.put('/user/profile-picture', data)
        .then(({data}) => data)
        .catch( error => Promise.reject(error));
    },

    checkRole(role) {
        const user = JSON.parse(localStorage.getItem("user"));
        let hasRole = false;

        for (const roleObj of user.user_role_assoc) {
            if (roleObj.id === role) {
                hasRole = true;
                break;
            }
        }
        
        return hasRole;
    },

    async updateProfileData(data) {
        return await axios.put('/user/profile', data)
        .then(result => {return result; })
        .catch(error => {return Promise.reject(error); });
    },

    async updatePassword(data) {
        return await axios.put('/user/change-password', data)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error.response); });
    },

    async sendEmailVerifyOTP() {
        return await axios.post('user/verify-email')
        .then(result => result)
        .catch( error => Promise.reject(error));
    }, 

    async verifyEmailOtp(data) {
        return await axios.put('user/verify-email', data)
        .then(result => result)
        .catch( error => Promise.reject(error));
    },

    async getLanguages() {
        return await axios.get('public/language')
        .then(result => result)
        .catch( error => Promise.reject(error));
    }
}