import axios from "axios";




// Set config defaults when creating the instance
const instance = axios.create({
    //Replace baseURL for calling BE here
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Alter defaults after instance has been created


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    //Auth
    if (typeof window !== "undefined" && window
        && window.localStorage
        && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }



    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {



    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //! Check data from response
    //? Response here having many config relating to HTTP Response 
    // => just need data if success
    if (response.data != null && response.data.data != null)
        return response.data;//response {status, payload, ...}
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response != null && error.response.data != null) return error.response.data;
    return Promise.reject(error);
});

export default instance;