import { create } from "zustand";
import { 
  loginUser, 
  registerUser, 
  checkEmailExists, 
  requestPasswordReset, 
  resetPassword 
} from "../services/authService";

const STORAGE_KEY_TOKEN = "ranger_auth_token_v1";
const STORAGE_KEY_USER = "ranger_user_v1";

// 🔄 Helper: Recover session from either Local (Remember Me) or Session storage
const getInitialState = () => {
  const localToken = localStorage.getItem(STORAGE_KEY_TOKEN);
  const sessionToken = sessionStorage.getItem(STORAGE_KEY_TOKEN);
  const token = localToken || sessionToken;

  const localUser = localStorage.getItem(STORAGE_KEY_USER);
  const sessionUser = sessionStorage.getItem(STORAGE_KEY_USER);
  const userStr = localUser || sessionUser;

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Auth state hydration failed:", e);
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  // --- ACTIONS ---

  /**
   * CHECK EMAIL (For Register Page)
   * Doesn't modify global auth state, just returns boolean
   */
  checkEmail: async (email) => {
    try {
      return await checkEmailExists(email);
    } catch (error) {
      console.warn("Email check skipped:", error);
      return false; // Fail open (don't block registration on network error)
    }
  },

  /**
   * LOGIN
   * Supports 'Remember Me' functionality
   */
  login: async (email, password, rememberMe = false) => {
    set({ isLoading: true, error: null });

    try {
      const { user, token } = await loginUser({ email, password });
      
      // Persistence Logic
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_TOKEN, token);
      storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || "Authentication failed" 
      });
      throw error; // Re-throw so UI can show toast
    }
  },

  /**
   * REGISTER
   */
  register: async (formData) => {
    set({ isLoading: true, error: null });

    try {
      // formData: { name, email, password, role }
      const response = await registerUser(formData);
      
      // If the backend returns a token immediately, auto-login
      if (response.token && response.user) {
        // Default to localStorage for new registrations for better UX
        localStorage.setItem(STORAGE_KEY_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));

        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        // Otherwise just stop loading (user needs to check email or login manually)
        set({ isLoading: false });
      }

      return response;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || "Registration failed" 
      });
      throw error;
    }
  },

  /**
   * LOGOUT
   * Clears both storage types to be safe
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  /**
   * PASSWORD RECOVERY FLOWS
   */
  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await requestPasswordReset(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await resetPassword({ token, newPassword });
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  }
}));