import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;

  setAuthenticated: (
    value: boolean
  ) => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    isAuthenticated: false,

    setAuthenticated: (value) =>
      set({
        isAuthenticated: value,
      }),
  }));