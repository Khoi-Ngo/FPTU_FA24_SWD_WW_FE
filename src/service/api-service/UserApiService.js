import axios from "axios";

const fetchAllUsersAPI = () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    console.log(`>>> GET API FROM: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
}


export {
   fetchAllUsersAPI,
}