import axios from "axios";

export default {
  async importBuyingStationData({ buyingStationId, data}) {
    try {
      const response = await axios.post(`coffee/buying-station/purchase-order/import`, {
        buyingStationId,
        data
      })
      return Promise.resolve(response);
    } catch(err) {
      return Promise.reject(err.response);
    }
  },
  async getBuyingStationList(dataOptions) {
    const requestParams = {
      page: dataOptions.page,
      limit: dataOptions.limit,
      search: dataOptions.search,
      order: dataOptions.order,
    }
    try {
      const { data } = await axios.get(`coffee/buying-station/purchase-order/list`, {
        params: requestParams
      })
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async updateBuyingStation(updatePayload) {
    try {
      let payload = {
        buyingStation: updatePayload.buyingStation,
        buyingStationId: updatePayload.buyingStationId,
        parentAccount: updatePayload?.parentAccount,
      }
      const { data } = await axios.post(`coffee/buying-station/purchase-order/update`, payload , {
        params: { status: updatePayload.status }
      })
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getBuyingStationData(dataOptions, search = "") {
    const requestParams = {
      page: dataOptions.page,
      limit: dataOptions.itemsPerPage,
      search: search,
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async listBuyingStations(dataOptions) {
    const requestParams = {
      page: dataOptions.page,
      limit: dataOptions.limit,
      search: dataOptions.search,
      col: dataOptions.orderField || 'id',
      // Fallback to DESC when order is missing; ensure proper casing
      desc: (dataOptions.order || 'DESC').toUpperCase() === 'DESC' ? 'true' : 'false'
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station`, {
        params: requestParams
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async deleteBuyingStation(id) {
    try {
      const { data } = await axios.delete(`/coffee/buying-station/${id}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async activateBuyingStation(id) {
    try {
      const { data } = await axios.put(`/coffee/buying-station/${id}/activate`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async deactivateBuyingStation(id) {
    try {
      const { data } = await axios.put(`/coffee/buying-station/${id}/deactivate`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getBuyingStationDetails(id) {
    try {
      const { data } = await axios.get(`/coffee/buying-station/${id}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getSingleBuyingStationPurchaseOrder(id, dataOptions, search = "") {
    const requestParams = {
      page: dataOptions.page || 1,
      limit: dataOptions.itemsPerPage || dataOptions.limit || 10,
      view: dataOptions.toggleView,
      timePeriod: dataOptions.viewBy,
      search: search,
      startDate: dataOptions.startDate,
      endDate: dataOptions.endDate
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/purchase-order/list/${id}`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getSingleBuyingStationPurchaseOrderExport(id, dataOptions, type) {
    const requestParams = {
      startDate: dataOptions.startDate,
      endDate: dataOptions.endDate
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/purchase-order/list/${id}/${type}`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },

  async getSingleBuyingStationPurchaseOrderExportByCalendar(id, dataOptions, type) {
    try {
      dataOptions.limit = dataOptions.itemsPerPage 
      dataOptions.timePeriod = dataOptions.viewBy
      const { data } = await axios.get(`/coffee/buying-station/purchase-order/calendar-list/${id}/${type}`, {
        params: dataOptions,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },



  async getSingleBuyingStationProcessingBatchExport(id, dataOptions, type) {
    const requestParams = {
      startDate: dataOptions.startDate,
      endDate: dataOptions.endDate
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/processing-batch/list/${id}/${type}`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getSingleBuyingStationProcessingBatch(id, dataOptions, search = "") {
    const requestParams = {
      page: dataOptions.page || 1,
      limit: dataOptions.itemsPerPage || dataOptions.limit || 10,
      search: search,
      startDate: dataOptions.startDate,
      endDate: dataOptions.endDate
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/processing-batch/list/${id}`, {
        params: requestParams,
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getPurchaseOrder(id) {
    try {
      const { data } = await axios.get(
        `/coffee/buying-station/purchase-order/${id}`
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async deletePurchaseOrder(id) {
    try {
      const { data } = await axios.delete(
        `/coffee/buying-station/purchase-order`,
        {
          data: { orderId: id },
        }
      );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getProcessBatch(id) {
    try {
      const { data } = await axios.get(
        `/coffee/buying-station/processing-batch/${id}`
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async deleteProcessBatch(id) {
    try {
      const { data } = await axios.delete(
        `/coffee/buying-station/processing-batch`,
        {
          data: { batchId: id },
        }
      );
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getFarmers() {
    try {
      const { data } = await axios.get(`/coffee/farmers`, {
        params: {
          page: 1,
          limit: 1000,
        },
      });
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async getFarms(farmerId) {
    try {
      const { data } = await axios.get(`/coffee/farm/${farmerId}`);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async exportOffilneFarmer(dataOptions, type) {
    const requestParams = {
      page: dataOptions.page,
      limit: dataOptions.limit,
      search: dataOptions.search,
      order: dataOptions.order,
    }
    try {
      const { data } = await axios.get(`coffee/buying-station/purchase-order/download/${type}`, {
        params: requestParams
      })
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getAssociatedFarms(buyingStationId, dataOptions) {
    const requestParams = {
      page: dataOptions.page || 1,
      limit: dataOptions.limit || 10,
      search: dataOptions.search || '',
      deforestationStatus: dataOptions.deforestationStatus || null,
      orderField: dataOptions.orderField || 'id',
      order: dataOptions.order || 'ASC'
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/${buyingStationId}/associated-farms`, {
        params: requestParams
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getFarmDetails(buyingStationId, farmId) {
    try {
      const { data } = await axios.get(`/coffee/buying-station/${buyingStationId}/associated-farms/${farmId}`);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getAssociatedFarmsExport(buyingStationId, dataOptions, type) {
    const requestParams = {
      page: dataOptions.page || 1,
      limit: dataOptions.limit || 10,
      search: dataOptions.search || '',
      deforestationStatus: dataOptions.deforestationStatus || null
    };
    try {
      const { data } = await axios.get(`/coffee/buying-station/${buyingStationId}/associated-farms/${type}`, {
        params: requestParams
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
};
