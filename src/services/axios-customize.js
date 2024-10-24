import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://winewarehousesystem.azurewebsites.net/api/v1/',
});

// Thêm interceptor vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
