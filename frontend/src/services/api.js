// frontend/src/services/api.js

import axios from "axios";
import { useAuthStore } from "../store/authStore";
// import toast from "react-hot-toast"; // enable later when UI ready

// --- ENV CONFIG ---
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ⏳ prevent hanging requests
  withCredentials: false, // will become true in Phase 10 when using httpOnly cookies
});

// --- REQUEST INTERCEPTOR: ATTACH TOKEN ---
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR: HANDLE 401, ERRORS ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      // toast.error("Network error — server unreachable");
      return Promise.reject(error);
    }

    // SESSION EXPIRED → AUTO LOGOUT
    if (response.status === 401) {
      const { logout, token } = useAuthStore.getState();

      if (token) {
        console.warn("⚠️ Session expired — logging out automatically");
        logout();
      }
    }

    // Optional global error message placeholder:
    // toast.error(response.data?.message || "Something went wrong");

    return Promise.reject(error);
  }
);

export default api;
