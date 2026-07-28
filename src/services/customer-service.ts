import { supabase } from "@/services/supabase/client";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as Customer[];
}

export async function createCustomer(
  customer: CreateCustomerPayload
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function updateCustomer(
  id: string,
  customer: UpdateCustomerPayload
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({
      ...customer,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Customer;
}

export async function deleteCustomer(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}