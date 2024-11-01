import axios from "axios";

// Lấy dữ liệu nhà cung cấp
export const fetchSuppliersApi = async () => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/supliers`); // Sửa lỗi chính tả thành 'suppliers'
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
    const token = localStorage.getItem('access_token'); // Lấy token từ localStorage

    try {
        const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/users/staff', {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });
        // Xử lý dữ liệu trả về
        return response.data;
    } catch (error) {
        console.error('Error fetching checkers:', error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
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
