import axios from "axios"

export default {
    async getLogs(date, userType, role, searchPhrase = '', org_id) {
        var url=`logs/${date}`
        var params = {
            user: userType,
            role: role,
            org_id: org_id
        }
        if(searchPhrase.length)
           params.searchPhrase = searchPhrase

        return await axios.get(url, {params})
        .then(({data}) => data)
        .catch( err => err)
    },
}