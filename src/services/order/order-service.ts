import type { Order } from "@/types/order";
import { supabase } from "../supabase/client";

// -----------------------------------------------------------------------------
// Supabase Implementation
// -----------------------------------------------------------------------------

// export async function getOrders(): Promise<Order[]> {
//   const { data, error } = await supabase
//     .from("orders")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) {
//     throw error;
//   }

//   return data as Order[];
// }

// -----------------------------------------------------------------------------
// Mock Implementation
// -----------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const orders: Order[] = [
    {
      id: "1",

      reference: "XP-12345",

      customerName: "Nancy Drew",

      customerPhone: "+1 555-0101",

      customerEmail: "nancy@example.com",

      deliveryAddress: {
        street: "12 Admiralty Way",
        city: "Lekki Phase 1",
        state: "Lagos",
        country: "Nigeria",
      },

      items: [
        {
          productId: "product-1",
          productName: "Ankara Tote Bag",
          quantity: 2,
          unitPrice: 10,
          subtotal: 20,
          currency: "USD",
        },
      ],

      total: 20,

      currency: "USD",

      paymentChannel: "card",

      status: "paid",

      statusHistory: [
        {
          id: "history-1-1",
          status: "paid",
          createdAt: "2026-07-17T10:24:00Z",
          updatedBy: "System",
          note: "Payment received successfully.",
        },
      ],

      createdAt: "2026-07-17T10:24:00Z",

      updatedAt: "2026-07-17T10:24:00Z",
    },

    {
      id: "2",

      reference: "XP-12346",

      customerName: "John Smith",

      customerPhone: "+1 555-0102",

      customerEmail: "john@example.com",

      deliveryAddress: {
        street: "45 Allen Avenue",
        city: "Ikeja",
        state: "Lagos",
        country: "Nigeria",
      },

      items: [
        {
          productId: "product-2",
          productName: "Sneakers",
          quantity: 1,
          unitPrice: 45,
          subtotal: 45,
          currency: "USD",
        },
      ],

      total: 45,

      currency: "USD",

      paymentChannel: "bankTransfer",

      status: "returned",

      statusHistory: [
        {
          id: "history-2-1",
          status: "paid",
          createdAt: "2026-07-17T09:40:00Z",
          updatedBy: "System",
          note: "Payment completed.",
        },
        {
          id: "history-2-2",
          status: "returned",
          createdAt: "2026-07-18T11:10:00Z",
          updatedBy: "Merchant",
          note: "Customer returned the order.",
        },
      ],

      createdAt: "2026-07-17T09:40:00Z",

      updatedAt: "2026-07-18T11:10:00Z",
    },

    {
      id: "3",

      reference: "XP-12347",

      customerName: "Sarah Johnson",

      customerPhone: "+1 555-0103",

      customerEmail: "sarah@example.com",

      deliveryAddress: {
        street: "18 Herbert Macaulay Way",
        city: "Yaba",
        state: "Lagos",
        country: "Nigeria",
      },

      items: [
        {
          productId: "product-3",
          productName: "Backpack",
          quantity: 3,
          unitPrice: 6,
          subtotal: 18,
          currency: "USD",
        },
      ],

      total: 18,

      currency: "USD",

      paymentChannel: "bank",

      status: "failed",

      statusHistory: [
        {
          id: "history-3-1",
          status: "failed",
          createdAt: "2026-07-16T17:08:00Z",
          updatedBy: "System",
          note: "Payment authorization failed.",
        },
      ],

      createdAt: "2026-07-16T17:05:00Z",

      updatedAt: "2026-07-16T17:08:00Z",
    },

    {
      id: "4",

      reference: "XP-12348",

      customerName: "Michael Brown",

      customerPhone: "+1 555-0104",

      customerEmail: "michael@example.com",

      deliveryAddress: {
        street: "8 Gana Street",
        city: "Maitama",
        state: "FCT Abuja",
        country: "Nigeria",
      },

      items: [
        {
          productId: "product-4",
          productName: "Office Chair",
          quantity: 5,
          unitPrice: 12,
          subtotal: 60,
          currency: "USD",
        },
      ],

      total: 60,

      currency: "USD",

      paymentChannel: "nqr",

      status: "delivered",

      statusHistory: [
        {
          id: "history-4-1",
          status: "paid",
          createdAt: "2026-07-16T14:30:00Z",
          updatedBy: "System",
          note: "Payment completed.",
        },
        {
          id: "history-4-2",
          status: "delivered",
          createdAt: "2026-07-17T09:00:00Z",
          updatedBy: "Delivery Agent",
          note: "Order delivered successfully.",
        },
      ],

      createdAt: "2026-07-16T14:30:00Z",

      updatedAt: "2026-07-17T09:00:00Z",
    },
  ];

  return [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
}