import axios from "axios";


export const fetchSuppliersApi = async () => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/supliers`); // Sửa lỗi chính tả thành 'suppliers'
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

export const fetchCustomersApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};


export const fetchCheckersApi = async () => {
    const token = localStorage.getItem('access_token');

    try {
        const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/users/staff', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching checkers:', error);
        throw error;
    }
};
export const fetchWineIDApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wines`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Wines:', error);
        throw error;
    }
};
export const fetchRoomAvailable = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms/available`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms for import:', error);
        throw error;
    }
};

export const fetchRoomAvailableForExport = async () => {
    try {
        const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/rooms/export');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms for export:', error);
        throw error;
    }
};