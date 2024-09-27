import axios from "axios";

const fetchAllUsersAPI = () => {
    const URL_BACKEND = "https://winewarehousesystem.azurewebsites.net/api/v1/users";
    console.log(`>>> GET API FROM: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
}


export {
   fetchAllUsersAPI,
}