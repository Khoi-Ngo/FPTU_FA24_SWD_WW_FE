import axios from "axios";


// Create an Axios instance with default baseURL
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace baseURL for calling BE here
});

// Add a request interceptor to always send the JWT token if available
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

// Add a response interceptor to handle response data
instance.interceptors.response.use(
  function (response) {
    // Return `data.data` if it exists, otherwise return `data`
    return response.data?.data || response.data;
  },
  function (error) {
    // Return response error data if available, otherwise reject the error
    return error.response?.data || Promise.reject(error);
  }
);

export default instance;
