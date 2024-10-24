import axios from "axios";

const LoginAPI = async ({ username, password }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`;
    return axios.post(URL_BACKEND, { username, password });

}



export {LoginAPI, }