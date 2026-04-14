import { create } from "zustand";
import api from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    set({ user: data.user, token: data.token, loading: false });
  },

  register: async (email, password, name) => {
    set({ loading: true });
    const { data } = await api.post("/auth/register", { email, password, name });
    localStorage.setItem("token", data.token);
    set({ user: data.user, token: data.token, loading: false });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get("/user/me");
      set({ user: data });
    } catch {
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
