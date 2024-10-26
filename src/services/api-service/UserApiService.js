import axios from "axios";

const fetchAllUsersAPI = () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    return axios.get(URL_BACKEND);
}

const fetchUserDetail = (userId) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.get(URL_BACKEND);
}

const createUserApi = (newUserData) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    return axios.post(URL_BACKEND, newUserData);
}

const deleteUserApi = async (userId) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.delete(URL_BACKEND);
};

const updateUserApi = (updatedUserData, userId) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.put(URL_BACKEND, updatedUserData);
}

const updatePasswordApi = ({ newPass, oldPass, username }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/update-password`;
    return axios.post(URL_BACKEND, { newPass, oldPass, username })
}

const sendMailResetPassAPI = ({ username, email }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/mail-forget-pass`;
    return axios.post(URL_BACKEND, { username, email });
}

const resetPasswordADMINApi = ({ username, newPass }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`;
    return axios.post(URL_BACKEND, { username, newPass });
}
const fetchAllStaffAPI = async () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/staff`;
    return axios.get(URL_BACKEND);
}

const uploadAvatarApi = () => {
    //TODO: implement later
}

//TODO: reset pass by code mail + new pass

export {
    fetchAllUsersAPI, createUserApi, deleteUserApi, updateUserApi, updatePasswordApi, sendMailResetPassAPI, uploadAvatarApi, fetchUserDetail, resetPasswordADMINApi, fetchAllStaffAPI
}

