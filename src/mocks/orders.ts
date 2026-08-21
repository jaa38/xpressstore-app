// src/mocks/orders.ts

import type { Order } from "@/types/order";

/**
 * ============================================================================
 * MOCK ORDERS
 * ============================================================================
 */

export const MOCK_ORDERS: Order[] = [
  {
    id: "mock-order-001",
    reference: "ORD-20260821",
    customerName: "Chinedu Okafor",
    customerPhone: "08031234567",
    customerEmail: "chinedu.okafor@example.com",

    deliveryAddress: {
      street: "14 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "106104",
    },

    total: 85000,
    currency: "NGN",

    items: [
      {
        productId: "1",
        productName: "Classic Leather Sneakers",
        quantity: 1,
        unitPrice: 85000,
        subtotal: 85000,
        currency: "NGN",
      },
    ],

    paymentChannel: "card",
    status: "paid",

    createdAt: "2026-08-21T09:15:00.000Z",
    updatedAt: "2026-08-21T09:20:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-002",
    reference: "ORD-20260820",
    customerName: "Amaka Eze",
    customerPhone: "08145678901",
    customerEmail: "amaka.eze@example.com",

    deliveryAddress: {
      street: "22 GRA Avenue",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101233",
    },

    total: 142500,
    currency: "NGN",

    items: [
      {
        productId: "2",
        productName: "Premium Ankara Tote Bag",
        quantity: 2,
        unitPrice: 45000,
        subtotal: 90000,
        currency: "NGN",
      },
      {
        productId: "3",
        productName: "Minimalist Wrist Watch",
        quantity: 1,
        unitPrice: 52500,
        subtotal: 52500,
        currency: "NGN",
      },
    ],

    paymentChannel: "bankTransfer",
    status: "delivered",

    createdAt: "2026-08-20T13:45:00.000Z",
    updatedAt: "2026-08-21T08:30:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-003",
    reference: "ORD-20260819",
    customerName: "Tunde Adeyemi",
    customerPhone: "07012345678",
    customerEmail: "tunde.adeyemi@example.com",

    deliveryAddress: {
      street: "8 Wuse 2 Crescent",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
      postalCode: "900288",
    },

    total: 225000,
    currency: "NGN",

    items: [
      {
        productId: "4",
        productName: "Premium Wireless Headphones",
        quantity: 1,
        unitPrice: 125000,
        subtotal: 125000,
        currency: "NGN",
      },
      {
        productId: "5",
        productName: "Smart Travel Backpack",
        quantity: 1,
        unitPrice: 100000,
        subtotal: 100000,
        currency: "NGN",
      },
    ],

    paymentChannel: "bank",
    status: "returned",

    createdAt: "2026-08-19T10:30:00.000Z",
    updatedAt: "2026-08-20T16:00:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-004",
    reference: "ORD-20260818",
    customerName: "Fatima Bello",
    customerPhone: "08098765432",
    customerEmail: "fatima.bello@example.com",

    deliveryAddress: {
      street: "17 Ahmadu Bello Way",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101241",
    },

    total: 67500,
    currency: "NGN",

    items: [
      {
        productId: "6",
        productName: "Classic Cotton Shirt",
        quantity: 3,
        unitPrice: 22500,
        subtotal: 67500,
        currency: "NGN",
      },
    ],

    paymentChannel: "ussd",
    status: "failed",

    createdAt: "2026-08-18T15:20:00.000Z",
    updatedAt: "2026-08-18T15:35:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-005",
    reference: "ORD-20260817",
    customerName: "David Williams",
    customerPhone: "09023456789",
    customerEmail: "david.williams@example.com",

    deliveryAddress: {
      street: "5 Allen Avenue",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101233",
    },

    total: 310000,
    currency: "NGN",

    items: [
      {
        productId: "7",
        productName: "Executive Office Chair",
        quantity: 1,
        unitPrice: 180000,
        subtotal: 180000,
        currency: "NGN",
      },
      {
        productId: "8",
        productName: "Adjustable Laptop Stand",
        quantity: 2,
        unitPrice: 35000,
        subtotal: 70000,
        currency: "NGN",
      },
      {
        productId: "9",
        productName: "Wireless Keyboard",
        quantity: 1,
        unitPrice: 60000,
        subtotal: 60000,
        currency: "NGN",
      },
    ],

    paymentChannel: "nqr",
    status: "paid",

    createdAt: "2026-08-17T11:10:00.000Z",
    updatedAt: "2026-08-17T11:15:00.000Z",

    statusHistory: [],
  },

  {
    id: "mock-order-006",
    reference: "ORD-20260816",
    customerName: "Blessing Johnson",
    customerPhone: "08167890123",
    customerEmail: "blessing.johnson@example.com",

    deliveryAddress: {
      street: "31 Banana Island Road",
      city: "Ikoyi",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "106104",
    },

    total: 119000,
    currency: "NGN",

    items: [
      {
        productId: "10",
        productName: "Premium Crossbody Bag",
        quantity: 1,
        unitPrice: 69000,
        subtotal: 69000,
        currency: "NGN",
      },
      {
        productId: "11",
        productName: "Fashion Sunglasses",
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000,
        currency: "NGN",
      },
    ],

    paymentChannel: "card",
    status: "delivered",

    createdAt: "2026-08-16T09:40:00.000Z",
    updatedAt: "2026-08-17T14:20:00.000Z",

    statusHistory: [],
  },
];

/**
 * ============================================================================
 * GET MOCK ORDERS
 * ============================================================================
 */

export function getMockOrders(): Order[] {
  return [...MOCK_ORDERS];
}

/**
 * ============================================================================
 * GET MOCK ORDER BY ID
 * ============================================================================
 */

export function getMockOrderById(id: string): Order | undefined {
  return MOCK_ORDERS.find((order) => order.id === id);
}
