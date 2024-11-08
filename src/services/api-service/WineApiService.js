import axios from "axios";

// const fetchAllWineAPI = async () => {
//     const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines`;
//     return axios.get(URL_BACKEND);
// }
export const fetchAllWineAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wines`, {
        headers: {
          Authorization: token
        }
      })
    return response.data
}

const createWineAPI = async (createWineRequestDto, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines`;
    return axios.post(URL_BACKEND, createWineRequestDto, {
        headers: {
            Authorization: token
        }
    });
}

const deleteWineAPI = async (wineId, token) => {
    const URL_BACKEND = `${import.meta.env.VITE_BACKEND_URL}/wines/${wineId}`;
    return axios.delete(URL_BACKEND, {
        headers: {
            Authorization: token
        }
    });
}


export const updateWineAPI = async (wineId, payload, token) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/wines/${wineId}`, payload, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const getWineByCategoryAPI = async (categoryId, token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wine-categories/${categoryId}/wines`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}

export const fetchWineDetailAPI = async (wineId, token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wines/${wineId}`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchWineCategoriesAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/wine-categories`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchCountriesAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/countries`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchTastesAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tastes`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchClassesAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/classes`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchQualificationsAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/qualifications`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchCorksAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/corks`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchBrandsAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/brands`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchBottleSizesAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bottle-sizes
`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}
export const fetchAlcoholVolumeAPI = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/alcohol-by-volumes`, {
        headers: {
            Authorization: token
        }
    })
    return response.data
}

export {deleteWineAPI, createWineAPI, 
}
