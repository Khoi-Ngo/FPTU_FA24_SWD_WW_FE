import axios from "axios";

//get all check requests
export const fetchCheckRequestsAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.get(URL_BACKEND);
}

//create check request
export const createCheckRequestAPI = async (createCheckRequestRequest) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.post(URL_BACKEND, createCheckRequestRequest);
}

//view detail of a check request
export const fetchViewDetailCheckRequestAPI = async ({ requestId }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests/${requestId}`;
    return axios.get(URL_BACKEND);
}

//update the main check request
export const updateCheckRequestAPI = async (updateCheckRequestRequest) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.put(URL_BACKEND, updateCheckRequestRequest);
}

//disable check request
export const disableCheckRequestAPI = async ({requestId}) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests/${requestId}`;
    return axios.delete(URL_BACKEND);
}

