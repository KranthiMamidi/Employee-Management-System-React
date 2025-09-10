import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // replace with your backend base URL
  headers : {
    "Content-Type" : "application/json"
  }
});

// Automatically add JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
