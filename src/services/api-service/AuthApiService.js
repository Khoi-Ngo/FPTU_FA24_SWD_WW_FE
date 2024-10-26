
import axiosInstance from "../axios-customize";

const LoginAPI = async ({ username, password }) => {
    return axiosInstance.post('/auth/sign-in', { username, password });
};

export { LoginAPI };
