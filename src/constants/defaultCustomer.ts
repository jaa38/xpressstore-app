import type { CustomerDraft } from "@/types/customer";

export const defaultCustomer: CustomerDraft = {
  name: "",
  phone: "",
  email: "",
  customerType: "individual",

  address: {
    country: "",
    state: "",
    city: "",
    street: "",
  },
};