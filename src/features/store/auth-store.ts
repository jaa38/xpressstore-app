import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;

  isLoading: boolean;

  user: unknown | null;

  setAuthenticated: (
    value: boolean
  ) => void;

  setLoading: (
    value: boolean
  ) => void;

  setUser: (
    user: unknown | null
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    isAuthenticated: false,

    isLoading: true,

    user: null,

    setAuthenticated: (value) =>
      set({
        isAuthenticated: value,
      }),

    setLoading: (value) =>
      set({
        isLoading: value,
      }),

    setUser: (user) =>
      set({
        user,
      }),

    logout: () =>
      set({
        isAuthenticated: false,
        user: null,
      }),
  }));