import axios from 'axios';

export const fetchReportByIdApi = async (id) => {
    try {
        const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/reports/GetReportsByIORequestId/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching report data');
    }
};

export const updateReportApi = async (id, reportDetails) => {
    try {
        const response = await axios.put(`https://winewarehousesystem.azurewebsites.net/api/v1/reports?id=${id}`, {
            ioRequestDetails: reportDetails
        });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Cập nhật không thành công');
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật báo cáo:", error);
        throw new Error('Error updating report');
    }
};

export const deleteReportApi = async (id, idDetails) => {
    try {
        const response = await axios.delete(`https://winewarehousesystem.azurewebsites.net/api/v1/reports/${id}?idDetails=${idDetails}`);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Xóa không thành công');
        }
    } catch (error) {
        console.error("Lỗi khi xóa báo cáo:", error);
        throw new Error('Error deleting report');
    }
};

export const uploadFileApi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('https://winewarehousesystem.azurewebsites.net/api/v1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.downloadUrl;
    } catch (error) {
        console.error("Lỗi khi tải lên file:", error);
        throw new Error('Error uploading file');
    }
};