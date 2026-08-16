import type {
  Customer,
  CustomerDraft,
} from "@/types/customer";

export interface CustomerRepository {
  getCustomers(): Promise<Customer[]>;

  getCustomerById(
    id: string
  ): Promise<Customer | null>;

  saveCustomers(
    customers: Customer[]
  ): Promise<void>;

  saveCustomer(
    customer: Customer
  ): Promise<void>;

  saveDraft(
    draft: CustomerDraft
  ): Promise<void>;

  deleteCustomer(
    id: string
  ): Promise<void>;

  clearCustomers(): Promise<void>;
}