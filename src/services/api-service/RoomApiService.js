import axios from "axios"
export const fetchRoomsAPI = async () => {
  const response = await axios.get(`https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms`)
  return response.data
}
// export const fetchRoomsAPI = async () => {
//   const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/rooms`)
//   return response.data
// }
export const createRoomAPI = async (newRoomData) => {
  const response = await axios.post(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms`,
    newRoomData
  )
  return response.data;
}
export const updateRoomAPI = async (roomId, data) => {
  const response = await axios.put(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms/${roomId}`,
    data
  )
  return response.data;
}
export const deleteRoomAPI = async (roomId) => {
  const response = await axios.delete(`https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms/${roomId}`)
  return response.data
}
