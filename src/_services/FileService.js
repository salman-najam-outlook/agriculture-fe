import axios from "axios";

// const url = process.env.VUE_APP_EPD_BASE_URL || 'https://livestock-epd-nodeapi-dev.dimitra.dev';
//const serverUrl = process.env.VUE_APP_EPD_BASE_URL || 'http://localhost:3020/api';
const apiUrl = process.env.VUE_APP_BASE_URL.replace("/admin", "");

export default {
    async getFile(url) {
        return await axios({method: 'GET', url: url, baseURL: null, responseType: 'blob'}).then(response => {
            const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

            return {success: true, blob};
        }).catch((error) => {
            return Promise.reject(error.response);
        })
    },
    async getFileStream(url) {
        return await axios({method: 'GET', url: url, baseURL: null, responseType: 'stream'}).then(response => {
            return response;
        }).catch((error) => {
            return Promise.reject(error.response);
        })
    },
    //salman
    async sendFile(endpoint, data, progressFunc) { // const token = localStorage.getItem('token')
         //salman
        const progressConfig = {
            onUploadProgress: progressFunc ?? (() => {}),
            //salman
            // headers: {
            //     'oauth-token': token
            // }
            //salman
        };

        return await axios.post(`${apiUrl}/${endpoint}`, data, progressConfig).then(({data}) => data).catch(error => Promise.reject(error));
    },

    async uploadFile( file, isPublic = true, directoryName){
        return await axios.post(`${apiUrl}/media/presigned-url`,
            {
                filename: file.name,
                mimeType: file.type,
                isPublic,
                directory: directoryName
            },
            //salman
            // {
            //     headers: {
            //         'oauth-token': token
            //     }
            // }
            //salman
        ).then(({data}) => data).catch(error => Promise.reject(error));
    },

    async getObjectURL(key, isPublic = true) {
        return await axios.post(`${apiUrl}/media/url`, {
            key,
            isPublic,
        }, 
        //salman
        // {
        //     headers: {
        //         'oauth-token': localStorage.getItem('token'),
        //     },
        // }
        //salman
    ).then(({ data }) => data).catch(error => Promise.reject(error));
    }
}
