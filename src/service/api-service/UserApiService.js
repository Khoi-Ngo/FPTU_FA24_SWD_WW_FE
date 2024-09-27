import axios from "axios";

const fetchAllUsersAPI = () => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/users`;
    console.log(`>>> GET API FROM: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
}

const fetchUserDetail = (userId) =>{
    //TODO: get userId from token -> fetch when get the userdetail page
}

const createUserApi = () => {
    //TODO: implement later
}

const deleteUserApi = () => {
    //TODO: implement later
}

const updateUserApi = () => {
    //TODO: implement later
}

const updatePasswordApi = () => {
    //TODO: implement later
}

const resetPasswordApi = () => {
    //TODO: implement later
}

const uploadAvatarApi = () =>{
    //TODO: implement later + call firebase
}

export {
    fetchAllUsersAPI, createUserApi, deleteUserApi, updateUserApi, updatePasswordApi, resetPasswordApi, uploadAvatarApi
}