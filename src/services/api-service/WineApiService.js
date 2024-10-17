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


export {
    fetchAllWineAPI, fetchWineDetailAPI, deleteWineAPI, updateWineAPI, uploadWineImage, createWineAPI, 
}