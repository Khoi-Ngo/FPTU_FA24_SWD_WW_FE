import axios from 'axios'

export const fetchRequestHistoryAPI = async (year, token) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
    params: { year: year },
    headers: {
      Authorization: token
    }
  })
  return response.data
}
export const fetchTotalWinesAPI = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantity`, {
    headers: {
      Authorization: token
    }
  })
  return response.data
}
export const fetchTotalWinesByCategoryAPI = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantityCategory`, {
    headers: {
      Authorization: token
    }
  })
  return response.data
}
export const fetchTotalWinesBymMonthAPI = async (year, token) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantityIo`, {
    params: { year: year },
    headers: {
      Authorization: token
    }
  })
  return response.data
}
