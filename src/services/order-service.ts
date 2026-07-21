import type { Order } from "@/types/order";
import { supabase } from "./supabase/client";

// For Supabase

// export async function getOrders(): Promise<Order[]> {
//   const { data, error } = await supabase
//     .from("orders")
//     .select("*");
//     // .order("created_at", { ascending: false });

//   if (error) throw error;

//   return data;
// }

// For testing purposes, we can return a static list of orders.
// In a real application, you would fetch this data from your backend or database.

export async function getOrders(): Promise<Order[]> {
  const orders: Order[] = [
    {
      id: "1",
      reference: "XP-12345",
      customerName: "Nancy Drew",

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
      createdAt: "2026-07-17T10:24:00Z",
    },

    {
      id: "2",
      reference: "XP-12346",
      customerName: "John Smith",

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
      createdAt: "2026-07-17T09:40:00Z",
    },

    {
      id: "3",
      reference: "XP-12347",
      customerName: "Sarah Johnson",

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
      createdAt: "2026-07-16T17:05:00Z",
    },

    {
      id: "4",
      reference: "XP-12348",
      customerName: "Michael Brown",

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
      createdAt: "2026-07-16T14:30:00Z",
    },
  ];

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}