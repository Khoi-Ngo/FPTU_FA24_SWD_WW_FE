import axios from "axios";

const fetchAllWineAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines`;
    return axios.get(URL_BACKEND);
}

const createWineAPI = async (createWineRequestDto) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines`;
    return axios.post(URL_BACKEND, createWineRequestDto);
}

const deleteWineAPI = async (wineId) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines/${wineId}`;
    return axios.delete(URL_BACKEND);
}


const updateWineAPI = (updatedWineData) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines`;
    return axios.put(URL_BACKEND, updatedWineData);
}

const uploadWineImage = () =>{
    //TODO: implement later
}
const fetchWineDetailAPI = (wineId) =>{
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines/${wineId}`;
    return axios.delete(URL_BACKEND)
}
export const fetchWineCategoriesAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wine-categories`)
    return response.data
}
export const fetchCountriesAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/countries`)
    return response.data
}
export const fetchTastesAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tastes`)
    return response.data
}
export const fetchClassesAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/classes`)
    return response.data
}
export const fetchQualificationsAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/qualifications`)
    return response.data
}
export const fetchCorksAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/corks`)
    return response.data
}
export const fetchBrandsAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/brands`)
    return response.data
}
export const fetchBottleSizesAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bottle-sizes
`)
    return response.data
}
export const fetchAlcoholVolumeAPI = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/alcohol-by-volumes`)
    return response.data
}


export {
    fetchAllWineAPI, fetchWineDetailAPI, deleteWineAPI, updateWineAPI, uploadWineImage, createWineAPI, 
}