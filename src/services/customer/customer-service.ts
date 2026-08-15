import { apiClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

/**
 * ---------------------------------------------------------------------------
 * API Customer DTO
 * ---------------------------------------------------------------------------
 *
 * This represents the customer returned by the Xpress API.
 *
 * The backend currently exposes:
 *
 * - id
 * - firstName
 * - lastName
 * - email
 * - phoneNumber
 * - isBlackListed
 */
interface CustomerApiDto {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  isBlackListed: boolean;
}

/**
 * ---------------------------------------------------------------------------
 * Create Customer Response
 * ---------------------------------------------------------------------------
 */
interface CreateCustomerResponse {
  id: number;
}

/**
 * ---------------------------------------------------------------------------
 * Split Customer Name
 * ---------------------------------------------------------------------------
 *
 * The API expects firstName and lastName separately while the application
 * currently stores a single `name` field.
 */
function splitCustomerName(name: string | undefined) {
  const normalizedName = name?.trim() ?? "";

  const parts = normalizedName.split(/\s+/).filter(Boolean);

  const firstName = parts.shift() ?? "";

  const lastName = parts.join(" ");

  return {
    firstName,
    lastName,
  };
}

/**
 * ---------------------------------------------------------------------------
 * Required Customer Field
 * ---------------------------------------------------------------------------
 *
 * Some of the existing application payload types contain optional fields.
 * The API requires specific fields, so validate them at the service boundary.
 */
function requireCustomerField(
  value: string | undefined,
  fieldName: string
): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValue;
}

/**
 * ---------------------------------------------------------------------------
 * Customer Mapper
 * ---------------------------------------------------------------------------
 *
 * Maps the Xpress API customer DTO into the application's existing Customer
 * model.
 *
 * Some fields currently displayed by the UI are not returned by the customer
 * API. Those fields are therefore given safe defaults rather than inventing
 * values from another data source.
 */
function mapCustomer(row: CustomerApiDto): Customer {
  const name = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();

  return {
    id: String(row.id),

    name,

    phone: row.phoneNumber,

    email: row.email ?? "",

    /**
     * Returned directly by the Xpress Customer API.
     */
    isBlackListed: row.isBlackListed,

    /**
     * The current customer API does not expose customerType.
     */
    customerType: "individual",

    /**
     * Address information is not returned by the documented
     * customer endpoints.
     */
    country: "",

    state: "",

    city: "",

    street: "",

    /**
     * Orders and total spending are not returned by the documented
     * GetCustomer response.
     */
    orders: 0,

    spent: 0,

    created_at: "",

    updated_at: "",
  };
}

/**
 * ---------------------------------------------------------------------------
 * Get Customers
 * ---------------------------------------------------------------------------
 *
 * GET /Invoices/GetCustomer
 */
export async function getCustomers(): Promise<Customer[]> {
  const response = await apiClient.get<ApiResponse<CustomerApiDto[]>>(
    API_ENDPOINTS.customers.getAll
  );

  return (response.data.data ?? []).map(mapCustomer);
}

/**
 * ---------------------------------------------------------------------------
 * Get Customer By ID
 * ---------------------------------------------------------------------------
 *
 * The documented API currently provides GetCustomer for the merchant's
 * customer collection but does not document a dedicated GetCustomerById
 * endpoint.
 *
 * Therefore we retrieve the customer collection and locate the requested
 * customer locally.
 */
export async function getCustomerById(id: string): Promise<Customer> {
  const customers = await getCustomers();

  const customer = customers.find((item) => item.id === String(id));

  if (!customer) {
    throw new Error("Customer not found.");
  }

  return customer;
}

/**
 * ---------------------------------------------------------------------------
 * Create Customer
 * ---------------------------------------------------------------------------
 *
 * POST /Invoices/CreateCustomer
 *
 * Backend request:
 *
 * {
 *   firstName,
 *   lastName,
 *   email,
 *   phoneNumber
 * }
 */
export async function createCustomer(
  customer: CreateCustomerPayload
): Promise<Customer> {
  const name = requireCustomerField(customer.name, "Customer name");

  const phone = requireCustomerField(customer.phone, "Phone number");

  const email = customer.email?.trim() ?? "";

  const { firstName, lastName } = splitCustomerName(name);

  const response = await apiClient.post<ApiResponse<CreateCustomerResponse>>(
    API_ENDPOINTS.customers.create,
    {
      firstName,

      lastName,

      email,

      phoneNumber: phone,
    }
  );

  const customerId = response.data.data?.id;

  if (customerId === undefined || customerId === null) {
    throw new Error("Customer was created but no customer ID was returned.");
  }

  /**
   * Return the application Customer model so the existing
   * React Query hooks and screens continue to work.
   */
  return {
    id: String(customerId),

    name,

    phone,

    email,

    customerType: customer.customerType ?? "individual",

    country: customer.country ?? "",

    state: customer.state ?? "",

    city: customer.city ?? "",

    street: customer.street ?? "",

    isBlackListed: false,

    orders: 0,

    spent: 0,

    created_at: "",

    updated_at: "",
  };
}

/**
 * ---------------------------------------------------------------------------
 * Update Customer
 * ---------------------------------------------------------------------------
 *
 * POST /Invoices/UpdateCustomer
 *
 * Backend request:
 *
 * {
 *   id,
 *   firstName,
 *   lastName,
 *   email,
 *   phoneNumber
 * }
 */
export async function updateCustomer(
  id: string,
  customer: UpdateCustomerPayload
): Promise<Customer> {
  const name = requireCustomerField(customer.name, "Customer name");

  const phone = requireCustomerField(customer.phone, "Phone number");

  const email = customer.email?.trim() ?? "";

  const { firstName, lastName } = splitCustomerName(name);

  await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.customers.update, {
    id: Number(id),

    firstName,

    lastName,

    email,

    phoneNumber: phone,
  });

  /**
   * The UpdateCustomer API returns null data, so return the
   * application model using the values supplied by the UI.
   */

  const existingCustomer = await getCustomerById(id);

  return {
    id: String(id),

    name,

    phone,

    email,

    customerType: customer.customerType ?? existingCustomer.customerType,

    country: customer.country ?? existingCustomer.country,

    state: customer.state ?? existingCustomer.state,

    city: customer.city ?? existingCustomer.city,

    street: customer.street ?? existingCustomer.street,

    isBlackListed: existingCustomer.isBlackListed,

    orders: existingCustomer.orders,

    spent: existingCustomer.spent,

    created_at: existingCustomer.created_at,

    updated_at: existingCustomer.updated_at,
  };
}

/**
 * ---------------------------------------------------------------------------
 * Blacklist Customer
 * ---------------------------------------------------------------------------
 *
 * POST /Invoices/BlackListCustomer/{customerId}?IsBlackListed={boolean}
 *
 * true  -> blacklist customer
 * false -> remove blacklist
 */
export async function blacklistCustomer(
  id: string,
  isBlackListed: boolean
): Promise<void> {
  await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.customers.blacklist(Number(id), isBlackListed)
  );
}

/**
 * ---------------------------------------------------------------------------
 * Delete Customer
 * ---------------------------------------------------------------------------
 *
 * The current Xpress API documentation does NOT provide a delete-customer
 * endpoint.
 *
 * Customer removal should therefore NOT make a DELETE request.
 *
 * The closest supported backend operation is blacklistCustomer().
 */
export async function deleteCustomer(id: string): Promise<void> {
  await blacklistCustomer(id, true);
}
