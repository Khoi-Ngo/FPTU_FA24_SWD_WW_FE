import axios from 'axios'

export const fetchRequestHistoryAPI = async (year) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
    params: { year: year }
  })
  return response.data
}

