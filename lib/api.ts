// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";
// import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";

// const api = axios.create({
//   baseURL: API_SERVER_ADDRESS,
//   timeout: 10000,
// });

// // Request Interceptor: access token 붙이기
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response Interceptor: access token 만료 시 refresh 시도
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     if (
//       err.response?.status === 401 &&
//       !originalRequest._retry &&
//       err.response.data?.code === "token_not_valid"
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = await SecureStore.getItemAsync("refresh_token");
//         const res = await axios.post(
//           `${API_SERVER_ADDRESS}/api/token/refresh/`,
//           {
//             refresh: refreshToken,
//           }
//         );

//         const newAccess = res.data.access;
//         await AsyncStorage.setItem("access_token", newAccess);

//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh failed:", refreshError);
//         // 여기서 logout 처리 가능
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;
