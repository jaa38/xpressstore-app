export interface CustomerAddress {
  country: string;
  state: string;
  city: string;
  street: string;
}

export interface Customer {
  id: string;

  name: string;
  phone: string;
  email: string;

  customerType: "individual" | "business";

  country: string;
  state: string;
  city: string;
  street: string;

  orders: number;
  spent: number;

  created_at: string;
  updated_at: string;
}

export interface CustomerDraft {
  name: string;
  phone: string;
  email: string;
  customerType: "individual" | "business";

  address: CustomerAddress;
}

export type CreateCustomerPayload = Omit<
  Customer,
  | "id"
  | "orders"
  | "spent"
  | "created_at"
  | "updated_at"
>;

export type UpdateCustomerPayload =
  Partial<CreateCustomerPayload>;