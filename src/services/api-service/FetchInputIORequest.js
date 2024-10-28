import axios from "axios";

// Lấy dữ liệu nhà cung cấp
export const fetchSuppliersApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/supliers`); // Sửa lỗi chính tả thành 'suppliers'
        return response.data; // Trả về dữ liệu
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

// Lấy dữ liệu khách hàng
export const fetchCustomersApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customers`);
        return response.data; // Trả về dữ liệu
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

// Lấy dữ liệu người kiểm tra
export const fetchCheckersApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/staff`);
        return response.data; // Trả về dữ liệu
    } catch (error) {
        console.error('Error fetching checkers:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
export const fetchWineIDApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wines`);
        return response.data; // Trả về dữ liệu
    } catch (error) {
        console.error('Error fetching Wines:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
