import axios  from "axios"

export default {
    async validateEmail(email) {
        return await axios.get(`/validateEmail?email=${email}`)
            .then(result => result.data)
            .catch( error => Promise.reject(error));
    },

    async sendOtp(type, payLoad){
        return await axios.post(`/forgot-password/${type}`, payLoad)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error.response); });
    },

    async verifyOtp(payLoad){
        return await axios.post(`/verify-otp/forgot-password`, payLoad)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error.response); });
    },

    async createPassword(payLoad){
        return await axios.post(`/create-password`, payLoad)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error.response); });
    },

    async resetPassword(payLoad){
        return await axios.put(`/user/reset-password`, payLoad)
        .then(({data}) => data)
        .catch(error => {return Promise.reject(error.response); });
    }

}