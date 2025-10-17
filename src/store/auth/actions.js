import axios from "axios";

export default {
  async checkAuth(context, data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", data)
        .then((response) => {
          response = response.data;
          if (response.success) {
            const user = response.data;
            context.commit("setUserData", user);
            resolve({ success: "ok" });
          } else {
            reject(response.message);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async autoLogin(context) {
    const user = await JSON.parse(localStorage.getItem("user"));
    const token = await localStorage.getItem("token");
    const refToken = await localStorage.getItem("refreshtoken");
    if (user && token) {
      await context.commit("setUserData", user);
      await context.commit("setAuthToken", token);
      await context.commit("setRefreshToken", refToken);
    }
  },

  async logout(context) {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('refreshtoken');
    context.commit("unsetUser");
    // Clear farmers data
    context.dispatch("memberData/clearFarmersOptions", null, { root: true });
    // await axios.post('/logout',{})
    //     .then( (response) => {
    //         console.log(response)
    //     })
    //     .catch( () => {
    //         context.commit('unsetUser');
    //     });
  },

  async forgotPassword(context, payLoad) {
    let type = payLoad.type;
    delete payLoad["type"];
    return await axios
      .post("/user/forgot-password/" + type, payLoad)
      .then((res) => {
        res = res.data;
        if (!res.success) {
          throw res.message;
        }
        context.commit("setTempToken", res.data.token);
      })
      .catch((err) => {
        throw err;
      });
  },

  async verifyForgotPasswordOtp(context, payLoad) {
    return await axios
      .post("/user/verify-otp/forgot-password", payLoad)
      .then((res) => {
        res = res.data;
        if (!res.success) {
          throw res.message;
        }
        context.commit("setAuthToken", res.data.token);
        // axios.defaults.headers.common['oauth-token'] = `${res.data.token}`
      })
      .catch((err) => {
        throw err;
      });
  },

  async createUserPassword(context, payLoad) {
    return await axios
      .post("/user/create-password", payLoad)
      .then((res) => {
        res = res.data;
        return res;
        // console.log('frg', res);
      })
      .catch((err) => {
        throw err;
      });
  },

  async refreshToken(context) {
    const token = context.getters.getAuthToken;
    const refershToken = context.getters.getRefreshToken;
    return await axios
      .post("/access-token", {
        accesstoken: token,
        refreshtoken: refershToken,
      })
      .then((res) => {
        res = res.data;
        if (!res.success) {
          context.dispatch("logout");
          throw res.message;
        }
        context.commit("setAuthToken", res.data.accesstoken);
        context.commit("setRefreshToken", res.data.refreshtoken);
      })
      .catch((err) => {
        throw err;
      });
  },

  async setModulePermittedActions(context, payload) {
    await context.commit("setModulePermittedActions", payload);
  },

  async setGlobalSettings(context, payload) {
    await context.commit("setGlobalSettings", payload);
  },
};
