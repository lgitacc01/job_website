// src/api/axiosClient.js
import axios from "axios";

const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: false, // dùng Bearer token
});

/**
 * Request interceptor
 * → luôn lấy token MỚI NHẤT từ localStorage
 * → tránh lỗi "mới login đã expired"
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 🔥 ĐÚNG KEY
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor (optional – debug)
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized – token invalid/expired");
      // optional:
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
