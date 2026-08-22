import { apiClient } from "@/api/client";

import { API_ENDPOINTS } from "@/api/endpoints";

import { USE_MOCK_CUSTOMERS } from "@/mocks/config";

import {
  getMockCustomers,
  getMockCustomerById,
  createMockCustomer,
  updateMockCustomer,
  deleteMockCustomer,
  toggleMockCustomerBlacklist,
} from "@/mocks/customers";

import { customerRepository } from "@/repositories/customers/sqliteCustomerRepository";

import type { ApiResponse } from "@/types/api";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

/**
 * ============================================================================
 * API CUSTOMER DTO
 * ============================================================================
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
 * ============================================================================
 * CREATE CUSTOMER RESPONSE
 * ============================================================================
 */

interface CreateCustomerResponse {
  id: number;
}

/**
 * ============================================================================
 * SPLIT CUSTOMER NAME
 * ============================================================================
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
 * ============================================================================
 * REQUIRED CUSTOMER FIELD
 * ============================================================================
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
 * ============================================================================
 * CUSTOMER MAPPER
 * ============================================================================
 */

function mapCustomer(row: CustomerApiDto): Customer {
  const name = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();

  return {
    id: String(row.id),

    name,

    phone: row.phoneNumber,

    email: row.email ?? "",

    isBlackListed: row.isBlackListed,

    /**
     * The current customer API does not
     * expose customerType.
     */
    customerType: "individual",

    /**
     * Address information is not returned
     * by the documented customer API.
     */
    country: "",

    state: "",

    city: "",

    street: "",

    /**
     * Orders and total spending are not
     * returned by the documented API.
     */
    orders: 0,

    spent: 0,

    created_at: "",

    updated_at: "",
  };
}

/**
 * ============================================================================
 * GET CUSTOMERS
 * ============================================================================
 *
 * MOCK:
 *   Mock data
 *
 * API:
 *   API -> map -> SQLite -> return
 *
 * OFFLINE:
 *   SQLite -> return
 * ============================================================================
 */

export async function getCustomers(): Promise<Customer[]> {
  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    return getMockCustomers();
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  try {
    const response = await apiClient.get<ApiResponse<CustomerApiDto[]>>(
      API_ENDPOINTS.customers.getAll
    );

    const customers = (response.data.data ?? []).map(mapCustomer);

    /**
     * Persist successful API response.
     */
    await customerRepository.saveCustomers(customers);

    return customers;
  } catch (error) {
    console.warn(
      "Failed to fetch customers from API. Using local SQLite data.",
      error
    );

    const cachedCustomers = await customerRepository.getCustomers();

    if (cachedCustomers.length === 0) {
      throw error;
    }

    return cachedCustomers;
  }
}

/**
 * ============================================================================
 * GET CUSTOMER BY ID
 * ============================================================================
 */

export async function getCustomerById(id: string): Promise<Customer> {
  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    const customer = getMockCustomerById(id);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  try {
    const response = await apiClient.get<ApiResponse<CustomerApiDto[]>>(
      API_ENDPOINTS.customers.getAll
    );

    const customers = (response.data.data ?? []).map(mapCustomer);

    /**
     * Persist complete API response.
     */
    await customerRepository.saveCustomers(customers);

    const customer = customers.find((item) => item.id === String(id));

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  } catch (error) {
    console.warn(
      `Failed to fetch customer ${id} from API. Using local SQLite data.`,
      error
    );

    const cachedCustomer = await customerRepository.getCustomerById(String(id));

    if (!cachedCustomer) {
      throw error;
    }

    return cachedCustomer;
  }
}

/**
 * ============================================================================
 * CREATE CUSTOMER
 * ============================================================================
 *
 * MOCK:
 *   Local mock collection
 *
 * API:
 *   POST /Invoices/CreateCustomer
 * ============================================================================
 */

export async function createCustomer(
  customer: CreateCustomerPayload
): Promise<Customer> {
  const name = requireCustomerField(customer.name, "Customer name");

  const phone = requireCustomerField(customer.phone, "Phone number");

  const email = customer.email?.trim() ?? "";

  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    return createMockCustomer({
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
    });
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

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

  const createdCustomer: Customer = {
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

  await customerRepository.saveCustomer(createdCustomer);

  return createdCustomer;
}

/**
 * ============================================================================
 * UPDATE CUSTOMER
 * ============================================================================
 *
 * MOCK:
 *   Updates mock collection.
 *
 * API:
 *   POST /Invoices/UpdateCustomer
 * ============================================================================
 */

export async function updateCustomer(
  id: string,
  customer: UpdateCustomerPayload
): Promise<Customer> {
  const name = requireCustomerField(customer.name, "Customer name");

  const phone = requireCustomerField(customer.phone, "Phone number");

  const email = customer.email?.trim() ?? "";

  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    const updatedCustomer = updateMockCustomer(id, {
      name,

      phone,

      email,

      customerType: customer.customerType ?? "individual",

      country: customer.country ?? "",

      state: customer.state ?? "",

      city: customer.city ?? "",

      street: customer.street ?? "",
    });

    if (!updatedCustomer) {
      throw new Error("Customer not found.");
    }

    return updatedCustomer;
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  const { firstName, lastName } = splitCustomerName(name);

  await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.customers.update, {
    id: Number(id),

    firstName,

    lastName,

    email,

    phoneNumber: phone,
  });

  /**
   * Preserve application-only fields.
   */
  const existingCustomer = await customerRepository.getCustomerById(id);

  const updatedCustomer: Customer = {
    id: String(id),

    name,

    phone,

    email,

    customerType:
      customer.customerType ?? existingCustomer?.customerType ?? "individual",

    country: customer.country ?? existingCustomer?.country ?? "",

    state: customer.state ?? existingCustomer?.state ?? "",

    city: customer.city ?? existingCustomer?.city ?? "",

    street: customer.street ?? existingCustomer?.street ?? "",

    isBlackListed: existingCustomer?.isBlackListed ?? false,

    orders: existingCustomer?.orders ?? 0,

    spent: existingCustomer?.spent ?? 0,

    created_at: existingCustomer?.created_at ?? "",

    updated_at: new Date().toISOString(),
  };

  await customerRepository.saveCustomer(updatedCustomer);

  return updatedCustomer;
}

/**
 * ============================================================================
 * BLACKLIST CUSTOMER
 * ============================================================================
 *
 * MOCK:
 *   Updates local mock state.
 *
 * API:
 *   POST /Invoices/BlackListCustomer/{id}
 * ============================================================================
 */

export async function blacklistCustomer(
  id: string,
  isBlackListed: boolean
): Promise<void> {
  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    const updatedCustomer = toggleMockCustomerBlacklist(id, isBlackListed);

    if (!updatedCustomer) {
      throw new Error("Customer not found.");
    }

    return;
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.customers.blacklist(Number(id), isBlackListed)
  );

  /**
   * Update local cache only after
   * API confirms success.
   */
  const existingCustomer = await customerRepository.getCustomerById(id);

  if (existingCustomer) {
    await customerRepository.saveCustomer({
      ...existingCustomer,

      isBlackListed,

      updated_at: new Date().toISOString(),
    });
  }
}

/**
 * ============================================================================
 * DELETE CUSTOMER
 * ============================================================================
 *
 * The current Xpress API documentation does
 * not provide a delete-customer endpoint.
 *
 * MOCK:
 *   Actually removes mock customer.
 *
 * API:
 *   Maps delete to blacklist because that
 *   is the closest documented operation.
 * ============================================================================
 */

export async function deleteCustomer(id: string): Promise<void> {
  /**
   * -------------------------------------------------------------------------
   * MOCK MODE
   * -------------------------------------------------------------------------
   */

  if (USE_MOCK_CUSTOMERS) {
    const deleted = deleteMockCustomer(id);

    if (!deleted) {
      throw new Error("Customer not found.");
    }

    return;
  }

  /**
   * -------------------------------------------------------------------------
   * API MODE
   * -------------------------------------------------------------------------
   */

  await blacklistCustomer(id, true);
}
