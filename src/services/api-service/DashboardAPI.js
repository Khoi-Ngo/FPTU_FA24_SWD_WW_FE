import axios from 'axios'

export const fetchRequestHistoryAPI = async (year) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
    params: { year: year }
  })
  return response.data
}
export const fetchTotalWinesAPI = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantity`)
  return response.data
}
export const fetchTotalWinesByCategoryAPI = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantityCategory`)
  return response.data
}
export const fetchTotalWinesBymMonthAPI = async (year) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/quantityIo`, {
    params: { year: year }
  })
  return response.data
}
