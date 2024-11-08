import axios from "axios";


export const fetchSuppliersApi = async (token) => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/supliers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); // Sửa lỗi chính tả thành 'suppliers'
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

export const fetchCustomersApi = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};


export const fetchCheckersApi = async (token) => {
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
export const fetchWineIDApi = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wines`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Wines:', error);
        throw error;
    }
};
export const fetchRoomAvailable = async (token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms/available`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms for import:', error);
        throw error;
    }
};

export const fetchRoomAvailableForExport = async (token) => {
    try {
        const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/rooms/export', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms for export:', error);
        throw error;
    }
};