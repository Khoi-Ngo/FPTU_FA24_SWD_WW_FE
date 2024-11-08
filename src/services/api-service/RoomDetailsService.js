import axios from "axios"
// export const fetchRoomDetailsAPI = async () => {
//   const response = await axios.get(
//     `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms`
//   )
//   return response.data
// }
export const fetchRoomDetailsAPI = async (roomId, token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}`, {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
export const removeWineFromRoomAPI = async (id, token) => {
  const response = await axios.delete(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms/${id}`, {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
export const addWineToRoomAPI = async (newData, token) => {
  const response = await axios.post(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms`, newData, {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
export const updateRoomDetailsAPI = async (id, data, token) => {
  const response = await axios.put(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/WineRooms/${id}`, data, {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data
}
