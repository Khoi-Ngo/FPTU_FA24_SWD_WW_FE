import axios from "axios";

export const fetchRoomsAPI = async () => {
  const response = await axios.get(`https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms`)
  return response.data
}
export const createRoomAPI = async (newRoomData) => {
  const response = await axios.post(
    `https://6704dd95ab8a8f8927352836.mockapi.io/api/v1/Rooms`,
    newRoomData
  )
  return response.data;
}

// Set config defaults when creating the instance
const instance = axios.create({
  //Replace baseURL for calling BE here
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Alter defaults after instance has been created

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    //Auth
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }

    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
// instance.interceptors.response.use(function (response) {

//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     //! Check data from response
//     //? Response here having many config relating to HTTP Response
//     // => just need data if success
//     if (response.data != null && response.data.data != null)
//         return response.data;//response {status, payload, ...}
// }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if (error.response != null && error.response.data != null) return error.response.data;
//     return Promise.reject(error);
// });

instance.interceptors.response.use(
  function (response) {
    // If response contains data, return it
    if (response.data != null) {
      // If `data` contains another `data` field, return it; otherwise, return the whole response
      return response.data.data ? response.data.data : response.data;
    }
  },
  function (error) {
    if (error.response != null && error.response.data != null)
      return error.response.data;
    return Promise.reject(error);
  },
);

export default instance;
