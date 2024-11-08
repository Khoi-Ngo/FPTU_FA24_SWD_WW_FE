import axios from 'axios';


export const addIORequestDetail = async (requestId, detail, token) => {
    try {
        const response = await axios.put(`https://winewarehousesystem.azurewebsites.net/api/v1/iorequests/Create-details/${requestId}`, {
            ioRequestDetails: [detail],
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding IO Request detail:', error);
        throw error;
    }
};


export const updateIORequestDetail = async (requestId, detail, token) => {
    try {
        const response = await axios.put(`https://winewarehousesystem.azurewebsites.net/api/v1/iorequests/update-details/${requestId}`, {
            upIORequestDetails: [detail],
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating IO Request detail:', error);
        throw error;
    }
};


export const deleteIORequestDetail = async (requestId, detailId, token) => {
    try {
        const response = await axios.put(`https://winewarehousesystem.azurewebsites.net/api/v1/iorequests/delete-details/${requestId}?detailIds=${detailId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting IO Request detail:', error);
        throw error;
    }
};
