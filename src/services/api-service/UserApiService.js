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

const updateUserApi = (updatedUserData) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    return axios.put(URL_BACKEND, updatedUserData);
}

const updatePasswordApi = ({ newPass, oldPass, username }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`;
    return axios.post({ newPass, oldPass, username })
}

const resetPasswordApi = ({ verifiedCode, newPass, userId }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`; ``
    return axios.put(URL_BACKEND, { verifiedCode, newPass, userId });
}

const uploadAvatarApi = () => {
    //TODO: implement later
}

export {
    fetchAllUsersAPI, createUserApi, deleteUserApi, updateUserApi, updatePasswordApi, resetPasswordApi, uploadAvatarApi, fetchUserDetail
}

