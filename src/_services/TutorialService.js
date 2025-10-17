import axios from "axios"

export default {
    // Get tutorials for current user's organization
    getTutorials(params = {}) {
        return axios.get('../tutorials', { params })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    // Get all tutorials for admin management
    getAllTutorials(params = {}) {
        return axios.get('../tutorials/admin/all', { params })
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    // Create a new tutorial (admin)
    createTutorial(tutorialData) {
        return axios.post('../tutorials', tutorialData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    // Update a tutorial (admin)
    updateTutorial(id, tutorialData) {
        return axios.put(`../tutorials/${id}`, tutorialData)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    },

    // Delete a tutorial (admin)
    deleteTutorial(id) {
        return axios.delete(`../tutorials/${id}`)
        .then(({data}) => data)
        .catch(({response}) => Promise.reject(response))
    }
}

