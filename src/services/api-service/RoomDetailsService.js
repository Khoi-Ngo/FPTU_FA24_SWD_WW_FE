import axios from "axios"
// export const fetchRoomDetailsAPI = async () => {
//   const response = await axios.get(
//     `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms`
//   )
//   return response.data
// }
export const fetchRoomDetailsAPI = async (roomId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`
  )
  return response.data
}
export const removeWineFromRoomAPI = async (id) => {
  const response = await axios.delete(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms/${id}`
  )
  return response.data
}
export const addWineToRoomAPI = async (newData) => {
  const response = await axios.post(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms`, newData
  )
  return response.data
}
export const updateRoomDetailsAPI = async (id, data) => {
  const response = await axios.put(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms/${id}`, data
  )
  return response.data
}
