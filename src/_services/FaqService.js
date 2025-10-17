import axios  from "axios"

export default {

    getAllFaq(){
        return axios.get('../faq')
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    getAllTopics(){
        return axios.get('../faq/get/topics')
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    createTopic(topicData){
        return axios.post('../faq/topic', topicData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    createFaq(faqData){
        return axios.post('../faq', faqData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    deleteFaq(faqData){
        return axios.delete('../faq/deleteFaq', {
            data: faqData
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    updateFaq(id,faqData){
        return axios.put(`../faq/${id}`, faqData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    deleteFaqImage(deleteData){
        return axios.delete('../faq/deleteImage', {
            data: deleteData
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    updateTopic(id,topicData) {
        return axios.put(`../faq/topic/${id}`, topicData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    deleteTopic(topicData){
        return axios.delete('../faq/deleteTopic', {
            data: topicData
        })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

}