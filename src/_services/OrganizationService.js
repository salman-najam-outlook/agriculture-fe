import axios from "axios";

export default {
  async uploadOrganizationLogo(logo) {
    return await axios
      .put("/organization/logo", {
        base64Logo: logo,
      })
      .then((result) => result)
      .catch((error) => Promise.reject(error));
  },
  async uploadOrganizationSplash(splash) {
    return await axios
      .put("/organization/splash-screen", {
        base64Splash: splash,
      })
      .then((result) => result)
      .catch((error) => Promise.reject(error));
  },
  async getorganization() {
    return await axios
      .get("/organization")
      .then((result) => result)
      .catch((error) => Promise.reject(error));
  },
  async updateData(data){
    return await axios
      .put("/organization/update",data)
      .then((result) => result)
      .catch((error) => Promise.reject(error));
  },

  async updateHideShowLoginSplash(data){
    return await axios
      .put("/organization/update-hide-show-logo-splash",data)
      .then((result) => result)
      .catch((error) => Promise.reject(error));
  }
};
