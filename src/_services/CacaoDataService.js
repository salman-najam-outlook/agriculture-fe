import axios  from "axios"

export default {

    async getCacaoTreeData(treeType){
        try{
            const {data} = await axios.get(`/cacao/cacao-data/cacao-trees/${treeType}`)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async createCacaoTreeType(treeType, treeData){
        try{
            const {data} = await axios.post(`/cacao/cacao-data/cacao-trees/${treeType}`, treeData)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async updateCacaoTreeType(id, treeType, treeData){
        try{
            const {data} = await axios.put(`/cacao/cacao-data/cacao-trees/${treeType}/${id}`, treeData)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async deleteCacaoTreeType(treeType, id){
        try{
            const {data} = await axios.delete(`/cacao/cacao-data/cacao-trees/${treeType}/${id}`)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async getCacaoBuySellOverview(params){
        try{
            const {data} = await axios.get(`/cacao/overview`, {params})
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async getCacaoData(dataOptions, search) {
        const url = `/cacao/buying-station/cacao-fermentation-process`
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            searchPhrase: search,
        }

        // if(dataOptions.sortBy.length){
        //     requestParams.orderField = dataOptions.sortBy[0]
        //     requestParams.order = dataOptions.sortDesc[0]? 'DESC': 'ASC'
        // }


        try{
            const {data} = await axios.get(url, {
                params: requestParams
            })
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },
    async getCacaoBuySellOverviewList(params){

        try{
            const {data} = await axios.get(`/cacao/overview/list`, {params})
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },
    async getCacaoBuySellDetails(params,id){

        try{
            const {data} = await axios.get(`/cacao/overview/${id}`, {params})
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    // getFarmCountries
    async getFarmCountries(){
        try{
            const {data} = await axios.get(`/cacao/overview/countries`)
            return Promise.resolve(data);
        }catch(err){
            return Promise.reject(err.response)
        }
    },

    async downloadCacaoOverview(params){
      try{
          const data = await axios.get(`/cacao/overview/download`, {
            params,
            responseType: 'blob',
          })
          return Promise.resolve(data);
      }catch(err){
          return Promise.reject(err.response)
      }
    },
    async downloadCacaoOverviewDetails(params,id){
      try{
        const data = await axios.get(`/cacao/overview/download/${id}`, {
          params,
          responseType: 'blob',
        })
        return Promise.resolve(data);
    }catch(err){
        return Promise.reject(err.response)
    }
    },
}