import { supabase } from "@/services/supabase/client";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

function mapCustomer(row: any): Customer {
  return {
    id: row.id,

    name: row.name,
    phone: row.phone,
    email: row.email,

    customerType: row.customer_type,

    country: row.country,
    state: row.state,
    city: row.city,
    street: row.street,

    orders: row.orders,
    spent: Number(row.spent),

    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

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

  return (data ?? []).map(mapCustomer);
}

export async function getCustomerById(id: string): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapCustomer(data);
}

export async function createCustomer(
  customer: CreateCustomerPayload
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,

      customer_type: customer.customerType,

      country: customer.country,
      state: customer.state,
      city: customer.city,
      street: customer.street,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapCustomer(data);
}

export async function updateCustomer(
  id: string,
  customer: UpdateCustomerPayload
): Promise<Customer> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (customer.name !== undefined) updateData.name = customer.name;
  if (customer.phone !== undefined) updateData.phone = customer.phone;
  if (customer.email !== undefined) updateData.email = customer.email;

  if (customer.customerType !== undefined) {
    updateData.customer_type = customer.customerType;
  }

  if (customer.country !== undefined) updateData.country = customer.country;
  if (customer.state !== undefined) updateData.state = customer.state;
  if (customer.city !== undefined) updateData.city = customer.city;
  if (customer.street !== undefined) updateData.street = customer.street;

  const { data, error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapCustomer(data);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from("customers").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
