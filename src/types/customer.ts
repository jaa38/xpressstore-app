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

  /**
   * Returned directly by the
   * Xpress Customer API.
   */
  isBlackListed: boolean;

  /**
   * UI/application fields.
   */
  customerType: "individual" | "business";

  country: string;

  state: string;

  city: string;

  street: string;

  /**
   * Not currently returned by
   * documented customer API.
   */
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

export type CreateCustomerPayload = Pick<
  Customer,
  | "name"
  | "phone"
  | "email"
  | "customerType"
  | "country"
  | "state"
  | "city"
  | "street"
>;

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;
