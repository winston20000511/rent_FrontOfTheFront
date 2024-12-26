import axios from 'axios';

// 建立 Axios 實例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 後端伺服器地址
});

// 添加請求攔截器：自動將 JWT Token 添加到 Authorization 標頭
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// 添加回應攔截器（可選）
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 可選：處理未授權錯誤或其他情況
//     if (error.response?.status === 401) {
//       alert("登入過期，請重新登入！");
//       localStorage.removeItem("jwt"); // 清除過期的 Token
//       window.location.href = "/login"; // 導向登入頁面
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

// instance.defaults.headers.common["Content-Type"] = "application/json";

// export default instance;
