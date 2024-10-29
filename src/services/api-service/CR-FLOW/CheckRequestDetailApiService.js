import axios from "axios";

//get all check request details list
export const fetchCheckRequestsAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details`;
    return axios.get(URL_BACKEND);
}

//create additional request detail in view detail of check request
export const createAddCheckRequestAPI = async (request) =>{
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details`;
    return axios.post(URL_BACKEND, request);
}