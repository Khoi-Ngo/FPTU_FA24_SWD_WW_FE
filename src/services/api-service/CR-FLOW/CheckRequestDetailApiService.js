import axios from "axios";

//get all check request details list
export const fetchAllCheckRequestDetailsAPI = async (token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

//view detail of check request detail
export const fetchDetailOfCRDetail = async (id, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details/${id}`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

//create additional request detail in view detail of check request
export const createAddCheckRequestAPI = async (request, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details`;
    return axios.post(URL_BACKEND, request, {
        headers: {
            Authorization: token
        }
    });
}

//disable check request detail
export const disableCheckRequestDetailAPI = async (id, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-details/${id}`;
    return axios.delete(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}


//create report
export const createCRReport = async (id, payload, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/check-request-reports`;
    return axios.post(URL_BACKEND, { ...payload, checkRequestDetailId: id }, {
        headers: {
            Authorization: token
        }
    });
}


