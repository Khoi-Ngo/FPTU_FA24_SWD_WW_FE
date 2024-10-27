import axios from 'axios';

const BASE_URL = 'https://winewarehousesystem.azurewebsites.net/api/v1/iorequests';

export const fetchIORequestApi = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching IO Requests', error);
        throw error;
    }
};

export const createIORequestApi = async (newRequest) => {
    try {
        const response = await axios.post(BASE_URL, newRequest);
        return response.data;
    } catch (error) {
        console.error('Error creating IO Request', error);
        throw error;
    }
};

export const updateIORequestApi = async (id, updatedRequest) => {
    try {
        console.log(`Updating IO Request at ${BASE_URL}/${id} with data:`, updatedRequest);
        const response = await axios.put(`${BASE_URL}/${id}`, updatedRequest);
        return response.data;
    } catch (error) {
        console.error('Error updating IO Request', error);
        throw error;
    }
};

export const handleDisableStatus = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`); // Gọi API để xóa yêu cầu
    } catch (error) {
        if (error.response) {
            console.error('Error disabling IO Request:', error.response.data);
            console.error('Status code:', error.response.status);
        } else {
            console.error('Error disabling IO Request:', error.message);
        }
    }
};
export const handleDoneStatus = async (id) => {
    try {
        await axios.put(`${BASE_URL}/done/${id}`);
    } catch (error) {
        if (error.response) {
            console.error('Error Done IO Request:', error.response.data);
            console.error('Status code:', error.response.status);
        } else {
            console.error('Error Done IO Request:', error.message);
        }
    }
};

export const fetchIORequestByIdApi = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching IO Request with ID: ${id}`, error);
        throw error;
    }
};

export const fetchIORequestTypeApi = async (ioType) => {
    try {
        const response = await axios.get(`${BASE_URL}/style?io=${ioType}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching IO Request Type for ${ioType}`, error);
        throw error;
    }
};
