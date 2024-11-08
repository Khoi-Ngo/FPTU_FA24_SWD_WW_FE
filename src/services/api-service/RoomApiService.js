import axios from 'axios'
// export const fetchRoomsAPI = async () => {
//   const response = await axios.get('https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms')
//   return response.data
// }

export const fetchRoomsAPI = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms`, {
    headers: {
      Authorization: token
    }
  })
  return response.data
}
export const createRoomAPI = async (newRoomData, token) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rooms`,
    newRoomData,{
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
export const updateRoomAPI = async (roomId, data, token) => {
  const response = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`,
    data,
    {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
export const deleteRoomAPI = async (roomId, token) => {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`, {
    headers: {
      Authorization: token
    }
  })
  return response.data
}
