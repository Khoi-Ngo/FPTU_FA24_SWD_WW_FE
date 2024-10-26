import axios from "axios";

export const fetchWineRoomsByWineId = async (wineId) => {
}

export const fetchAllActiveWineRoomNameAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wine-rooms`;
    return axios.get(URL_BACKEND);
}