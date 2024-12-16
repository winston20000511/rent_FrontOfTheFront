import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 後端伺服器地址
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;