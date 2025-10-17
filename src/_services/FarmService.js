import axios from "axios";

export default {
  async addFarm(data) {
    return await axios
      .post("farm", data)
      .then((result) => result.data)
      .catch((error) => Promise.reject(error.response));
  },

  async uploadDocument(formData) {
    return await axios
      .post("farm/farm_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => result.data)
      .catch((error) => Promise.reject(error.response));
  },

  async getFarm(id) {
    var url = `farm/${id}`;
    return await axios
      .get(url)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async getFarmZoneByLocationId(id, page, limit, search) {
    var url = `farm/location/zone/${id}`;
    return await axios
      .get(url, {
        params: {
          search,
          limit,
          page,
        },
      })
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async getFarmLocationByFarmId(id) {
    var url = `farm/location/${id}`;
    return await axios
      .get(url)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async getZoneGeofence(id) {
    var url = `farm/location/geofence/${id}`;
    return await axios
      .get(url)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async getFarmLocation(id) {
    var url = `farm/location/farmlocation/${id}`;
    return await axios
      .get(url)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async createFarmLocation(data) {
    var url = `farm/location/farmlocation`;
    return await axios
      .post(url, data)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async updateFarmLocation(locationId, data) {
    var url = `farm/location/farmlocation/${locationId}`;
    return await axios
      .put(url, data)
      .then(({ data }) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async editFarm(data) {
    var url = `farm/`;
    return await axios
      .put(url, data)
      .then((result) => result.data)
      .catch((error) => Promise.reject(error.response));
  },

  async loadUsers() {
    return await axios
      .get("/option/user?page=1&limit=1000")
      .then(({ data }) => data)
      .catch((error) => Promise.reject(error));
  },

  async loadCountries() {
    return await axios
      .get("/farm/countries/all")
      .then((data) => data.data)
      .catch((error) => Promise.reject(error));
  },
  async loadStates(id) {
    let url = `/farm/states/${id}`;
    return await axios
      .get(url)
      .then((data) => data.data)
      .catch((error) => Promise.reject(error));
  },
  async loadCities(id) {
    let url = `/option/city?state=${id}`;
    return await axios
      .get(url)
      .then((data) => data.data)
      .catch((error) => Promise.reject(error));
  },

  async loadFarmOptions(groupName) {
    let url = `/farm/options?groupName=${groupName}`;
    return await axios
      .get(url)
      .then(({ data }) => data.data.info)
      .catch((error) => Promise.reject(error));
  },

  async deactiveFarm(id) {
    var url = `farm`;
    return await axios
      .delete(url, {
        data: { farmId: id },
      })
      .then(({ data }) => Promise.resolve(data))
      .catch((error) => Promise.reject(error));
  },

  async createSegment(data) {
    let url = `farm/segment`;
    return await axios
      .post(url, data)
      .then(({ data }) => Promise.resolve(data))
      .catch((error) => console.error(error));
  },
  async deleteSegment(id) {
    let url = `farm/segment`;
    return await axios
      .delete(url, {
        data: {
          id,
        },
      })
      .then(({ data }) => Promise.resolve(data))
      .catch((error) => console.error(error));
  },
  async updateSegment(data) {
    let url = `farm/segment`;
    return await axios
      .put(url, data)
      .then(({ data }) => Promise.resolve(data))
      .catch((error) => console.error(error));
  },
  async getFarmCalenderActivities(params) {
    let url = `farm/farm-calendar-activities`;
    try {
      const { data } = await axios.get(url, { params });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async getFarmCalenderActivitiesOptions() {
    let url = `farm/farm-calendar-activities/options`;
    try {
      const { data } = await axios.get(url);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async downloadFarmCalenderActivities(params) {
    let url = `farm/farm-calendar-activities/calendar-view-download`;
    try {
      const data = await axios.get(url, {
        params,
        responseType: "blob",
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
  async downloadFarmCalenderActivitiesList(params) {
    let url = `farm/farm-calendar-activities/list-view-download`;
    try {
      const data = await axios.get(url, {
        params,
        responseType: "blob",
      });
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err.response);
    }
  },
};
