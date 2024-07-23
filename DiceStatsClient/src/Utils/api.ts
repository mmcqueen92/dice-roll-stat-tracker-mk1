import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("DiceStatsToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
