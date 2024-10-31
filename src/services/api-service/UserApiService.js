import axios from "axios";

const fetchAllUsersAPI = (token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

const fetchUserDetail = (userId, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}

const createUserApi = (newUserData, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    return axios.post(URL_BACKEND, newUserData, {
        headers: {
            Authorization: token
        }
    });
}

const deleteUserApi = async (userId, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.delete(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
};

const updateUserApi = (updatedUserData, userId, token) => {
    updatedUserData.profileImageUrl = "temp N/A";
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`;
    return axios.put(URL_BACKEND, updatedUserData, {
        headers: {
            Authorization: token
        }
    });
}

const updatePasswordApi = ({ newPass, oldPass, username }, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/update-password`;
    return axios.post(URL_BACKEND, { newPass, oldPass, username }, {
        headers: {
            Authorization: token
        }
    })
}

const resetPasswordADMINApi = ({ username, newPass }, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`;
    return axios.post(URL_BACKEND, { username, newPass }, {
        headers: {
            Authorization: token
        }
    });
}

const fetchAllStaffAPI = async (token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/staff`;
    return axios.get(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}


//TODO: implement later
const uploadAvatarApi = () => {
    
}

const sendMailResetPassAPI = ({ username, email }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users/mail-forget-pass`;
    return axios.post(URL_BACKEND, { username, email });
}


export {
    fetchAllUsersAPI, createUserApi, deleteUserApi, updateUserApi, updatePasswordApi, sendMailResetPassAPI, uploadAvatarApi, fetchUserDetail, resetPasswordADMINApi, fetchAllStaffAPI
}

