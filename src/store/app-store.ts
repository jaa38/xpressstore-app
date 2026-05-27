import { create } from "zustand";

interface AppStore {
  isOnboarded: boolean;

  setOnboarded: (
    value: boolean
  ) => void;
}

export const useAppStore =
  create<AppStore>((set) => ({
    isOnboarded: false,

    setOnboarded: (value) =>
      set({
        isOnboarded: value,
      }),
  }));