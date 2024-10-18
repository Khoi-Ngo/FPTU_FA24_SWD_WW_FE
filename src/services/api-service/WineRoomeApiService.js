import axios from "axios";

export const fetchWineRoomsByWineId = async (wineId) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/winerooms-wine/${wineId}`;
    return axios.get(URL_BACKEND);
}