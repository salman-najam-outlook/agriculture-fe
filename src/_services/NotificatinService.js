import axios  from "axios"

export default {

    createNotifications(notificationData){
        return axios.post('/notification', notificationData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    getNotifications(params){
        return axios.get('/notification', {
            params: params
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    readNotification(ids){
        const notiData = {
            notificationId: ids
        }
        return axios.put('/notification/read', notiData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    getSentNotifications(params){
        return axios.get('/notification/sent', {
            params: params
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    getSentNotificationsById(params){
        return axios.get('/notification/sent/:notificationId', {
            params: params
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },
}