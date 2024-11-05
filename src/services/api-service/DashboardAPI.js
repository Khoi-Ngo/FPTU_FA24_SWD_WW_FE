import axios from 'axios'

export const fetchRequestHistoryAPI = async (month, year) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, month, year)
  return response.data
}
