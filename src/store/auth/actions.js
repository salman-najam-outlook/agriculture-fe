import axios from "axios";
import router from "../../router/index";

export default {
  async checkAuth(context, data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", data)
        .then((response) => {
          response = response.data;
          if (response.success) {
            const user = response.data; 
            
            // Check if MFA is required
            if (user.mfa_required) {
              // Return MFA data without setting user data
              resolve({ 
                success: true,
                data: user,
                message: response.message
              });
              return;
            }
            
            // Regular login flow (no MFA)
            context.commit("setUserData", user);
            localStorage.setItem('isAuthenticated', 'true');
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

  async verifyMfa(context, data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/verify-mfa", data)
        .then((response) => {
          response = response.data;
          if (response.success) {
            const user = response.data;
            // Set user data after successful MFA verification
            context.commit("setUserData", user);
            localStorage.setItem('isAuthenticated', 'true');
            resolve({ 
              success: true, 
              data: user,
              message: response.message
            });
          } else {
            resolve({
              success: false,
              message: response.message || 'Invalid verification code'
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  //salman
async autoLogin(context) {
  try {
    const response = await axios.get("/user-data");
    if (response.data.success) {
      context.commit("setUserData", response.data.data);
    }
  } catch (error) {
   console.log(error);
  }
},
  //salman

  async logout(context) {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('refreshtoken');
    // Clear farmers data
 
    //salman
    await axios.post('/logout')
        .then( (response) => {
            if(response.data.success) {
              context.commit("unsetUser");
              localStorage.removeItem('isAuthenticated');
              router.push('/login')
              context.dispatch("memberData/clearFarmersOptions", null, { root: true });
            }
        });
    //salman
       
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

  //salman
  async refreshToken(context) {
    return await axios
      .post("/access-token")
      .then((res) => {
        res = res.data;
        if (!res.success) {
          context.dispatch("logout");
          throw res.message;
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  //salman

  async setModulePermittedActions(context, payload) {
    await context.commit("setModulePermittedActions", payload);
  },

  async setGlobalSettings(context, payload) {
    await context.commit("setGlobalSettings", payload);
  },
};
