import { create } from "zustand";

import { defaultCustomer } from "@/constants/defaultCustomer";

import type { CustomerDraft } from "@/types/customer";

interface CustomerStore {
  customer: CustomerDraft;

  updateCustomer: (data: Partial<CustomerDraft>) => void;

  resetCustomer: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customer: defaultCustomer,

  updateCustomer: (data) =>
    set((state) => ({
      customer: {
        ...state.customer,
        ...data,
      },
    })),

  resetCustomer: () =>
    set({
      customer: defaultCustomer,
    }),
}));
