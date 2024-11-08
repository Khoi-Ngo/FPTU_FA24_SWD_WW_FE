import axios from 'axios';

const BASE_URL = 'https://winewarehousesystem.azurewebsites.net/api/v1/iorequests';

export const fetchIORequestApi = async (token) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching IO Requests', error);
        throw error;
    }
};

export const createIORequestApi = async (newRequest, token) => {
    try {
        const response = await axios.post(BASE_URL, newRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating IO Request', error);
        throw error;
    }
};

export const updateIORequestApi = async (id, updatedRequest, token) => {
    try {
        console.log(`Updating IO Request at ${BASE_URL}/${id} with data:`, updatedRequest);
        const response = await axios.put(`${BASE_URL}/${id}`, updatedRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating IO Request', error);
        throw error;
    }
};

export const handleDisableStatus = async (id, token) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true };
    } catch (error) {
        if (error.response) {
            console.error('Error disabling IO Request:', error.response.data);
            console.error('Status code:', error.response.status);
        } else {
            console.error('Error disabling IO Request:', error.message);
        }
        return { success: false };
    }
};
export const handleDoneStatus = async (id, token) => {
    try {
        await axios.put(`${BASE_URL}/done/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true };
    } catch (error) {
        if (error.response) {
            console.error('Error Done IO Request:', error.response.data);
            console.error('Status code:', error.response.status);
            const errorMessage = error.response.data.errorMessage || 'An unknown error occurred.';
            return { success: false, errorMessage };
        } else {
            console.error('Error Done IO Request:', error.message);
        }
        return { success: false };
    }
};

export const fetchIORequestByIdApi = async (id, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching IO Request with ID: ${id}`, error);
        throw error;
    }
};

export const fetchIORequestTypeApi = async (ioType, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/style?io=${ioType}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching IO Request Type for ${ioType}`, error);
        throw error;
    }
};
export const fetchRoomById = async (roomId, token) => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/rooms/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching room by ID:", error);
        throw error;
    }
};
export const paymentIORequestApi = async (id) => {
    try {
        const response = await axios.post(`${BASE_URL}/${id}/payment`, {});
        return response.data;
    } catch (error) {
        console.error('Error processing payment for IO Request', error);
        throw error;
    }
};
export const fetchRoomByIdForExport = async (roomId, token) => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/rooms/export/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching room for export by ID:", error);
        throw error;
    }
};
