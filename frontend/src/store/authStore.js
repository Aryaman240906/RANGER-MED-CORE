import { create } from "zustand";
import api from "../services/api";

const getInitialState = () => {
  const token = localStorage.getItem("ranger_token");
  const user = localStorage.getItem("ranger_user");

  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,

  // LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.post("/auth/login", { email, password });

      // 🟢 FIX: backend returns { success, data: { token, user } }
      const token = res.data.data.token;
      const user = res.data.data.user;

      // Save to localStorage
      localStorage.setItem("ranger_token", token);
      localStorage.setItem("ranger_user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      set({ error: msg, isLoading: false });
      return { ok: false };
    }
  },

  // REGISTER
  register: async (formData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.post("/auth/register", formData);

      const token = res.data.data.token;
      const user = res.data.data.user;

      localStorage.setItem("ranger_token", token);
      localStorage.setItem("ranger_user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      set({ error: msg, isLoading: false });
      return { ok: false };
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem("ranger_token");
    localStorage.removeItem("ranger_user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));

