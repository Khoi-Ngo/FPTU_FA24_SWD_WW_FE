import axios from "axios";

const LoginAPI = async ({ username, password }) => {

    return axiosInstance.post('/auth/sign-in', { username, password });
};




export {LoginAPI, }