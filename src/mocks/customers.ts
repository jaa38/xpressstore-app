// src/mocks/customers.ts

import type { Customer } from "@/types/customer";

/**
 * ============================================================================
 * MOCK CUSTOMERS
 * ============================================================================
 */

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "customer-001",
    name: "Aisha Bello",
    phone: "08031234567",
    email: "aisha.bello@example.com",
    isBlackListed: false,
    customerType: "individual",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikeja",
    street: "12 Allen Avenue",
    orders: 12,
    spent: 485000,
    created_at: "2026-01-15T09:30:00.000Z",
    updated_at: "2026-08-10T14:20:00.000Z",
  },

  {
    id: "customer-002",
    name: "Daniel Okafor",
    phone: "08145678901",
    email: "daniel.okafor@example.com",
    isBlackListed: false,
    customerType: "individual",
    country: "Nigeria",
    state: "Lagos",
    city: "Lekki",
    street: "24 Admiralty Way",
    orders: 8,
    spent: 325000,
    created_at: "2026-02-03T11:15:00.000Z",
    updated_at: "2026-08-08T10:45:00.000Z",
  },

  {
    id: "customer-003",
    name: "Chinedu Eze",
    phone: "07039876543",
    email: "chinedu.eze@example.com",
    isBlackListed: false,
    customerType: "individual",
    country: "Nigeria",
    state: "Anambra",
    city: "Awka",
    street: "18 Zik Avenue",
    orders: 21,
    spent: 920000,
    created_at: "2025-12-20T08:45:00.000Z",
    updated_at: "2026-08-15T16:30:00.000Z",
  },

  {
    id: "customer-004",
    name: "Fatima Ibrahim",
    phone: "09021234567",
    email: "fatima.ibrahim@example.com",
    isBlackListed: true,
    customerType: "individual",
    country: "Nigeria",
    state: "Abuja",
    city: "Garki",
    street: "7 Gimbiya Street",
    orders: 5,
    spent: 175000,
    created_at: "2026-03-12T13:20:00.000Z",
    updated_at: "2026-08-01T09:10:00.000Z",
  },

  {
    id: "customer-005",
    name: "Grace Williams",
    phone: "08098765432",
    email: "grace.williams@example.com",
    isBlackListed: false,
    customerType: "individual",
    country: "Nigeria",
    state: "Rivers",
    city: "Port Harcourt",
    street: "15 Aba Road",
    orders: 17,
    spent: 675000,
    created_at: "2026-01-28T10:00:00.000Z",
    updated_at: "2026-08-17T12:40:00.000Z",
  },

  {
    id: "customer-006",
    name: "Xpress Fashion Ltd",
    phone: "08123456789",
    email: "hello@xpressfashion.example.com",
    isBlackListed: false,
    customerType: "business",
    country: "Nigeria",
    state: "Lagos",
    city: "Yaba",
    street: "31 Herbert Macaulay Way",
    orders: 34,
    spent: 1850000,
    created_at: "2025-11-18T07:30:00.000Z",
    updated_at: "2026-08-19T15:15:00.000Z",
  },
];

/**
 * ============================================================================
 * GET CUSTOMERS
 * ============================================================================
 */

export function getMockCustomers(): Customer[] {
  return [...MOCK_CUSTOMERS];
}

/**
 * ============================================================================
 * GET CUSTOMER BY ID
 * ============================================================================
 */

export function getMockCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((customer) => customer.id === id);
}

/**
 * ============================================================================
 * CREATE CUSTOMER
 * ============================================================================
 */

export function createMockCustomer(
  customer: Omit<Customer, "id" | "created_at" | "updated_at">
): Customer {
  const now = new Date().toISOString();

  const newCustomer: Customer = {
    ...customer,
    id: `customer-${Date.now()}`,
    created_at: now,
    updated_at: now,
  };

  MOCK_CUSTOMERS.push(newCustomer);

  return newCustomer;
}

/**
 * ============================================================================
 * UPDATE CUSTOMER
 * ============================================================================
 */

export function updateMockCustomer(
  id: string,
  updates: Partial<Customer>
): Customer | undefined {
  const customerIndex = MOCK_CUSTOMERS.findIndex(
    (customer) => customer.id === id
  );

  if (customerIndex === -1) {
    return undefined;
  }

  /**
   * TypeScript needs an explicit guard here because Array[index]
   * can be undefined even after checking the index.
   */
  const existingCustomer = MOCK_CUSTOMERS[customerIndex];

  if (!existingCustomer) {
    return undefined;
  }

  const updatedCustomer: Customer = {
    ...existingCustomer,
    ...updates,

    /**
     * These values must never be changed by an edit.
     */
    id: existingCustomer.id,
    created_at: existingCustomer.created_at,

    /**
     * Always update modification time.
     */
    updated_at: new Date().toISOString(),
  };

  MOCK_CUSTOMERS[customerIndex] = updatedCustomer;

  return updatedCustomer;
}

/**
 * ============================================================================
 * DELETE CUSTOMER
 * ============================================================================
 */

export function deleteMockCustomer(id: string): boolean {
  const customerIndex = MOCK_CUSTOMERS.findIndex(
    (customer) => customer.id === id
  );

  if (customerIndex === -1) {
    return false;
  }

  MOCK_CUSTOMERS.splice(customerIndex, 1);

  return true;
}

/**
 * ============================================================================
 * TOGGLE BLACKLIST CUSTOMER
 * ============================================================================
 *
 * The optional `isBlackListed` argument allows screens to explicitly specify
 * the desired state.
 *
 * Examples:
 *
 * toggleMockCustomerBlacklist("customer-001")
 *
 * or:
 *
 * toggleMockCustomerBlacklist("customer-001", true)
 *
 * or:
 *
 * toggleMockCustomerBlacklist("customer-001", false)
 * ============================================================================
 */

export function toggleMockCustomerBlacklist(
  id: string,
  isBlackListed?: boolean
): Customer | undefined {
  const customerIndex = MOCK_CUSTOMERS.findIndex(
    (customer) => customer.id === id
  );

  if (customerIndex === -1) {
    return undefined;
  }

  const existingCustomer = MOCK_CUSTOMERS[customerIndex];

  if (!existingCustomer) {
    return undefined;
  }

  const nextStatus =
    typeof isBlackListed === "boolean"
      ? isBlackListed
      : !existingCustomer.isBlackListed;

  const updatedCustomer: Customer = {
    ...existingCustomer,

    isBlackListed: nextStatus,

    updated_at: new Date().toISOString(),
  };

  MOCK_CUSTOMERS[customerIndex] = updatedCustomer;

  return updatedCustomer;
}

/**
 * ============================================================================
 * SET BLACKLIST STATUS
 * ============================================================================
 */

export function setMockCustomerBlacklist(
  id: string,
  isBlackListed: boolean
): Customer | undefined {
  const customerIndex = MOCK_CUSTOMERS.findIndex(
    (customer) => customer.id === id
  );

  if (customerIndex === -1) {
    return undefined;
  }

  const existingCustomer = MOCK_CUSTOMERS[customerIndex];

  if (!existingCustomer) {
    return undefined;
  }

  const updatedCustomer: Customer = {
    ...existingCustomer,

    isBlackListed,

    updated_at: new Date().toISOString(),
  };

  MOCK_CUSTOMERS[customerIndex] = updatedCustomer;

  return updatedCustomer;
}

/**
 * ============================================================================
 * SEARCH CUSTOMERS
 * ============================================================================
 */

export function searchMockCustomers(query: string): Customer[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return getMockCustomers();
  }

  return MOCK_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.phone.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * ============================================================================
 * CUSTOMER STATISTICS
 * ============================================================================
 */

export function getMockCustomerStats() {
  const customers = MOCK_CUSTOMERS;

  const totalCustomers = customers.length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0
  );

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.spent,
    0
  );

  const blacklistedCustomers = customers.filter(
    (customer) => customer.isBlackListed
  ).length;

  const individualCustomers = customers.filter(
    (customer) => customer.customerType === "individual"
  ).length;

  const businessCustomers = customers.filter(
    (customer) => customer.customerType === "business"
  ).length;

  return {
    totalCustomers,
    totalOrders,
    totalSpent,
    blacklistedCustomers,
    individualCustomers,
    businessCustomers,
  };
}
