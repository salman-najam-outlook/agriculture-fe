import axios from "axios";

export default {
  async getTreeData(treeType, organizationId = null, subOrganizationId = null) {
    try {
      const params = {};
      if (organizationId) {
        params.organization = organizationId;
      }
      if (subOrganizationId) {
        params.subOrganizationId = subOrganizationId;
      }
      
      const { data } = await axios.get(`/coffee/${treeType}`, {
        params
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async createTreeType(treeType, treeData) {
    try {
      const { data } = await axios.post(`/coffee/${treeType}`, treeData);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async updateTreeType(id, treeType, treeData) {
    try {
      const { data } = await axios.put(`/coffee/${treeType}/${id}`, treeData);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async deleteTreeType(treeType, id) {
    try {
      const { data } = await axios.delete(`/coffee/${treeType}/${id}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async getCoffeeVariety(dataOptions, organizationId = null, subOrganizationId = null) {
    try {
      const requestParams = {
        page: dataOptions.page,
        limit: dataOptions.itemsPerPage,
        coffeeSpecies: dataOptions.coffeeSpecies,
      };
      
      if (organizationId) {
        requestParams.organization = organizationId;
      }
      if (subOrganizationId) {
        requestParams.subOrganizationId = subOrganizationId;
      }
      
      if (dataOptions.sortBy.length) {
        requestParams.name = dataOptions.sortBy[0];
        requestParams.sortingType = dataOptions.sortDesc[0] ? "DESC" : "ASC";
      }
      const { data } = await axios.get(`/coffee/coffeeVariety`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async createCoffeeVariety(coffeeData) {
    try {
      const { data } = await axios.post(`/coffee/coffeeVariety`, coffeeData);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async deleteCoffeeVariety(id) {
    try {
      const { data } = await axios.delete(`/coffee/coffeeVariety/${id}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async getCoffeeSpecies(dataOptions, organizationId = null, subOrganizationId = null) {
    try {
      const requestParams = {
        page: dataOptions.page,
        limit: dataOptions.itemsPerPage,
      };
      
      if (organizationId) {
        requestParams.organization = organizationId;
      }
      if (subOrganizationId) {
        requestParams.subOrganizationId = subOrganizationId;
      }
      
      if (dataOptions.sortBy.length) {
        requestParams.name = dataOptions.sortBy[0];
        requestParams.sortingType = dataOptions.sortDesc[0] ? "DESC" : "ASC";
      }
      const { data } = await axios.get(`/coffee/coffeeSpecies`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async getMemberDataCoffeeSpecies(organizationId = null, subOrganizationId = null) {
    try {
      const params = {};
      if (organizationId) {
        params.organization = organizationId;
      }
      if (subOrganizationId) {
        params.subOrganizationId = subOrganizationId;
      }
      
      const { data } = await axios.get(`/coffee/memberData/coffeeSpecies`, {
        params
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  
  async getMemberDataCoffeeVariety(dataOptions, organizationId = null, subOrganizationId = null) {
    try {
      const requestParams = {
        coffeeSpecies: dataOptions.coffeeSpecies,
      };

      if (organizationId) {
        requestParams.organization = organizationId;
      }
      if (subOrganizationId) {
        requestParams.subOrganizationId = subOrganizationId;
      }

      const { data } = await axios.get(`/coffee/memberData/coffeeVariety`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  
  async createCoffeeSpecies(speciesData) {
    try {
      const { data } = await axios.post(`/coffee/coffeeSpecies`, speciesData);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async deleteCoffeeSpecies(id) {
    try {
      const { data } = await axios.delete(`/coffee/coffeeSpecies/${id}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async updateCoffeeSpecies(id, speciesData) {
    try {
      const { data } = await axios.put(
        `/coffee/coffeeSpecies/${id}`,
        speciesData
      );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async updateCoffeeVariety(id, varietyData) {
    try {
      const { data } = await axios.put(
        `/coffee/coffeeVariety/${id}`,
        varietyData
      );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },

  async getCoffeeTypes() {
    try {
      const { data } = await axios.get(`/coffee/coffee-types`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response ?? err.request);
    }
  },

    async getCoffeeData(dataOptions, search, organizationId = null, subOrganizationId = null) {
        const url = `/coffee/buying-station/processing-batch-for-dds`
        const requestParams = {
            page: dataOptions.page,
            limit: dataOptions.itemsPerPage,
            searchPhrase: search,
        }

        if (organizationId) {
          requestParams.organization = organizationId;
        }
        if (subOrganizationId) {
          requestParams.subOrganizationId = subOrganizationId;
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
}
