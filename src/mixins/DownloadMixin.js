import axios from "axios"

export default {
    methods: {
        async downloadSourceFile(fileUrl, type, fileName = 'downloaded-file') {
            return axios.get(fileUrl, { responseType: 'blob' })
                .then(response => {
                    const blob = new Blob([response.data], { type: type })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    URL.revokeObjectURL(link.href)
                    return Promise.resolve()
                }).catch(ee => {
                    // console.log(ee)
                    return Promise.reject(ee)
                })
        },

        downloadObject(data, fileName = 'downloaded-file', extension = '.json', dataPrefix = "data:text/json;charset=utf-8,") {
            const dataStr = dataPrefix + encodeURIComponent(data);
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", fileName + extension);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },

        async downloadSourceFileWithToken(fileUrl, type, oauthToken, fileName = 'downloaded-file') {
            console.log("ok")
            return new Promise((resolve, reject) => {
            axios.get(fileUrl, {
                headers: {
                    'oauth-token': oauthToken,
                    'Content-Type': 'application/pdf',
                },
                responseType: 'blob' 
            }).then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    URL.revokeObjectURL(link.href)
                    resolve("promise")
                }).catch(ee => {
                    // console.log(ee)
                    reject(ee)
                })
            })
        },

        async downloadSourceFileWithTokenPost(fileUrl, type, payload, oauthToken, fileName = 'downloaded-file') {
            return new Promise((resolve, reject) => {
                axios.post(fileUrl, payload, {
                    headers: {
                        'oauth-token': oauthToken
                    },
                    responseType: 'blob' 
                }).then(response => {
                        const blob = new Blob([response.data], { type: type })
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = fileName
                        link.click()
                        URL.revokeObjectURL(link.href)
                        resolve("promise")
                    }).catch(ee => {
                        // console.log(ee)
                        reject(ee)
                    })
            })
        },

        async downloadBlobFile(blobdata, fileName = 'downloaded-file') {
            const blob = new Blob([blobdata], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        },

        async downloadBlob(blob, fileName) {
            const parsedFileName = typeof fileName === 'string' || typeof fileName === 'number' ? fileName.toString() : Date.now().toString();
            const url = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a')
            downloadLink.href = url;
            downloadLink.download = parsedFileName;
            downloadLink.click();
            window.URL.revokeObjectURL(url);
        }
    },

}