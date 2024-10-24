import axiosInstance from "../axios-customize";

const LoginAPI = async ({ username, password }) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`;
    return axiosInstance.post(URL_BACKEND, { username, password });
}

export { LoginAPI };
