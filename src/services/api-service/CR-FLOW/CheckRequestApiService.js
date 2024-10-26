import axios from "axios";


export const fetchCheckRequestsAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.get(URL_BACKEND);
}

export const createCheckRequestAPI = async (createCheckRequestRequest) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-requests`;
    return axios.post(URL_BACKEND, createCheckRequestRequest);
}