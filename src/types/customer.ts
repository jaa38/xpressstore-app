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
   * Returned directly by the Xpress Customer API.
   */
  isBlackListed: boolean;

  /**
   * UI/application fields.
   *
   * These are not currently returned by the documented
   * Xpress Customer API.
   */
  customerType: "individual" | "business";

  country: string;
  state: string;
  city: string;
  street: string;

  /**
   * The documented customer endpoint does not currently
   * return order count or total customer spending.
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