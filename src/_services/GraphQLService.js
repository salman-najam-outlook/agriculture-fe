import store from "../store/index";
import axios from "axios";
import router from "../router";

const DEFORESTATION_BASE_URL =
  process.env.VUE_APP_DEFORESTATION_BASE_URL ||
  "https://cf-deforestation.dimitra.dev/graphql";
// const DEFORESTRATION_API_BASE_URL =
//   process.env.VUE_APP_DEFORESTRATION_API_BASE_URL ||
//   "https://cf-deforestation.dimitra.dev/api";
// const ttk = localStorage.getItem('token');
const axiosConfig = {
    baseURL: DEFORESTATION_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // authorization: ttk || store?.getters?.getAuthToken,
        screensize: `${window.outerWidth}x${window.outerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: localStorage.getItem("LANGUAGE") ?? 'en',
    }
};

const axiosInstance = axios.create(axiosConfig);
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use(axiosConfig, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const storageToken = localStorage.getItem('token');
    // const authToken = storageToken || store.getters.getAuthToken;
    // config.headers['authorization'] = authToken || store.getters.getAuthToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function callPostAPI(query, variables){
  const result = await axiosInstance.post(
    DEFORESTATION_BASE_URL,
    {
      query,
      variables,
    }
  );
  return result.data;
}

async function postGraphqlQuery(query, variables, retry = true) {
  try {
    console.log("variables", variables)    
    const result = await axiosInstance.post(
      DEFORESTATION_BASE_URL,
      {
        query,
        variables,
      }
    );
    return result.data;
  } catch (error) {
    // const token = store.getters.getAuthToken;
    // Map dev errors to user messages
    const devMessage = error.response?.data?.errors?.[0]?.message;
    let userMessage = "Something went wrong. Please try again later.";

    if (error.response?.status === 500 && retry) {
      const message = error.response?.data?.errors?.[0]?.message?.toLowerCase();

      // Retry only if message says token is invalid/expired
      if (message?.includes("invalid token") || message?.includes("context creation failed")) {
        try {
          await store.dispatch("refreshToken");

          // Retry with updated token
          return await postGraphqlQuery(query, variables, false);
        } catch (err) {
          await store.dispatch("logout");
          // router.push("/login");
          userMessage = "Session expired. Please log in again.";
        }
      }

      userMessage = "Something went wrong on the server. Please try again later.";
    }
    if (error.response?.data?.errors?.length && error.response?.data?.errors[0].statusCode === 401) {
      try{
        await store.dispatch('refreshToken');
        // console.log( error.response);
        return await callPostAPI(query,variables)

      }catch(err){
        // console.log('rf', err);
        await store.dispatch('logout');
        router.push('/login')
      }
    }

    if (error.response?.data?.errors?.length && error.response?.data?.errors[0].statusCode === 403) {
      router.push({name: 'AdminDashboard'})
    }

    console.error(devMessage);
    return Promise.reject(userMessage);
  }
}

export {
    postGraphqlQuery,
    axiosConfig
};