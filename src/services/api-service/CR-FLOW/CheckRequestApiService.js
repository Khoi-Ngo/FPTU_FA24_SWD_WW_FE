import axios from "axios";

//get all check requests
export const fetchCheckRequestsAPI = async (token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

//create check request
export const createCheckRequestAPI = async (createCheckRequestRequest, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.post(URL_BACKEND, createCheckRequestRequest, {
        headers: {
            Authorization: token
        }
    });
}

//view detail of a check request
export const fetchViewDetailCheckRequestAPI = async (requestId, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests/${requestId}`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

//update the main check request
export const updateCheckRequestAPI = async (updateCheckRequestRequest, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.put(URL_BACKEND, updateCheckRequestRequest, {
        headers: {
            Authorization: token
        }
    });
}

//disable check request
export const disableCheckRequestAPI = async (id, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests/${id}`;
    return axios.delete(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

