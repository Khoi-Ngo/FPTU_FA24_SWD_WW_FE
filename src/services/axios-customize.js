import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = window?.localStorage?.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);



instance.interceptors.response.use(
  function (response) {
    return response.data?.data || response.data;
  },
  function (error) {
    return error.response?.data || Promise.reject(error);
  }
);

export default instance;
