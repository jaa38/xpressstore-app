import type { Order } from "@/types/order";
import { supabase } from "./supabase/client";

// For supabase

// export async function getOrders(): Promise<Order[]> {
//   const { data, error } = await supabase
//     .from("orders")
//     .select("*");
// .order("created_at", { ascending: false });

//   if (error) throw error;

//   return data;
// }

// For testing purposes, we can return a static list of orders. In a real application, you would fetch this data from your backend or database.

export async function getOrders(): Promise<Order[]> {
  const orders: Order[] = [
    {
      id: "1",
      reference: "XP-12345",
      customerName: "Nancy Drew",
      image: "",
      total: 20,
      currency: "USD",
      itemCount: 2,
      productName: "Ankara Tote Bag",
      paymentChannel: "card",
      status: "paid",
      createdAt: "2026-07-17T10:24:00Z",
    },
    {
      id: "2",
      reference: "XP-12346",
      customerName: "John Smith",
      image: "",
      total: 45,
      currency: "USD",
      itemCount: 1,
      productName: "Sneakers",
      paymentChannel: "bankTransfer",
      status: "returned",
      createdAt: "2026-07-17T09:40:00Z",
    },
    {
      id: "3",
      reference: "XP-12347",
      customerName: "Sarah Johnson",
      image: "",
      total: 18,
      currency: "USD",
      itemCount: 3,
      productName: "Backpack",
      paymentChannel: "bank",
      status: "failed",
      createdAt: "2026-07-16T17:05:00Z",
    },
    {
      id: "4",
      reference: "XP-12348",
      customerName: "Michael Brown",
      image: "",
      total: 60,
      currency: "USD",
      itemCount: 5,
      productName: "Office Chair",
      paymentChannel: "nqr",
      status: "delivered",
      createdAt: "2026-07-16T14:30:00Z",
    },
  ];

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
