import type { Order } from "@/types/order";
import { supabase } from "./supabase/client";

// export async function getOrders(): Promise<Order[]> {
//   const { data, error } = await supabase
//     .from("orders")
//     .select("*");

//   if (error) throw error;

//   return data;
// }

export async function getOrders(): Promise<Order[]> {
  return [
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
      createdAt: "Today, 10:24",
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
      createdAt: "Today, 09:40",
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
      createdAt: "Yesterday, 17:05",
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
      createdAt: "Yesterday, 14:30",
    },
  ];
}