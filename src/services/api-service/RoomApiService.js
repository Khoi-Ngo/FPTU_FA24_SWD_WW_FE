import axios from 'axios'
// export const fetchRoomsAPI = async () => {
//   const response = await axios.get('https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms')
//   return response.data
// }
export const fetchRoomsAPI = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms`)
  return response.data
}
export const createRoomAPI = async (newRoomData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rooms`,
    newRoomData
  )
  return response.data
}
export const updateRoomAPI = async (roomId, data) => {
  const response = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`,
    data
  )
  return response.data
}
export const deleteRoomAPI = async (roomId) => {
  const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`)
  return response.data
}
